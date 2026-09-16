# 🐍 PyMastery: Dedicated Python Program Tutor

> An interactive, high-craft web application designed to teach Python programming from absolute zero (Level 0) to advanced software engineering, powered by Pyodide (in-browser WebAssembly Python 3.11 engine) and Claude 3.5 AI.

---

## ✨ Features

- **📖 10-Chapter Living Python Book Curriculum**: Covers Hello World variations, variables, dynamic typing, memory pointers (`id()`), slicing, conditionals, terminal ASCII charts, data structures, OOP (`self`, encapsulation), decorators, and async programming.
- **🔍 Dynamic Smart Line Syntax Inspector**: Move cursor over any line of code to get an instant 3-part breakdown:
  1. **Why this line?** (Plain English statement action)
  2. **Why that concept?** (Python language syntax & rules)
  3. **Why NOT something else?** (Alternative methods & pitfalls)
- **💬 AI Python Tutor (Powered by Claude 3.5)**: Context-aware Q&A assistant with strict Python-only guardrails.
- **⚡ In-Browser Python 3.11 Execution**: Powered by Pyodide (Wasm) running 100% locally with 0ms server latency.
- **🔍 Memory & Variable Inspector**: Real-time visual table inspecting variable allocations in memory.
- **➕ My Practice Sandbox**: Dedicated custom script editor for students to write and run their own Python programs.
- **🔒 Backend API Key Security**: Zero key leakage. All API requests route securely through a backend Node.js proxy server.

---

## 🛠️ Quick Start (Local Setup)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/python-tutor-app.git
cd python-tutor-app
```

### 2. Configure Environment
Copy `.env.example` to `.env` and add your Claude API key:
```bash
cp .env.example .env
```
Edit `.env`:
```env
CLAUDE_API_KEY=your_claude_api_key_here
PORT=3000
```

### 3. Start the Application
```bash
node server.js
```
Open **`http://localhost:3000`** in your browser!

---

## 🚀 One-Click Online Deployment

### Deploy on Render.com / Railway / Vercel
1. Create a new Web Service and link your GitHub repository.
2. Set **Start Command**: `node server.js`.
3. Add Environment Variable:
   - `CLAUDE_API_KEY`: `<your-key>`
   - `PORT`: `3000`

---

## 📄 License
MIT License - Free for educational and open-source use.
