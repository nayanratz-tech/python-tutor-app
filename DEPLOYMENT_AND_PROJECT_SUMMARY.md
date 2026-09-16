# 🐍 PyMastery - Dedicated Python Program Tutor
## Project Summary & Deployment / Online Upload Guide

> **Date Created**: September 16, 2026  
> **Project Location**: `C:\Users\LeGion\.gemini\antigravity-ide\scratch\python-tutor-app`  
> **Backend Node Server**: `server.js` (Running on Port 3000)  
> **AI Engine**: Anthropic Claude AI (Model: `claude-sonnet-4-6`)  
> **Python Engine**: Pyodide 3.11 (WebAssembly Client-Side)

---

## 🌟 Key Features Built

### 1. Minimalist Top Code Editor & Line-by-Line Inspector
- **Top Code Editor**: CodeMirror 5 with syntax highlighting, line numbers, auto-close brackets, and multi-file tabs (`main.py`, `sales_data.csv`, `➕ My Practice Code`).
- **Dynamic Smart Line Breakdown Inspector**: Move cursor over any line of code to see:
  - 🟢 **1. Why this statement?** (Action in plain English)
  - 🟣 **2. Why that concept?** (Python language mechanism & syntax rules)
  - 🟠 **3. Why NOT something else?** (Alternative methods & common pitfalls)

### 2. 10-Chapter "Living Python Book" Curriculum
1. **Chapter 1**: Hello World, String Syntax, `sep`, `end`, & Variations
2. **Chapter 2**: Variables, Dynamic Typing, Memory Addresses & `id()`
3. **Chapter 3**: Numbers & Math Operators (`/` vs `//` floor division, `%`, `**`)
4. **Chapter 4**: Strings & Slicing Magic (`text[start:stop:step]`, `::-1` reversal)
5. **Chapter 5**: Conditionals & Truthy/Falsy Rules (`if not items:` vs `len() == 0`)
6. **Chapter 6**: Loops, `range()`, `zip()`, & Terminal ASCII Data Charts
7. **Chapter 7**: Data Structures: Lists, Dicts & List Comprehensions (`[x**2 for x in nums]`)
8. **Chapter 8**: Functions, Scope, `*args`, & `**kwargs`
9. **Chapter 9**: Object-Oriented Programming (Classes, `__init__`, `self`, Encapsulation)
10. **Chapter 10**: Advanced Decorators (`@timer_decorator`), Context Managers, & Async

### 3. In-Browser Pyodide Execution & Clean Terminal Output
- Zero-latency Python 3.11 execution 100% inside WebAssembly.
- Standard output formatted into stacked `.terminal-line` block elements for clean line spacing.
- **🔍 Memory & Variable Inspector**: Interactive HTML table inspecting all active variables in memory.
- **🧪 Automated Test Assertion Evaluator**: Tests student solutions automatically.

### 4. 🔒 Secure Claude AI Tutor Integration & Python-Only Guardrails
- **Backend Security Proxy (`server.js`)**: Keeps your Anthropic API key (`sk-ant-api03...`) safely in `.env` on the server. **API key is NEVER exposed to client browsers, network logs, or frontend code.**
- **Model**: `claude-sonnet-4-6`
- **Strict Guardrail Prompt**: Restricts AI responses strictly to Python programming, syntax, and computer science concepts. Non-Python questions are politely declined.

---

## 📂 Project Directory Structure

```text
C:\Users\LeGion\.gemini\antigravity-ide\scratch\python-tutor-app\
├── server.js                        # Node.js Backend Proxy Server & API Key Guard
├── index.html                       # Main HTML5 UI Markup
├── style.css                        # Emerald Ink Dark Theme CSS System
├── app.js                           # Core Application Logic, Line Inspector & AI Connector
├── curriculum.js                    # 10-Chapter Living Python Book Database
├── .env                             # Backend Environment File (Holds CLAUDE_API_KEY)
└── DEPLOYMENT_AND_PROJECT_SUMMARY.md # This Deployment & Project Guide
```

---

## 🚀 How to Upload / Deploy Online (Tomorrow's Steps)

### Option A: Render.com (Recommended Free Hosting with Node.js Backend)
1. Push the `python-tutor-app` folder to a GitHub repository.
2. Log into **[Render.com](https://render.com/)** and click **New > Web Service**.
3. Connect your GitHub repository.
4. Set:
   - **Build Command**: `npm install` (or leave empty)
   - **Start Command**: `node server.js`
5. In Render's **Environment Variables** section, add:
   - `CLAUDE_API_KEY`: `sk-ant-api03-FKQAF...`
   - `PORT`: `3000`
6. Click **Deploy**. Your app will be live at `https://your-app-name.onrender.com`!

### Option B: Vercel / Railway / VPS / Heroku
- Set the deployment start command to `node server.js`.
- Add `CLAUDE_API_KEY` to the hosting provider's Secret Environment Variables.

---

## 💻 Local Execution Command (To run locally anytime)

```bash
cd C:\Users\LeGion\.gemini\antigravity-ide\scratch\python-tutor-app
node server.js
```
Then open: **[http://localhost:3000](http://localhost:3000)**
