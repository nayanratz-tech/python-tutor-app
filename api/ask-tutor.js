// Vercel Serverless Function for PyMastery Claude AI Tutor
const https = require('https');

const SYSTEM_PROMPT = `You are PyMastery AI, an expert, highly pedagogical Python programming tutor. 
Your goal is to teach Python from zero to advanced level with absolute clarity, encouragement, and deep technical accuracy.

CRITICAL GUARDRAIL RULE:
You MUST ONLY answer questions related to Python programming, Python syntax, Python libraries, data structures, algorithms, computer science concepts related to Python, and code debugging. 

If the user asks a question about ANYTHING UNRELATED to Python (such as general trivia, politics, recipes, pop culture, non-programming topics, or unrelated languages without Python context), you MUST politely decline with:
"🐍 As a dedicated Python Program Tutor, I can only answer questions related to Python programming and computer science. Please ask me anything about Python code, syntax, errors, or concepts!"

FORMATTING RULES:
- Provide clear, well-structured, Markdown-formatted answers.
- Break down complex concepts into simple explanations.
- When explaining code, explain 1) What it does, 2) Core Python mechanism, and 3) Why not alternative approaches.`;

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'CLAUDE_API_KEY is not configured in Vercel Environment Variables.' });
  }

  const { question, currentLine, codeContext } = req.body || {};
  if (!question) {
    return res.status(400).json({ error: 'Question is required.' });
  }

  let promptContent = `Student Question: "${question}"\n`;
  if (currentLine) promptContent += `Active Line of Code (Line ${currentLine}): "${codeContext}"\n`;

  const candidateModels = [
    'claude-sonnet-4-6',
    'claude-3-5-sonnet-20241022',
    'claude-3-5-sonnet-20240620',
    'claude-3-haiku-20240307'
  ];

  function tryModel(idx) {
    if (idx >= candidateModels.length) {
      return res.status(500).json({ error: 'Claude API key returned HTTP 404 Not Found for models.' });
    }

    const currentModel = candidateModels[idx];
    const requestData = JSON.stringify({
      model: currentModel,
      max_tokens: 600,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: promptContent }]
    });

    const apiReq = https.request({
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(requestData)
      }
    }, (apiRes) => {
      let body = '';
      apiRes.on('data', chunk => body += chunk);
      apiRes.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (apiRes.statusCode >= 400) {
            if (json.error && json.error.type === 'not_found_error') {
              return tryModel(idx + 1);
            }
            return res.status(500).json({ error: json.error?.message || 'Claude API Error' });
          }

          const answerText = json.content?.[0]?.text || 'No response generated.';
          return res.status(200).json({ answer: answerText });
        } catch (e) {
          return res.status(500).json({ error: 'Failed to parse AI response.' });
        }
      });
    });

    apiReq.on('error', (e) => {
      return res.status(500).json({ error: 'Network error calling Claude API.' });
    });

    apiReq.write(requestData);
    apiReq.end();
  }

  tryModel(0);
};
