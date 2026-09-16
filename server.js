// PyMastery Secure Backend Proxy Server (Multi-Provider: Claude & Gemini AI)

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// 1. Load .env Configuration
let claudeApiKey = process.env.CLAUDE_API_KEY || '';
let geminiApiKey = process.env.GEMINI_API_KEY || '';
const port = process.env.PORT || 3000;

const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match) {
      const key = match[1];
      const val = match[2].trim();
      if (key === 'CLAUDE_API_KEY') claudeApiKey = val;
      if (key === 'GEMINI_API_KEY') geminiApiKey = val;
    }
  });
}

console.log('🔒 PyMastery Secure Backend Server starting...');
if (claudeApiKey) console.log('✅ Claude API Key loaded securely on backend.');
if (geminiApiKey) console.log('✅ Gemini API Key loaded securely on backend.');

// 2. Strict System Prompt (Python-Only Restriction)
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

// 3. HTTP Server
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  // Handle API Endpoint: POST /api/ask-tutor
  if (req.method === 'POST' && req.url === '/api/ask-tutor') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const userQuery = payload.question || '';
        const codeContext = payload.codeContext || '';
        const currentLine = payload.currentLine || '';

        if (!userQuery) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Question is required.' }));
        }

        let promptContent = `Student Question: "${userQuery}"\n`;
        if (currentLine) promptContent += `Active Line of Code (Line ${currentLine}): "${codeContext}"\n`;

        // Try Gemini API first if available, or Claude API
        if (geminiApiKey) {
          callGeminiAPI(geminiApiKey, promptContent, res);
        } else if (claudeApiKey) {
          callClaudeAPI(claudeApiKey, promptContent, res);
        } else {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'No AI API keys configured on backend.' }));
        }

      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload.' }));
      }
    });
    return;
  }

  // Handle Static Files
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'text/plain';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
      } else {
        res.writeHead(500);
        res.end('Server Error: ' + err.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// Call Anthropic Claude API
function callClaudeAPI(key, promptContent, res) {
  const candidateModels = [
    'claude-sonnet-4-6',
    'claude-3-5-sonnet-20241022',
    'claude-3-5-sonnet-20240620',
    'claude-3-haiku-20240307'
  ];

  function tryModel(idx) {
    if (idx >= candidateModels.length) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Claude API key returned HTTP 404 Not Found for models. Please check if your Anthropic account billing/credits are active.' }));
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
        'x-api-key': key,
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
            console.warn(`[Claude ${currentModel}] HTTP ${apiRes.statusCode}:`, body);
            if (json.error && json.error.type === 'not_found_error') {
              return tryModel(idx + 1);
            }
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: json.error?.message || 'Claude API Error' }));
          }

          const answerText = json.content?.[0]?.text || 'No response generated.';
          console.log(`✅ Claude AI responded using model: ${currentModel}`);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ answer: answerText }));
        } catch (e) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Failed to parse Claude response.' }));
        }
      });
    });

    apiReq.on('error', (e) => {
      console.error('Claude Network Error:', e);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Network error reaching Claude API.' }));
    });

    apiReq.write(requestData);
    apiReq.end();
  }

  tryModel(0);
}

// Call Google Gemini API
function callGeminiAPI(key, promptContent, res) {
  const requestData = JSON.stringify({
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: [{ parts: [{ text: promptContent }] }]
  });

  const apiReq = https.request({
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestData)
    }
  }, (apiRes) => {
    let body = '';
    apiRes.on('data', chunk => body += chunk);
    apiRes.on('end', () => {
      try {
        const json = JSON.parse(body);
        if (apiRes.statusCode >= 400) {
          console.warn(`[Gemini API] HTTP ${apiRes.statusCode}:`, body);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: json.error?.message || 'Gemini API Error' }));
        }

        const answerText = json.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
        console.log('✅ Gemini AI responded successfully!');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ answer: answerText }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to parse Gemini response.' }));
      }
    });
  });

  apiReq.on('error', (e) => {
    console.error('Gemini Network Error:', e);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Network error reaching Gemini API.' }));
  });

  apiReq.write(requestData);
  apiReq.end();
}

if (require.main === module) {
  server.listen(port, () => {
    console.log(`🚀 PyMastery Secure Server running at http://localhost:${port}`);
  });
}

module.exports = server;
