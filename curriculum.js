// PyMastery - Expanded 10-Chapter Living Python Book Curriculum
window.CURRICULUM = [
  {
    chapterId: "ch-1",
    chapterName: "Chapter 1: Hello World & String Fundamentals",
    badge: "Level 0: Foundations",
    lessons: [
      {
        id: "ch1-1",
        title: "1.1 The Iconic 'Hello World' & String Syntax",
        subtitle: "Learn how Python speaks to the screen and explore string syntax variations.",
        concept: `
          <h3>Welcome to Python!</h3>
          <p>The <code>print()</code> function tells Python to display text on your screen. Everything inside quotes is called a <strong>String</strong>.</p>
        `,
        starterFiles: {
          "main.py": `# Line 1: Standard Hello World
print("Hello, World!")

# Line 2: Single quotes
print('Hello, World from single quotes!')

# Line 3: Multi-line string
print("""Hello World!
Welcome to Python Programming.""")

# Line 4: Custom separator
print("Python", "is", "awesome", sep=" 🔥 ")

# Line 5: Controlling line endings
print("Loading", end="... ")
print("Done!")
`
        },
        lineExplanations: {},
        variations: [],
        testCode: `assert True\nprint("✅ Chapter 1.1 Complete!")`,
        hints: ["Double and single quotes work identically in Python."]
      }
    ]
  },
  {
    chapterId: "ch-2",
    chapterName: "Chapter 2: Variables, Types & Memory (id)",
    badge: "Level 0: Core Concepts",
    lessons: [
      {
        id: "ch2-1",
        title: "2.1 Variables, Dynamic Typing & Memory Pointers",
        subtitle: "Understand how Python binds names to objects in heap memory using id().",
        concept: `
          <h3>Variables as Memory Tags</h3>
          <p>In Python, variables are not boxes—they are <strong>names pointing to objects in memory</strong>.</p>
        `,
        starterFiles: {
          "main.py": `# Integer assignment
age = 25

# Float assignment
price = 19.99

# String assignment
name = "Alice"

# Dynamic Typing & Memory Identification
data = 100
print("Value:", data, "Type:", type(data), "Memory ID:", id(data))

data = "Now a string"
print("Value:", data, "Type:", type(data), "Memory ID:", id(data))
`
        },
        lineExplanations: {},
        variations: [],
        testCode: `assert type(age) == int\nprint("✅ Chapter 2.1 Complete!")`,
        hints: ["`id(x)` returns the exact memory address of variable x."]
      }
    ]
  },
  {
    chapterId: "ch-3",
    chapterName: "Chapter 3: Numbers, Math & Division Operators",
    badge: "Level 1: Math & Logic",
    lessons: [
      {
        id: "ch3-1",
        title: "3.1 Division (/ vs //), Modulo (%) & Powers (**)",
        subtitle: "Master integer division, remainder math, and exponentiation in Python.",
        concept: `
          <h3>Python Math Operators</h3>
          <p>Python provides distinct operators for true float division <code>/</code> and integer floor division <code>//</code>.</p>
        `,
        starterFiles: {
          "main.py": `# True division (always yields float)
result_float = 7 / 2

# Floor division (rounds down to integer)
result_int = 7 // 2

# Modulo operator (returns remainder)
remainder = 7 % 2

# Exponentiation (power)
power = 2 ** 8

print(f"7 / 2 = {result_float}")
print(f"7 // 2 = {result_int}")
print(f"7 % 2 = {remainder}")
print(f"2 ** 8 = {power}")
`
        },
        lineExplanations: {},
        variations: [],
        testCode: `assert result_float == 3.5 and result_int == 3\nprint("✅ Chapter 3.1 Complete!")`,
        hints: ["`/` gives float decimal, `//` truncates down to integer."]
      }
    ]
  },
  {
    chapterId: "ch-4",
    chapterName: "Chapter 4: Strings & Slicing Magic",
    badge: "Level 1: Strings",
    lessons: [
      {
        id: "ch4-1",
        title: "4.1 String Slicing [start:stop:step] & Methods",
        subtitle: "Manipulate strings with indexing, reversing, and string utilities.",
        concept: `
          <h3>String Slicing</h3>
          <p>Python strings can be sliced using <code>string[start:stop:step]</code>.</p>
        `,
        starterFiles: {
          "main.py": `text = 'Python Programming'

# First 6 chars
first_word = text[0:6]

# Reverse string with step -1
reversed_text = text[::-1]

# Clean and format string
clean_text = text.upper().strip()

print(f"Original: {text}")
print(f"First Word: {first_word}")
print(f"Reversed: {reversed_text}")
print(f"Clean: {clean_text}")
`
        },
        lineExplanations: {},
        variations: [],
        testCode: `assert first_word == 'Python'\nprint("✅ Chapter 4.1 Complete!")`,
        hints: ["`[::-1]` is a classic Python trick to reverse any sequence."]
      }
    ]
  },
  {
    chapterId: "ch-5",
    chapterName: "Chapter 5: Conditionals & Truthy/Falsy Rules",
    badge: "Level 1: Control Flow",
    lessons: [
      {
        id: "ch5-1",
        title: "5.1 Decision Logic & Truthiness",
        subtitle: "Learn how Python evaluates values like empty lists, 0, and None as False.",
        concept: `
          <h3>Truthy and Falsy Values</h3>
          <p>In Python, empty values (<code>""</code>, <code>[]</code>, <code>0</code>, <code>None</code>) evaluate to <code>False</code> in boolean contexts.</p>
        `,
        starterFiles: {
          "main.py": `items = []
user_role = 'admin'

if not items:
    print('Shopping cart is empty!')

if user_role == 'admin' and len(items) == 0:
    print('Admin alert: No orders to process.')
`
        },
        lineExplanations: {},
        variations: [],
        testCode: `assert not items\nprint("✅ Chapter 5.1 Complete!")`,
        hints: ["`if not items:` is cleaner than `if len(items) == 0:`."]
      }
    ]
  },
  {
    chapterId: "ch-6",
    chapterName: "Chapter 6: Loops & Terminal Visualizations",
    badge: "Level 2: Iteration",
    lessons: [
      {
        id: "ch6-1",
        title: "6.1 Loops, range(), zip() & ASCII Data Charts",
        subtitle: "Construct custom terminal bar charts using Python loops and list pairing.",
        concept: `
          <h3>Data Visualization with Loops</h3>
          <p>Learn how to render ASCII bar charts using string multiplication and loop iteration.</p>
        `,
        starterFiles: {
          "main.py": `traffic = [120, 340, 560, 410, 890]
days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

max_traffic = max(traffic)

print('📊 WEEKLY TRAFFIC CHARTS')
print('=' * 40)
for day, val in zip(days, traffic):
    bar = '█' * int((val / max_traffic) * 20)
    print(f'{day:<4} | {bar:<20} {val}')
`
        },
        lineExplanations: {},
        variations: [],
        testCode: `assert max_traffic == 890\nprint("✅ Chapter 6.1 Complete!")`,
        hints: ["`zip()` pairs lists element-by-element."]
      }
    ]
  },
  {
    chapterId: "ch-7",
    chapterName: "Chapter 7: Data Structures & Comprehensions",
    badge: "Level 2: Data Structures",
    lessons: [
      {
        id: "ch7-1",
        title: "7.1 Lists, Dicts & List Comprehensions",
        subtitle: "Transform data efficiently using compact list and dictionary comprehensions.",
        concept: `
          <h3>List Comprehensions</h3>
          <p>Comprehensions provide a concise syntax to create lists: <code>[expression for item in iterable if condition]</code>.</p>
        `,
        starterFiles: {
          "main.py": `numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Square even numbers only
even_squares = [n ** 2 for n in numbers if n % 2 == 0]

# Dictionary mapping numbers to their cubes
cube_map = {n: n ** 3 for n in range(1, 5)}

print(f'Even Squares: {even_squares}')
print(f'Cube Map: {cube_map}')
`
        },
        lineExplanations: {},
        variations: [],
        testCode: `assert even_squares == [4, 16, 36, 64, 100]\nprint("✅ Chapter 7.1 Complete!")`,
        hints: ["List comprehensions replace multi-line `for` loops."]
      }
    ]
  },
  {
    chapterId: "ch-8",
    chapterName: "Chapter 8: Functions, *args, **kwargs & Scope",
    badge: "Level 3: Modular Code",
    lessons: [
      {
        id: "ch8-1",
        title: "8.1 Advanced Functions & Variable Arguments",
        subtitle: "Master flexible functions accepting positional (*args) and keyword (**kwargs) arguments.",
        concept: `
          <h3>Flexibility with *args and **kwargs</h3>
          <p><code>*args</code> collects positional arguments into a tuple. <code>**kwargs</code> collects keyword arguments into a dictionary.</p>
        `,
        starterFiles: {
          "main.py": `def build_user_profile(username, *hobbies, **metadata):
    print(f'User: {username}')
    print(f'Hobbies: {hobbies}')
    print(f'Metadata: {metadata}')

build_user_profile('Alex', 'Coding', 'Chess', role='Admin', level=42)
`
        },
        lineExplanations: {},
        variations: [],
        testCode: `assert True\nprint("✅ Chapter 8.1 Complete!")`,
        hints: ["`*args` is a tuple, `**kwargs` is a dictionary."]
      }
    ]
  },
  {
    chapterId: "ch-9",
    chapterName: "Chapter 9: OOP, Classes & Encapsulation (_ vs __)",
    badge: "Level 3: Object-Oriented",
    lessons: [
      {
        id: "ch9-1",
        title: "9.1 Building Bank Account with Encapsulation & Self",
        subtitle: "Learn classes, __init__, self, method binding, and attribute protection.",
        concept: `
          <h3>Deep Dive into Python OOP</h3>
          <p>Learn why <code>self._balance = balance</code> is written this way and what happens if you omit <code>self.</code>.</p>
        `,
        starterFiles: {
          "main.py": `# Line 1: Class Definition
class BankAccount:
    def __init__(self, owner, balance=0.0):
        self.owner = owner
        self._balance = balance

    def deposit(self, amount):
        if amount <= 0:
            print("Deposit must be positive.")
            return False
        self._balance += amount
        print(f"Deposited \${amount:.2f}. Balance: \${self._balance:.2f}")
        return True

    def withdraw(self, amount):
        if amount > self._balance:
            print("Insufficient funds.")
            return False
        self._balance -= amount
        print(f"Withdrew \${amount:.2f}. Balance: \${self._balance:.2f}")
        return True

acc = BankAccount('Elena', 250.0)
acc.deposit(100.0)
print(f'Account owner: {acc.owner}, Balance: {acc._balance}')
`
        },
        lineExplanations: {},
        variations: [],
        testCode: `assert acc._balance == 350.0\nprint("✅ Chapter 9.1 Complete!")`,
        hints: ["`self` attaches variables to the specific object instance."]
      }
    ]
  },
  {
    chapterId: "ch-10",
    chapterName: "Chapter 10: Advanced Decorators, Context & Async",
    badge: "Level 4: Advanced Mastery",
    lessons: [
      {
        id: "ch10-1",
        title: "10.1 Custom Decorators & Performance Profiling",
        subtitle: "Extend function behavior dynamically using Python function decorators.",
        concept: `
          <h3>Decorators in Python</h3>
          <p>A decorator is a function that takes another function as an argument and extends its behavior without modifying it.</p>
        `,
        starterFiles: {
          "main.py": `import time

def timer_decorator(func):
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        res = func(*args, **kwargs)
        end = time.perf_counter()
        print(f'⏱️ [{func.__name__}] took {(end-start)*1000:.3f} ms')
        return res
    return wrapper

@timer_decorator
def compute_squares():
    return [i ** 2 for i in range(100000)]

compute_squares()
`
        },
        lineExplanations: {},
        variations: [],
        testCode: `assert callable(timer_decorator)\nprint("✅ Chapter 10.1 Complete!")`,
        hints: ["The `@timer_decorator` syntax is shorthand for `compute_squares = timer_decorator(compute_squares)`."]
      }
    ]
  }
];
