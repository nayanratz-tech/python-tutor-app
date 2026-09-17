// PyMastery Application Core Logic - Living Python Book Tutor

(function() {
  let pyodideInstance = null;
  let codeEditor = null;
  let currentChapterIndex = 0;
  let currentLessonIndex = 0;
  let activeFileName = "main.py";
  let activeFiles = {};

  // DOM Elements
  const engineStatus = document.getElementById('engineStatus');
  const btnRunCode = document.getElementById('btnRunCode');
  const btnRunTests = document.getElementById('btnRunTests');
  const btnResetCode = document.getElementById('btnResetCode');
  const btnClearTerminal = document.getElementById('btnClearTerminal');
  const tierNav = document.getElementById('tierNav');
  const lessonSelect = document.getElementById('lessonSelect');
  const lessonBadge = document.getElementById('lessonBadge');
  const lessonTitle = document.getElementById('lessonTitle');
  const lessonSubtitle = document.getElementById('lessonSubtitle');
  const lessonConcept = document.getElementById('lessonConcept');
  const fileTabs = document.getElementById('fileTabs');
  const terminalConsole = document.getElementById('terminalConsole');
  const memoryView = document.getElementById('memoryView');
  const hintsToggle = document.getElementById('hintsToggle');
  const hintsBody = document.getElementById('hintsBody');
  const hintsList = document.getElementById('hintsList');
  const toggleLessonBtn = document.getElementById('toggleLessonBtn');
  const headerToggleLessonBtn = document.getElementById('headerToggleLessonBtn');
  const lessonPanel = document.getElementById('lessonPanel');

  // Line Inspector DOM Elements
  const activeLineTag = document.getElementById('activeLineTag');
  const whyThisLine = document.getElementById('whyThisLine');
  const whyThatConcept = document.getElementById('whyThatConcept');
  const whyNotElse = document.getElementById('whyNotElse');

  // Variations DOM Elements
  const variationsPills = document.getElementById('variationsPills');

  // Q&A DOM Elements
  const qaInput = document.getElementById('qaInput');
  const qaSubmit = document.getElementById('qaSubmit');
  const qaResponse = document.getElementById('qaResponse');

  // Initialize App
  document.addEventListener('DOMContentLoaded', async () => {
    try {
      initCodeEditor();
      setupEventListeners();
      loadGamificationState();
      renderChapterNavigation();
      loadCurrentLesson();
      await initPyodideEngine();
    } catch (e) {
      console.error("Initialization error:", e);
    }
  });

  // 1. Initialize CodeMirror Editor & Line Inspector Listener
  function initCodeEditor() {
    const textarea = document.getElementById('codeEditor');
    codeEditor = CodeMirror.fromTextArea(textarea, {
      mode: 'python',
      theme: 'dracula',
      lineNumbers: true,
      indentUnit: 4,
      tabSize: 4,
      indentWithTabs: false,
      lineWrapping: true,
      autoCloseBrackets: true
    });

    codeEditor.on('cursorActivity', () => {
      try {
        const cursor = codeEditor.getCursor();
        const lineNumber = cursor.line + 1;
        inspectLineBreakdown(lineNumber);
      } catch (err) {
        console.warn("Cursor activity inspection error:", err);
      }
    });

    codeEditor.on('change', () => {
      if (activeFiles[activeFileName]) {
        activeFiles[activeFileName] = codeEditor.getValue();
      }
    });
  }

  // 2. Dynamic Smart Line Syntax Analyzer Engine
  function inspectLineBreakdown(lineNum) {
    if (!activeLineTag || !whyThisLine) return;

    const chapter = window.CURRICULUM ? window.CURRICULUM[currentChapterIndex] : null;
    const lesson = chapter ? chapter.lessons[currentLessonIndex] : null;

    activeLineTag.textContent = "Line " + lineNum;

    if (lesson && lesson.lineExplanations && lesson.lineExplanations[lineNum]) {
      const exp = lesson.lineExplanations[lineNum];
      whyThisLine.textContent = exp.why;
      whyThatConcept.textContent = exp.whyThat;
      whyNotElse.textContent = exp.whyNot;
      return;
    }

    const rawLine = codeEditor ? codeEditor.getLine(lineNum - 1) : "";
    if (!rawLine || !rawLine.trim()) {
      whyThisLine.textContent = "Empty line or formatting spacing.";
      whyThatConcept.textContent = "Python uses blank lines to visually separate logical blocks of code.";
      whyNotElse.textContent = "Blank lines have zero runtime overhead in Python bytecode.";
      return;
    }

    const analysis = analyzePythonSyntaxLine(rawLine.trim());
    whyThisLine.textContent = analysis.why;
    whyThatConcept.textContent = analysis.whyThat;
    whyNotElse.textContent = analysis.whyNot;
  }

  function analyzePythonSyntaxLine(line) {
    // Comments
    if (line.startsWith('#')) {
      return {
        why: "Documentation comment: '" + line.replace(/^#\s*/, '') + "'",
        whyThat: "In Python, lines starting with `#` are comments ignored by the interpreter at runtime.",
        whyNot: "Why not `//` or `/*...*/`? `//` is integer floor division in Python! Use `#` for single-line comments or `\"\"\"` for docstrings."
      };
    }

    // List assignment
    const listAssignMatch = line.match(/^([A-Za-z0-9_]+)\s*=\s*\[(.*)\]/);
    if (listAssignMatch) {
      const varName = listAssignMatch[1];
      const items = listAssignMatch[2];
      return {
        why: "Creates a Python List named '" + varName + "' containing: [" + items + "].",
        whyThat: "Lists store ordered sequences of values enclosed in square brackets `[...]`. Each item is accessible by zero-indexed position (e.g., `" + varName + "[0]`).",
        whyNot: "Why not separate variables (`" + varName + "_1`, `" + varName + "_2`)? A list allows iterating through all items in a single loop and performing operations like `max(" + varName + ")` or `len(" + varName + ")` instantly!"
      };
    }

    // Class definition
    const classMatch = line.match(/^class\s+([A-Za-z0-9_]+)(?:\(([^)]+)\))?:/);
    if (classMatch) {
      const className = classMatch[1];
      const parentName = classMatch[2];
      return {
        why: "Defines a new Object-Oriented Class named '" + className + "'" + (parentName ? " inheriting from '" + parentName + "'" : "") + ".",
        whyThat: "Classes act as blueprints for creating objects that encapsulate state (attributes) and behavior (methods).",
        whyNot: "Why not use standalone global variables? Global variables clutter scope and allow unsafe mutation. Classes provide clean state isolation."
      };
    }

    // __init__ method
    if (line.match(/^def\s+__init__\s*\(/)) {
      return {
        why: "Defines the `__init__` constructor method, which initializes new object instances.",
        whyThat: "`__init__` is automatically invoked when you call `ClassName()`. `self` refers to the specific instance being instantiated.",
        whyNot: "Why not name it `init()` or `constructor()`? Python specifically searches for the exact dunder method name `__init__` upon object creation."
      };
    }

    // Instance attribute assignment
    const selfAttrMatch = line.match(/^self\.(_*)([A-Za-z0-9_]+)\s*=\s*(.+)/);
    if (selfAttrMatch) {
      const underscores = selfAttrMatch[1];
      const attrName = selfAttrMatch[2];
      const val = selfAttrMatch[3];
      const isPrivate = underscores.length > 0;
      const privateNote = isPrivate ? " The leading underscore indicates a protected/internal attribute convention." : "";
      return {
        why: "Binds value '" + val + "' to instance attribute 'self." + underscores + attrName + "'.",
        whyThat: "`self.` attaches the attribute to the instance's persistent memory state across method calls." + privateNote,
        whyNot: "Why not '" + attrName + " = " + val + "'? Without 'self.', '" + attrName + "' would just be a temporary local variable inside the method and disappear when the method finishes! Why not 'self.__" + attrName + "'? Double underscores trigger name mangling, which is rarely needed."
      };
    }

    // Method definition
    const methodMatch = line.match(/^def\s+([A-Za-z0-9_]+)\s*\(([^)]*)\):/);
    if (methodMatch) {
      const methodName = methodMatch[1];
      const params = methodMatch[2];
      const hasSelf = params.includes('self');
      const selfNote = hasSelf ? " Instance methods require 'self' as the 1st parameter to access object state." : "";
      return {
        why: "Defines function/method '" + methodName + "(" + params + ")'.",
        whyThat: "Functions package reusable code blocks." + selfNote,
        whyNot: hasSelf ? "Why is 'self' required? When calling `obj.method()`, Python automatically passes `obj` as the 1st argument. Omitting `self` causes a TypeError!" : "Why not write inline code? Packaging logic into functions prevents repetition (DRY principle)."
      };
    }

    // Conditionals
    if (line.match(/^(if|elif|else)\b/)) {
      return {
        why: "Branching decision statement: executes indented block conditionally.",
        whyThat: "Python evaluates the condition as boolean (True/False). Code inside the indented block only runs if truthy.",
        whyNot: "Why no parentheses or curly braces `if (x) { ... }`? Python relies on clean indentation (4 spaces) rather than `{}` to define code blocks."
      };
    }

    // Loops
    if (line.match(/^(for|while)\b/)) {
      return {
        why: "Loop iteration statement: repeats execution over a sequence or condition.",
        whyThat: "Python's `for` loop iterates directly over elements in an iterable sequence (list, range, dict).",
        whyNot: "Why not `for (int i=0; i<N; i++)`? Python's direct iterator pattern is cleaner, safer, and avoids off-by-one boundary bugs."
      };
    }

    // List Comprehension
    if (line.includes('[') && line.includes('for') && line.includes('in') && line.includes(']')) {
      return {
        why: "List Comprehension: Constructs a new list in a single optimized line.",
        whyThat: "Combines looping, filtering, and value transformation into a fast C-speed bytecode instruction.",
        whyNot: "Why not a traditional `for` loop with `.append()`? List comprehensions are faster and more concise when transforming datasets."
      };
    }

    // Import statements
    if (line.match(/^(import|from)\b/)) {
      return {
        why: "Imports module or symbol into current namespace: '" + line + "'",
        whyThat: "Modules provide pre-built standard libraries (like math, time, csv, json) or third-party packages.",
        whyNot: "Why not `from module import *`? Star imports pollute your namespace and can silently overwrite existing function names."
      };
    }

    // Return statements
    if (line.match(/^return\b/)) {
      return {
        why: "Exits function execution and passes back result: '" + line.replace('return', '').trim() + "'",
        whyThat: "`return` sends the computed result back to the caller and immediately terminates function execution.",
        whyNot: "Why not just `print()` the result? `print()` displays text on screen, but returns `None`. `return` allows caller functions to use the result in further calculations."
      };
    }

    // Variable assignment
    if (line.includes('=')) {
      return {
        why: "Variable assignment or state update: `" + line + "`",
        whyThat: "Binds the name on the left to the evaluated result of the expression on the right.",
        whyNot: line.includes('+=') ? "Why not `x++`? Python does not support increment `++` or `--` operators. `x += 1` is the standard Pythonic way." : "Why not declare variable types like `int x = 5`? Python is dynamically typed and infers types at runtime."
      };
    }

    // Fallback
    return {
      why: "Executes statement: `" + line + "`",
      whyThat: "Python evaluates expressions sequentially from top to bottom.",
      whyNot: "Syntax follows standard Python 3.11 grammar rules."
    };
  }

  // 3. Pyodide Engine
  async function initPyodideEngine() {
    try {
      updateEngineStatus('loading', 'Loading Python Wasm...');
      pyodideInstance = await loadPyodide();
      
      pyodideInstance.setStdout({
        batched: (text) => appendTerminalOutput(text, 'out')
      });
      pyodideInstance.setStderr({
        batched: (text) => appendTerminalOutput(text, 'err')
      });

      updateEngineStatus('ready', 'Python 3.11 Engine Ready');
      showToast('⚡ Python Engine Ready!');
    } catch (err) {
      console.error(err);
      updateEngineStatus('error', 'Engine Failed');
      appendTerminalOutput('Error loading Pyodide Python engine: ' + err.message, 'err');
    }
  }

  function updateEngineStatus(state, text) {
    if (!engineStatus) return;
    let dotClass = 'yellow';
    if (state === 'ready') dotClass = 'green';
    if (state === 'error') dotClass = 'red';
    engineStatus.innerHTML = `<span class="dot ${dotClass}"></span> ${text}`;
  }

  // 4. Render Curriculum & Variations
  function renderChapterNavigation() {
    if (!tierNav || !window.CURRICULUM) return;
    tierNav.innerHTML = '';
    window.CURRICULUM.forEach((ch, index) => {
      const btn = document.createElement('button');
      btn.className = `tier-btn ${index === currentChapterIndex ? 'active' : ''}`;
      btn.textContent = ch.chapterName.split(':')[0];
      btn.onclick = () => selectChapter(index);
      tierNav.appendChild(btn);
    });
  }

  function selectChapter(chIdx) {
    currentChapterIndex = chIdx;
    currentLessonIndex = 0;
    renderChapterNavigation();
    loadCurrentLesson();
  }

  function loadCurrentLesson() {
    if (!window.CURRICULUM) return;
    const ch = window.CURRICULUM[currentChapterIndex];
    if (!ch) return;
    const lesson = ch.lessons[currentLessonIndex];
    if (!lesson) return;

    // Meta
    if (lessonBadge) lessonBadge.textContent = ch.badge;
    if (lessonTitle) lessonTitle.textContent = lesson.title;
    if (lessonSubtitle) lessonSubtitle.textContent = lesson.subtitle;
    if (lessonConcept) lessonConcept.innerHTML = lesson.concept;

    // Hints
    if (hintsList) {
      hintsList.innerHTML = '';
      if (lesson.hints) {
        lesson.hints.forEach(h => {
          const li = document.createElement('li');
          li.textContent = h;
          hintsList.appendChild(li);
        });
      }
    }

    // Options
    if (lessonSelect) {
      lessonSelect.innerHTML = '';
      ch.lessons.forEach((l, idx) => {
        const opt = document.createElement('option');
        opt.value = idx;
        opt.textContent = l.title;
        if (idx === currentLessonIndex) opt.selected = true;
        lessonSelect.appendChild(opt);
      });
    }

    // Variations
    renderVariations(lesson);

    // Files
    activeFiles = { ...lesson.starterFiles };
    renderFileTabs();
    selectFile("main.py");

    // Default inspect line 1
    setTimeout(() => inspectLineBreakdown(1), 100);
  }

  function renderVariations(lesson) {
    if (!variationsPills) return;
    variationsPills.innerHTML = '';
    
    const baseBtn = document.createElement('button');
    baseBtn.className = 'variation-pill active';
    baseBtn.textContent = 'Main Example Code';
    baseBtn.onclick = () => {
      document.querySelectorAll('.variation-pill').forEach(p => p.classList.remove('active'));
      baseBtn.classList.add('active');
      activeFiles["main.py"] = lesson.starterFiles["main.py"];
      selectFile("main.py");
    };
    variationsPills.appendChild(baseBtn);

    if (lesson.variations && lesson.variations.length > 0) {
      lesson.variations.forEach(v => {
        const btn = document.createElement('button');
        btn.className = 'variation-pill';
        btn.textContent = v.name;
        btn.onclick = () => {
          document.querySelectorAll('.variation-pill').forEach(p => p.classList.remove('active'));
          btn.classList.add('active');
          activeFiles["main.py"] = v.code;
          selectFile("main.py");
        };
        variationsPills.appendChild(btn);
      });
    }
  }

  // 5. File Management
  function renderFileTabs() {
    if (!fileTabs) return;
    fileTabs.innerHTML = '';
    
    Object.keys(activeFiles).forEach(fname => {
      const tab = document.createElement('button');
      tab.className = `file-tab ${fname === activeFileName ? 'active' : ''}`;
      tab.textContent = fname;
      tab.onclick = () => selectFile(fname);
      fileTabs.appendChild(tab);
    });

    const sandboxBtn = document.createElement('button');
    sandboxBtn.className = 'btn-add-file';
    sandboxBtn.textContent = '➕ My Practice Code';
    sandboxBtn.onclick = createNewPracticeFile;
    fileTabs.appendChild(sandboxBtn);
  }

  function createNewPracticeFile() {
    const filename = prompt("Enter a filename for your custom Python program (e.g. my_program.py):", "my_program.py");
    if (!filename) return;

    let validName = filename.trim();
    if (!validName.endsWith('.py') && !validName.endsWith('.csv') && !validName.endsWith('.json')) {
      validName += '.py';
    }

    if (!activeFiles[validName]) {
      activeFiles[validName] = `# My Custom Python Program\n# Write your code below and click 'Run Code'!\n\nprint("Hello from my custom Python script!")\n`;
    }

    selectFile(validName);
    showToast("Created practice file: " + validName);
  }

  function selectFile(fname) {
    activeFileName = fname;
    renderFileTabs();
    if (codeEditor && activeFiles[fname] !== undefined) {
      codeEditor.setValue(activeFiles[fname]);
      codeEditor.setOption('readOnly', fname.endsWith('.csv') || fname.endsWith('.json') ? 'nocursor' : false);
    }
  }

  // 6. Code Runner
  async function runPythonCode() {
    if (!pyodideInstance) {
      showToast("Python engine still loading...", "warning");
      return;
    }

    clearTerminal();
    appendTerminalOutput("--- Executing Python Code ---", 'sys');

    try {
      Object.keys(activeFiles).forEach(fname => {
        pyodideInstance.FS.writeFile(fname, activeFiles[fname]);
      });

      const userCode = activeFiles[activeFileName] || activeFiles["main.py"] || "";
      await pyodideInstance.runPythonAsync(userCode);
      
      appendTerminalOutput("\n--- Program Execution Complete ---", 'sys');
      showToast("Code Executed Successfully!");

      addXp(50, "Code Execution");
      unlockBadge('first_spark');

      inspectVariableMemoryState();

    } catch (err) {
      appendTerminalOutput("Traceback Error:\n" + err.message, 'err');
      showToast("Execution Error encountered", "error");
    }
  }

  // 7. Test Runner
  async function runTestSuite() {
    if (!pyodideInstance || !window.CURRICULUM) return;

    const ch = window.CURRICULUM[currentChapterIndex];
    const lesson = ch ? ch.lessons[currentLessonIndex] : null;
    if (!lesson || !lesson.testCode) {
      showToast("No automated tests defined for this lesson.");
      return;
    }

    clearTerminal();
    appendTerminalOutput("🧪 --- Running Automated Test Suite ---", 'sys');

    try {
      Object.keys(activeFiles).forEach(fname => {
        pyodideInstance.FS.writeFile(fname, activeFiles[fname]);
      });

      const fullTestScript = `${activeFiles["main.py"]}\n\n# --- AUTOMATED TEST ASSERTIONS ---\n${lesson.testCode}`;
      await pyodideInstance.runPythonAsync(fullTestScript);
      
      showToast("🎉 All Challenge Tests Passed!");
      addXp(100, "Automated Test Suite Passed!");
      unlockBadge('bug_hunter');
      
      // Unlock chapter badge if applicable
      if (currentChapterIndex === 0) unlockBadge('ch1_master');
      if (currentChapterIndex === 1) unlockBadge('ch2_master');
      if (currentChapterIndex === 2) unlockBadge('ch3_master');
      if (currentChapterIndex === 3) unlockBadge('ch4_master');

      triggerConfettiBurst();
      inspectVariableMemoryState();

    } catch (err) {
      appendTerminalOutput("❌ Test Failed:\n" + err.message, 'err');
      showToast("Tests failed. Check output for details.", "error");
    }
  }

  // 8. Secure Real Claude AI Tutor Assistant Integration
  async function handleAskTutor() {
    if (!qaInput) return;
    const userQuery = qaInput.value.trim();
    if (!userQuery) return;

    // Active Code Context
    const cursor = codeEditor ? codeEditor.getCursor() : { line: 0 };
    const currentLineText = codeEditor ? codeEditor.getLine(cursor.line) : "";

    // Render Loading State
    if (qaResponse) {
      qaResponse.innerHTML = "🤖 <em>Claude AI Tutor is thinking...</em>";
      qaResponse.classList.remove('hidden');
    }

    try {
      // Send query to secure backend proxy endpoint (/api/ask-tutor)
      const res = await fetch('/api/ask-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userQuery,
          currentLine: cursor.line + 1,
          codeContext: currentLineText
        })
      });

      const data = await res.json();
      if (res.ok && data.answer) {
        // Simple Markdown to HTML conversion
        let formattedText = data.answer
          .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
          .replace(/```python([\s\S]*?)```/g, '<pre class="code-box"><code>$1</code></pre>')
          .replace(/```([\s\S]*?)```/g, '<pre class="code-box"><code>$1</code></pre>')
          .replace(/`([^`]+)`/g, '<code>$1</code>')
          .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
          .replace(/\n/g, '<br>');

        qaResponse.innerHTML = "<strong>🤖 Claude AI Python Tutor:</strong><br><br>" + formattedText;
      } else {
        throw new Error(data.error || "Failed to reach AI service.");
      }
    } catch (err) {
      console.warn("AI Backend call failed, using dynamic syntax fallback:", err);
      // Fallback to local dynamic syntax analyzer
      const analysis = analyzePythonSyntaxLine(currentLineText.trim() || userQuery);
      qaResponse.innerHTML = "<strong>🐍 Python Tutor Explanation:</strong><br><br>" +
        "🟢 <strong>1. Why this statement?</strong><br>" + escapeHtml(analysis.why) + "<br><br>" +
        "🟣 <strong>2. Core Concept:</strong><br>" + escapeHtml(analysis.whyThat) + "<br><br>" +
        "🟠 <strong>3. Why NOT something else?</strong><br>" + escapeHtml(analysis.whyNot);
    }

    addXp(20, "Asked AI Tutor");
    unlockBadge('ai_scholar');
    qaInput.value = '';
  }

  // 9. Memory Inspector
  async function inspectVariableMemoryState() {
    if (!pyodideInstance || !memoryView) return;

    try {
      const inspectorScript = `
import json

def _inspect_globals():
    output = []
    ignored = {'__name__', '__doc__', '__package__', '__loader__', '__spec__', '__annotations__', '__builtins__', '_inspect_globals', 'json'}
    for k, v in globals().items():
        if k not in ignored and not k.startswith('_'):
            val_str = str(v)
            if len(val_str) > 60: val_str = val_str[:57] + '...'
            output.append({
                "name": k,
                "type": type(v).__name__,
                "value": val_str
            })
    return json.dumps(output)

_inspect_globals()
`;
      const jsonResult = await pyodideInstance.runPythonAsync(inspectorScript);
      const varList = JSON.parse(jsonResult);

      if (varList.length === 0) {
        memoryView.innerHTML = '<p class="placeholder-text">No active user variables in memory.</p>';
        return;
      }

      let html = `
        <table class="memory-table">
          <thead>
            <tr>
              <th>Variable Name</th>
              <th>Type</th>
              <th>Current Memory Value</th>
            </tr>
          </thead>
          <tbody>
      `;

      varList.forEach(v => {
        html += `
          <tr>
            <td style="color: var(--accent-cyan); font-weight: 600;">${v.name}</td>
            <td style="color: var(--accent-purple);">${v.type}</td>
            <td style="color: var(--text-main);">${escapeHtml(v.value)}</td>
          </tr>
        `;
      });

      html += '</tbody></table>';
      memoryView.innerHTML = html;
      unlockBadge('memory_sleuth');

    } catch (e) {
      console.warn("Memory inspection fallback:", e);
    }
  }

  // --- GAMIFICATION & ACHIEVEMENT ENGINE (LEVELS 1 - 3) ---
  const GAMIFICATION_KEY = 'pymastery_gamification_v1';

  const LEVEL_TIERS = [
    { level: 1, name: 'Python Novice', icon: '🐍', minXp: 0, maxXp: 300, desc: 'Next Level: Level 2 (Byte Explorer) at 300 XP' },
    { level: 2, name: 'Byte Explorer', icon: '🔷', minXp: 301, maxXp: 800, desc: 'Next Level: Level 3 (Script Crafter) at 800 XP' },
    { level: 3, name: 'Script Crafter', icon: '👑', minXp: 801, maxXp: 1500, desc: '🎉 Maximum Course Milestone Reached! Master of Python Fundamentals.' }
  ];

  const COURSE_BADGES = [
    { id: 'first_spark', icon: '⚡', title: 'First Spark', desc: 'Run your very first Python program in WASM.' },
    { id: 'memory_sleuth', icon: '🧠', title: 'Memory Sleuth', desc: 'Inspect live variable memory allocation.' },
    { id: 'bug_hunter', icon: '🧪', title: 'Bug Hunter', desc: 'Pass your first automated challenge test suite.' },
    { id: 'ai_scholar', icon: '🤖', title: 'AI Scholar', desc: 'Ask a question to the AI Python Tutor.' },
    { id: 'ch1_master', icon: '🐍', title: 'Variable Virtuoso', desc: 'Complete Chapter 1: Variables & Data Types.' },
    { id: 'ch2_master', icon: '🔀', title: 'Branch Master', desc: 'Complete Chapter 2: Control Flow & If-Statements.' },
    { id: 'ch3_master', icon: '🔁', title: 'Loop Legend', desc: 'Complete Chapter 3: For & While Loops.' },
    { id: 'ch4_master', icon: '📦', title: 'Data Sculptor', desc: 'Complete Chapter 4: Lists & Dictionaries.' },
    { id: 'script_crafter', icon: '👑', title: 'Script Crafter', desc: 'Reach Level 3 Milestone (800+ XP)!' }
  ];

  let gamificationState = {
    xp: 0,
    level: 1,
    streakDays: 1,
    lastActiveDate: new Date().toDateString(),
    unlockedBadges: [],
    completedChapters: []
  };

  function loadGamificationState() {
    try {
      const saved = localStorage.getItem(GAMIFICATION_KEY);
      if (saved) {
        gamificationState = { ...gamificationState, ...JSON.parse(saved) };
      }
      checkStreak();
      updateGamificationUI();
    } catch (e) {
      console.warn("Error loading gamification state:", e);
    }
  }

  function saveGamificationState() {
    try {
      localStorage.setItem(GAMIFICATION_KEY, JSON.stringify(gamificationState));
      updateGamificationUI();
    } catch (e) {
      console.warn("Error saving gamification state:", e);
    }
  }

  function checkStreak() {
    const today = new Date().toDateString();
    if (!gamificationState.lastActiveDate) {
      gamificationState.lastActiveDate = today;
      gamificationState.streakDays = 1;
      return;
    }

    if (gamificationState.lastActiveDate === today) return;

    const last = new Date(gamificationState.lastActiveDate);
    const now = new Date(today);
    const diffDays = Math.round((now - last) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      gamificationState.streakDays += 1;
    } else if (diffDays > 1) {
      gamificationState.streakDays = 1;
    }
    gamificationState.lastActiveDate = today;
  }

  function addXp(amount, reason = '') {
    gamificationState.xp += amount;
    showToast(`+${amount} XP! ${reason}`);

    // Check Level Up (Cap at Level 3: Script Crafter)
    let newLevel = 1;
    if (gamificationState.xp >= 800) {
      newLevel = 3;
      unlockBadge('script_crafter');
    } else if (gamificationState.xp >= 300) {
      newLevel = 2;
    }

    if (newLevel > gamificationState.level) {
      gamificationState.level = newLevel;
      const currentTier = LEVEL_TIERS.find(t => t.level === newLevel);
      showAchievementToast(`Level Up! ${currentTier.icon} ${currentTier.name}`, `Reached Level ${newLevel}`);
      triggerConfettiBurst();
    }

    saveGamificationState();
  }

  function unlockBadge(badgeId) {
    if (gamificationState.unlockedBadges.includes(badgeId)) return;

    const badge = COURSE_BADGES.find(b => b.id === badgeId);
    if (!badge) return;

    gamificationState.unlockedBadges.push(badgeId);
    saveGamificationState();

    showAchievementToast(`Badge Unlocked: ${badge.title}`, badge.desc, badge.icon);
    triggerConfettiBurst();
  }

  function showAchievementToast(title, desc, icon = '🏆') {
    const toast = document.getElementById('achievementToast');
    const toastIcon = document.getElementById('achToastIcon');
    const toastTitle = document.getElementById('achToastTitle');
    const toastDesc = document.getElementById('achToastDesc');

    if (!toast) return;
    if (toastIcon) toastIcon.textContent = icon;
    if (toastTitle) toastTitle.textContent = title;
    if (toastDesc) toastDesc.textContent = desc;

    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 4000);
  }

  function triggerConfettiBurst() {
    if (window.confetti) {
      window.confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }

  function updateGamificationUI() {
    const currentTier = LEVEL_TIERS.find(t => t.level === gamificationState.level) || LEVEL_TIERS[0];
    const statLevelBadge = document.getElementById('statLevelBadge');
    const statXpText = document.getElementById('statXpText');
    const xpBarFill = document.getElementById('xpBarFill');
    const statStreakDays = document.getElementById('statStreakDays');

    if (statLevelBadge) statLevelBadge.textContent = `${currentTier.icon} Lvl ${currentTier.level}: ${currentTier.name}`;
    if (statStreakDays) statStreakDays.textContent = gamificationState.streakDays;

    let pct = 0;
    if (currentTier.level === 3) {
      pct = 100;
      if (statXpText) statXpText.textContent = `${gamificationState.xp} XP (Script Crafter)`;
    } else {
      const nextTier = LEVEL_TIERS.find(t => t.level === currentTier.level + 1);
      const range = nextTier.minXp - currentTier.minXp;
      const currentProgress = gamificationState.xp - currentTier.minXp;
      pct = Math.min(100, Math.max(0, (currentProgress / range) * 100));
      if (statXpText) statXpText.textContent = `${gamificationState.xp} / ${nextTier.minXp} XP`;
    }
    if (xpBarFill) xpBarFill.style.width = `${pct}%`;

    // Modal UI
    const modalLevelIcon = document.getElementById('modalLevelIcon');
    const modalLevelName = document.getElementById('modalLevelName');
    const modalLevelProgressFill = document.getElementById('modalLevelProgressFill');
    const modalLevelDesc = document.getElementById('modalLevelDesc');
    const badgesGrid = document.getElementById('badgesGrid');

    if (modalLevelIcon) modalLevelIcon.textContent = currentTier.icon;
    if (modalLevelName) modalLevelName.textContent = `Level ${currentTier.level}: ${currentTier.name}`;
    if (modalLevelProgressFill) modalLevelProgressFill.style.width = `${pct}%`;
    if (modalLevelDesc) modalLevelDesc.textContent = currentTier.desc;

    if (badgesGrid) {
      badgesGrid.innerHTML = '';
      COURSE_BADGES.forEach(b => {
        const isUnlocked = gamificationState.unlockedBadges.includes(b.id);
        const card = document.createElement('div');
        card.className = `badge-card ${isUnlocked ? 'unlocked' : 'locked'}`;
        card.innerHTML = `
          <div class="badge-card-icon">${b.icon}</div>
          <div class="badge-card-title">${b.title}</div>
          <div class="badge-card-desc">${b.desc}</div>
          <div class="badge-status">${isUnlocked ? '✓ Unlocked' : '🔒 Locked'}</div>
        `;
        badgesGrid.appendChild(card);
      });
    }
  }

  // Terminal Output Line Formatting Helper
  function appendTerminalOutput(text, type = 'out') {
    if (!terminalConsole) return;
    
    const lines = text.split('\n');
    lines.forEach(line => {
      if (line === '' && lines.length > 1) return;
      const div = document.createElement('div');
      div.className = 'terminal-line';
      if (type === 'err') div.className += ' error';
      if (type === 'sys') div.className += ' system';
      div.textContent = line;
      terminalConsole.appendChild(div);
    });
    
    terminalConsole.scrollTop = terminalConsole.scrollHeight;
  }

  function clearTerminal() {
    if (terminalConsole) terminalConsole.innerHTML = '';
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
  }

  // Event Listeners
  function setupEventListeners() {
    if (btnRunCode) btnRunCode.addEventListener('click', runPythonCode);
    if (btnRunTests) btnRunTests.addEventListener('click', runTestSuite);
    if (btnClearTerminal) btnClearTerminal.addEventListener('click', clearTerminal);

    // Achievements Modal Event Listeners
    const achievementsModal = document.getElementById('achievementsModal');
    const btnOpenAchievements = document.getElementById('btnOpenAchievements');
    const btnCloseAchievements = document.getElementById('btnCloseAchievements');

    if (btnOpenAchievements && achievementsModal) {
      btnOpenAchievements.addEventListener('click', () => {
        updateGamificationUI();
        achievementsModal.classList.remove('hidden');
      });
    }

    if (btnCloseAchievements && achievementsModal) {
      btnCloseAchievements.addEventListener('click', () => {
        achievementsModal.classList.add('hidden');
      });
    }

    if (achievementsModal) {
      achievementsModal.addEventListener('click', (e) => {
        if (e.target === achievementsModal) {
          achievementsModal.classList.add('hidden');
        }
      });
    }

    if (btnResetCode) {
      btnResetCode.addEventListener('click', () => {
        const ch = window.CURRICULUM[currentChapterIndex];
        const lesson = ch ? ch.lessons[currentLessonIndex] : null;
        if (lesson) {
          activeFiles = { ...lesson.starterFiles };
          selectFile(activeFileName);
          showToast("Code reset to base template.");
        }
      });
    }

    if (lessonSelect) {
      lessonSelect.addEventListener('change', (e) => {
        currentLessonIndex = parseInt(e.target.value);
        loadCurrentLesson();
      });
    }

    if (hintsToggle && hintsBody) {
      hintsToggle.addEventListener('click', () => {
        hintsBody.classList.toggle('hidden');
      });
    }

    if (qaSubmit) qaSubmit.addEventListener('click', handleAskTutor);
    if (qaInput) {
      qaInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAskTutor();
      });
    }

    const toggleSidebar = () => {
      if (!lessonPanel) return;
      lessonPanel.classList.toggle('collapsed');
      const isCollapsed = lessonPanel.classList.contains('collapsed');
      if (toggleLessonBtn) toggleLessonBtn.textContent = isCollapsed ? '▶' : '◀';
      showToast(isCollapsed ? "Lesson drawer hidden" : "Lesson drawer visible");
    };

    if (toggleLessonBtn) toggleLessonBtn.addEventListener('click', toggleSidebar);
    if (headerToggleLessonBtn) headerToggleLessonBtn.addEventListener('click', toggleSidebar);

    // Terminal Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        e.target.classList.add('active');
        const targetTab = e.target.getAttribute('data-tab');
        if (targetTab === 'terminal') {
          const tabT = document.getElementById('tabTerminal');
          if (tabT) tabT.classList.add('active');
        } else if (targetTab === 'memory') {
          const tabM = document.getElementById('tabMemory');
          if (tabM) tabM.classList.add('active');
          inspectVariableMemoryState();
        }
      });
    });
  }

})();
