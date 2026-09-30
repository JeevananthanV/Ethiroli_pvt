# ETH-FS-45 — Full Stack Development Internship
## Complete Day-by-Day Curriculum (Content • Code • Quiz • Task)

Below is the **full 45-day master map** plus **complete detailed content for Days 1–15**. Because each day includes theory, fully explained code, a quiz with answer key, and a graded task, the full 45 days is very large — I'll deliver it in 3 parts. **Reply `CONTINUE` and I'll send Days 16–30, then 31–45.**

---

# 📅 MASTER DAY MAP — ETH-FS-45

| Day | Course | Topic | Phase |
|---|---|---|---|
| 1 | 01 Full Stack Foundation | What is Full Stack + SDLC + How the Web Works | 1 |
| 2 | 01 Full Stack Foundation | Environment Setup + First Page | 1 |
| 3 | 02 HTML5 | Document Structure & Semantic Tags | 1 |
| 4 | 02 HTML5 | Forms, Tables, Media, Accessibility | 1 |
| 5 | 03 CSS3 | Selectors, Box Model, Typography | 1 |
| 6 | 03 CSS3 | Flexbox & Grid | 1 |
| 7 | 03 CSS3 | Responsive Design | 1 |
| 8 | 04 UI/UX | Design Principles & Visual Hierarchy | 1 |
| 9 | 04 UI/UX | Wireframes, Figma, Design Systems | 1 |
| 10 | 05 Git & GitHub | Git Basics, Commits, Branches | 1 |
| 11 | 05 Git & GitHub | Remotes, PRs, Merge Conflicts | 2 |
| 12 | 06 JS Fundamentals | Variables, Data Types, Operators | 2 |
| 13 | 06 JS Fundamentals | Conditionals & Loops | 2 |
| 14 | 06 JS Fundamentals | Functions, Scope, Hoisting | 2 |
| 15 | 06 JS Fundamentals | Arrays & Array Methods | 2 |
| 16 | 06 JS Fundamentals | Objects, JSON, Destructuring, Spread | 2 |
| 17 | 07 JS Advanced | DOM Manipulation & Events | 2 |
| 18 | 07 JS Advanced | ES6+, Modules, Error Handling | 2 |
| 19 | 07 JS Advanced | Async JS: Promises, async/await, fetch | 2 |
| 20 | 08 React | Intro, Vite, JSX, Components | 2 |
| 21 | 08 React | Props & Composition | 2 |
| 22 | 08 React | State & useState | 2 |
| 23 | 08 React | useEffect & Data Fetching | 2 |
| 24 | 08 React | Lists, Keys, Forms | 2 |
| 25 | 08 React | React Router & Project Structure | 2 |
| 26 | 09 Node.js | Runtime, Modules, npm, fs | 3 |
| 27 | 09 Node.js | HTTP Module & Event Loop | 3 |
| 28 | 09 Node.js | Async Node, Env Vars, Project Setup | 3 |
| 29 | 10 Express | Setup, Routing, Middleware | 3 |
| 30 | 10 Express | Controllers & Error Handling | 3 |
| 31 | 10 Express | MVC Structure, Static, CORS | 3 |
| 32 | 11 MySQL | Intro, DDL, SQL Basics | 3 |
| 33 | 11 MySQL | CRUD, WHERE, ORDER, LIMIT | 3 |
| 34 | 11 MySQL | Joins & Aggregation | 3 |
| 35 | 11 MySQL | Relationships, Normalization, Indexes | 3 |
| 36 | 12 REST API | REST Principles & Status Codes | 3 |
| 37 | 12 REST API | Build API: Express + MySQL | 3 |
| 38 | 13 Auth | bcrypt, Sessions vs JWT | 4 |
| 39 | 13 Auth | JWT + RBAC Middleware | 4 |
| 40 | 14 Integration | React ↔ API, Proxy, Env | 4 |
| 41 | 14 Integration | End-to-End CRUD Feature | 4 |
| 42 | 15 Testing | Jest, Supertest, Debugging | 4 |
| 43 | 16 Deployment | Build, Host, Deploy, CI | 4 |
| 44 | 17 Final Project | Requirements + Architecture + Build | 5 |
| 45 | 17 Final Project | Build, Review, Present, Evaluate | 6 |

---

# 🟢 DAY 1 — What is Full Stack + SDLC + How the Web Works

**Course 01:** Full Stack Development Foundation | **Phase 1**

### 🎯 Learning Objectives
- Define frontend, backend, database, and DevOps
- Explain the client–server model and HTTP request/response cycle
- Describe the 6 phases of the SDLC
- Identify the MERN/MEAN-style stack you'll use (React + Node + Express + MySQL)

### 📘 Content

**1.1 What "Full Stack" means**

A full-stack developer can build every layer of an application:

```
┌─────────────────────────────────────────┐
│  PRESENTATION LAYER  (Frontend)         │  React, HTML, CSS, JS
├─────────────────────────────────────────┤
│  APPLICATION LAYER   (Backend)          │  Node.js, Express
├─────────────────────────────────────────┤
│  DATA LAYER          (Database)         │  MySQL
├─────────────────────────────────────────┤
│  INFRASTRUCTURE      (DevOps)           │  Git, CI/CD, Hosting
└─────────────────────────────────────────┘
```

**1.2 The client–server model**

- **Client** = browser (Chrome). It *requests*.
- **Server** = a machine running your Node app. It *responds*.
- They speak **HTTP** (HyperText Transfer Protocol).

**1.3 What happens when you type a URL**

1. **DNS lookup** — `google.com` → `142.250.190.78`
2. **TCP handshake** — client and server open a connection (3-way: SYN, SYN-ACK, ACK)
3. **HTTP request** sent:

```http
GET /search?q=react HTTP/1.1
Host: google.com
Accept: text/html
```

4. **Server processes** and returns:

```http
HTTP/1.1 200 OK
Content-Type: text/html

<html>...</html>
```

5. **Browser renders** — parses HTML → builds DOM → applies CSS → runs JS

**1.4 HTTP methods & status codes (preview)**

| Method | Purpose | Status | Meaning |
|---|---|---|---|
| GET | Read data | 200 | OK |
| POST | Create data | 201 | Created |
| PUT | Replace | 400 | Bad Request |
| PATCH | Partial update | 401 | Unauthorized |
| DELETE | Remove | 404 | Not Found |
| | | 500 | Server Error |

**1.5 SDLC — Software Development Life Cycle**

```
1. REQUIREMENT GATHERING  → What does the client need?
2. DESIGN                 → Wireframes + DB schema + API design
3. DEVELOPMENT            → Write the code
4. TESTING                → Does it work? Does it break?
5. DEPLOYMENT             → Put it on a server
6. MAINTENANCE            → Fix bugs, add features
```

**1.6 Your stack for this internship**

| Layer | Technology | Why |
|---|---|---|
| Frontend | React | Component-based, industry standard |
| Backend | Node.js + Express | Same language (JS) as frontend |
| Database | MySQL | Relational, teaches real SQL |
| Version control | Git + GitHub | Every company uses it |

### 🧪 Quiz — Day 1

1. Which layer is responsible for storing data permanently?
   a) Presentation b) Application c) Data d) Infrastructure
   ✅ **c) Data** — The database layer persists data.

2. Which HTTP method is used to *create* a new resource?
   a) GET b) POST c) PUT d) DELETE
   ✅ **b) POST** — POST creates; GET reads; PUT replaces; DELETE removes.

3. What does DNS do?
   a) Encrypts data b) Translates domain names to IP addresses c) Compresses files d) Manages sessions
   ✅ **b)** — DNS resolves human-readable names into IP addresses.

4. Status code `401` means:
   a) Not Found b) Server Error c) Unauthorized d) Created
   ✅ **c) Unauthorized** — 401 = not authenticated. (403 = authenticated but not allowed.)

5. Which is NOT a phase of the SDLC?
   a) Requirement Gathering b) Deployment c) Compilation d) Maintenance
   ✅ **c) Compilation** — Compilation is a build step, not an SDLC phase.

### 🛠️ Task — Day 1
**Deliverable:** `Day01_FullStack_Notes.md` in your GitHub repo.

Write a 1-page document containing:
1. A diagram of the client–server model (can be ASCII or an image)
2. A trace of what happens when you visit `https://ethiroli.in` (8+ steps)
3. A table listing 6 HTTP status codes and their meanings
4. One paragraph: "Which layer do I want to specialise in, and why?"

**Rubric (10 pts):** Diagram 2 · Trace 3 · Status codes 3 · Reflection 2

### ✅ Checkpoint
You can explain the request/response cycle out loud without notes.

---

# 🟢 DAY 2 — Environment Setup + Your First Page

**Course 01:** Full Stack Development Foundation | **Phase 1**

### 🎯 Learning Objectives
- Install and verify Node.js, npm, Git, VS Code
- Navigate the terminal confidently
- Create and serve a first HTML file
- Understand the browser DevTools

### 📘 Content

**2.1 Install checklist**

| Tool | Verify command | Expected |
|---|---|---|
| Node.js | `node -v` | v20.x.x or higher |
| npm | `npm -v` | 10.x.x |
| Git | `git --version` | 2.x |
| VS Code | — | Opens |

**2.2 Terminal survival kit**

```bash
pwd                 # where am I?
ls                  # list files (Windows: dir)
cd projects         # change directory
cd ..               # go up one level
mkdir ethiroli-lms  # make a folder
touch index.html    # create a file (Windows: ni index.html)
code .              # open current folder in VS Code
```

**2.3 VS Code extensions to install**

- **Prettier** — auto-formatting
- **ESLint** — catches JS errors
- **Live Server** — serves HTML with auto-reload
- **GitLens** — Git history inline
- **MySQL** (cweijan) — DB viewer (you'll need it on Day 32)

**2.4 Your first HTML page**

Create `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ethiroli LMS — Day 2</title>
</head>
<body>
  <h1>Hello, Ethiroli!</h1>
  <p>My first page is live.</p>
</body>
</html>
```

**Line-by-line explanation:**

| Line | Meaning |
|---|---|
| `<!DOCTYPE html>` | Tells the browser "this is HTML5" — must be first |
| `<html lang="en">` | Root element; `lang` helps screen readers & SEO |
| `<meta charset="UTF-8">` | Supports all characters (Tamil, emoji, etc.) |
| `<meta name="viewport" ...>` | **Critical for mobile** — makes width = device width |
| `<title>` | Text shown in the browser tab |
| `<body>` | Everything visible goes here |

**2.5 Running it**

- Option A: Double-click the file → opens in browser
- Option B (**recommended**): Right-click → **Open with Live Server**

**2.6 DevTools crash course** (`F12` or `Ctrl+Shift+I`)

| Tab | Use |
|---|---|
| Elements | Inspect/edit HTML & CSS live |
| Console | Run JS, see errors |
| Network | See every request, status, timing |
| Application | View localStorage, cookies |

Try this in the Console:
```js
document.querySelector('h1').style.color = 'crimson';
```
**Explanation:** `document` is the page. `.querySelector('h1')` finds the first `<h1>`. `.style.color` sets the CSS color. The page updates instantly — this is the DOM being mutated.

### 🧪 Quiz — Day 2

1. Which meta tag is required for responsive design?
   a) `<meta charset>` b) `<meta name="viewport">` c) `<meta name="description">` d) `<meta http-equiv>`
   ✅ **b)** — Without the viewport tag, mobile browsers render at desktop width and zoom out.

2. What does `cd ..` do?
   a) Deletes a folder b) Moves up one directory level c) Creates a folder d) Lists files
   ✅ **b)** — `..` always means "parent directory."

3. Which DevTools tab shows HTTP requests?
   a) Elements b) Console c) Network d) Application
   ✅ **c) Network**

4. Which command checks your Node version?
   a) `npm -v` b) `node --version` c) `node -version` d) Both b and c
   ✅ **d)** — `--version` and `-v` both work for `node`.

5. What does `<!DOCTYPE html>` do?
   a) Loads a stylesheet b) Declares HTML5 so the browser uses standards mode c) Creates the body d) Nothing
   ✅ **b)**

### 🛠️ Task — Day 2
**Deliverable:** A GitHub repo `ethiroli-internship` with `index.html`.

Requirements:
1. Correct HTML5 boilerplate with viewport meta
2. An `<h1>` with your name, a `<p>` with your goal for these 45 days
3. An unordered list of 5 tools you installed
4. Push to GitHub with the commit message `day02: environment setup + first page`

**Rubric (10 pts):** Boilerplate 3 · Content 2 · Valid HTML (no console errors) 2 · Pushed correctly 3

### ✅ Checkpoint
`node -v`, `git --version`, and Live Server all work.

---

# 🟢 DAY 3 — HTML5 Document Structure & Semantic Tags

**Course 02:** HTML5 | **Phase 1**

### 🎯 Learning Objectives
- Use semantic HTML elements instead of generic `<div>`
- Build a proper page skeleton
- Understand block vs inline elements
- Write accessible headings and landmarks

### 📘 Content

**3.1 Why semantic HTML matters**

```html
<!-- ❌ Div soup — no meaning -->
<div class="header">
  <div class="nav">...</div>
</div>
<div class="main">
  <div class="article">...</div>
</div>

<!-- ✅ Semantic — meaning is built in -->
<header>
  <nav>...</nav>
</header>
<main>
  <article>...</article>
</main>
```

**Benefits:** SEO (Google understands your page), Accessibility (screen readers can jump to `<nav>`), Maintainability (readable code).

**3.2 The semantic elements**

| Element | Purpose |
|---|---|
| `<header>` | Introductory content / logo / nav |
| `<nav>` | Navigation links |
| `<main>` | Primary content (**only one per page**) |
| `<section>` | Thematic grouping, usually with a heading |
| `<article>` | Self-contained content (blog post, card) |
| `<aside>` | Sidebar, related content |
| `<footer>` | Copyright, contact, links |
| `<figure>` / `<figcaption>` | Image + caption |

**3.3 Block vs Inline**

```html
<!-- Block: starts on a new line, takes full width -->
<div>Block</div>
<p>Block</p>
<h1>Block</h1>

<!-- Inline: flows with text, only takes needed width -->
<span>inline</span>
<a href="#">inline</a>
<strong>inline</strong>
```

**3.4 Heading hierarchy**

```html
<h1>Page Title</h1>        <!-- ONE per page -->
  <h2>Section</h2>
    <h3>Subsection</h3>
```

Never skip levels (`<h1>` → `<h4>`). Screen readers use headings as a table of contents.

**3.5 Complete page skeleton — build this**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ethiroli LMS</title>
</head>
<body>

  <header>
    <h1>Ethiroli LMS</h1>
    <nav aria-label="Main navigation">
      <ul>
        <li><a href="#programs">Programs</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <section id="programs">
      <h2>Our Internship Programs</h2>

      <article>
        <h3>30-Day Web Development</h3>
        <p>Build a frontend with a basic API integration.</p>
      </article>

      <article>
        <h3>45-Day Full Stack Development</h3>
        <p>Build and deploy a complete full-stack application.</p>
      </article>

      <article>
        <h3>60-Day Advanced Full Stack + AI</h3>
        <p>Production-grade application with AI-assisted workflow.</p>
      </article>
    </section>

    <aside>
      <h2>Quick Links</h2>
      <p>Download the syllabus PDF.</p>
    </aside>
  </main>

  <footer>
    <p>&copy; 2025 Ethiroli. All rights reserved.</p>
  </footer>

</body>
</html>
```

**Explanation of key choices:**
- `aria-label="Main navigation"` — distinguishes this `<nav>` from others for screen readers
- `id="programs"` on the section + `href="#programs"` — creates an in-page anchor jump
- Each `<article>` is self-contained — you could copy it elsewhere and it still makes sense
- `<aside>` is tangential content — correct semantically

**3.6 Text-level semantics**

```html
<strong>Important</strong>     <!-- strong importance, bold -->
<em>Emphasised</em>            <!-- stress emphasis, italic -->
<mark>Highlighted</mark>       <!-- relevant/highlighted -->
<code>const x = 1;</code>      <!-- inline code -->
<pre><code>multi-line code</code></pre>  <!-- preserves whitespace -->
<abbr title="Application Programming Interface">API</abbr>
<time datetime="2025-01-15">Jan 15, 2025</time>
```

### 🧪 Quiz — Day 3

1. How many `<main>` elements should a page have?
   a) Unlimited b) One c) Two d) Zero
   ✅ **b) One** — `<main>` marks the single primary content region.

2. Which element is best for a self-contained blog post?
   a) `<section>` b) `<div>` c) `<article>` d) `<aside>`
   ✅ **c) `<article>`**

3. `<span>` is:
   a) Block-level b) Inline c) Void d) Semantic
   ✅ **b) Inline** — it flows inline and has no default styling.

4. Why avoid skipping heading levels?
   a) It breaks CSS b) It confuses screen readers and hurts SEO c) Browsers reject it d) It's slower
   ✅ **b)**

5. Which is a **void** (self-closing) element?
   a) `<div>` b) `<p>` c) `<img>` d) `<section>`
   ✅ **c) `<img>`** — Void elements have no content and no closing tag: `img`, `br`, `hr`, `input`, `meta`, `link`.

### 🛠️ Task — Day 3
**Deliverable:** `day03/semantic-page.html`

Build a semantically correct page for a fictional "Ethiroli Course Detail" screen containing:
- `<header>` with logo text + `<nav>` with 3 links
- `<main>` with one `<section>` containing 3 `<article>` course cards
- Each card: `<h3>`, `<p>`, and a `<time>` for duration
- One `<aside>` with related links
- `<footer>` with copyright
- Zero `<div>` elements

**Rubric (10 pts):** All landmarks present 4 · Zero divs 2 · Heading hierarchy correct 2 · Valid HTML 2

### ✅ Checkpoint
Your page passes the W3C validator with 0 errors.

---

# 🟢 DAY 4 — HTML5 Forms, Tables, Media & Accessibility

**Course 02:** HTML5 | **Phase 1**

### 🎯 Learning Objectives
- Build accessible, validated forms
- Use the correct `<input>` types
- Structure tabular data correctly
- Apply ARIA and alt-text best practices

### 📘 Content

**4.1 The anatomy of a form**

```html
<form action="/api/register" method="POST">
  <fieldset>
    <legend>Intern Registration</legend>

    <label for="fullname">Full Name</label>
    <input type="text" id="fullname" name="fullname" required minlength="3" />

    <label for="email">Email</label>
    <input type="email" id="email" name="email" required />

    <label for="age">Age</label>
    <input type="number" id="age" name="age" min="18" max="65" />

    <label for="password">Password</label>
    <input type="password" id="password" name="password"
           required minlength="8" pattern="(?=.*\d)(?=.*[A-Z]).{8,}" />

    <label for="track">Program</label>
    <select id="track" name="track">
      <option value="">-- Select --</option>
      <option value="web30">30-Day Web Development</option>
      <option value="fs45">45-Day Full Stack</option>
      <option value="ai60">60-Day Full Stack + AI</option>
    </select>

    <label for="bio">Short Bio</label>
    <textarea id="bio" name="bio" rows="4"></textarea>

    <button type="submit">Register</button>
  </fieldset>
</form>
```

**Critical rules:**

| Rule | Why |
|---|---|
| Every input needs a `<label for="id">` matching the input's `id` | Clicking the label focuses the input; screen readers announce it |
| Use `name` attribute | This is the key sent to the server — without it, the value isn't submitted |
| `required`, `minlength`, `pattern` | Free client-side validation, no JS needed |
| `<fieldset>` + `<legend>` | Groups related fields semantically |
| `type="email"` not `type="text"` | Mobile shows @ keyboard; browser validates format |

**4.2 Input types cheat sheet**

```html
<input type="text">      <input type="email">
<input type="password">  <input type="number">
<input type="date">      <input type="time">
<input type="tel">       <input type="url">
<input type="checkbox">  <input type="radio">
<input type="file">      <input type="range">
<input type="color">     <input type="search">
<input type="hidden">
```

**4.3 Radio groups & checkboxes**

```html
<!-- Radio: only ONE selectable per name group -->
<fieldset>
  <legend>Mode</legend>
  <input type="radio" id="online" name="mode" value="online" checked />
  <label for="online">Online</label>

  <input type="radio" id="offline" name="mode" value="offline" />
  <label for="offline">Offline</label>
</fieldset>

<!-- Checkbox: MULTIPLE selectable -->
<input type="checkbox" id="terms" name="terms" required />
<label for="terms">I accept the terms</label>
```

**Explanation:** Radio buttons share the same `name` — the browser treats them as one group and only allows one selection.

**4.4 Tables — for data, never for layout**

```html
<table>
  <caption>Intern Progress Report</caption>
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Program</th>
      <th scope="col">Progress</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Arun</th>
      <td>45-Day Full Stack</td>
      <td>68%</td>
    </tr>
    <tr>
      <th scope="row">Divya</th>
      <td>30-Day Web Dev</td>
      <td>91%</td>
    </tr>
  </tbody>
  <tfoot>
    <tr><td colspan="3">Last updated: 2025-01-15</td></tr>
  </tfoot>
</table>
```

- `<caption>` describes the table (screen readers read it first)
- `scope="col"` / `scope="row"` tell assistive tech which cells a header governs
- `colspan="3"` merges 3 columns

**4.5 Media**

```html
<!-- Images -->
<img src="team.jpg" alt="Five interns collaborating at a whiteboard"
     width="600" height="400" loading="lazy" />

<!-- Responsive images -->
<img src="small.jpg"
     srcset="small.jpg 480w, medium.jpg 800w, large.jpg 1200w"
     sizes="(max-width: 600px) 480px, 800px"
     alt="Dashboard screenshot" />

<!-- Video -->
<video controls width="640" poster="thumb.jpg">
  <source src="demo.mp4" type="video/mp4" />
  <track kind="captions" src="demo.vtt" srclang="en" label="English" />
  Your browser doesn't support video.
</video>
```

**Alt text rules:**
- Decorative image → `alt=""` (empty, but present)
- Informative → describe the content, not "image of"
- Never omit `alt` entirely

**4.6 Accessibility checklist**

| Item | Requirement |
|---|---|
| Colour contrast | 4.5:1 minimum for body text |
| Keyboard | Everything reachable via Tab |
| Focus | Visible focus ring (never `outline: none` without a replacement) |
| Labels | Every form control has one |
| Alt text | Every meaningful image |
| Language | `<html lang="en">` |
| Skip link | `<a href="#main" class="skip">Skip to content</a>` |

### 🧪 Quiz — Day 4

1. Which attribute sends a form field's value to the server?
   a) `id` b) `name` c) `for` d) `value`
   ✅ **b) `name`** — `id` links to the label; `name` is the data key.

2. How do you group radio buttons so only one can be selected?
   a) Same `id` b) Same `name` c) Wrap in `<div>` d) Same `value`
   ✅ **b) Same `name`**

3. Correct alt text for a decorative divider line?
   a) `alt="line"` b) `alt=""` c) no alt attribute d) `alt="decorative image"`
   ✅ **b) `alt=""`** — Empty alt tells screen readers to skip it.

4. What does `scope="col"` do in a `<th>`?
   a) Styles the column b) Identifies the header as governing a column c) Merges cells d) Sorts the column
   ✅ **b)**

5. Which element groups related form fields?
   a) `<group>` b) `<section>` c) `<fieldset>` d) `<div>`
   ✅ **c) `<fieldset>`**, paired with `<legend>`.

### 🛠️ Task — Day 4
**Deliverable:** `day04/registration-form.html`

Build a fully accessible intern registration form with:
- `<fieldset>` + `<legend>` for Personal Info, Program Selection, and Account
- 8+ different input types
- HTML5 validation (`required`, `pattern`, `minlength`, `type`)
- A radio group and at least 2 checkboxes
- A `<table>` showing 3 sample intern records with `<thead>`, `<tbody>`, `<caption>`, and `scope`
- One `<img>` with meaningful alt text and one with `alt=""`

**Rubric (10 pts):** All labels correct 3 · Validation attributes 2 · Table semantics 3 · Alt text 2

### ✅ Checkpoint
Tab through the form — every field is reachable and announced correctly.

---

# 🟢 DAY 5 — CSS3: Selectors, Box Model & Typography

**Course 03:** CSS3 & Responsive Design | **Phase 1**

### 🎯 Learning Objectives
- Link CSS three ways and know which to use
- Master specificity and the cascade
- Understand the box model precisely
- Apply typography and colour systems

### 📘 Content

**5.1 Three ways to add CSS**

```html
<!-- 1. Inline (avoid — highest specificity, unmaintainable) -->
<p style="color: red;">Text</p>

<!-- 2. Internal (ok for single-page demos) -->
<head>
  <style>
    p { color: red; }
  </style>
</head>

<!-- 3. External (✅ always use this) -->
<head>
  <link rel="stylesheet" href="styles.css" />
</head>
```

**5.2 Selectors**

```css
/* Element */
p { color: #333; }

/* Class (. reusable) */
.card { border-radius: 8px; }

/* ID (# unique — avoid for styling) */
#header { background: #000; }

/* Descendant */
nav a { text-decoration: none; }

/* Direct child */
nav > ul { list-style: none; }

/* Adjacent sibling */
h2 + p { margin-top: 0; }

/* Attribute */
input[type="email"] { border-color: blue; }

/* Pseudo-class */
a:hover { color: crimson; }
li:nth-child(odd) { background: #f5f5f5; }

/* Pseudo-element */
.card::before { content: "★"; }
p::first-line { font-weight: bold; }

/* Multiple */
h1, h2, h3 { font-family: sans-serif; }
```

**5.3 Specificity — who wins?**

```
Inline style        → 1,0,0,0
ID                  → 0,1,0,0
Class / attribute / pseudo-class → 0,0,1,0
Element / pseudo-element         → 0,0,0,1
```

```css
p { color: blue; }              /* 0,0,0,1 */
.text { color: green; }         /* 0,0,1,0  ← wins */
#main .text { color: red; }     /* 0,1,1,0  ← wins over both */
```

**Rule:** If you need `!important`, your structure is wrong. Refactor instead.

**5.4 The Box Model — the single most important CSS concept**

```
┌─────────────────────────────────────┐
│            MARGIN (outside)         │
│  ┌───────────────────────────────┐  │
│  │        BORDER                 │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │      PADDING            │  │  │
│  │  │  ┌───────────────────┐  │  │  │
│  │  │  │     CONTENT       │  │  │  │
│  │  │  └───────────────────┘  │  │  │
│  │  └─────────────────────────┘  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

```css
.box {
  width: 300px;
  padding: 20px;
  border: 5px solid #333;
  margin: 10px;
}
/* Rendered width = 300 + 40 + 10 = 350px  ← confusing! */
```

**Fix it globally — always do this:**

```css
*, *::before, *::after {
  box-sizing: border-box;
}
```

Now `width: 300px` includes padding and border. Rendered width = **300px**. This is why every modern codebase starts with this reset.

**5.5 A professional CSS reset**

```css
/* reset.css */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  -webkit-text-size-adjust: 100%;
  scroll-behavior: smooth;
}

body {
  min-height: 100vh;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}

input, button, textarea, select {
  font: inherit;
}

a {
  color: inherit;
  text-decoration: none;
}

ul, ol {
  list-style: none;
}
```

**5.6 Typography**

```css
:root {
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Type scale (1.25 ratio) */
  --text-xs:   0.75rem;   /* 12px */
  --text-sm:   0.875rem;  /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg:   1.25rem;   /* 20px */
  --text-xl:   1.563rem;  /* 25px */
  --text-2xl:  1.953rem;  /* 31px */
  --text-3xl:  2.441rem;  /* 39px */
}

body {
  font-family: var(--font-sans);
  font-size: var(--text-base);
  line-height: 1.6;
  color: #1a1a1a;
}

h1 {
  font-size: var(--text-3xl);
  line-height: 1.2;
  letter-spacing: -0.02em;
  margin-bottom: 0.5em;
}

p {
  max-width: 65ch;  /* 45–75 characters = optimal reading */
  margin-bottom: 1em;
}
```

**Why `rem` and not `px`?** `rem` is relative to the root font size. If a user increases their browser's default text size for accessibility, `rem` scales and `px` doesn't.

**5.7 Colours**

```css
:root {
  /* Brand */
  --brand-500: #6366f1;
  --brand-600: #4f46e5;

  /* Neutrals */
  --gray-50:  #f9fafb;
  --gray-200: #e5e7eb;
  --gray-500: #6b7280;
  --gray-900: #111827;

  /* Semantic */
  --success: #16a34a;
  --warning: #d97706;
  --danger:  #dc2626;

  /* Spacing scale */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --space-8: 2rem;
  --space-16: 4rem;
}

.btn-primary {
  background: var(--brand-500);
  color: #fff;
  padding: var(--space-2) var(--space-4);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 150ms ease;
}

.btn-primary:hover {
  background: var(--brand-600);
}
```

**Colour formats:**
```css
color: #6366f1;                  /* hex */
color: rgb(99, 102, 241);        /* rgb */
color: rgba(99, 102, 241, 0.5);  /* alpha */
color: hsl(239, 84%, 67%);       /* hue, saturation, lightness */
color: oklch(58% 0.20 275);      /* modern, perceptually uniform */
```

### 🧪 Quiz — Day 5

1. What does `box-sizing: border-box` do?
   a) Adds a border b) Includes padding & border inside the declared width c) Removes margins d) Sets all boxes to full width
   ✅ **b)**

2. Specificity of `#nav .link:hover`?
   a) 0,1,0,0 b) 0,1,1,1 c) 0,0,1,1 d) 0,2,0,0
   ✅ **b) 0,1,1,1** — 1 ID, 1 class, 1 pseudo-class, 0 elements → wait: `#nav` (ID) + `.link` (class) + `:hover` (pseudo-class) = 0 IDs... let me restate: **1 ID (0,1,0,0) + 2 class-level (0,0,2,0) = 0,1,2,0**. ✅ Correct answer: **0,1,2,0**

3. Which unit scales with the user's root font-size setting?
   a) `px` b) `pt` c) `rem` d) `cm`
   ✅ **c) `rem`**

4. Why avoid `!important`?
   a) It's slow b) It breaks the cascade and makes overrides impossible c) Browsers ignore it d) It only works inline
   ✅ **b)**

5. Optimal line length for body text?
   a) 20–30 characters b) 45–75 characters c) 100–120 characters d) Any
   ✅ **b) 45–75 characters** (`max-width: 65ch`)

### 🛠️ Task — Day 5
**Deliverable:** `day05/` with `index.html` + `css/reset.css` + `css/styles.css`

Restyle your Day 3 page:
1. Include the full reset with `border-box`
2. Define at least 10 CSS custom properties in `:root`
3. Build a `.card` component with padding, border-radius, subtle box-shadow
4. Build a `.btn-primary` and `.btn-secondary` with `:hover` and `:focus-visible` states
5. Use a 1.25 modular type scale
6. Set `max-width: 65ch` on paragraphs
7. **No inline styles, no `!important`**

**Rubric (10 pts):** Reset + border-box 2 · Custom properties 2 · Components 3 · Type scale 2 · No !important 1

### ✅ Checkpoint
Every box on your page has a predictable, inspectable size in DevTools.

---

# 🟢 DAY 6 — CSS Flexbox & Grid

**Course 03:** CSS3 & Responsive Design | **Phase 1**

### 🎯 Learning Objectives
- Choose correctly between Flexbox and Grid
- Master the Flexbox main/cross axis model
- Build 2D layouts with Grid template areas
- Create a real page layout

### 📘 Content

**6.1 Flexbox vs Grid — the decision rule**

| Use **Flexbox** when… | Use **Grid** when… |
|---|---|
| Laying out in **one direction** (row OR column) | Laying out in **two dimensions** (rows AND columns) |
| Content determines size | Layout determines size |
| Navbars, button groups, card internals | Page layouts, dashboards, image galleries |

**6.2 Flexbox fundamentals**

```css
.container {
  display: flex;
  flex-direction: row;      /* row | row-reverse | column | column-reverse */
  justify-content: center;  /* MAIN axis alignment */
  align-items: center;      /* CROSS axis alignment */
  flex-wrap: wrap;          /* nowrap | wrap | wrap-reverse */
  gap: 1rem;
}
```

**The axis mental model — this trips everyone up:**

```
flex-direction: row  (default)
  MAIN AXIS  →  (horizontal)  ← justify-content controls this
  CROSS AXIS ↓  (vertical)    ← align-items controls this

flex-direction: column
  MAIN AXIS  ↓  (vertical)    ← justify-content controls this
  CROSS AXIS →  (horizontal)  ← align-items controls this
```

**`justify-content` values:**

```css
justify-content: flex-start;    /* |[1][2][3]          */
justify-content: flex-end;      /* |          [1][2][3]| */
justify-content: center;        /* |     [1][2][3]     | */
justify-content: space-between; /* |[1]   [2]   [3]     | */
justify-content: space-around;  /* | [1]  [2]  [3]      | */
justify-content: space-evenly;  /* |  [1]  [2]  [3]     | */
```

**Flex item properties:**

```css
.item {
  flex-grow: 1;    /* how much extra space it absorbs */
  flex-shrink: 0;  /* whether it can shrink (0 = never) */
  flex-basis: 200px; /* starting size */
  /* shorthand: */
  flex: 1 0 200px;
  align-self: flex-end; /* override container's align-items */
  order: 2;             /* reorder without changing HTML */
}
```

**6.3 Practical Flexbox patterns**

**Navbar (logo left, links right):**
```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}
.nav-links {
  display: flex;
  gap: 1.5rem;
}
```

**Perfect centering (the classic):**
```css
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
```

**Card with footer pinned to bottom:**
```css
.card {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.card-body { flex: 1; }  /* grows to fill, pushing footer down */
```

**Equal-width columns:**
```css
.row > * { flex: 1 1 0; }  /* basis 0 = truly equal widths */
```

**Sticky footer page layout:**
```css
body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
main { flex: 1; }
```

**6.4 CSS Grid**

```css
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;  /* 3 equal columns */
  grid-template-columns: repeat(3, 1fr);
  grid-template-columns: 250px 1fr;    /* sidebar + content */
  gap: 1.5rem;
}
```

**The `fr` unit** = fraction of remaining space. `1fr 2fr` means the second column is twice as wide.

**Responsive auto-fit grid (no media queries needed!):**

```css
.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
```

**Explanation:** `minmax(280px, 1fr)` says "each column is at least 280px and at most 1 fraction." `auto-fit` fits as many as possible and stretches them. This single rule replaces 3 media queries.

**Named grid areas — the most readable layout technique:**

```css
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header  header"
    "sidebar main"
    "footer  footer";
  gap: 1rem;
  min-height: 100vh;
}

.layout > header  { grid-area: header; }
.layout > aside   { grid-area: sidebar; }
.layout > main    { grid-area: main; }
.layout > footer  { grid-area: footer; }
```

```html
<div class="layout">
  <header>Header</header>
  <aside>Sidebar</aside>
  <main>Main</main>
  <footer>Footer</footer>
</div>
```

**Spanning:**

```css
.featured {
  grid-column: 1 / -1;   /* span all columns (-1 = last line) */
}
.tall {
  grid-row: span 2;
}
```

**Grid alignment:**

```css
.grid {
  justify-items: center;   /* inline-axis (horizontal) for all items */
  align-items: center;     /* block-axis (vertical) for all items */
  place-items: center;     /* shorthand for both */
  justify-content: center; /* the whole grid within its container */
  place-content: center;
}
```

**6.5 Complete real-world layout**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ethiroli Dashboard</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <div class="app">
    <header class="app-header">
      <h1>Ethiroli LMS</h1>
      <nav class="app-nav">
        <a href="#">Dashboard</a>
        <a href="#">Courses</a>
        <a href="#">Profile</a>
      </nav>
    </header>

    <aside class="app-sidebar">
      <ul>
        <li><a href="#">Overview</a></li>
        <li><a href="#">My Programs</a></li>
        <li><a href="#">Assignments</a></li>
        <li><a href="#">Certificates</a></li>
      </ul>
    </aside>

    <main class="app-main">
      <h2>Programs</h2>
      <div class="card-grid">
        <article class="card">…</article>
        <article class="card">…</article>
        <article class="card">…</article>
      </div>
    </main>

    <footer class="app-footer">© 2025 Ethiroli</footer>
  </div>
</body>
</html>
```

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.app {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header  header"
    "sidebar main"
    "footer  footer";
  min-height: 100vh;
  gap: 1px;
  background: #e5e7eb;
}

.app-header {
  grid-area: header;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #fff;
}

.app-nav {
  display: flex;
  gap: 1.5rem;
}

.app-sidebar {
  grid-area: sidebar;
  background: #fff;
  padding: 1.5rem;
}

.app-sidebar ul {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.app-main {
  grid-area: main;
  padding: 2rem;
  background: #fff;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.card {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
}

.app-footer {
  grid-area: footer;
  padding: 1rem 2rem;
  background: #fff;
  text-align: center;
  color: #6b7280;
}
```

### 🧪 Quiz — Day 6

1. In a flex container with `flex-direction: column`, `justify-content` aligns along the:
   a) Horizontal axis b) Vertical axis c) Both d) Neither
   ✅ **b) Vertical** — `justify-content` always follows the *main* axis, which is vertical in a column.

2. Which creates 3 equal-width columns?
   a) `grid-template-columns: 1fr 1fr 1fr` b) `grid-template-columns: repeat(3, 1fr)` c) Both d) Neither
   ✅ **c) Both** — `repeat()` is shorthand for the first.

3. `grid-column: 1 / -1` means:
   a) First column only b) Last column only c) Span from the first to the last grid line (all columns) d) Invalid
   ✅ **c)**

4. Which is best for a responsive card grid with no media queries?
   a) `display: flex; flex-wrap: wrap` b) `repeat(auto-fit, minmax(280px, 1fr))` c) Fixed widths d) Floats
   ✅ **b)**

5. To make a flex item never shrink:
   a) `flex-grow: 0` b) `flex-shrink: 0` c) `flex-basis: 0` d) `align-self: stretch`
   ✅ **b)**

### 🛠️ Task — Day 6
**Deliverable:** `day06/dashboard.html` + `day06/styles.css`

Build a full application shell:
1. Grid layout using **`grid-template-areas`** (header / sidebar / main / footer)
2. Header uses **Flexbox** with `justify-content: space-between`
3. Sidebar `<ul>` uses Flexbox column with `gap`
4. Main area contains a card grid using **`repeat(auto-fit, minmax(260px, 1fr))`**
5. Each card uses Flexbox column so its footer sits at the bottom (`flex: 1` on the body)
6. Sticky footer (page always fills the viewport)

**Rubric (10 pts):** grid-areas 3 · Flex header 2 · Auto-fit grid 3 · Card flex 1 · Sticky footer 1

### ✅ Checkpoint
Resize from 320px to 1920px — the layout never breaks.

---

# 🟢 DAY 7 — Responsive Design & Mobile-First

**Course 03:** CSS3 & Responsive Design | **Phase 1**

### 🎯 Learning Objectives
- Apply the mobile-first methodology
- Write correct media queries
- Choose between `px`, `rem`, `%`, `vw/vh`, `ch`
- Understand fluid typography with `clamp()`

### 📘 Content

**7.1 Mobile-first vs desktop-first**

```css
/* ❌ Desktop-first: you're stripping features away for mobile */
.sidebar { width: 300px; }
@media (max-width: 768px) {
  .sidebar { display: none; }
}

/* ✅ Mobile-first: you're adding capability as screens grow */
.sidebar { display: none; }
@media (min-width: 768px) {
  .sidebar { display: block; width: 300px; }
}
```

**Why mobile-first wins:** ~60% of web traffic is mobile. It forces you to prioritise content. It produces less CSS. It's the industry standard.

**7.2 Media query syntax**

```css
/* Min-width (mobile-first — use these) */
@media (min-width: 640px)  { /* sm: large phones */ }
@media (min-width: 768px)  { /* md: tablets */ }
@media (min-width: 1024px) { /* lg: laptops */ }
@media (min-width: 1280px) { /* xl: desktops */ }
@media (min-width: 1536px) { /* 2xl: large displays */ }

/* Range syntax (modern) */
@media (768px <= width < 1024px) { }

/* Other features */
@media (orientation: landscape) { }
@media (prefers-color-scheme: dark) { }
@media (prefers-reduced-motion: reduce) { }
@media print { }
@media (hover: hover) { }        /* devices with a real pointer */
@media (pointer: coarse) { }     /* touchscreens */
```

**7.3 Breakpoints — do NOT copy device widths**

Pick breakpoints where **your content breaks**, not where an iPhone happens to be. Resize your browser slowly and add a breakpoint the moment the layout looks bad.

A practical starter set:

```css
/* Mobile base — no query needed */

@media (min-width: 640px)  { /* 2-column card grid */ }
@media (min-width: 768px)  { /* sidebar appears */ }
@media (min-width: 1024px) { /* 3-column grid, larger type */ }
@media (min-width: 1280px) { /* max-width container caps */ }
```

**7.4 CSS units — when to use what**

| Unit | Relative to | Best for |
|---|---|---|
| `px` | Nothing (absolute) | Borders, shadows, fine details |
| `rem` | Root font-size (16px) | Font sizes, spacing, widths |
| `em` | Parent font-size | Component-relative padding |
| `%` | Parent dimension | Fluid widths, heights |
| `vw` / `vh` | Viewport width/height | Full-bleed sections, hero areas |
| `dvh` | Dynamic viewport height | Mobile-safe full height |
| `ch` | Width of "0" | Text max-width |
| `fr` | Grid free space | Grid tracks |

```css
/* ❌ Avoid for full-height on mobile — the URL bar breaks vh */
.hero { height: 100vh; }

/* ✅ Use dvh */
.hero { min-height: 100dvh; }
```

**7.5 Fluid typography with `clamp()`**

```css
/* clamp(minimum, preferred, maximum) */
h1 {
  font-size: clamp(1.75rem, 1rem + 3vw, 3.5rem);
}
```

**Explanation:** On a 320px screen, `1rem + 3vw` = 16 + 9.6 = 25.6px, but `clamp` holds it at the minimum `1.75rem` (28px). On a 1440px screen it computes to 16 + 43 = 59px, but caps at `3.5rem` (56px). Between those, it scales smoothly. **No media query needed.**

```css
/* Fluid spacing */
.section {
  padding-block: clamp(2rem, 5vw, 6rem);
}

/* Fluid container */
.container {
  width: min(100% - 2rem, 1200px);
  margin-inline: auto;
}
```

**Explanation:** `min(100% - 2rem, 1200px)` means "be as wide as the viewport minus 2rem of gutter, but never wider than 1200px." This single declaration replaces a container class + media queries.

**7.6 Responsive images**

```html
<img
  src="card-800.jpg"
  srcset="card-400.jpg 400w,
          card-800.jpg 800w,
          card-1200.jpg 1200w"
  sizes="(max-width: 640px) 100vw,
         (max-width: 1024px) 50vw,
         33vw"
  alt="Course card"
  loading="lazy"
  decoding="async"
  width="800"
  height="600"
/>
```

The browser picks the smallest file that satisfies the display size — a huge performance win on mobile.

**7.7 Responsive layout patterns**

**Responsive sidebar:**

```css
.layout {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas: "header" "main" "sidebar" "footer";
  gap: 1rem;
}

@media (min-width: 768px) {
  .layout {
    grid-template-columns: 240px 1fr;
    grid-template-areas:
      "header  header"
      "sidebar main"
      "footer  footer";
  }
}
```

**Responsive navigation (hamburger):**

```css
.nav-toggle { display: block; }
.nav-menu   { display: none; }
.nav-menu.is-open { display: flex; flex-direction: column; }

@media (min-width: 768px) {
  .nav-toggle { display: none; }
  .nav-menu   { display: flex; flex-direction: row; gap: 1.5rem; }
}
```

**Hiding/showing content:**

```css
.mobile-only { display: block; }
.desktop-only { display: none; }

@media (min-width: 768px) {
  .mobile-only { display: none; }
  .desktop-only { display: block; }
}
```

**7.8 Touch targets & accessibility**

```css
button, a.btn {
  min-height: 44px;   /* Apple HIG */
  min-width: 44px;    /* Google Material: 48px */
  padding: 0.75rem 1.25rem;
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0f172a;
    --text: #f1f5f9;
  }
}
```

**7.9 Testing responsiveness**

1. DevTools device toolbar (`Ctrl+Shift+M`)
2. Test at: 320, 375, 414, 768, 1024, 1440, 1920
3. Test landscape orientation
4. Test with real device if possible
5. Check: no horizontal scroll, no text overflow, readable font size (≥16px body)

### 🧪 Quiz — Day 7

1. Mobile-first means:
   a) Designing for iPhone only b) Writing base styles for mobile and adding `min-width` queries upward c) Using `max-width` queries d) Using a mobile app
   ✅ **b)**

2. Which unit scales with the user's root font-size preference?
   a) `px` b) `rem` c) `vw` d) `pt`
   ✅ **b) `rem`**

3. `font-size: clamp(1rem, 2vw, 2rem)` — what happens at a very wide viewport?
   a) Keeps growing b) Caps at `2rem` c) Falls to `1rem` d) Errors
   ✅ **b) Caps at 2rem**

4. Why prefer `dvh` over `vh` on mobile?
   a) Faster b) `vh` doesn't account for the browser's dynamic URL bar c) `dvh` is more compatible d) No difference
   ✅ **b)**

5. Best reason to choose a breakpoint?
   a) It matches iPhone width b) The layout starts to break there c) It's a round number d) The client asked
   ✅ **b)**

### 🛠️ Task — Day 7
**Deliverable:** `day07/responsive.html` + `styles.css`

Take your Day 6 dashboard and make it fully responsive:
1. Rewrite all CSS **mobile-first** (no `max-width` queries at all)
2. Sidebar hidden on mobile, visible ≥768px
3. Card grid: 1 column → 2 columns (≥640px) → 3 columns (≥1024px)
4. Use `clamp()` for at least the `h1` font-size and section padding
5. Use `min(100% - 2rem, 1200px)` for the container
6. Add a `prefers-reduced-motion` block
7. Add a `prefers-color-scheme: dark` block with CSS variables
8. All buttons ≥44px touch target

**Test at 320px, 768px, 1440px — screenshot all three.**

**Rubric (10 pts):** Mobile-first 3 · Breakpoints 2 · clamp/min 2 · Dark mode 2 · Touch targets 1

### ✅ Checkpoint
No horizontal scrollbar at any width from 320px to 1920px.

---

# 🟢 DAY 8 — UI/UX Principles for Developers

**Course 04:** UI/UX for Developers | **Phase 1**

### 🎯 Learning Objectives
- Apply the 10 usability heuristics
- Design using spacing, contrast, and visual hierarchy
- Use a consistent 8-point spacing system
- Avoid the most common UI mistakes

### 📘 Content

**8.1 The developer's UX responsibility**

You don't need to be a designer, but you must know enough to not ship a bad interface. These rules cover 90% of real-world UI bugs.

**8.2 Nielsen's 10 Usability Heuristics (adapted)**

| # | Heuristic | Practical rule |
|---|---|---|
| 1 | Visibility of system status | Always show loading, success, and error states |
| 2 | Match the real world | Say "Email" not "user_email_input" |
| 3 | User control & freedom | Always provide Cancel / Undo |
| 4 | Consistency | Same button style = same action everywhere |
| 5 | Error prevention | Disable submit until the form is valid |
| 6 | Recognition over recall | Show options, don't make users memorise |
| 7 | Flexibility & efficiency | Keyboard shortcuts for power users |
| 8 | Aesthetic & minimalist design | Remove everything that isn't needed |
| 9 | Help users recover from errors | Plain-language errors with a fix |
| 10 | Help & documentation | Inline hints, tooltips |

**8.3 Visual hierarchy**

The user's eye should travel in a deliberate order. You control this with:

**Size** — bigger = more important
```css
h1 { font-size: 2.5rem; }   /* attention first */
h2 { font-size: 1.75rem; }
p  { font-size: 1rem; }     /* read last */
```

**Weight** — bold draws the eye
```css
.emphasis { font-weight: 700; }
.muted    { font-weight: 400; color: var(--gray-500); }
```

**Colour & contrast**
```css
.primary-action { color: #fff; background: var(--brand-600); }
.secondary-action { color: var(--brand-600); background: transparent; border: 1px solid; }
```

**Space** — whitespace *is* a design element
```css
.section + .section { margin-top: 4rem; }  /* grouping by proximity */
```

**Position** — top-left gets read first (in LTR languages)

**8.4 The 8-point spacing system**

All spacing should be a multiple of 8 (with 4 allowed for tight cases). This creates rhythm and prevents the "everything is 13px apart" mess.

```css
:root {
  --space-0:  0;
  --space-1:  0.25rem;  /*  4px */
  --space-2:  0.5rem;   /*  8px */
  --space-3:  0.75rem;  /* 12px */
  --space-4:  1rem;     /* 16px */
  --space-5:  1.25rem;  /* 20px */
  --space-6:  1.5rem;   /* 24px */
  --space-8:  2rem;     /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
}
```

**Proximity principle:** related items get *less* space between them than unrelated items.

```css
/* ❌ Everything equally spaced — no grouping */
.form-field { margin-bottom: 1rem; }
.form-group { margin-bottom: 1rem; }

/* ✅ Labels hug their inputs; groups are separated */
.form-field { margin-bottom: 0; }
.form-field label { display: block; margin-bottom: var(--space-1); }
.form-group { margin-bottom: var(--space-6); }
```

**8.5 Contrast & accessibility**

WCAG 2.2 requirements:

| Level | Normal text | Large text (≥18.66px bold or ≥24px) |
|---|---|---|
| AA (minimum) | 4.5:1 | 3:1 |
| AAA (enhanced) | 7:1 | 4.5:1 |

```css
/* ❌ 2.3:1 — fails */
.muted { color: #999; background: #fff; }

/* ✅ 7.4:1 — passes AAA */
.muted { color: #595959; background: #fff; }
```

Also: **never use colour alone** to convey meaning.
```html
<!-- ❌ -->
<span style="color: red;">●</span> Offline

<!-- ✅ -->
<span style="color: red;">●</span> Offline (red dot)
<!-- Or better: icon + text + colour -->
```

**8.6 Typography rules**

```css
body {
  font-size: 16px;          /* never below 16px on mobile — iOS zooms inputs below this */
  line-height: 1.6;         /* body text */
}

h1, h2, h3 {
  line-height: 1.2;         /* headings need tighter leading */
  letter-spacing: -0.02em;  /* large text looks better tightened */
}

p {
  max-width: 65ch;
  margin-bottom: 1em;
}

/* Limit font families — 1 sans + 1 mono is plenty */
:root {
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

**8.7 Form UX**

```html
<!-- ❌ Bad -->
<input placeholder="Email" />

<!-- ✅ Good -->
<label for="email">
  Email
  <span class="hint">We'll never share it.</span>
</label>
<input
  type="email"
  id="email"
  name="email"
  autocomplete="email"
  required
  aria-describedby="email-error"
/>
<p id="email-error" class="error" role="alert" hidden>
  Please enter a valid email address.
</p>
```

Rules:
- Labels **above** inputs (not placeholders — they vanish on typing)
- `autocomplete` attributes for fast filling
- Errors **below** the field, in plain language
- Validate on blur, not on every keystroke
- Never disable the submit button silently — explain what's missing

**8.8 Button hierarchy**

```css
/* One primary action per screen */
.btn-primary { background: var(--brand-600); color: #fff; }

/* Secondary — supporting actions */
.btn-secondary { background: #fff; color: var(--brand-600); border: 1px solid; }

/* Tertiary / ghost — low-priority */
.btn-ghost { background: transparent; color: var(--gray-600); }

/* Destructive */
.btn-danger { background: var(--danger); color: #fff; }
```

**8.9 Loading, empty, and error states**

Every data-driven screen needs **four** states:

```html
<!-- 1. Loading -->
<div class="skeleton" aria-busy="true" aria-live="polite">Loading…</div>

<!-- 2. Empty -->
<div class="empty-state">
  <h3>No programs yet</h3>
  <p>Enrol in a program to see it here.</p>
  <button class="btn-primary">Browse Programs</button>
</div>

<!-- 3. Error -->
<div class="error-state" role="alert">
  <h3>Couldn't load programs</h3>
  <p>Check your connection and try again.</p>
  <button class="btn-secondary">Retry</button>
</div>

<!-- 4. Success (the actual data) -->
<ul class="program-list">…</ul>
```

**Most interns ship only state 4.** Interviewers look for the other three.

### 🧪 Quiz — Day 8

1. Minimum WCAG AA contrast ratio for normal body text?
   a) 2:1 b) 3:1 c) 4.5:1 d) 7:1
   ✅ **c) 4.5:1**

2. Why should you avoid placeholder-as-label?
   a) It's slow b) The text disappears once the user types, harming recall & accessibility c) It breaks validation d) Browsers block it
   ✅ **b)**

3. In an 8-point spacing system, which value is invalid?
   a) 16px b) 24px c) 18px d) 32px
   ✅ **c) 18px** — not a multiple of 8 (or 4).

4. Which heuristic covers "always show a loading spinner"?
   a) Match real world b) Visibility of system status c) Error prevention d) Flexibility
   ✅ **b)**

5. How many primary buttons should a screen have?
   a) As many as needed b) One c) Two d) Zero
   ✅ **b) One** — multiple primaries destroy hierarchy.

### 🛠️ Task — Day 8
**Deliverable:** `day08/component-library.html`

Build a mini design system page showing:
1. A **colour palette** with hex values and contrast ratios annotated
2. A **type scale** (h1–h4, body, small, caption) with rem values
3. A **spacing scale** visualised with labelled blocks (4px → 96px)
4. All **4 button variants** (primary, secondary, ghost, danger) with `:hover`, `:focus-visible`, `:disabled` states
5. A **form field** component: label, hint, input, error message
6. All **4 data states**: loading skeleton, empty state, error state, success list

Use CSS custom properties for every value. No hardcoded colours or spacing.

**Rubric (10 pts):** Palette + contrast 2 · Type scale 2 · Spacing scale 2 · Buttons 2 · 4 data states 2

### ✅ Checkpoint
You can justify every spacing and colour value in your UI.

---

# 🟢 DAY 9 — Wireframes, Figma & Design Systems

**Course 04:** UI/UX for Developers | **Phase 1**

### 🎯 Learning Objectives
- Move from requirements → wireframe → mockup → code
- Build a wireframe in Figma (or on paper)
- Structure a design system with tokens
- Read a Figma file as a developer (handoff)

### 📘 Content

**9.1 The design fidelity ladder**

```
1. SKETCH           pencil, 2 minutes, throwaway
        ↓
2. WIREFRAME        grey boxes, layout only, no colour
        ↓
3. MOCKUP           real colours, fonts, images
        ↓
4. PROTOTYPE        clickable, linked screens
        ↓
5. CODE             React components
```

**Never skip step 2.** Coding without a wireframe means rewriting your layout three times.

**9.2 Wireframe conventions**

| Element | Wireframe representation |
|---|---|
| Image | Box with an X through it |
| Text | Grey horizontal lines |
| Button | Rounded rectangle with a label |
| Input | Rectangle with a label above |
| Heading | Thick short line |
| Body copy | Thin long lines |

**9.3 Your first wireframe — the LMS Dashboard**

```
┌──────────────────────────────────────────────────────────┐
│  [LOGO]   Programs   Courses   Profile        [Avatar]  │  ← header
├────────────┬─────────────────────────────────────────────┤
│ ▢ Overview │  ┌──────────────────────────────────────┐   │
│ ▢ Programs │  │  Welcome back, Arun                  │   │
│ ▢ Tasks    │  └──────────────────────────────────────┘   │
│ ▢ Progress │  ┌────────┐ ┌────────┐ ┌────────┐          │
│ ▢ Certif.  │  │ Card 1 │ │ Card 2 │ │ Card 3 │          │
│            │  │        │ │        │ │        │          │
│            │  └────────┘ └────────┘ └────────┘          │
│            │                                             │
│            │  ┌──────────────────────────────────────┐   │
│            │  │  Recent Activity table               │   │
│            │  │  ▭▭▭▭▭  ▭▭▭▭  ▭▭▭▭                │   │
│            │  └──────────────────────────────────────┘   │
├────────────┴─────────────────────────────────────────────┤
│  © 2025 Ethiroli                                          │  ← footer
└──────────────────────────────────────────────────────────┘
```

**9.4 Figma essentials for developers**

**Frames** = artboards = one screen each. Use real device sizes: 375×812 (mobile), 1440×900 (desktop).

**Auto Layout** = Figma's Flexbox. This is the one feature you must understand:
- Horizontal / vertical direction = `flex-direction`
- Gap = `gap`
- Padding = `padding`
- Fill container = `flex: 1`
- Hug contents = `width: fit-content`

When you see Auto Layout in Figma, you can translate it almost 1:1 to CSS.

**Components & Variants** = React components + props. A `Button` component with variants for `primary/secondary` and states `default/hover/disabled` maps directly to a React component with a `variant` and `disabled` prop.

**9.5 Design tokens → CSS variables**

Design tokens are the single source of truth for design decisions.

```json
{
  "color": {
    "brand": {
      "500": { "value": "#6366f1", "type": "color" },
      "600": { "value": "#4f46e5", "type": "color" }
    },
    "neutral": {
      "50":  { "value": "#f9fafb", "type": "color" },
      "900": { "value": "#111827", "type": "color" }
    }
  },
  "space": {
    "1": { "value": "0.25rem", "type": "spacing" },
    "4": { "value": "1rem",    "type": "spacing" },
    "8": { "value": "2rem",    "type": "spacing" }
  },
  "radius": {
    "sm": { "value": "4px",  "type": "borderRadius" },
    "md": { "value": "8px",  "type": "borderRadius" },
    "full": { "value": "9999px", "type": "borderRadius" }
  }
}
```

Convert to CSS:

```css
:root {
  --color-brand-500: #6366f1;
  --color-brand-600: #4f46e5;
  --color-neutral-50: #f9fafb;
  --color-neutral-900: #111827;

  --space-1: 0.25rem;
  --space-4: 1rem;
  --space-8: 2rem;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-full: 9999px;
}
```

**Semantic layer (important):** Map raw tokens to meaning.

```css
:root {
  /* Semantic tokens — components use THESE, never raw values */
  --bg-surface:      var(--color-neutral-50);
  --bg-elevated:     #ffffff;
  --text-primary:    var(--color-neutral-900);
  --text-secondary:  #6b7280;
  --border-default:  #e5e7eb;

  --action-primary-bg:       var(--color-brand-600);
  --action-primary-bg-hover: var(--color-brand-700);
}
```

**Why?** When dark mode arrives, you only remap the semantic layer:
```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-surface:   #0f172a;
    --text-primary: #f1f5f9;
    /* Components unchanged! */
  }
}
```

**9.6 Developer handoff checklist**

When you receive a Figma file, extract:

| What to extract | Where in Figma |
|---|---|
| Colours | Right panel → Fill → hex |
| Font family/size/weight/line-height | Right panel → Text |
| Spacing | Select two elements → hold Alt → shows gap |
| Border radius | Right panel → corner radius |
| Shadows | Right panel → Effects |
| Breakpoints | Separate frames per device |
| Interactive states | Component variants |

**9.7 Accessibility-first design**

- Design focus states **before** hover states
- Minimum touch target: 44×44px
- Never rely on colour alone
- Test your design in greyscale
- Design at 200% zoom

### 🧪 Quiz — Day 9

1. What is a wireframe?
   a) A finished design b) A low-fidelity layout showing structure without visual design c) A prototype d) A code file
   ✅ **b)**

2. Figma's **Auto Layout** most closely maps to which CSS concept?
   a) Grid b) Flexbox c) Position absolute d) Floats
   ✅ **b) Flexbox**

3. Why use semantic design tokens (`--text-primary`) instead of raw ones (`--gray-900`)?
   a) They're shorter b) You can remap them for dark mode without touching components c) They render faster d) Figma requires it
   ✅ **b)**

4. Correct order of design fidelity?
   a) Mockup → Wireframe → Sketch b) Sketch → Wireframe → Mockup → Prototype c) Prototype → Wireframe → Sketch d) Wireframe → Code → Mockup
   ✅ **b)**

5. Minimum touch target size?
   a) 24×24px b) 32×32px c) 44×44px d) 60×60px
   ✅ **c) 44×44px**

### 🛠️ Task — Day 9
**Deliverable:** `day09/` containing `wireframe.png` (or hand-drawn photo) + `tokens.css` + `tokens.json`

1. **Wireframe** the "Intern Management System" dashboard on paper or in Figma — include header, sidebar, stat cards, a data table, and a form modal
2. **Create `tokens.json`** with colour, spacing, radius, and typography scales
3. **Create `tokens.css`** with both raw and semantic layers
4. **Build the page** from your wireframe using only semantic tokens (no hardcoded values)
5. Take a screenshot at 1440px and compare side-by-side with your wireframe

**Rubric (10 pts):** Wireframe completeness 3 · tokens.json valid 2 · Semantic layer 3 · Fidelity to wireframe 2

### ✅ Checkpoint
Your code visually matches your wireframe.

---

# 🟢 DAY 10 — Git Basics: Commits & Branches

**Course 05:** Git & GitHub | **Phase 1**

### 🎯 Learning Objectives
- Explain Git's three-tree architecture
- Make clean, atomic commits
- Create, switch, and merge branches
- Write a professional `.gitignore`

### 📘 Content

**10.1 Why Git exists**

Without version control:
```
project_final.zip
project_final_v2.zip
project_final_v2_ACTUAL.zip
project_final_v2_ACTUAL_FIXED.zip
```

Git gives you: a complete history, safe experimentation via branches, collaboration without overwriting, and the ability to undo anything.

**10.2 The three trees**

```
┌─────────────┐   git add    ┌─────────────┐   git commit   ┌─────────────┐
│  WORKING    │ ───────────► │   STAGING   │ ─────────────► │    REPO     │
│  DIRECTORY  │              │    INDEX    │                │  (.git)     │
└─────────────┘              └─────────────┘                └─────────────┘
      │                                                            │
      │◄──────────────── git checkout / restore ───────────────────┘
```

- **Working directory** — your actual files
- **Staging area** — what will go into the next commit
- **Repository** — the permanent history

**10.3 First-time setup**

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main
git config --global core.autocrlf input   # Windows: true
git config --list
```

**10.4 Starting a repository**

```bash
mkdir ethiroli-internship && cd ethiroli-internship
git init
git status
```

**10.5 The daily workflow**

```bash
git status                        # what changed?
git diff                          # what exactly changed?
git add index.html                # stage one file
git add .                         # stage everything
git add -p                        # stage interactively (hunk by hunk)
git commit -m "feat: add navbar"  # commit
git log --oneline --graph --all   # view history
```

**10.6 Anatomy of a good commit**

```bash
# ❌ Useless
git commit -m "fixed stuff"
git commit -m "changes"
git commit -m "asdfgh"

# ✅ Good — Conventional Commits format
git commit -m "feat(auth): add JWT login endpoint"
git commit -m "fix(cart): prevent negative quantity on blur"
git commit -m "docs(readme): add setup instructions"
git commit -m "refactor(api): extract db connection to module"
git commit -m "style(nav): align logo with flexbox"
git commit -m "test(user): add unit tests for validateEmail"
git commit -m "chore(deps): upgrade express to 4.19"
```

**Format:** `type(scope): imperative description`

| Type | Use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no logic change |
| `refactor` | Code change that neither fixes nor adds |
| `test` | Adding tests |
| `chore` | Build, deps, tooling |
| `perf` | Performance |

**Rules:**
- Imperative mood: "add" not "added" (reads as "this commit will add…")
- ≤ 72 characters in the subject
- One logical change per commit — not "add navbar + fix DB bug + update README"
- Body (optional) explains **why**, not what

```bash
git commit -m "fix(auth): reject expired JWT tokens

Tokens were accepted up to 24h past expiry because the
exp check compared seconds to milliseconds.

Closes #42"
```

**10.7 Viewing history**

```bash
git log                          # full history
git log --oneline                # compact
git log --oneline --graph --all  # visual branch graph
git log -5                       # last 5
git log --author="Arun"          # by author
git log --since="2 weeks ago"
git show a1b2c3d                 # details of one commit
git diff HEAD~1 HEAD             # compare last two commits
git blame index.html             # who wrote each line
```

**10.8 Undoing things**

```bash
# Discard unstaged changes in a file (DESTRUCTIVE)
git restore index.html

# Unstage a file (keeps changes)
git restore --staged index.html

# Amend the last commit message (only if not pushed)
git commit --amend -m "feat: better message"

# Undo last commit but keep changes staged
git reset --soft HEAD~1

# Undo last commit and unstage changes (keeps files)
git reset HEAD~1

# Undo last commit and DESTROY changes (dangerous)
git reset --hard HEAD~1

# Safest: create a new commit that reverses an old one
git revert a1b2c3d
```

**Golden rule:** Never `reset --hard` or `--amend` on a commit you've already pushed to a shared branch.

**10.9 Branching**

```bash
git branch                       # list local branches
git branch -a                    # include remote
git branch feature/login         # create
git checkout feature/login       # switch
git switch feature/login         # modern syntax
git switch -c feature/login      # create + switch
git branch -d feature/login      # delete (safe)
git branch -D feature/login      # delete (force)
git branch -m old-name new-name  # rename
```

**Why branches matter:** `main` must always be deployable. You never experiment on `main`.

**10.10 Merging**

```bash
git switch main
git merge feature/login
```

**Fast-forward merge** — `main` hasn't moved since you branched. Git just slides the pointer forward. No merge commit.

```
Before:  A───B (main)
              \
               C───D (feature)

After:   A───B───C───D (main, feature)
```

**Three-way merge** — both branches moved. Git creates a merge commit.

```
Before:  A───B───E (main)
              \
               C───D (feature)

After:   A───B───E─────M (main)
              \       /
               C───D─
```

```bash
git merge --no-ff feature/login   # force a merge commit (preserves history)
git merge --squash feature/login  # combine all commits into one
git merge --abort                 # cancel a conflicted merge
```

**10.11 A professional `.gitignore`**

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Environment
.env
.env.local
.env.*.local

# Build output
dist/
build/
.next/
out/

# Logs
logs/
*.log
npm-debug.log*
yarn-error.log*

# Editor
.vscode/*
!.vscode/extensions.json
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
desktop.ini

# Testing
coverage/
.nyc_output/

# Uploads / local data
uploads/
*.sqlite
*.db
```

**Critical:** Never commit `node_modules/` or `.env`. `.env` contains secrets — committing it is a serious security incident.

If you already committed `.env`:
```bash
git rm --cached .env
echo ".env" >> .gitignore
git commit -m "chore: stop tracking .env"
# Then ROTATE all keys in that file — they're compromised
```

**10.12 The `.gitkeep` trick**

Git doesn't track empty directories. To keep `uploads/` in the repo:
```bash
touch uploads/.gitkeep
git add uploads/.gitkeep
```

### 🧪 Quiz — Day 10

1. Which area holds changes that will go into the next commit?
   a) Working directory b) Staging area c) Remote d) Stash
   ✅ **b) Staging area**

2. Best commit message?
   a) `fixed bug` b) `feat(auth): add password reset endpoint` c) `update` d) `changes to files`
   ✅ **b)**

3. What does `git restore --staged file.js` do?
   a) Deletes the file b) Unstages it but keeps your edits c) Reverts to the last commit d) Commits it
   ✅ **b)**

4. Which should **never** be committed?
   a) `package.json` b) `.env` c) `README.md` d) `.gitignore`
   ✅ **b) `.env`**

5. `git switch -c feature/x` does what?
   a) Deletes a branch b) Creates and switches to a new branch c) Merges d) Renames
   ✅ **b)**

### 🛠️ Task — Day 10
**Deliverable:** A Git repo with **at least 12 meaningful commits** and **3 branches**.

1. Initialise a repo `ethiroli-internship` with a proper `.gitignore` and `README.md`
2. Recreate your Days 3–9 work, committing **one logical change at a time** using Conventional Commits
3. Create three branches: `feature/html`, `feature/css`, `feature/responsive`
4. Do work on each, then merge them into `main` one at a time
5. Run `git log --oneline --graph --all` and paste the output in `README.md`

**Rubric (10 pts):** 12+ atomic commits 3 · Conventional format 3 · 3 branches used 2 · Clean history graph 2

### ✅ Checkpoint
`git log --oneline` reads like a changelog a non-developer could follow.

---

# 🟢 DAY 11 — GitHub, Pull Requests & Merge Conflicts

**Course 05:** Git & GitHub | **Phase 2**

### 🎯 Learning Objectives
- Connect a local repo to GitHub
- Push and pull correctly
- Open a professional pull request
- Resolve merge conflicts confidently

### 📘 Content

**11.1 Git vs GitHub**

| Git | GitHub |
|---|---|
| A version control **tool** | A **hosting platform** for Git repos |
| Runs on your machine | Runs in the cloud |
| Free, open source | Free tier + paid plans |
| Created 2005 (Linus Torvalds) | Created 2008 (now Microsoft) |

Alternatives to GitHub: GitLab, Bitbucket, Gitea.

**11.2 Connecting to a remote**

```bash
# Create an empty repo on github.com first (no README, no .gitignore)
git remote add origin https://github.com/yourname/ethiroli-internship.git
git remote -v

git branch -M main
git push -u origin main
```

`-u` sets the upstream, so future pushes are just `git push`.

**11.3 Authentication — use SSH or a PAT**

HTTPS with a password no longer works. Two options:

**Option A — Personal Access Token (simpler)**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate with `repo` scope
3. Use the token as your password when Git prompts

**Option B — SSH (better)**
```bash
ssh-keygen -t ed25519 -C "you@example.com"
# Press Enter 3 times
cat ~/.ssh/id_ed25519.pub
# Copy → GitHub → Settings → SSH and GPG keys → New SSH key

ssh -T git@github.com
# Should say: Hi username! You've successfully authenticated
```

**11.4 Push, pull, fetch**

```bash
git fetch origin          # download changes, DON'T merge
git pull                  # fetch + merge
git pull --rebase         # fetch + rebase (cleaner history)
git push                  # upload commits
git push origin main      # explicit
git push -u origin feature/login
```

**Difference:**
- `fetch` = "show me what's new" (safe, inspect first)
- `pull` = "get it and merge it into my branch" (can cause conflicts)

**11.5 The professional GitHub workflow**

```bash
# 1. Always start from an updated main
git switch main
git pull

# 2. Create a feature branch
git switch -c feature/intern-crud

# 3. Work and commit
git add .
git commit -m "feat(intern): add create endpoint"

# 4. Push the branch
git push -u origin feature/intern-crud

# 5. Open a Pull Request on GitHub

# 6. After review + approval, merge on GitHub

# 7. Clean up locally
git switch main
git pull
git branch -d feature/intern-crud
```

**Never commit directly to `main` in a team.** Branch protection rules can enforce this.

**11.6 Anatomy of a great Pull Request**

```markdown
## What
Adds CRUD endpoints for interns and the corresponding React admin table.

## Why
Closes #23 — interns were being managed by direct DB edits.

## How
- Added `internController.js` with create/read/update/delete
- Added `validateIntern` middleware
- Added `InternTable.jsx` consuming `GET /api/interns`
- Wired routing in `internRoutes.js`

## Screenshots
| Before | After |
|---|---|
| (screenshot) | (screenshot) |

## Testing
- [x] `npm test` passes (14/14)
- [x] Manually tested create/update/delete via Postman
- [x] Tested on mobile viewport (375px)

## Checklist
- [x] No console errors
- [x] No `any` types / lint clean
- [x] No secrets committed
- [x] Documentation updated
```

**Small PRs get reviewed. Huge PRs get rubber-stamped.** Aim for < 400 lines changed.

**11.7 Reviewing someone else's PR**

```
✅ "Nit: could this be `const` instead of `let`?"
✅ "Question: why did we choose polling over websockets here?"
✅ "Suggestion: extracting this into a hook would make it testable."
✅ "Blocker: this query is vulnerable to SQL injection — needs parameterisation."

❌ "This is wrong."
❌ "Just rewrite it."
❌ "Looks fine" (on a 2000-line PR)
```

Prefix comments with **Nit / Question / Suggestion / Blocker** so the author knows what's optional.

**11.8 Merge conflicts — the part everyone fears**

A conflict happens when **two branches change the same lines** of the same file.

**Creating a conflict (practice this today):**

```bash
git switch main
# edit line 5 of index.html to say "Welcome to Ethiroli LMS"
git commit -am "docs: update welcome heading"

git switch -c feature/heading
git switch main~1        # go back one commit
git switch -c feature/heading main~1
# edit the SAME line 5 to say "Welcome to the Ethiroli Learning Portal"
git commit -am "feat: new heading copy"

git switch main
git merge feature/heading
# 💥 CONFLICT
```

**What you see:**

```html
<<<<<<< HEAD
<h1>Welcome to Ethiroli LMS</h1>
=======
<h1>Welcome to the Ethiroli Learning Portal</h1>
>>>>>>> feature/heading
```

Reading it:
- `<<<<<<< HEAD` → everything until `=======` is **your current branch**
- `=======` → the divider
- `>>>>>>> feature/heading` → everything until this marker is **the incoming branch**

**Resolving:**

1. Open the file
2. Decide the final content — you may keep one side, the other, or a combination
3. **Delete all three marker lines**
4. Save, stage, commit

```html
<h1>Welcome to the Ethiroli Learning Portal</h1>
```

```bash
git add index.html
git commit -m "merge: resolve heading conflict in index.html"
```

**Using tools instead of hand-editing:**

```bash
git status                 # lists "both modified" files
git diff                   # shows conflicts
git checkout --ours index.html    # keep YOUR version
git checkout --theirs index.html  # keep THEIR version
git mergetool              # open a visual merge tool
git merge --abort          # panic button — undo everything
```

**Preventing conflicts:**
- Pull `main` into your branch daily
- Keep branches short-lived (1–3 days)
- Keep PRs small
- Don't reformat files you aren't otherwise changing
- Communicate when two people touch the same module

**11.9 `.gitattributes` — stop lockfile conflicts**

```gitattributes
* text=auto eol=lf
*.png binary
*.jpg binary
package-lock.json merge=binary
yarn.lock merge=binary
```

**11.10 README that gets you hired**

```markdown
# Ethiroli Internship — Full Stack Development

A full-stack internship management system built during the
45-Day Full Stack Development Internship at Ethiroli.

![Screenshot](./docs/screenshot.png)

## Tech Stack
- **Frontend:** React 18, Vite, React Router, Axios
- **Backend:** Node.js, Express, JWT
- **Database:** MySQL 8
- **Testing:** Jest, Supertest, Vitest

## Features
- 🔐 JWT authentication with role-based access (admin / mentor / intern)
- 📊 Dashboard with live progress stats
- ✅ Task assignment and submission workflow
- 📅 Attendance tracking
- 📜 Certificate eligibility calculation

## Getting Started

### Prerequisites
- Node.js ≥ 18
- MySQL ≥ 8

### Installation
\`\`\`bash
git clone https://github.com/you/ethiroli-internship.git
cd ethiroli-internship

# Backend
cd server
npm install
cp .env.example .env    # fill in your values
npm run migrate
npm run dev

# Frontend (new terminal)
cd client
npm install
npm run dev
\`\`\`

### Environment Variables
| Variable | Description |
|---|---|
| `PORT` | Server port (default 5000) |
| `DB_HOST` | MySQL host |
| `DB_USER` | MySQL user |
| `DB_PASSWORD` | MySQL password |
| `DB_NAME` | Database name |
| `JWT_SECRET` | Long random string |
| `JWT_EXPIRES_IN` | e.g. `1d` |

## API Endpoints
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Get JWT |
| GET | `/api/interns` | Admin | List interns |
| POST | `/api/tasks` | Mentor | Create task |

## Project Structure
\`\`\`
├── client/          React app
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       └── services/
└── server/          Express API
    └── src/
        ├── config/
        ├── controllers/
        ├── middleware/
        ├── models/
        └── routes/
\`\`\`

## License
MIT
```

### 🧪 Quiz — Day 11

1. Difference between `git fetch` and `git pull`?
   a) No difference b) `fetch` downloads without merging; `pull` fetches and merges c) `pull` is faster d) `fetch` only works on main
   ✅ **b)**

2. In a conflict, what does `<<<<<<< HEAD` mark?
   a) The incoming branch b) Your current branch's version c) Deleted code d) A syntax error
   ✅ **b)**

3. `git checkout --theirs file.js` keeps:
   a) Your version b) The incoming branch's version c) Both d) Neither
   ✅ **b)**

4. Best PR size?
   a) As large as possible b) Under ~400 lines changed c) Exactly 1000 lines d) Size doesn't matter
   ✅ **b)**

5. What should you do immediately after accidentally committing `.env`?
   a) Nothing b) `git rm --cached .env`, add to `.gitignore`, commit, and **rotate all secrets** c) Delete the repo d) Force push
   ✅ **b)**

### 🛠️ Task — Day 11
**Deliverable:** A GitHub repo with 1 merged PR and a conflict-resolution log.

1. Push your `ethiroli-internship` repo to GitHub
2. Set up SSH **or** a PAT (document which, in `README.md`)
3. Create branch `feature/readme` and write a full professional README (use the template above)
4. Open a **Pull Request** with the What/Why/How/Screenshots/Testing structure
5. Create a second branch `feature/footer`, change a line that `main` also changed, and **deliberately create a merge conflict**
6. Resolve it manually, commit, and push
7. Write `docs/CONFLICT_LOG.md` documenting: what conflicted, how you resolved it, and what you learned

**Rubric (10 pts):** Repo pushed 2 · README quality 3 · PR quality 3 · Conflict resolved + logged 2

### ✅ Checkpoint
Your GitHub profile shows a repo with a merged PR and a clean commit graph.

---

# 🟢 DAY 12 — JavaScript: Variables, Data Types & Operators

**Course 06:** JavaScript Fundamentals | **Phase 2**

### 🎯 Learning Objectives
- Choose correctly between `var`, `let`, and `const`
- Identify all 8 JavaScript data types
- Use `===` vs `==` correctly and explain why
- Master type coercion pitfalls

### 📘 Content

**12.1 Adding JS to a page**

```html
<!-- External (✅ always) -->
<script src="app.js" defer></script>

<!-- Inline (avoid) -->
<script>console.log('hi');</script>
```

**Why `defer`?** Without it, the browser stops parsing HTML to download and run the script. `defer` downloads in parallel and runs after the HTML is parsed — so `document.querySelector` works.

- `defer` — download in parallel, run in order, after parsing
- `async` — download in parallel, run ASAP, order not guaranteed
- neither — blocks HTML parsing

**12.2 Variables**

```js
var   oldWay = 'function-scoped, avoid';  // ❌ legacy
let   changeable = 'block-scoped';        // ✅ when it changes
const fixed = 'block-scoped, cannot reassign'; // ✅ default choice
```

**`var` problems:**

```js
if (true) {
  var x = 10;
}
console.log(x);  // 10 ← leaked out of the block! 😱

if (true) {
  let y = 10;
}
console.log(y);  // ReferenceError ✅ correctly scoped
```

```js
// var allows redeclaration — silent bugs
var name = 'Arun';
var name = 'Divya';  // no error!

// let/const prevent it
let name = 'Arun';
let name = 'Divya';  // SyntaxError ✅
```

**Rule:** `const` by default → `let` only when reassignment is needed → never `var`.

**Note:** `const` prevents *reassignment*, not *mutation*:

```js
const arr = [1, 2, 3];
arr.push(4);        // ✅ allowed — mutating the array
console.log(arr);   // [1, 2, 3, 4]

arr = [5, 6];       // ❌ TypeError — reassigning the binding

const user = { name: 'Arun' };
user.name = 'Divya';  // ✅ allowed — mutating a property
user = {};            // ❌ TypeError
```

To truly freeze:
```js
const user = Object.freeze({ name: 'Arun', age: 22 });
user.name = 'Divya';      // silently fails (throws in strict mode)
console.log(user.name);   // 'Arun'
```

**Naming conventions:**

```js
const userName = 'Arun';         // camelCase — variables & functions
const MAX_RETRIES = 3;           // SCREAMING_SNAKE — true constants
class UserService {}             // PascalCase — classes & components
const isActive = true;           // boolean → prefix is/has/can/should
const getUserById = () => {};    // function → verb first

// ❌ Bad names
const d = 5;
const data2 = [];
const temp = 'Arun';
```

**12.3 The 8 data types**

```js
// ── PRIMITIVES (immutable, copied by value) ──
let str     = 'Hello';           // string
let num     = 42;                // number (int + float are the same type)
let big     = 9007199254740993n; // bigint
let bool    = true;              // boolean
let nothing = undefined;         // undefined — declared, not assigned
let empty   = null;              // null — intentional absence
let sym     = Symbol('id');      // symbol — unique identifier

// ── OBJECT (mutable, copied by reference) ──
let obj     = { name: 'Arun' };
let arr     = [1, 2, 3];
let fn      = function () {};
let date    = new Date();
```

```js
typeof 'hello'      // 'string'
typeof 42           // 'number'
typeof 42n          // 'bigint'
typeof true         // 'boolean'
typeof undefined    // 'undefined'
typeof null         // 'object'  ← famous JS quirk (a 1995 bug)
typeof Symbol()     // 'symbol'
typeof {}           // 'object'
typeof []           // 'object'  ← arrays are objects
typeof function(){} // 'function'
typeof NaN          // 'number'  ← also a quirk
```

To check for an array: `Array.isArray(x)`.
To check for null: `x === null`.

**12.4 `undefined` vs `null`**

```js
let a;
console.log(a);          // undefined — JS gave it no value

let b = null;
console.log(b);          // null — YOU set it to nothing

function greet(name) { return name; }
console.log(greet());    // undefined — argument not passed

// Use null for intentional emptiness
let selectedUser = null;  // nothing selected yet
```

**12.5 `==` vs `===` — always use `===`**

```js
// == does type coercion — unpredictable
5 == '5'          // true   😱 string coerced to number
0 == false        // true   😱
'' == false       // true   😱
null == undefined // true   😱
[] == false       // true   😱
[] == ![]         // true   🤯

// === compares value AND type — predictable
5 === '5'          // false ✅
0 === false        // false ✅
null === undefined // false ✅
```

**The one acceptable use of `==`:**

```js
if (x == null) { }
// Equivalent to: if (x === null || x === undefined) { }
// Useful, but writing it explicitly is clearer
```

**12.6 Operators**

**Arithmetic:**
```js
10 + 3    // 13
10 - 3    // 7
10 * 3    // 30
10 / 3    // 3.3333333333333335
10 % 3    // 1  (remainder)
10 ** 3   // 1000 (exponent)

// ⚠️ + is overloaded
'5' + 3   // '53'  (string concatenation!)
5 + 3 + '2' // '82' (left-to-right: 8, then '82')
'5' - 3   // 2    (- forces numeric coercion)
```

**Increment/decrement:**
```js
let i = 5;
i++;        // 5 then i becomes 6  (post)
++i;        // i becomes 7, returns 7 (pre)

let a = 5;
console.log(a++);  // 5  (returns old value)
console.log(a);    // 6
let b = 5;
console.log(++b);  // 6  (returns new value)
```

**Comparison:**
```js
5 > 3      // true
5 >= 5     // true
5 < 3      // false
5 !== 3    // true
```

**Logical:**
```js
true && false   // false — AND
true || false   // true  — OR
!true           // false — NOT

// Short-circuit evaluation
const name = user && user.name;         // safe access
const display = nickname || 'Anonymous'; // fallback

// Nullish coalescing — fallback ONLY for null/undefined
const count = 0;
console.log(count || 10);   // 10  😱 0 is falsy!
console.log(count ?? 10);   // 0   ✅ correct

// Optional chaining
const city = user?.address?.city;       // undefined instead of TypeError
const first = arr?.[0];
const result = obj?.method?.();
```

**Falsy values (memorise these 8):**
```js
false, 0, -0, 0n, '', null, undefined, NaN
```
Everything else is truthy — including `[]`, `{}`, `'0'`, `'false'`.

**Assignment:**
```js
let x = 10;
x += 5;   // 15
x -= 3;   // 12
x *= 2;   // 24
x /= 4;   // 6
x %= 4;   // 2
x **= 3;  // 8
```

**Ternary:**
```js
const age = 22;
const status = age >= 18 ? 'Adult' : 'Minor';

// Nested ternaries get unreadable fast — use if/else instead
// ❌
const s = a ? b ? 'x' : 'y' : 'z';
// ✅
let s;
if (a) { s = b ? 'x' : 'y'; } else { s = 'z'; }
```

**12.7 Type conversion**

```js
// Explicit (✅ preferred)
Number('42')       // 42
Number('42px')     // NaN
Number('')         // 0
Number(true)       // 1
parseInt('42px')   // 42  ← parses until invalid char
parseFloat('3.14abc') // 3.14
String(42)         // '42'
Boolean(0)         // false

// Check for NaN
NaN === NaN            // false! NaN is not equal to itself
Number.isNaN(NaN)      // true ✅
Number.isFinite(1/0)   // false

// Modern coercion
+'42'              // 42
!!'hello'          // true
```

**12.8 Template literals**

```js
const name = 'Arun';
const role = 'Intern';

// ❌ Old
console.log('Hello ' + name + ', you are an ' + role + '.');

// ✅ Template literal
console.log(`Hello ${name}, you are an ${role}.`);

// Multi-line
const html = `
  <div class="card">
    <h3>${name}</h3>
    <p>${role}</p>
  </div>
`;

// Expressions inside
console.log(`Total: ${2 + 3}`);
console.log(`Status: ${age >= 18 ? 'Adult' : 'Minor'}`);
```

### 🧪 Quiz — Day 12

1. `typeof null` returns:
   a) `'null'` b) `'object'` c) `'undefined'` d) `'boolean'`
   ✅ **b) `'object'`** — a historical JS bug kept for backwards compatibility.

2. Output of `console.log(0 || 'default')`?
   a) `0` b) `'default'` c) `undefined` d) `NaN`
   ✅ **b) `'default'`** — `0` is falsy. (`0 ?? 'default'` would give `0`.)

3. Which is NOT a primitive?
   a) `string` b) `symbol` c) `array` d) `bigint`
   ✅ **c) array** — Arrays are objects.

4. `console.log('5' - 3)` outputs:
   a) `'53'` b) `2` c) `NaN` d) `8`
   ✅ **b) 2** — `-` forces numeric coercion; only `+` concatenates.

5. What does `const` prevent?
   a) Any mutation b) Reassignment of the binding c) Property changes d) Nothing
   ✅ **b) Reassignment of the binding**

### 🛠️ Task — Day 12
**Deliverable:** `day12/typeExplorer.js`

Write a script (run with `node typeExplorer.js`) that:

1. Declares one variable of each of the 8 data types and logs `typeof` for each
2. Demonstrates `let` block scoping vs `var` function scoping with a comment explaining the difference
3. Shows 6 examples where `==` and `===` disagree, each with a one-line comment explaining **why**
4. Demonstrates the `||` vs `??` difference using `0`, `''`, and `false`
5. Uses optional chaining to safely access a nested property on an object that doesn't have it
6. Demonstrates `NaN !== NaN` and how to check for NaN correctly
7. Uses a template literal to build a multi-line HTML card string

**Constraint:** Every line must have a comment explaining what it does and its output.

**Rubric (10 pts):** All 8 types 2 · Scoping demo 2 · ==/=== examples 2 · ||/?? 2 · Optional chaining + NaN 1 · Template literal 1

### ✅ Checkpoint
You can explain why `0 || 10` and `0 ?? 10` differ.

---

# 🟢 DAY 13 — Conditionals & Loops

**Course 06:** JavaScript Fundamentals | **Phase 2**

### 🎯 Learning Objectives
- Write `if/else if/else` and `switch` correctly
- Choose the right loop for the job
- Use `break`, `continue`, and labelled loops
- Avoid infinite loops

### 📘 Content

**13.1 `if` / `else if` / `else`**

```js
const score = 78;

if (score >= 90) {
  console.log('Grade A');
} else if (score >= 80) {
  console.log('Grade B');
} else if (score >= 70) {
  console.log('Grade C');
} else if (score >= 60) {
  console.log('Grade D');
} else {
  console.log('Fail');
}
```

**Order matters.** Conditions are checked top-to-bottom; the first `true` wins. If you put `score >= 60` first, everything ≥60 would be Grade D.

**Always use braces** — even for one-liners:

```js
// ❌ Dangerous — easy to introduce bugs
if (isLoggedIn)
  console.log('Welcome');
  redirectToDashboard();  // runs ALWAYS — not part of the if!

// ✅ Safe
if (isLoggedIn) {
  console.log('Welcome');
  redirectToDashboard();
}
```

**Truthy/falsy in conditions:**

```js
const items = [];

if (items.length) {          // ✅ explicit — checks count
  console.log('Has items');
}

if (items) {                 // ❌ always true — [] is truthy!
  console.log('Always runs');
}

// Guard clauses — return early, reduce nesting
function processUser(user) {
  if (!user) return null;                       // guard
  if (!user.isActive) return null;              // guard
  if (!user.permissions.includes('admin')) return null; // guard

  // happy path, no nesting
  return doAdminThing(user);
}
```

**Guard clauses vs nested ifs:**

```js
// ❌ Arrow anti-pattern
function getPrice(user, product) {
  if (user) {
    if (product) {
      if (product.inStock) {
        if (user.isPremium) {
          return product.price * 0.8;
        } else {
          return product.price;
        }
      } else {
        return null;
      }
    } else {
      return null;
    }
  } else {
    return null;
  }
}

// ✅ Guard clauses
function getPrice(user, product) {
  if (!user) return null;
  if (!product) return null;
  if (!product.inStock) return null;

  return user.isPremium ? product.price * 0.8 : product.price;
}
```

**13.2 `switch`**

```js
const role = 'mentor';

switch (role) {
  case 'admin':
    console.log('Full access');
    break;
  case 'mentor':
    console.log('Manage interns and tasks');
    break;
  case 'intern':
    console.log('View own progress');
    break;
  default:
    console.log('Unknown role');
}
```

**Rules:**
- `switch` uses **strict equality** (`===`)
- **Always `break`** — otherwise execution "falls through" to the next case
- Always include a `default`

**Intentional fall-through (grouping cases):**

```js
switch (day) {
  case 'Saturday':
  case 'Sunday':
    console.log('Weekend');
    break;
  default:
    console.log('Weekday');
}
```

**`switch` with blocks (for `let`/`const`):**

```js
switch (action) {
  case 'add': {
    const result = a + b;   // braces create a block scope
    console.log(result);
    break;
  }
  case 'subtract': {
    const result = a - b;   // no redeclaration error
    console.log(result);
    break;
  }
}
```

**When to use `switch` vs `if`:**
- `switch` — comparing **one value** against many exact values
- `if/else` — ranges, complex conditions, different variables

**13.3 `while` loop**

```js
let i = 1;
while (i <= 5) {
  console.log(i);
  i++;           // ⚠️ forget this → infinite loop
}
// 1 2 3 4 5
```

**`do...while` — runs at least once:**

```js
let input;
do {
  input = prompt('Enter a number > 0');
} while (Number(input) <= 0 || isNaN(Number(input)));
```

The condition is checked **after** the body, so the body always executes at least once.

**13.4 `for` loop**

```js
for (let i = 0; i < 5; i++) {
  console.log(i);   // 0 1 2 3 4
}

// Anatomy:
// for (INITIALISE ; CONDITION ; UPDATE)

// Countdown
for (let i = 5; i > 0; i--) {
  console.log(i);   // 5 4 3 2 1
}

// Step by 2
for (let i = 0; i <= 10; i += 2) {
  console.log(i);   // 0 2 4 6 8 10
}

// Multiple counters
for (let i = 0, j = 10; i < j; i++, j--) {
  console.log(i, j);
}
```

**13.5 `for...of` — iterate values (✅ preferred for arrays)**

```js
const programs = ['30-Day Web', '45-Day Full Stack', '60-Day AI'];

for (const program of programs) {
  console.log(program);
}

// With index — use .entries()
for (const [index, program] of programs.entries()) {
  console.log(`${index + 1}. ${program}`);
}

// Strings are iterable
for (const char of 'Ethiroli') {
  console.log(char);
}

// Maps and Sets
const scores = new Map([['Arun', 90], ['Divya', 95]]);
for (const [name, score] of scores) {
  console.log(`${name}: ${score}`);
}
```

**13.6 `for...in` — iterate keys (⚠️ objects only)**

```js
const user = { name: 'Arun', role: 'Intern', age: 22 };

for (const key in user) {
  console.log(key, user[key]);   // 'name' 'Arun', etc.
}
```

**⚠️ Never use `for...in` on arrays:**

```js
const arr = ['a', 'b', 'c'];
arr.extra = 'oops';

for (const i in arr) {
  console.log(i);   // '0' '1' '2' 'extra'  ← strings AND inherited props!
}

for (const v of arr) {
  console.log(v);   // 'a' 'b' 'c'  ✅ values only
}
```

**13.7 `break` and `continue`**

```js
// break — exit the loop entirely
for (let i = 1; i <= 10; i++) {
  if (i === 5) break;
  console.log(i);   // 1 2 3 4
}

// continue — skip to the next iteration
for (let i = 1; i <= 10; i++) {
  if (i % 2 === 0) continue;
  console.log(i);   // 1 3 5 7 9
}

// Real-world: find first matching item
function findIntern(interns, id) {
  for (const intern of interns) {
    if (intern.id === id) return intern;  // early return exits the loop
  }
  return null;
}
```

**Labelled loops (nested `break`):**

```js
outer:
for (let i = 1; i <= 3; i++) {
  for (let j = 1; j <= 3; j++) {
    if (i === 2 && j === 2) break outer;  // exits BOTH loops
    console.log(i, j);
  }
}
```

Without the label, `break` would only exit the inner loop.

**13.8 Loop performance & pitfalls**

```js
// ⚠️ Cache the length for large arrays (minor in modern JS engines)
for (let i = 0, len = arr.length; i < len; i++) { }

// ⚠️ Don't modify an array while iterating it
const nums = [1, 2, 3, 4];
for (const n of nums) {
  if (n === 2) nums.push(99);   // infinite loop risk / skipped items
}

// ✅ Filter first, then loop
const filtered = nums.filter(n => n !== 2);
```

**Off-by-one errors:**

```js
const arr = [10, 20, 30];

// ❌ <= goes one past the end → undefined
for (let i = 0; i <= arr.length; i++) {
  console.log(arr[i]);   // 10 20 30 undefined
}

// ✅
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);   // 10 20 30
}
```

**13.9 A complete practical example**

```js
/**
 * Generates a progress report for interns.
 * @param {Array} interns - Array of intern objects
 * @returns {string} Formatted report
 */
function generateReport(interns) {
  if (!Array.isArray(interns) || interns.length === 0) {
    return 'No interns to report.';
  }

  const lines = ['=== Intern Progress Report ==='];
  let totalProgress = 0;
  let atRiskCount = 0;

  for (const [index, intern] of interns.entries()) {
    const { name, program, completedDays, totalDays } = intern;

    const percent = Math.round((completedDays / totalDays) * 100);
    totalProgress += percent;

    let status;
    if (percent >= 90)      status = '🏆 Excellent';
    else if (percent >= 70) status = '✅ On Track';
    else if (percent >= 50) status = '⚠️ Needs Push';
    else { status = '🚨 At Risk'; atRiskCount++; }

    lines.push(`${index + 1}. ${name} (${program}) — ${percent}% ${status}`);
  }

  const average = Math.round(totalProgress / interns.length);
  lines.push('─'.repeat(40));
  lines.push(`Average progress: ${average}%`);
  lines.push(`At-risk interns: ${atRiskCount}`);

  return lines.join('\n');
}

const interns = [
  { name: 'Arun',  program: '45-Day FS', completedDays: 41, totalDays: 45 },
  { name: 'Divya', program: '45-Day FS', completedDays: 28, totalDays: 45 },
  { name: 'Karthik', program: '45-Day FS', completedDays: 18, totalDays: 45 },
  { name: 'Meena', program: '45-Day FS', completedDays: 44, totalDays: 45 },
];

console.log(generateReport(interns));
```

Output:
```
=== Intern Progress Report ===
1. Arun (45-Day FS) — 91% 🏆 Excellent
2. Divya (45-Day FS) — 62% ⚠️ Needs Push
3. Karthik (45-Day FS) — 40% 🚨 At Risk
4. Meena (45-Day FS) — 98% 🏆 Excellent
────────────────────────────────────────
Average progress: 73%
At-risk interns: 1
```

### 🧪 Quiz — Day 13

1. Which loop always executes its body at least once?
   a) `for` b) `while` c) `do...while` d) `for...of`
   ✅ **c) `do...while`**

2. `for (const i in ['a','b'])` iterates over:
   a) Values b) Indices as strings c) Objects d) Nothing
   ✅ **b) Indices as strings** — `'0'`, `'1'`.

3. What happens if you omit `break` in a `switch`?
   a) SyntaxError b) Fall-through — subsequent cases also execute c) Nothing d) It exits the switch
   ✅ **b) Fall-through**

4. In `for (let i = 0; i <= arr.length; i++)`, the last iteration logs:
   a) The last element b) `undefined` c) `null` d) An error
   ✅ **b) `undefined`** — off-by-one; should be `<`.

5. Which is the guard-clause refactor of nested `if`s?
   a) `switch` b) Early `return` for invalid cases, then the happy path c) `try/catch` d) Recursion
   ✅ **b)**

### 🛠️ Task — Day 13
**Deliverable:** `day13/loops.js` + `day13/report.js`

**Part A — `loops.js`:** Demonstrate
1. `if/else if/else` for a grade calculator
2. `switch` for a role-permission mapper (4 roles + default)
3. `while` countdown from 10
4. `do...while` that runs at least once even when the condition is false
5. `for` printing a 5×5 multiplication table
6. `for...of` over an array **and** over a string
7. `for...in` over an object
8. `break` finding the first even number above 20
9. `continue` printing only odd numbers 1–20
10. A labelled nested loop that breaks both levels

**Part B — `report.js`:** Build a **FizzBuzz variant** for intern progress:
- For each day 1–45, print `Day N: <status>`
- Multiples of 5 → `"Review"`
- Multiples of 7 → `"Assessment"`
- Multiples of both 5 and 7 → `"Milestone"`
- Otherwise → `"Development"`
- Use `continue` to skip days 44–45 and handle them separately as `"Final Evaluation"`

**Rubric (10 pts):** Part A all 10 items correct 6 · Part B logic 3 · Code comments 1

### ✅ Checkpoint
You never write `for...in` on an array again.

---

# 🟢 DAY 14 — Functions, Scope & Hoisting

**Course 06:** JavaScript Fundamentals | **Phase 2**

### 🎯 Learning Objectives
- Write function declarations, expressions, and arrow functions
- Explain scope, closures, and the scope chain
- Predict hoisting behaviour
- Use default, rest, and spread parameters

### 📘 Content

**14.1 Three ways to write a function**

```js
// 1. Function declaration — hoisted, has its own `this`
function add(a, b) {
  return a + b;
}

// 2. Function expression — NOT hoisted, assigned to a variable
const subtract = function (a, b) {
  return a - b;
};

// 3. Arrow function — concise, NO own `this`
const multiply = (a, b) => a + b;
```

**Arrow function syntax variations:**

```js
const square = x => x * x;                       // one param, no parens needed
const add = (a, b) => a + b;                     // multiple params need parens
const getUser = () => ({ name: 'Arun' });        // returning an object needs ( )
const log = msg => { console.log(msg); };        // block body needs explicit return
const noop = () => {};                           // empty function
```

**14.2 Declaration vs Expression vs Arrow**

| Feature | Declaration | Expression | Arrow |
|---|---|---|---|
| Hoisted | ✅ fully | ❌ (TDZ) | ❌ (TDZ) |
| Own `this` | ✅ | ✅ | ❌ inherits |
| `arguments` object | ✅ | ✅ | ❌ |
| Can be a constructor (`new`) | ✅ | ✅ | ❌ |
| Best for | Top-level utilities | Callbacks, conditional definitions | Callbacks, array methods |

**14.3 Parameters**

```js
// Default parameters
function greet(name = 'Guest', greeting = 'Hello') {
  return `${greeting}, ${name}!`;
}
greet();                    // 'Hello, Guest!'
greet('Arun');              // 'Hello, Arun!'
greet('Arun', 'Vanakkam');  // 'Vanakkam, Arun!'
greet(undefined, 'Hi');     // 'Hi, Guest!'  ← undefined triggers default
greet(null, 'Hi');          // 'Hi, null!'   ← null does NOT

// Default can reference earlier params
function createUser(name, role = name === 'admin' ? 'admin' : 'intern') {
  return { name, role };
}

// Rest parameters — collect remaining args into an array
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}
sum(1, 2, 3, 4, 5);   // 15

// Spread — expand an array into arguments
const nums = [1, 2, 3];
sum(...nums);         // 6

// Combining
function tag(first, ...rest) {
  return `${first}: ${rest.join(', ')}`;
}
tag('JS', 'react', 'node', 'mysql');  // 'JS: react, node, mysql'
```

**Old way — the `arguments` object (avoid):**

```js
function oldSum() {
  let total = 0;
  for (let i = 0; i < arguments.length; i++) {
    total += arguments[i];
  }
  return total;
}
// `arguments` is array-like, not a real array — no .map, .filter
// Rest params are always better
```

**14.4 `return`**

```js
function divide(a, b) {
  if (b === 0) return null;   // early return
  return a / b;
}

// A function with no return returns undefined
function logIt(msg) {
  console.log(msg);
}
console.log(logIt('hi'));   // logs 'hi', then undefined

// return with no value exits early
function checkAge(age) {
  if (age < 18) return;
  console.log('Access granted');
}

// Returning multiple values — return an object or array
function minMax(arr) {
  return { min: Math.min(...arr), max: Math.max(...arr) };
}
const { min, max } = minMax([3, 1, 4, 1, 5]);
```

**14.5 Scope**

```js
// GLOBAL SCOPE
const globalVar = 'I am global';

function outer() {
  // FUNCTION SCOPE
  const outerVar = 'I am in outer';

  function inner() {
    // BLOCK/FUNCTION SCOPE
    const innerVar = 'I am in inner';

    console.log(globalVar);  // ✅ accessible
    console.log(outerVar);   // ✅ accessible
    console.log(innerVar);   // ✅ accessible
  }

  inner();
  console.log(innerVar);     // ❌ ReferenceError
}

outer();
console.log(outerVar);       // ❌ ReferenceError
```

**The scope chain:** An inner function can access everything in its enclosing scopes. The reverse is never true.

**Block scope:**

```js
{
  let blockScoped = 'only here';
  var functionScoped = 'leaks out';
}
// console.log(blockScoped);     // ❌ ReferenceError
console.log(functionScoped);     // 'leaks out' ⚠️
```

**Variable shadowing:**

```js
const name = 'Global';

function test() {
  const name = 'Local';   // shadows the global
  console.log(name);      // 'Local'
}

test();
console.log(name);        // 'Global'
```

**14.6 Closures — the most important JS concept**

> A closure is a function that remembers the variables from the scope where it was **created**, even after that scope has finished executing.

```js
function counter() {
  let count = 0;              // private variable

  return {
    increment() { count++; return count; },
    decrement() { count--; return count; },
    getCount()  { return count; },
  };
}

const c = counter();
console.log(c.increment());  // 1
console.log(c.increment());  // 2
console.log(c.getCount());   // 2
console.log(c.count);        // undefined ← truly private!
```

`count` persists because the returned methods close over it. Each call to `counter()` creates a **fresh** `count`.

```js
const c1 = counter();
const c2 = counter();
c1.increment();  // 1
c1.increment();  // 2
c2.increment();  // 1  ← independent
```

**Practical closure: a rate limiter**

```js
function rateLimit(fn, delayMs) {
  let lastCall = 0;

  return function (...args) {
    const now = Date.now();
    if (now - lastCall < delayMs) {
      console.log('Rate limited');
      return;
    }
    lastCall = now;
    return fn(...args);
  };
}

const limitedLog = rateLimit(console.log, 1000);
limitedLog('first');   // logs 'first'
limitedLog('second');  // logs 'Rate limited'
```

**The classic loop closure bug (and its fix):**

```js
// ❌ With var — all callbacks share the same i
for (var i = 1; i <= 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// 4 4 4

// ✅ With let — each iteration gets a new binding
for (let i = 1; i <= 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// 1 2 3

// ✅✅ Older fix: IIFE creates a new scope per iteration
for (var i = 1; i <= 3; i++) {
  (function (j) {
    setTimeout(() => console.log(j), 0);
  })(i);
}
```

**14.7 Hoisting**

Hoisting is JavaScript's behaviour of moving **declarations** to the top of their scope during compilation.

```js
// Function declarations — fully hoisted
sayHi();                       // ✅ works
function sayHi() { console.log('Hi'); }

// var — hoisted as undefined
console.log(x);                // undefined (not an error!)
var x = 5;

// Behind the scenes:
// var x;
// console.log(x);  // undefined
// x = 5;

// let/const — hoisted but in the Temporal Dead Zone (TDZ)
console.log(y);                // ❌ ReferenceError: Cannot access 'y' before initialization
let y = 10;

// Function expressions / arrows — not usable before definition
greet();                       // ❌ TypeError: greet is not a function
var greet = function () {};
// Behind the scenes: var greet; → greet() → undefined() → TypeError

hello();                       // ❌ ReferenceError
const hello = () => {};
```

**Practical guidance:** Declare functions and variables at the top of their scope. Don't rely on hoisting — it's a language mechanic, not a design pattern.

**14.8 Pure functions & side effects**

```js
// ❌ Impure — mutates external state
let total = 0;
function addToTotal(n) {
  total += n;
}

// ✅ Pure — same input always gives same output, no side effects
function add(a, b) {
  return a + b;
}

// ❌ Impure — mutates the input
function addItemBad(arr, item) {
  arr.push(item);
  return arr;
}

// ✅ Pure — returns a new array
function addItem(arr, item) {
  return [...arr, item];
}
```

**Why pure functions matter:** they're trivially testable, safe to run in parallel, and easy to reason about.

**14.9 Function naming & size**

```js
// ✅ Verb-first, descriptive
function calculateProgress(completed, total) { }
function validateEmail(email) { }
function formatDate(date) { }
function isEligibleForCertificate(intern) { }

// ❌ Vague
function process(data) { }
function handle(x) { }
function doStuff() { }

// ✅ Small and single-purpose
function getFullName(user) {
  return `${user.firstName} ${user.lastName}`.trim();
}

function getInitials(user) {
  return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
}

function isValidUser(user) {
  return Boolean(user?.firstName && user?.lastName && user?.email);
}
```

A function should do **one thing**. If you need "and" to describe it, split it.

**14.10 JSDoc — document your functions**

```js
/**
 * Calculates the progress percentage for an intern.
 *
 * @param {number} completedDays - Days the intern has completed.
 * @param {number} totalDays - Total days in the program.
 * @returns {number} Percentage (0–100), rounded.
 * @throws {TypeError} If totalDays is 0 or negative.
 *
 * @example
 * calculateProgress(36, 45);  // 80
 */
function calculateProgress(completedDays, totalDays) {
  if (totalDays <= 0) throw new TypeError('totalDays must be positive');
  const raw = (completedDays / totalDays) * 100;
  return Math.min(100, Math.max(0, Math.round(raw)));
}
```

VS Code shows this on hover — it's the fastest way to make your code usable by a teammate.

### 🧪 Quiz — Day 14

1. Which is fully hoisted (usable before its definition)?
   a) `let` b) `const` c) Function declaration d) Arrow function
   ✅ **c) Function declaration**

2. What is a closure?
   a) A loop b) A function that retains access to variables from its creation scope c) A way to close a browser d) An IIFE
   ✅ **b)**

3. `console.log(x); var x = 5;` outputs:
   a) `5` b) `undefined` c) `ReferenceError` d) `null`
   ✅ **b) `undefined`**

4. Arrow functions differ from regular functions by:
   a) Being faster b) Not having their own `this` c) Not accepting parameters d) Not returning values
   ✅ **b) Not having their own `this`**

5. Which is a pure function?
   a) `function add(a,b){ return a+b; }` b) `function log(m){ console.log(m); }` c) `function push(arr,x){ arr.push(x); }` d) `let t=0; function inc(){ t++; }`
   ✅ **a)** — no side effects, deterministic.

### 🛠️ Task — Day 14
**Deliverable:** `day14/functions.js`

Write and document (JSDoc + comments) the following:

1. All 3 function forms computing the same thing (area of a circle) — compare them in a comment
2. A function with **default parameters** where the default depends on a previous parameter
3. A function using **rest params** to calculate the average of any number of arguments
4. A function returning an **object** with `{ min, max, average }` from an array
5. A **closure-based counter** factory — create two counters and prove they're independent
6. A **closure-based `once()`** function: the wrapped function only ever runs one time
7. A **hoisting demo** — one example each of: function declaration used before definition ✅, `var` before declaration ✅, `let` before declaration ❌ (in a `try/catch`)
8. A **pure function** and an **impure version** of the same logic, with a comment explaining the difference
9. A `memoize()` higher-order function using a closure + `Map`

**Constraint:** Every function needs a JSDoc block with `@param`, `@returns`, and `@example`.

**Rubric (10 pts):** 3 forms 1 · Defaults/rest 2 · Closure counter 2 · `once()` 2 · Hoisting demos 1 · Pure vs impure 1 · Memoize 1

### ✅ Checkpoint
You can explain closures using the `counter()` example without notes.

---

# 🟢 DAY 15 — Arrays & Array Methods

**Course 06:** JavaScript Fundamentals | **Phase 2**

### 🎯 Learning Objectives
- Create, access, and mutate arrays safely
- Master `map`, `filter`, `reduce`, `find`, `some`, `every`
- Know when to mutate vs return a new array
- Chain array methods for data transformation

### 📘 Content

**15.1 Creating arrays**

```js
const literal = [1, 2, 3];
const fromArray = Array.from('abc');        // ['a','b','c']
const fromLength = new Array(3).fill(0);    // [0,0,0]
const range = Array.from({ length: 5 }, (_, i) => i + 1); // [1,2,3,4,5]
const spread = [...literal, 4, 5];          // [1,2,3,4,5]
const mixed = [1, 'two', true, null, { a: 1 }, [2]];
```

**15.2 Access & basic operations**

```js
const arr = ['a', 'b', 'c', 'd', 'e'];

arr[0]              // 'a'  (zero-indexed)
arr[arr.length - 1] // 'e'
arr.at(-1)          // 'e'  ← modern, cleaner
arr.at(-2)          // 'd'
arr.length          // 5

// Mutating methods
arr.push('f');        // add to end → returns new length
arr.pop();            // remove from end → returns removed item
arr.unshift('z');     // add to start → returns new length
arr.shift();          // remove from start → returns removed item
arr.splice(1, 2);     // remove 2 items starting at index 1 → returns removed
arr.splice(1, 0, 'x'); // insert 'x' at index 1, remove 0
arr.reverse();        // reverses IN PLACE
arr.sort();           // sorts IN PLACE
arr.fill(0, 1, 3);    // fill indices 1–2 with 0
```

**⚠️ `sort()` is in-place AND sorts lexicographically by default:**

```js
const nums = [10, 1, 5, 25, 100];
nums.sort();               // [1, 10, 100, 25, 5]  😱 string sort!
nums.sort((a, b) => a - b); // [1, 5, 10, 25, 100] ✅ numeric ascending
nums.sort((a, b) => b - a); // [100, 25, 10, 5, 1] ✅ descending

// Sorting objects
const interns = [
  { name: 'Arun',  progress: 91 },
  { name: 'Divya', progress: 62 },
  { name: 'Meena', progress: 98 },
];
interns.sort((a, b) => b.progress - a.progress);
// Meena 98, Arun 91, Divya 62
```

**Non-mutating alternatives (✅ prefer these):**

```js
const arr = [1, 2, 3];

const added   = [...arr, 4];           // instead of push
const removed = arr.slice(0, -1);      // instead of pop
const sorted  = [...arr].sort();       // instead of sort (which mutates)
const reversed = [...arr].reverse();   // instead of reverse
const spliced = [...arr.slice(0,1), 'x', ...arr.slice(1)]; // instead of splice
const withAt = arr.with(1, 99);        // [1, 99, 3]  ← ES2023
```

**15.3 The Big Six array methods**

**`map` — transform every element, same length**

```js
const prices = [100, 250, 75];

const withTax = prices.map(p => p * 1.18);
// [118, 295, 88.5]

const interns = [
  { name: 'Arun', progress: 91 },
  { name: 'Divya', progress: 62 },
];

const names = interns.map(i => i.name);
// ['Arun', 'Divya']

// With index
const numbered = interns.map((i, idx) => `${idx + 1}. ${i.name}`);
// ['1. Arun', '2. Divya']
```

**`filter` — keep elements matching a condition**

```js
const nums = [1, 2, 3, 4, 5, 6, 7, 8];

const evens = nums.filter(n => n % 2 === 0);
// [2, 4, 6, 8]

const atRisk = interns.filter(i => i.progress < 70);
// [{ name: 'Divya', progress: 62 }]

// Multiple conditions
const activeAdmins = users.filter(u => u.isActive && u.role === 'admin');

// Remove falsy values
const cleaned = [0, 1, false, 2, '', 3, null, undefined].filter(Boolean);
// [1, 2, 3]
```

**`reduce` — collapse to a single value**

```js
const nums = [1, 2, 3, 4, 5];

// Sum
const sum = nums.reduce((acc, n) => acc + n, 0);   // 15

// Max
const max = nums.reduce((acc, n) => (n > acc ? n : acc), nums[0]);

// Count occurrences
const fruits = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];
const counts = fruits.reduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] || 0) + 1;
  return acc;
}, {});
// { apple: 3, banana: 2, orange: 1 }

// Group by property
const grouped = interns.reduce((acc, intern) => {
  const key = intern.progress >= 70 ? 'onTrack' : 'atRisk';
  (acc[key] ||= []).push(intern);
  return acc;
}, {});
// { onTrack: [...], atRisk: [...] }

// Flatten
const nested = [[1, 2], [3, 4], [5]];
const flat = nested.reduce((acc, arr) => acc.concat(arr), []); // [1,2,3,4,5]

// Average
const avg = nums.reduce((a, b) => a + b, 0) / nums.length;  // 3
```

**`reduce` anatomy — always pass the initial value:**

```js
array.reduce((accumulator, currentValue, index, array) => {
  // return the new accumulator
}, initialValue);
```

Omitting the initial value makes `reduce` use the first element and start at index 1 — a common source of bugs, especially on empty arrays (which throw `TypeError`).

**`find` / `findIndex` — get the first match**

```js
const users = [
  { id: 1, name: 'Arun' },
  { id: 2, name: 'Divya' },
  { id: 3, name: 'Meena' },
];

const user = users.find(u => u.id === 2);        // { id: 2, name: 'Divya' }
const index = users.findIndex(u => u.id === 2);  // 1
const missing = users.find(u => u.id === 99);    // undefined

// findLast / findLastIndex (ES2023)
const last = users.findLast(u => u.id > 1);      // { id: 3, name: 'Meena' }
```

**`some` / `every` — boolean tests**

```js
const nums = [2, 4, 6, 8];

nums.some(n => n > 7);     // true  — at least one
nums.every(n => n % 2 === 0); // true — all
nums.some(n => n > 10);    // false

// Empty array edge cases
[].some(() => true);       // false
[].every(() => true);      // true  ← vacuous truth
```

**`includes` / `indexOf`**

```js
['a', 'b'].includes('b');       // true
['a', 'b'].indexOf('b');        // 1
['a', 'b'].indexOf('z');        // -1
[1, 2, 3].includes(2, 2);       // false — start searching from index 2
```

**15.4 Other useful methods**

```js
// join
['a', 'b', 'c'].join('-');          // 'a-b-c'

// concat
[1, 2].concat([3, 4]);              // [1,2,3,4]

// slice — non-mutating extraction
const arr = [1, 2, 3, 4, 5];
arr.slice(1, 3);                    // [2, 3]
arr.slice(-2);                      // [4, 5]
arr.slice();                        // shallow copy

// flat / flatMap
[1, [2, [3, [4]]]].flat();          // [1, 2, [3, [4]]]
[1, [2, [3, [4]]]].flat(2);         // [1, 2, 3, [4]]
[1, [2, [3, [4]]]].flat(Infinity);  // [1, 2, 3, 4]

const sentences = ['hello world', 'foo bar'];
sentences.flatMap(s => s.split(' '));  // ['hello','world','foo','bar']

// Array.from
Array.from('hello');                          // ['h','e','l','l','o']
Array.from(new Set([1,1,2,3]));               // [1,2,3]
Array.from({ length: 3 }, (_, i) => i * 2);   // [0,2,4]
Array.from(document.querySelectorAll('li'));  // real array from NodeList

// at
[1,2,3].at(-1);                     // 3

// toSorted / toReversed / toSpliced (ES2023 — non-mutating)
const sorted = [3,1,2].toSorted();  // [1,2,3], original untouched
```

**15.5 Chaining**

```js
const interns = [
  { name: 'Arun',    program: 'fs45', completedDays: 41, totalDays: 45 },
  { name: 'Divya',   program: 'fs45', completedDays: 28, totalDays: 45 },
  { name: 'Karthik', program: 'web30', completedDays: 27, totalDays: 30 },
  { name: 'Meena',   program: 'fs45', completedDays: 44, totalDays: 45 },
  { name: 'Ravi',    program: 'ai60', completedDays: 12, totalDays: 60 },
];

// Question: Names of fs45 interns above 85% progress, sorted by progress desc
const result = interns
  .filter(i => i.program === 'fs45')
  .map(i => ({ ...i, progress: Math.round((i.completedDays / i.totalDays) * 100) }))
  .filter(i => i.progress > 85)
  .sort((a, b) => b.progress - a.progress)
  .map(i => i.name);

console.log(result);  // ['Meena', 'Arun']
```

**Readability tip:** One operation per line. Don't compress into a single unreadable line.

**15.6 `map` vs `forEach`**

```js
// forEach — for side effects, returns undefined
interns.forEach(i => console.log(i.name));

// map — for transformation, returns a new array
const names = interns.map(i => i.name);

// ❌ Using map for side effects — misuse
interns.map(i => console.log(i.name));

// ❌ Using forEach to build an array
const names2 = [];
interns.forEach(i => names2.push(i.name));  // works, but map is correct
```

**Rule:** If you're building a value → `map`. If you're doing something → `forEach`.

**15.7 Destructuring & spread with arrays**

```js
// Destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];
// first=1, second=2, rest=[3,4,5]

// Skip elements
const [, , third] = [1, 2, 3];  // third=3

// Default values
const [a = 10, b = 20] = [5];   // a=5, b=20

// Swap
let x = 1, y = 2;
[x, y] = [y, x];   // x=2, y=1

// Spread — shallow copy
const original = [1, 2, 3];
const copy = [...original];
copy.push(4);
console.log(original);  // [1,2,3] — untouched ✅

// Combine
const combined = [...arr1, ...arr2];

// Spread into function args
Math.max(...[3, 1, 4, 1, 5]);  // 5
```

**⚠️ Spread is a *shallow* copy:**

```js
const original = [{ name: 'Arun' }];
const copy = [...original];
copy[0].name = 'Divya';
console.log(original[0].name);  // 'Divya'  😱 shared reference!

// Deep copy
const deep = structuredClone(original);  // modern, built-in
// or: JSON.parse(JSON.stringify(original))  (loses Dates, functions)
```

**15.8 A complete practical example**

```js
const submissions = [
  { internId: 1, taskId: 101, score: 88, submittedAt: '2025-01-10', late: false },
  { internId: 1, taskId: 102, score: 92, submittedAt: '2025-01-12', late: false },
  { internId: 2, taskId: 101, score: 75, submittedAt: '2025-01-11', late: true  },
  { internId: 2, taskId: 102, score: 68, submittedAt: '2025-01-14', late: false },
  { internId: 3, taskId: 101, score: 95, submittedAt: '2025-01-09', late: false },
  { internId: 3, taskId: 102, score: 91, submittedAt: '2025-01-13', late: false },
];

// 1. Average score per intern
const avgByIntern = submissions.reduce((acc, s) => {
  (acc[s.internId] ||= []).push(s.score);
  return acc;
}, {});

const averages = Object.entries(avgByIntern).map(([id, scores]) => ({
  internId: Number(id),
  average: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
  submissions: scores.length,
}));

console.log(averages);
// [{ internId:1, average:90, submissions:2 },
//  { internId:2, average:72, submissions:2 },
//  { internId:3, average:93, submissions:2 }]

// 2. Top performer
const top = [...averages].sort((a, b) => b.average - a.average)[0];
console.log(`Top performer: Intern #${top.internId} (${top.average}%)`);

// 3. Did anyone submit everything on time?
const allOnTime = submissions.every(s => !s.late);   // false
const anyoneLate  = submissions.some(s => s.late);   // true

// 4. Total points awarded
const totalPoints = submissions.reduce((sum, s) => sum + s.score, 0);  // 509

// 5. Late submission rate
const lateRate = (submissions.filter(s => s.late).length / submissions.length * 100).toFixed(1);
console.log(`Late rate: ${lateRate}%`);  // '16.7%'
```

### 🧪 Quiz — Day 15

1. Which method returns a new array of the same length?
   a) `filter` b) `map` c) `reduce` d) `find`
   ✅ **b) `map`**

2. `[10, 1, 5].sort()` returns:
   a) `[1, 5, 10]` b) `[1, 10, 5]` c) `[10, 5, 1]` d) Error
   ✅ **b) `[1, 10, 5]`** — default sort is lexicographic (string) order.

3. `[].every(x => x > 0)` returns:
   a) `false` b) `true` c) `undefined` d) Error
   ✅ **b) `true`** — vacuously true.

4. Which does NOT mutate the original array?
   a) `push` b) `sort` c) `reverse` d) `slice`
   ✅ **d) `slice`**

5. `[1,2,3].reduce((a,b) => a+b)` returns:
   a) `6` b) `123` c) `undefined` d) Error
   ✅ **a) 6** — with no initial value it uses `1` as the accumulator and starts at `2`.

### 🛠️ Task — Day 15
**Deliverable:** `day15/arrayMastery.js`

Given this dataset:

```js
const interns = [
  { id: 1, name: 'Arun',    program: 'fs45',  completedDays: 41, totalDays: 45, scores: [88, 92, 79], joinedAt: '2024-11-01' },
  { id: 2, name: 'Divya',   program: 'fs45',  completedDays: 28, totalDays: 45, scores: [75, 68, 82], joinedAt: '2024-11-03' },
  { id: 3, name: 'Karthik', program: 'web30', completedDays: 27, totalDays: 30, scores: [95, 91, 88], joinedAt: '2024-12-01' },
  { id: 4, name: 'Meena',   program: 'fs45',  completedDays: 44, totalDays: 45, scores: [90, 94, 97], joinedAt: '2024-11-01' },
  { id: 5, name: 'Ravi',    program: 'ai60',  completedDays: 12, totalDays: 60, scores: [60, 55, 70], joinedAt: '2025-01-05' },
  { id: 6, name: 'Sneha',   program: 'web30', completedDays: 30, totalDays: 30, scores: [85, 89, 92], joinedAt: '2024-12-01' },
];
```

Write functions that return:

1. An array of names, sorted alphabetically
2. An array of `{ name, progress }` objects where progress is a rounded percentage
3. Only interns with progress ≥ 85%
4. The **total** completed days across all interns
5. The **average score** for each intern (add a `avgScore` property — non-mutating!)
6. A grouped object: `{ fs45: [...], web30: [...], ai60: [...] }`
7. The **top performer** by average score
8. `true`/`false`: did every fs45 intern complete more than 25 days?
9. `true`/`false`: is there any intern with an average below 65?
10. A formatted multi-line report string using `map` + `join('\n')`
11. The number of interns who joined in **November**
12. A `Map` of program → count of interns

**Constraints:**
- Use `map`, `filter`, `reduce`, `find`, `some`, `every` at least once each
- **Never mutate the original array** — use spread/`toSorted` where needed
- Every function needs a JSDoc block

**Rubric (10 pts):** 12 outputs correct 6 · No mutation 2 · All 6 methods used 1 · JSDoc 1

### ✅ Checkpoint
You can solve any "filter this, transform that, total the other" problem by chaining methods.

# ETH-FS-45 — Full Stack Development Internship
## PART 2: Days 16–30

---

# 🟢 DAY 16 — Objects, JSON, Destructuring & Spread

**Course 06:** JavaScript Fundamentals | **Phase 2**

### 🎯 Learning Objectives
- Create and manipulate objects confidently
- Master object destructuring and spread
- Convert between objects and JSON
- Use `Object` static methods effectively
- Understand `this` in object methods

### 📘 Content

**16.1 What is an object?**

An object is a collection of **key–value pairs**. Keys are strings (or Symbols); values can be anything.

```js
const intern = {
  id: 1,
  name: 'Arun',
  role: 'Intern',
  program: 'FS45',
  isActive: true,
  skills: ['HTML', 'CSS', 'JS'],
  mentor: {
    name: 'Priya',
    email: 'priya@ethiroli.in',
  },
  greet() {
    return `Hi, I'm ${this.name}`;
  },
};
```

**16.2 Accessing properties**

```js
// Dot notation — use when the key is a known, valid identifier
intern.name          // 'Arun'
intern.mentor.name   // 'Priya'

// Bracket notation — use for dynamic keys or invalid identifiers
const key = 'role';
intern[key]          // 'Intern'
intern['full-name']  // works even with special chars

// Optional chaining — safe access
intern.address?.city       // undefined, no error
intern.mentor?.email        // 'priya@ethiroli.in'

// Checking existence
'name' in intern           // true
intern.hasOwnProperty('name') // true (older style)
Object.hasOwn(intern, 'name') // true (modern, ES2022)
intern.age                 // undefined
```

**16.3 Adding, updating, deleting**

```js
intern.email = 'arun@example.com';   // add
intern.role = 'Senior Intern';        // update
delete intern.isActive;               // delete (slow — avoid in hot paths)

// Dynamic key assignment
const field = 'phone';
intern[field] = '9876543210';   // creates intern.phone
```

**16.4 Shorthand & computed properties**

```js
const name = 'Divya';
const age = 22;

// ❌ Verbose
const user1 = { name: name, age: age };

// ✅ Shorthand
const user2 = { name, age };

// Computed property names
const fieldName = 'score';
const obj = {
  [fieldName]: 95,                    // { score: 95 }
  [`${fieldName}Max`]: 100,           // { scoreMax: 100 }
};

// Method shorthand
const calculator = {
  add(a, b) { return a + b; },        // not `add: function(a,b){}`
  sub(a, b) { return a - b; },
};
```

**16.5 Destructuring**

**Basic:**
```js
const { name, role } = intern;
console.log(name, role);   // 'Arun' 'Intern'
```

**Renaming:**
```js
const { name: internName, role: internRole } = intern;
console.log(internName);   // 'Arun'
```

**Defaults:**
```js
const { name, age = 20, city = 'Chennai' } = intern;
// age → 20 (not present), city → 'Chennai'
```

**Nested:**
```js
const { mentor: { name: mentorName, email } } = intern;
console.log(mentorName);   // 'Priya'
```

**Combined with defaults (common in function params):**
```js
function createIntern({
  name,
  role = 'Intern',
  program = 'FS45',
  skills = [],
} = {}) {
  return { name, role, program, skills };
}

createIntern({ name: 'Ravi' });
// { name: 'Ravi', role: 'Intern', program: 'FS45', skills: [] }

createIntern();
// { name: undefined, role: 'Intern', program: 'FS45', skills: [] }
```

The `= {}` at the end makes the function callable with **no arguments** — otherwise destructuring `undefined` throws.

**Swapping variables:**
```js
let a = 1, b = 2;
[a, b] = [b, a];   // a=2, b=1
```

**16.6 Spread & Rest with objects**

```js
// Spread — shallow copy
const copy = { ...intern };
copy.name = 'Changed';
console.log(intern.name);   // 'Arun' — original untouched

// Merge (later wins)
const defaults = { theme: 'light', lang: 'en', fontSize: 14 };
const userPrefs = { theme: 'dark' };
const config = { ...defaults, ...userPrefs };
// { theme: 'dark', lang: 'en', fontSize: 14 }

// Rest — collect remaining properties
const { id, name, ...rest } = intern;
// rest = { role, program, skills, mentor, greet }

// Updating immutably (essential for React!)
const updated = { ...intern, role: 'Senior' };
// Original unchanged, new object has new role
```

**⚠️ Spread is shallow:**
```js
const original = { user: { name: 'Arun' } };
const copy = { ...original };
copy.user.name = 'Divya';
console.log(original.user.name);  // 'Divya'  😱 shared reference

// Deep copy
const deep = structuredClone(original);  // modern browsers + Node 17+
```

**16.7 `this` in objects**

```js
const counter = {
  count: 0,
  increment() {
    this.count++;      // `this` = the object calling the method
    return this.count;
  },
};

counter.increment();   // 1
counter.increment();   // 2

// ⚠️ Detaching loses `this`
const inc = counter.increment;
inc();                 // TypeError: Cannot read 'count' of undefined

// ✅ Bind it
const bound = counter.increment.bind(counter);
bound();               // 3

// ✅ Or use an arrow if you define it inside
const counter2 = {
  count: 0,
  init() {
    // Arrow inherits `this` from init's scope (the object)
    this.increment = () => ++this.count;
  },
};
```

**`this` rules (memorise):**

| How the function is called | What `this` is |
|---|---|
| `obj.method()` | `obj` |
| `fn()` | `undefined` (strict) / `globalThis` (sloppy) |
| `new Fn()` | the new instance |
| Arrow function | inherited from enclosing scope |
| `fn.call(x)` / `fn.apply(x)` | `x` |
| `fn.bind(x)` | permanently `x` |

**16.8 JSON**

**JSON (JavaScript Object Notation)** is a text format for data exchange — the standard for APIs and config files.

```js
const obj = {
  name: 'Arun',
  age: 22,
  skills: ['JS', 'React'],
  active: true,
  mentor: null,
};

// Object → JSON string
const json = JSON.stringify(obj);
// '{"name":"Arun","age":22,"skills":["JS","React"],"active":true,"mentor":null}'

// Pretty print
JSON.stringify(obj, null, 2);   // indented with 2 spaces

// Filter keys — only serialise these
JSON.stringify(obj, ['name', 'age']);
// '{"name":"Arun","age":22}'

// Replace function
JSON.stringify(obj, (key, value) =>
  typeof value === 'string' ? value.toUpperCase() : value
);

// JSON string → Object
const parsed = JSON.parse(json);
parsed.name;   // 'Arun'
```

**JSON rules — strict:**

| Rule | Valid | Invalid |
|---|---|---|
| Keys must be double-quoted | `{"a":1}` | `{a:1}` |
| Strings must use double quotes | `"hi"` | `'hi'` |
| No trailing commas | `[1,2]` | `[1,2,]` |
| No comments | `{"a":1}` | `{"a":1 // x}` |
| No `undefined` | `{"a":null}` | `{"a":undefined}` |
| No functions | — | `{"f":function(){}}` |
| No dates (use ISO strings) | `"2025-01-15T10:00:00Z"` | `new Date()` |

**Safe parsing:**
```js
function safeParse(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch (err) {
    console.error('Invalid JSON:', err.message);
    return fallback;
  }
}

safeParse('{"a":1}');      // { a: 1 }
safeParse('{bad}');        // null + error logged
```

**Deep clone via JSON (loses Dates, functions, undefined):**
```js
const deep = JSON.parse(JSON.stringify(original));
```

**16.9 `Object` static methods**

```js
const user = { name: 'Arun', role: 'Intern', age: 22 };

// Keys, values, entries
Object.keys(user);      // ['name', 'role', 'age']
Object.values(user);    // ['Arun', 'Intern', 22]
Object.entries(user);   // [['name','Arun'], ['role','Intern'], ['age',22]]

// Iterate
for (const [key, value] of Object.entries(user)) {
  console.log(`${key}: ${value}`);
}

// Transform to Map
const map = new Map(Object.entries(user));

// Convert back to object
const back = Object.fromEntries(map);

// Merge (mutates target)
const target = { a: 1 };
Object.assign(target, { b: 2 }, { c: 3 });
// target = { a:1, b:2, c:3 }

// Spread is preferred (non-mutating)
const merged = { ...{ a: 1 }, ...{ b: 2 } };

// Freeze (shallow — nested objects still mutable)
const frozen = Object.freeze({ a: 1 });
frozen.a = 2;            // silently fails (throws in strict mode)
frozen.a;                // 1

// Seal (no add/remove, but existing values can change)
const sealed = Object.seal({ a: 1 });
sealed.a = 2;            // ✅ works
sealed.b = 3;            // ❌ silently fails

// Check state
Object.isFrozen(frozen);   // true
Object.isSealed(sealed);   // true

// Prototype info
Object.getPrototypeOf(user);   // Object.prototype
Object.hasOwn(user, 'name');   // true

// Deep freeze helper
function deepFreeze(obj) {
  Object.values(obj).forEach(v => {
    if (v && typeof v === 'object') deepFreeze(v);
  });
  return Object.freeze(obj);
}
```

**16.10 Practical example — an intern registry**

```js
const registry = {
  interns: [
    { id: 1, name: 'Arun',  role: 'Intern', program: 'FS45', scores: [88, 92] },
    { id: 2, name: 'Divya', role: 'Intern', program: 'FS45', scores: [75, 68] },
  ],

  addIntern(data) {
    const id = Math.max(0, ...this.interns.map(i => i.id)) + 1;
    const intern = { id, scores: [], ...data };
    this.interns = [...this.interns, intern];   // non-mutating
    return intern;
  },

  findById(id) {
    return this.interns.find(i => i.id === id) ?? null;
  },

  updateIntern(id, updates) {
    this.interns = this.interns.map(i =>
      i.id === id ? { ...i, ...updates } : i
    );
    return this.findById(id);
  },

  removeIntern(id) {
    const removed = this.findById(id);
    this.interns = this.interns.filter(i => i.id !== id);
    return removed;
  },

  getStats() {
    return Object.fromEntries(
      Object.entries(
        this.interns.reduce((acc, i) => {
          acc[i.program] = (acc[i.program] || 0) + 1;
          return acc;
        }, {})
      )
    );
  },
};

registry.addIntern({ name: 'Meena', role: 'Intern', program: 'AI60' });
registry.updateIntern(2, { name: 'Divya S.' });
console.log(registry.getStats());   // { FS45: 2, AI60: 1 }
```

### 🧪 Quiz — Day 16

1. What does `{...obj}` create?
   a) A deep copy b) A shallow copy c) A reference d) A string
   ✅ **b) A shallow copy** — nested objects are still shared.

2. `JSON.stringify({ a: undefined })` returns:
   a) `'{"a":undefined}'` b) `'{}'` c) Error d) `'null'`
   ✅ **b) `'{}'`** — `undefined` values are omitted.

3. Which converts an object to an array of `[key, value]` pairs?
   a) `Object.keys()` b) `Object.values()` c) `Object.entries()` d) `Object.fromEntries()`
   ✅ **c) `Object.entries()`**

4. In `obj.method()`, `this` refers to:
   a) `window` b) `obj` c) The method d) `undefined`
   ✅ **b) `obj`**

5. What does destructuring `const { a = 5 } = {}` set `a` to?
   a) `undefined` b) `5` c) `null` d) Error
   ✅ **b) 5** — default applies when the property is `undefined`.

### 🛠️ Task — Day 16
**Deliverable:** `day16/objects.js` + `day16/registry.js`

**Part A — `objects.js`:** Demonstrate
1. Object literal with nested object + method
2. Dot, bracket, and optional chaining access
3. Add, update, delete a property
4. Shorthand properties and computed keys
5. All 5 destructuring forms (basic, rename, default, nested, params)
6. Object spread: copy, merge, immutable update
7. Shallow vs deep copy — prove the difference
8. `this` demo: `obj.method()`, detached, `.bind()`, and arrow
9. `JSON.stringify` (with replacer + indent) and `JSON.parse` with a `try/catch`
10. All `Object` static methods: `keys`, `values`, `entries`, `fromEntries`, `assign`, `freeze`, `hasOwn`

**Part B — `registry.js`:** Extend the registry example with:
- `getAverageScore(id)` — returns average of that intern's scores
- `search(query)` — case-insensitive name search
- `sortBy(field)` — returns a **new** sorted array (non-mutating)
- `toJSON()` — returns a plain serialisable object
- `fromJSON(str)` — rebuilds the registry from JSON

**Rubric (10 pts):** Part A all 10 items 6 · Part B methods 3 · JSDoc + no mutation 1

### ✅ Checkpoint
You can update nested state immutably without touching the original.

---

# 🟢 DAY 17 — DOM Manipulation & Events

**Course 07:** JavaScript Advanced | **Phase 2**

### 🎯 Learning Objectives
- Select and modify DOM elements
- Create, insert, and remove nodes
- Handle events and understand propagation
- Use event delegation effectively
- Avoid performance pitfalls

### 📘 Content

**17.1 What is the DOM?**

The **Document Object Model** is a tree representation of your HTML that JavaScript can read and modify.

```html
<body>
  <h1 id="title">Ethiroli</h1>
  <ul class="list">
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
</body>
```

```
document
 └── html
      └── body
           ├── h1#title
           └── ul.list
                ├── li
                └── li
```

**17.2 Selecting elements**

```js
// Single element (first match) — returns Element or null
document.getElementById('title');                 // by id (fastest)
document.querySelector('.list');                  // CSS selector
document.querySelector('#title');
document.querySelector('ul.list > li:first-child');

// Multiple elements — returns NodeList
document.querySelectorAll('.item');               // static NodeList
document.getElementsByClassName('item');          // live HTMLCollection
document.getElementsByTagName('li');              // live HTMLCollection

// ⚠️ NodeList vs HTMLCollection
const staticList = document.querySelectorAll('li');   // snapshot
const liveList   = document.getElementsByTagName('li'); // updates automatically

// NodeList has forEach; HTMLCollection does NOT
staticList.forEach(el => console.log(el));
Array.from(liveList).forEach(el => console.log(el));
[...liveList].forEach(el => console.log(el));
```

**Escape hatch — scope your queries:**
```js
const nav = document.querySelector('nav');
const links = nav.querySelectorAll('a');   // only links inside nav
```

**17.3 Reading & writing content**

```js
const title = document.querySelector('#title');

// Text
title.textContent              // 'Ethiroli' — raw text, safe
title.innerText                // 'Ethiroli' — respects CSS visibility, slower

// ⚠️ innerHTML parses HTML — XSS risk with user input
title.innerHTML = '<em>Ethiroli</em>';

// ✅ Safe: create elements programmatically
const em = document.createElement('em');
em.textContent = userInput;    // no HTML parsing
title.replaceChildren(em);

// Attributes
const link = document.querySelector('a');
link.getAttribute('href');
link.setAttribute('href', '/new');
link.removeAttribute('target');
link.hasAttribute('disabled');
link.dataset.userId;           // reads data-user-id

// Properties vs attributes
const input = document.querySelector('input');
input.value;                   // current value (property — changes as user types)
input.getAttribute('value');   // original value (attribute — never changes)

// Classes
const box = document.querySelector('.box');
box.classList.add('active', 'focused');
box.classList.remove('hidden');
box.classList.toggle('open');             // add if absent, remove if present
box.classList.toggle('open', isOpen);     // force based on boolean
box.classList.replace('old', 'new');
box.classList.contains('active');         // boolean

// Inline styles (avoid — use classes)
box.style.backgroundColor = 'crimson';
box.style.setProperty('--brand', '#6366f1');   // custom property

// Computed styles
getComputedStyle(box).fontSize;   // '16px' — resolved value
```

**17.4 Creating & inserting nodes**

```js
// Create
const card = document.createElement('article');
card.className = 'card';
card.dataset.id = '101';

const h3 = document.createElement('h3');
h3.textContent = 'Web Development';

const p = document.createElement('p');
p.textContent = 'Learn HTML, CSS, JavaScript.';

card.append(h3, p);   // append multiple

// Insert
const list = document.querySelector('.list');
list.append(card);              // at end
list.prepend(card);             // at start
list.before(card);              // before list itself
list.after(card);               // after list itself

const firstItem = list.querySelector('li');
firstItem.before(card);         // before the first li
firstItem.after(card);          // after the first li
list.insertBefore(card, firstItem);  // older API

// Efficient batch insert
const fragment = document.createDocumentFragment();
for (let i = 1; i <= 100; i++) {
  const li = document.createElement('li');
  li.textContent = `Item ${i}`;
  fragment.append(li);
}
list.append(fragment);   // one reflow instead of 100 ✅

// Template approach (fast, clean)
const html = interns.map(i => `<li data-id="${i.id}">${i.name}</li>`).join('');
list.innerHTML = html;   // ⚠️ only safe with trusted data

// Remove
card.remove();
list.replaceChildren();   // empty it (modern, fast)
```

**17.5 Events**

```js
const button = document.querySelector('#submit');

// Modern
button.addEventListener('click', handleClick);

function handleClick(event) {
  console.log(event.type);           // 'click'
  console.log(event.target);         // the clicked element
  console.log(event.currentTarget);  // the element the listener is on
  event.preventDefault();            // stop default behaviour (form submit, link)
  event.stopPropagation();           // stop bubbling
}

// Remove — must pass the SAME function reference
button.removeEventListener('click', handleClick);

// One-time listener
button.addEventListener('click', () => console.log('once'), { once: true });

// Options
element.addEventListener('scroll', handler, {
  passive: true,       // promise not to preventDefault — better scroll perf
  capture: true,       // fire during capture phase
});
```

**`event.target` vs `event.currentTarget`:**

```html
<div class="card">
  <h3>Title</h3>
  <button>Click</button>
</div>
```

```js
document.querySelector('.card').addEventListener('click', (e) => {
  console.log(e.target);        // <h3>, <button>, or the div — whatever was clicked
  console.log(e.currentTarget); // always the .card div
});
```

**17.6 Event propagation**

```
Capture phase (window → target)   ← rarely used
        ↓
Target phase
        ↓
Bubble phase (target → window)     ← default for addEventListener
```

```html
<div id="outer">
  <div id="middle">
    <button id="inner">Click me</button>
  </div>
</div>
```

```js
outer.addEventListener('click', () => console.log('outer'));
middle.addEventListener('click', () => console.log('middle'));
inner.addEventListener('click', () => console.log('inner'));

// Click the button → logs:
// inner
// middle
// outer   ← bubbling up
```

**To stop it:**
```js
inner.addEventListener('click', (e) => {
  e.stopPropagation();   // nothing above fires
  console.log('inner only');
});
```

**17.7 Event delegation**

The most important pattern. Attach **one** listener to a parent instead of N listeners on children.

```html
<ul id="list">
  <li><button data-action="edit" data-id="1">Edit</button></li>
  <li><button data-action="delete" data-id="2">Delete</button></li>
  <!-- 100 more... -->
</ul>
```

```js
// ❌ 100 listeners
document.querySelectorAll('button').forEach(btn =>
  btn.addEventListener('click', handleClick)
);

// ✅ 1 listener — handles all present AND future buttons
document.querySelector('#list').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;   // clicked somewhere else

  const { action, id } = btn.dataset;

  if (action === 'edit')   openEditor(id);
  if (action === 'delete') confirmDelete(id);
});
```

`closest()` walks up the tree looking for a matching ancestor — handles clicks on nested spans inside buttons.

**Benefits:**
- Fewer listeners → less memory
- Works with dynamically added elements
- Cleaner code

**17.8 Common events**

```js
// Mouse
'click', 'dblclick', 'mousedown', 'mouseup', 'mousemove',
'mouseenter', 'mouseleave', 'contextmenu'

// Keyboard
'keydown', 'keyup', 'keypress' (deprecated)

document.addEventListener('keydown', (e) => {
  console.log(e.key);      // 'a', 'Enter', 'Escape'
  console.log(e.code);     // 'KeyA', 'Enter', 'Escape' — layout-independent
  if (e.key === 'Escape') closeModal();
  if (e.ctrlKey && e.key === 's') { e.preventDefault(); save(); }
});

// Form
'submit', 'input', 'change', 'focus', 'blur', 'reset'

const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
  e.preventDefault();      // stop page reload
  const data = Object.fromEntries(new FormData(form));
  console.log(data);
});

const emailInput = document.querySelector('#email');
emailInput.addEventListener('input', (e) => {
  console.log(e.target.value);   // fires on EVERY keystroke
});

emailInput.addEventListener('change', (e) => {
  console.log(e.target.value);   // fires on blur after change
});

// Window
'load', 'DOMContentLoaded', 'resize', 'scroll', 'beforeunload'

document.addEventListener('DOMContentLoaded', () => {
  // HTML parsed — safe to query
});

// With `defer` on the script tag, DOMContentLoaded is unnecessary
```

**17.9 Debounce & throttle**

```js
// Debounce — wait until the user stops
function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

const search = debounce((query) => {
  console.log('Searching:', query);
}, 300);

input.addEventListener('input', (e) => search(e.target.value));

// Throttle — run at most once per interval
function throttle(fn, limit) {
  let inThrottle = false;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

window.addEventListener('scroll', throttle(() => {
  console.log('Scroll position:', window.scrollY);
}, 200));
```

**17.10 Performance rules**

```js
// ❌ Read/write interleaved causes layout thrashing
for (let i = 0; i < 100; i++) {
  el.style.height = el.offsetHeight + 10 + 'px';   // read+write each iteration
}

// ✅ Batch reads, then batch writes
const heights = [];
for (let i = 0; i < 100; i++) heights.push(els[i].offsetHeight);
for (let i = 0; i < 100; i++) els[i].style.height = heights[i] + 10 + 'px';

// ✅ Use DocumentFragment for many inserts
// ✅ Use classList instead of style where possible
// ✅ Cache queries — don't re-query in a loop
// ✅ Use event delegation
// ✅ Use `requestAnimationFrame` for visual updates
```

**17.11 A complete example — a Todo app in vanilla JS**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Todo</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: system-ui; max-width: 500px; margin: 2rem auto; padding: 1rem; }
    form { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
    input { flex: 1; padding: 0.5rem; }
    ul { list-style: none; padding: 0; }
    li {
      display: flex; justify-content: space-between; align-items: center;
      padding: 0.5rem; border-bottom: 1px solid #eee;
    }
    li.done span { text-decoration: line-through; color: #999; }
    button { cursor: pointer; }
  </style>
</head>
<body>
  <h1>Todo</h1>
  <form id="form">
    <input id="input" placeholder="What needs doing?" autocomplete="off" />
    <button type="submit">Add</button>
  </form>
  <ul id="list"></ul>

  <script src="app.js" defer></script>
</body>
</html>
```

```js
// app.js
const form  = document.querySelector('#form');
const input = document.querySelector('#input');
const list  = document.querySelector('#list');

let todos = JSON.parse(localStorage.getItem('todos') || '[]');

function save() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function render() {
  if (todos.length === 0) {
    list.innerHTML = '<li class="empty">No todos yet.</li>';
    return;
  }

  const fragment = document.createDocumentFragment();

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.dataset.id = todo.id;
    if (todo.done) li.classList.add('done');

    const span = document.createElement('span');
    span.textContent = todo.text;

    const delBtn = document.createElement('button');
    delBtn.textContent = '✕';
    delBtn.dataset.action = 'delete';

    li.append(span, delBtn);
    fragment.append(li);
  });

  list.replaceChildren(fragment);
}

// Add
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  todos = [...todos, { id: crypto.randomUUID(), text, done: false }];
  input.value = '';
  save();
  render();
});

// Delegate toggle & delete
list.addEventListener('click', (e) => {
  const li = e.target.closest('li[data-id]');
  if (!li) return;

  const id = li.dataset.id;

  if (e.target.dataset.action === 'delete') {
    todos = todos.filter(t => t.id !== id);
  } else {
    todos = todos.map(t => t.id === id ? { ...t, done: !t.done } : t);
  }

  save();
  render();
});

render();
```

**Why this is good code:** one delegated listener, `DocumentFragment` for perf, immutable updates, persistence, XSS-safe (`textContent`).

### 🧪 Quiz — Day 17

1. `querySelectorAll` returns:
   a) An array b) A live HTMLCollection c) A static NodeList d) A single element
   ✅ **c) A static NodeList**

2. Which is safest for inserting user-supplied text?
   a) `innerHTML` b) `textContent` c) `outerHTML` d) `insertAdjacentHTML`
   ✅ **b) `textContent`** — no HTML parsing, no XSS.

3. Events by default propagate in which order?
   a) Capture → Target → Bubble b) Target → Bubble → Capture c) Only Target d) Random
   ✅ **a) Capture → Target → Bubble** — `addEventListener` listens in the bubble phase by default.

4. What does `event.target` refer to?
   a) The element with the listener b) The element that triggered the event c) The document d) The window
   ✅ **b) The element that triggered the event**

5. Why use event delegation?
   a) It's required b) Fewer listeners + works for dynamically added elements c) It's faster to type d) It prevents bubbling
   ✅ **b)**

### 🛠️ Task — Day 17
**Deliverable:** `day17/todo/` (HTML + CSS + JS) + `day17/README.md`

Build a **Todo application** from scratch (no frameworks) with:

1. Add, toggle-complete, and delete todos
2. **Event delegation** — exactly **one** click listener on the `<ul>`
3. Persistence to `localStorage`
4. Filter buttons: All / Active / Completed
5. An "items left" counter that updates live
6. A "Clear completed" button
7. **Debounced** search input that filters the list as you type (300ms)
8. **XSS-safe** rendering (`textContent` / `createElement`)
9. Use `DocumentFragment` for rendering batches
10. Keyboard: `Enter` adds, `Escape` clears the input

**README must explain:** why you used event delegation, why `textContent` over `innerHTML`, and how you structured state vs rendering.

**Rubric (10 pts):** CRUD 2 · Event delegation 2 · localStorage 1 · Filters + counter 2 · Debounce 1 · XSS-safe + fragment 1 · README 1

### ✅ Checkpoint
You can build an interactive page without jQuery or React.

---

# 🟢 DAY 18 — ES6+ Features, Modules & Error Handling

**Course 07:** JavaScript Advanced | **Phase 2**

### 🎯 Learning Objectives
- Use ES modules (`import` / `export`) correctly
- Apply `try/catch/finally` and custom errors
- Understand optional chaining, nullish coalescing, and modern syntax
- Structure a project with multiple modules

### 📘 Content

**18.1 ES Modules**

**Named exports/imports (preferred — explicit):**

```js
// math.js
export const PI = 3.14159;

export function add(a, b) { return a + b; }
export function multiply(a, b) { return a * b; }

// Exporting later
function subtract(a, b) { return a - b; }
export { subtract };
```

```js
// main.js
import { add, multiply, PI } from './math.js';
import { subtract as sub } from './math.js';     // rename
import * as Math from './math.js';                // namespace

console.log(add(1, 2));         // 3
console.log(Math.PI);            // 3.14159
console.log(sub(5, 3));          // 2
```

**Default export (one per file — for the "main thing"):**

```js
// UserService.js
export default class UserService {
  constructor(api) { this.api = api; }
  async getAll() { return this.api.get('/users'); }
}
```

```js
// main.js
import UserService from './UserService.js';   // no braces, any name
```

**Mixing:**
```js
export default class Api { /* ... */ }
export const BASE_URL = 'https://api.example.com';
```

```js
import Api, { BASE_URL } from './api.js';
```

**Rules & gotchas:**

| Rule | Why |
|---|---|
| File extension `.js` (or `.mjs`) required in the browser | Browser doesn't guess |
| Paths are relative (`./`, `../`) — no bare `math` | Bare imports need a bundler |
| Modules are **deferred** automatically | HTML is parsed before JS runs |
| Modules have their own scope | No global leakage |
| `this` at top level is `undefined`, not `window` | Strict mode is on |
| Imports are **live bindings** (read-only) | Can't reassign imported values |

**Using modules in the browser:**
```html
<script type="module" src="./main.js"></script>
```

**Dynamic import (code splitting):**
```js
button.addEventListener('click', async () => {
  const { openChart } = await import('./chart.js');
  openChart();
});
```

**18.2 `try / catch / finally`**

```js
function parseJSON(str) {
  try {
    return JSON.parse(str);
  } catch (err) {
    console.error('Parse failed:', err.message);
    return null;
  } finally {
    console.log('Parse attempt finished');   // ALWAYS runs
  }
}
```

**How the flow works:**

```js
try {
  console.log('1');
  throw new Error('boom');
  console.log('2');              // never runs
} catch (err) {
  console.log('3', err.message); // '3 boom'
} finally {
  console.log('4');              // '4'
}
```

**Even with a `return` in `try`, `finally` still runs:**
```js
function f() {
  try { return 'from try'; }
  finally { console.log('finally runs'); }
}
f();   // logs 'finally runs', returns 'from try'
```

**Don't swallow errors silently:**
```js
// ❌ Swallowing
try { doSomething(); } catch (e) {}

// ✅ Log or rethrow
try { doSomething(); } catch (e) {
  console.error(e);
  throw e;   // or handle meaningfully
}
```

**18.3 Built-in error types**

```js
new Error('Generic error');
new TypeError('Expected a string');             // wrong type
new ReferenceError('x is not defined');          // undefined variable
new RangeError('Array size must be positive');   // out of range
new SyntaxError('Unexpected token');             // bad code (usually caught at parse)
new URIError('Malformed URI');
```

**When they occur naturally:**
```js
undefinedVar;              // ReferenceError
null.foo;                  // TypeError
new Array(-1);             // RangeError
JSON.parse('{bad}');       // SyntaxError
```

**18.4 Throwing custom errors**

```js
class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.statusCode = 400;
    // Maintains proper stack trace in V8
    if (Error.captureStackTrace) Error.captureStackTrace(this, ValidationError);
  }
}

function validateEmail(email) {
  if (!email) throw new ValidationError('email', 'Email is required');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ValidationError('email', 'Email format is invalid');
  }
  return true;
}

try {
  validateEmail('bad-email');
} catch (err) {
  if (err instanceof ValidationError) {
    console.log(`Field "${err.field}": ${err.message}`);
    // Field "email": Email format is invalid
  } else {
    throw err;   // unexpected — don't hide it
  }
}
```

**More custom error classes for a real app:**

```js
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(resource) {
    super(`${resource} not found`, 404);
    this.resource = resource;
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401);
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, 403);
  }
}

class ConflictError extends AppError {
  constructor(message) {
    super(message, 409);
  }
}

// Usage
function getIntern(id) {
  const intern = db.find(i => i.id === id);
  if (!intern) throw new NotFoundError('Intern');
  return intern;
}
```

**Why this matters:** In the backend (Day 30), you'll catch these by `statusCode` and send the right HTTP response.

**18.5 Error handling patterns**

**Guard clauses + early throw:**
```js
function createUser({ name, email, age }) {
  if (!name?.trim())          throw new ValidationError('name', 'Name is required');
  if (!email?.includes('@'))  throw new ValidationError('email', 'Invalid email');
  if (typeof age !== 'number' || age < 18) {
    throw new ValidationError('age', 'Must be 18 or older');
  }

  return { id: crypto.randomUUID(), name, email, age };
}
```

**Centralised error handler:**
```js
function withErrorHandling(fn) {
  return function (...args) {
    try {
      return fn.apply(this, args);
    } catch (err) {
      console.error(`[${fn.name}]`, err);
      showToast(err.message, 'error');
      return null;
    }
  };
}

const safeFetch = withErrorHandling(async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
});
```

**Try/catch vs `.catch()`:**
```js
// async/await
try {
  const data = await fetchData();
} catch (err) {
  handle(err);
}

// Promise
fetchData()
  .then(data => handle(data))
  .catch(err => handleError(err));
```

Both work — pick whichever is more readable for the situation.

**18.6 Optional chaining & nullish coalescing (deep dive)**

```js
// Optional chaining
user?.name                       // undefined if user is null/undefined
user?.address?.city              // safe on nested
user?.getName?.()                // safe method call
arr?.[0]                         // safe index

// ⚠️ Short-circuits — everything after ?. is skipped
user?.profile.settings.theme
// If user is null, the whole expression is undefined — no error

// Nullish coalescing
const x = null ?? 'default';     // 'default'
const y = undefined ?? 'default';// 'default'
const z = 0 ?? 'default';        // 0  ✅ (unlike ||)

// Logical assignment
let a = null;
a ??= 'set';                     // a = 'set'

let b = 0;
b ||= 10;                        // b = 10

let c = null;
c &&= 'x';                       // c stays null (short-circuits on falsy)

// Combined with ||
const port = config.port ?? process.env.PORT ?? 3000;
```

**`??` vs `||`:**

| Value | `value \|\| fallback` | `value ?? fallback` |
|---|---|---|
| `0` | fallback | **0** ✅ |
| `''` | fallback | **''** ✅ |
| `false` | fallback | **false** ✅ |
| `null` | fallback | fallback |
| `undefined` | fallback | fallback |
| `NaN` | fallback | **NaN** ✅ |

Use `??` when `0`, `''`, or `false` are valid values (e.g., a numeric input).

**18.7 Modern operators & syntax**

**Logical assignment:**
```js
obj.count ||= 0;         // assign if falsy
obj.name ??= 'Guest';    // assign if null/undefined
obj.flag &&= doThing();  // run only if truthy
```

**Numeric separators:**
```js
const billion = 1_000_000_000;
const hex = 0xFF_FF_FF;
```

**`at()` for negative indexing:**
```js
[1, 2, 3].at(-1);            // 3
'hello'.at(-1);              // 'o'
```

**`Object.fromEntries` / `groupBy`:**
```js
const entries = [['a', 1], ['b', 2]];
Object.fromEntries(entries);   // { a: 1, b: 2 }

// ES2024
Object.groupBy(interns, i => i.program);
// { fs45: [...], web30: [...] }
```

**Class fields & private members:**
```js
class Counter {
  #count = 0;                       // truly private
  static instances = 0;             // static field

  constructor() { Counter.instances++; }

  increment() { return ++this.#count; }
  get value() { return this.#count; }
  set value(v) {
    if (v < 0) throw new RangeError('Must be non-negative');
    this.#count = v;
  }
}

const c = new Counter();
c.increment();
c.value = 10;
// c.#count → SyntaxError (truly private)
```

**18.8 A multi-module project structure**

```
src/
├── index.js              ← entry point
├── config.js             ← constants
├── utils/
│   ├── dom.js            ← DOM helpers
│   ├── format.js         ← formatters
│   └── storage.js        ← localStorage wrapper
├── services/
│   ├── api.js            ← HTTP client
│   └── interns.js        ← intern service
├── errors/
│   └── AppError.js
└── ui/
    ├── renderList.js
    └── renderForm.js
```

**`config.js`:**
```js
export const API_URL = 'https://api.ethiroli.in/v1';
export const STORAGE_KEYS = {
  TODOS: 'ethiroli.todos',
  USER: 'ethiroli.user',
};
```

**`errors/AppError.js`:**
```js
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(field, message) {
    super(message, 400);
    this.field = field;
  }
}
```

**`utils/storage.js`:**
```js
export const storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error('Storage write failed', err);
      return false;
    }
  },
  remove(key) { localStorage.removeItem(key); },
};
```

**`index.js`:**
```js
import { STORAGE_KEYS } from './config.js';
import { storage } from './utils/storage.js';
import { renderList } from './ui/renderList.js';
import { ValidationError } from './errors/AppError.js';

let todos = storage.get(STORAGE_KEYS.TODOS, []);

try {
  renderList(todos);
} catch (err) {
  if (err instanceof ValidationError) {
    console.error('Validation:', err.field, err.message);
  } else {
    console.error('Unexpected:', err);
  }
}
```

### 🧪 Quiz — Day 18

1. `export default` can appear how many times per module?
   a) 0 b) 1 c) Unlimited d) Only in Node
   ✅ **b) 1**

2. What does `finally` do?
   a) Runs only on error b) Runs only on success c) Always runs d) Never runs
   ✅ **c) Always runs**

3. `0 ?? 'default'` returns:
   a) `'default'` b) `0` c) `null` d) `NaN`
   ✅ **b) 0** — `??` only falls back on null/undefined.

4. To create a truly private class field:
   a) `_field` b) `private field` c) `#field` d) `static field`
   ✅ **c) `#field`**

5. Which correctly imports a named export?
   a) `import math from './math.js'` b) `import { add } from './math.js'` c) `require('./math')` d) `import add = require('math')`
   ✅ **b)**

### 🛠️ Task — Day 18
**Deliverable:** A refactored Todo app split into modules.

Restructure your Day 17 Todo app into:

```
day18/
├── index.html
├── styles.css
└── src/
    ├── index.js
    ├── config.js
    ├── errors.js
    ├── services/
    │   └── todoService.js
    ├── utils/
    │   ├── dom.js
    │   └── storage.js
    └── ui/
        ├── renderList.js
        ├── renderFilters.js
        └── bindEvents.js
```

Requirements:
1. Every file uses ES module `import`/`export` (no globals)
2. `errors.js` defines `AppError`, `ValidationError`, `NotFoundError`
3. `todoService.js` throws `ValidationError` for empty text and `NotFoundError` for unknown ids
4. `storage.js` wraps `localStorage` in `try/catch`
5. `index.js` wraps the bootstrap in `try/catch` and handles `AppError` subtypes differently
6. Use `??` and `?.` at least 4 times across the codebase
7. `<script type="module">` in HTML

**Rubric (10 pts):** 10+ modules 3 · No globals 2 · Custom errors used 2 · try/catch 2 · Modern operators 1

### ✅ Checkpoint
You can find any file in your project in under 10 seconds.

---

# 🟢 DAY 19 — Async JavaScript: Promises, async/await & fetch

**Course 07:** JavaScript Advanced | **Phase 2**

### 🎯 Learning Objectives
- Explain the event loop and the call stack
- Create and consume Promises correctly
- Use `async`/`await` and handle errors
- Fetch from real APIs with proper error handling
- Run requests in parallel with `Promise.all`

### 📘 Content

**19.1 Why async exists**

JavaScript runs on a **single thread**. If a 3-second network request blocked the thread, the entire page would freeze — no clicks, no scroll, no render.

Async lets you start a slow task, keep the UI responsive, and handle the result when it arrives.

**19.2 The event loop**

```
┌─────────────────────┐
│    CALL STACK       │  ← synchronous execution
│  (one thing at a   │
│   time)             │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐      ┌─────────────────────┐
│  WEB APIs / libuv   │─────▶│   TASK QUEUE        │
│  (timers, fetch,    │      │   (macrotasks)      │
│   DOM events)       │      │   setTimeout, I/O   │
└─────────────────────┘      └──────────┬──────────┘
                                        │
                             ┌──────────▼──────────┐
                             │  MICROTASK QUEUE    │
                             │  Promises, queue    │
                             │  Microtask          │
                             └──────────┬──────────┘
                                        │
                                        ▼
                             Event loop moves tasks
                             to the stack when empty
                             (microtasks first, ALWAYS)
```

**The classic demo:**

```js
console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve().then(() => console.log('3'));

console.log('4');

// Output: 1, 4, 3, 2
// Sync first (1, 4), then microtasks (3), then macrotasks (2)
```

**19.3 Promises**

A Promise represents a future value. It's in one of three states:

```
             ┌─────────────┐
             │   PENDING   │
             └──────┬──────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
  ┌──────────┐           ┌──────────┐
  │FULFILLED │           │ REJECTED │
  │ (value)  │           │ (reason) │
  └──────────┘           └──────────┘
```

**Creating:**
```js
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    const success = Math.random() > 0.5;
    if (success) resolve('Done!');
    else reject(new Error('Failed!'));
  }, 1000);
});
```

**Consuming:**
```js
promise
  .then(value => console.log('✅', value))
  .catch(err => console.error('❌', err.message))
  .finally(() => console.log('Done either way'));
```

**Chaining:**
```js
fetch('/api/user')
  .then(res => res.json())
  .then(user => fetch(`/api/posts?userId=${user.id}`))
  .then(res => res.json())
  .then(posts => console.log(posts))
  .catch(err => console.error(err));
```

Each `.then` receives the previous return value. If any step throws or rejects, execution jumps to the nearest `.catch`.

**19.4 Promisifying callbacks**

```js
// Callback style
function getDataCallback(id, cb) {
  setTimeout(() => cb(null, { id, name: 'Arun' }), 500);
}

// Promise style
function getData(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!id) return reject(new Error('id required'));
      resolve({ id, name: 'Arun' });
    }, 500);
  });
}

// Modern: util.promisify (Node)
import { promisify } from 'node:util';
const readFile = promisify(fs.readFile);
```

**19.5 `async` / `await`**

Syntactic sugar over Promises. Makes async code read like sync code.

```js
async function loadUser(id) {
  try {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const user = await res.json();
    return user;
  } catch (err) {
    console.error('Failed to load user:', err.message);
    throw err;
  }
}
```

**Key rules:**

| Rule | Note |
|---|---|
| `async` functions **always** return a Promise | Even `async function f() { return 1; }` → `Promise<1>` |
| `await` only works inside `async` functions or top-level modules | Top-level await is available in ES modules |
| `await` pauses that function, not the whole program | Other code keeps running |
| Wrap in `try/catch` for errors | Otherwise you get an unhandled rejection |
| `await` on a non-Promise wraps it in `Promise.resolve()` | `await 5` → `5` |

**Sequential vs parallel:**

```js
// ❌ Sequential — 3 seconds total
async function slow() {
  const a = await fetchA();  // 1s
  const b = await fetchB();  // 1s
  const c = await fetchC();  // 1s
  return [a, b, c];
}

// ✅ Parallel — 1 second total
async function fast() {
  const [a, b, c] = await Promise.all([fetchA(), fetchB(), fetchC()]);
  return [a, b, c];
}
```

**19.6 `Promise` combinators**

```js
// all — waits for ALL, rejects if ANY rejects
const [users, posts, comments] = await Promise.all([
  fetch('/api/users').then(r => r.json()),
  fetch('/api/posts').then(r => r.json()),
  fetch('/api/comments').then(r => r.json()),
]);

// allSettled — never rejects, gives you every result
const results = await Promise.allSettled([p1, p2, p3]);
results.forEach(r => {
  if (r.status === 'fulfilled') console.log('OK', r.value);
  else console.log('FAIL', r.reason);
});

// race — first to settle (resolve OR reject) wins
const fastest = await Promise.race([fetch('/a'), fetch('/b')]);

// any — first to RESOLVE (ignores rejections unless all fail)
const firstSuccess = await Promise.any([p1, p2, p3]);

// Timeout pattern with race
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), ms)
  );
  return Promise.race([promise, timeout]);
}

await withTimeout(fetch('/api/slow'), 5000);
```

**19.7 `fetch` — the HTTP client**

```js
const res = await fetch('/api/interns', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ name: 'Arun', program: 'FS45' }),
  credentials: 'include',   // send cookies
  signal: controller.signal, // for cancellation
});
```

**⚠️ `fetch` does NOT reject on HTTP errors:**

```js
// ❌ Bug — this "succeeds" even on 404/500
const res = await fetch('/api/missing');
const data = await res.json();   // throws on empty body

// ✅ Always check res.ok
const res = await fetch('/api/missing');
if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
const data = await res.json();
```

**Full-featured fetch wrapper:**

```js
// utils/api.js
export class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

const BASE_URL = 'https://api.ethiroli.in/v1';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Attach token if present
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, config);

  // Parse body once
  const contentType = res.headers.get('content-type') || '';
  const body = contentType.includes('application/json')
    ? await res.json().catch(() => null)
    : await res.text();

  if (!res.ok) {
    throw new ApiError(
      body?.message || `HTTP ${res.status}`,
      res.status,
      body
    );
  }

  return body;
}

export const api = {
  get:    (path, opts)       => request(path, { ...opts, method: 'GET' }),
  post:   (path, data, opts) => request(path, { ...opts, method: 'POST',   body: JSON.stringify(data) }),
  put:    (path, data, opts) => request(path, { ...opts, method: 'PUT',    body: JSON.stringify(data) }),
  patch:  (path, data, opts) => request(path, { ...opts, method: 'PATCH',  body: JSON.stringify(data) }),
  delete: (path, opts)       => request(path, { ...opts, method: 'DELETE' }),
};
```

**Using it:**
```js
import { api, ApiError } from './utils/api.js';

try {
  const interns = await api.get('/interns');
  render(interns);
} catch (err) {
  if (err instanceof ApiError) {
    if (err.status === 401) redirectToLogin();
    else if (err.status === 404) showEmpty();
    else showToast(err.message);
  } else {
    showToast('Network error');
  }
}
```

**19.8 Abort & cancellation**

```js
// Cancel a fetch
const controller = new AbortController();

fetch('/api/slow', { signal: controller.signal })
  .then(r => r.json())
  .catch(err => {
    if (err.name === 'AbortError') console.log('Cancelled');
    else throw err;
  });

// Cancel after 3s
setTimeout(() => controller.abort(), 3000);

// Cancel previous search when a new one starts
let currentController = null;

async function search(query) {
  currentController?.abort();     // cancel previous
  currentController = new AbortController();

  try {
    const res = await fetch(`/api/search?q=${query}`, {
      signal: currentController.signal,
    });
    return await res.json();
  } catch (err) {
    if (err.name === 'AbortError') return null;
    throw err;
  }
}
```

**19.9 Retry with exponential backoff**

```js
async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (attempt === retries) throw err;
      const delay = Math.min(1000 * 2 ** attempt, 10_000);
      console.warn(`Attempt ${attempt + 1} failed. Retrying in ${delay}ms`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
}
```

**19.10 Complete example — a GitHub user lookup**

```js
// github.js
import { api } from './utils/api.js';

export async function getGitHubUser(username) {
  const res = await fetch(`https://api.github.com/users/${username}`);

  if (res.status === 404) throw new Error(`User "${username}" not found`);
  if (res.status === 403) throw new Error('Rate limit exceeded');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  return res.json();
}

// main.js
const form  = document.querySelector('#form');
const input = document.querySelector('#username');
const output = document.querySelector('#output');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = input.value.trim();
  if (!username) return;

  output.innerHTML = '<p>Loading…</p>';

  try {
    const [user, repos] = await Promise.all([
      getGitHubUser(username),
      fetch(`https://api.github.com/users/${username}/repos?per_page=5`)
        .then(r => r.json()),
    ]);

    output.replaceChildren(buildUserCard(user, repos));
  } catch (err) {
    output.innerHTML = `<p class="error">${err.message}</p>`;
  }
});

function buildUserCard(user, repos) {
  const card = document.createElement('article');
  card.className = 'user-card';

  const img = document.createElement('img');
  img.src = user.avatar_url;
  img.alt = `${user.login} avatar`;
  img.width = 100;

  const h2 = document.createElement('h2');
  h2.textContent = user.name || user.login;

  const bio = document.createElement('p');
  bio.textContent = user.bio || 'No bio';

  const list = document.createElement('ul');
  repos.forEach(r => {
    const li = document.createElement('li');
    li.textContent = r.name;
    list.append(li);
  });

  card.append(img, h2, bio, list);
  return card;
}
```

### 🧪 Quiz — Day 19

1. `console.log` order for: `console.log('A'); setTimeout(()=>console.log('B'),0); Promise.resolve().then(()=>console.log('C')); console.log('D');`
   a) A B C D b) A D C B c) A D B C d) A C D B
   ✅ **b) A D C B** — sync, then microtasks, then macrotasks.

2. What does `fetch()` return?
   a) The response body b) A Promise that resolves to a Response c) JSON d) `undefined`
   ✅ **b)**

3. `fetch` rejects on a 404 response?
   a) Yes b) No — you must check `res.ok` c) Only in Node d) Only with `catch`
   ✅ **b) No**

4. Which runs requests in parallel?
   a) Sequential `await` b) `Promise.all([...])` c) Nested `.then()` d) `setTimeout`
   ✅ **b) `Promise.all([...])`**

5. `async function f() { return 1; }` — what does `f()` return?
   a) `1` b) `Promise<1>` c) `undefined` d) `async`
   ✅ **b) `Promise<1>`**

### 🛠️ Task — Day 19
**Deliverable:** `day19/` — a "GitHub Explorer" app + `utils/api.js`

Build an app that:
1. Takes a GitHub username input
2. Fetches the user and their top 5 repos **in parallel** with `Promise.all`
3. Shows loading, success, empty (404), rate-limit (403), and network-error states
4. Uses your own **`utils/api.js`** wrapper with an `ApiError` class
5. Implements **`AbortController`** so typing a new search cancels the previous request
6. Implements `fetchWithRetry` with exponential backoff (max 3 retries)
7. Implements a `withTimeout(promise, ms)` helper and applies it (5s)
8. Uses `Promise.allSettled` to fetch both user + repos even if repos fail
9. Persists the last searched username to `localStorage`

**Rubric (10 pts):** Parallel fetch 2 · 5 states handled 2 · api.js wrapper + ApiError 2 · AbortController 2 · Retry + timeout 1 · localStorage 1

### ✅ Checkpoint
You can fetch from any API and handle every failure mode.

---

# 🟢 DAY 20 — React Intro, Vite, JSX & Components

**Course 08:** React.js | **Phase 2**

### 🎯 Learning Objectives
- Scaffold a React app with Vite
- Write JSX and understand how it compiles
- Create functional components
- Understand the React rendering model
- Use fragments and conditional rendering

### 📘 Content

**20.1 Why React?**

Before React, building a UI meant manually syncing the DOM with your data:

```js
// Vanilla — you write the sync logic
function updateUI(state) {
  document.querySelector('#count').textContent = state.count;
  document.querySelector('#list').innerHTML = state.items
    .map(i => `<li>${i}</li>`).join('');
}
```

React inverts this: **you describe what the UI should look like for a given state**, and React figures out what to change.

```jsx
function App() {
  const [state, setState] = useState({ count: 0, items: [] });
  return (
    <>
      <div>{state.count}</div>
      <ul>{state.items.map(i => <li>{i}</li>)}</ul>
    </>
  );
}
```

**Key ideas:**
- **Declarative** — describe the result, not the steps
- **Component-based** — UI is composed of reusable pieces
- **Unidirectional data flow** — data flows down via props
- **Virtual DOM** — React diffs a lightweight tree and applies minimal real DOM changes

**20.2 Scaffolding with Vite**

```bash
npm create vite@latest ethiroli-client -- --template react
cd ethiroli-client
npm install
npm run dev
```

Options: `react`, `react-ts`, `vue`, `svelte`, `vanilla`, `vanilla-ts`.

Generated structure:

```
ethiroli-client/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── vite.svg
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── App.css
    ├── index.css
    └── assets/
```

**`index.html`:**
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ethiroli LMS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

**`main.jsx`:**
```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**What each line does:**
- `createRoot` — creates the React root attached to the `<div id="root">`
- `.render(<App />)` — tells React to render `<App />` into the DOM
- `<React.StrictMode>` — a development-only wrapper that double-invokes effects, renders, and some lifecycle methods to surface bugs. **Removed in production.**
- `import './index.css'` — Vite bundles the CSS

**Vite commands:**

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with HMR (hot module replacement) |
| `npm run build` | Production bundle into `dist/` |
| `npm run preview` | Serve the built bundle locally |
| `npm run lint` | ESLint |

**20.3 JSX**

JSX is HTML-like syntax that compiles to `React.createElement` calls.

```jsx
const element = <h1 className="title">Hello</h1>;

// Compiles to:
const element = React.createElement(
  'h1',
  { className: 'title' },
  'Hello'
);
```

**JSX rules:**

**1. Return a single root — use a Fragment `<>...</>` for multiples:**
```jsx
// ❌ Adjacent elements
return (
  <h1>Title</h1>
  <p>Text</p>
);

// ✅ Fragment
return (
  <>
    <h1>Title</h1>
    <p>Text</p>
  </>
);

// ✅ Wrapper
return (
  <div className="wrapper">
    <h1>Title</h1>
    <p>Text</p>
  </div>
);
```

Fragments don't create a DOM node — `<>...</>` is shorthand for `<React.Fragment>`.

**2. `className`, not `class`; `htmlFor`, not `for`:**
```jsx
<label htmlFor="email">Email</label>
<input id="email" className="input" />
```

**3. Self-close void elements:**
```jsx
<img src="x.png" alt="" />
<input type="text" />
<br />
```

**4. Embed JavaScript with `{}`:**
```jsx
const name = 'Arun';
const items = ['a', 'b', 'c'];

return (
  <>
    <h1>Hello, {name}</h1>
    <p>{2 + 3}</p>
    <p>{name.toUpperCase()}</p>
    <p>{items.length} items</p>
  </>
);
```

**5. Expressions only — statements are not allowed:**
```jsx
// ❌
<p>{ if (x) { return 'yes' } }</p>

// ✅ Ternary
<p>{x ? 'yes' : 'no'}</p>

// ✅ And
<p>{x && 'yes'}</p>

// ✅ IIFE for complex logic
<p>{(() => {
  if (x > 10) return 'Big';
  if (x > 5) return 'Medium';
  return 'Small';
})()}</p>
```

**6. Comments:**
```jsx
{/* This is a JSX comment */}
```

**7. Inline styles are objects:**
```jsx
<div style={{ backgroundColor: 'red', fontSize: '16px' }}>
```
Note the **double braces** — the outer `{}` is JSX, the inner `{}` is the object. Properties are camelCase (`backgroundColor`, not `background-color`).

**8. Boolean props:**
```jsx
<input disabled />               {/* true */}
<input disabled={true} />        {/* true */}
<input disabled={false} />       {/* false — attribute omitted */}
```

**9. `null`, `undefined`, `false`, `true` render nothing:**
```jsx
<p>{null}</p>         {/* renders nothing */}
<p>{undefined}</p>    {/* renders nothing */}
<p>{false}</p>        {/* renders nothing */}
<p>{0}</p>            {/* renders "0" — careful! */}
<p>{''}</p>           {/* renders nothing */}
```

**Watch out for the `0` pitfall:**
```jsx
// ❌ Renders "0" when items is empty
{items.length && <List items={items} />}

// ✅ Cast to boolean
{items.length > 0 && <List items={items} />}
{!!items.length && <List items={items} />}
```

**20.4 Your first component**

```jsx
function Welcome() {
  return (
    <div className="welcome">
      <h1>Welcome to Ethiroli</h1>
      <p>Your internship starts here.</p>
    </div>
  );
}

export default Welcome;
```

**Rules:**
- Component names **must** start with a capital letter — `<Welcome />` is a component, `<welcome />` is treated as an HTML tag
- Must return JSX or `null`
- Must be a pure function of its props (no side effects during render)

**Using it:**
```jsx
import Welcome from './Welcome.jsx';

function App() {
  return (
    <main>
      <Welcome />
    </main>
  );
}
```

**20.5 Component organisation**

```
src/
├── main.jsx
├── App.jsx
├── components/
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   └── Input.jsx
│   ├── layout/
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   └── Footer.jsx
│   └── intern/
│       ├── InternCard.jsx
│       └── InternList.jsx
├── pages/
│   ├── Dashboard.jsx
│   └── Login.jsx
└── hooks/
    └── useInterns.js
```

**Rules of thumb:**
- One component per file
- File name matches component name (`Button.jsx`)
- `ui/` for generic components, feature folders for domain components
- `pages/` for route-level components
- `hooks/` for custom hooks

**20.6 Conditional rendering**

```jsx
function Status({ user }) {
  // 1. Early return
  if (!user) return <p>Please log in.</p>;
  if (user.banned) return <p>Account suspended.</p>;

  // 2. Ternary
  return (
    <div>
      <h2>{user.isAdmin ? 'Admin Panel' : 'Dashboard'}</h2>
      {user.isAdmin ? <AdminTools /> : <UserTools />}
    </div>
  );
}

// 3. Logical AND (guarded)
function Notifications({ notifications }) {
  return (
    <div>
      {notifications.length > 0 && (
        <ul>
          {notifications.map(n => <li key={n.id}>{n.text}</li>)}
        </ul>
      )}
    </div>
  );
}

// 4. Switch via object map — clean for multiple states
const VIEWS = {
  loading: <Spinner />,
  error: <ErrorView />,
  empty: <EmptyState />,
  ready: <DataView />,
};

function Panel({ status }) {
  return <div>{VIEWS[status] ?? <p>Unknown state</p>}</div>;
}
```

**20.7 Fragments**

```jsx
// Short syntax — no key needed
return (
  <>
    <Header />
    <Main />
    <Footer />
  </>
);

// Long syntax — supports key (needed when mapping)
import { Fragment } from 'react';

function List({ items }) {
  return items.map(item => (
    <Fragment key={item.id}>
      <dt>{item.term}</dt>
      <dd>{item.definition}</dd>
    </Fragment>
  ));
}
```

**20.8 Your first real app**

```jsx
// App.jsx
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import InternList from './components/intern/InternList.jsx';

const interns = [
  { id: 1, name: 'Arun',    program: 'FS45',  progress: 91 },
  { id: 2, name: 'Divya',   program: 'FS45',  progress: 62 },
  { id: 3, name: 'Karthik', program: 'WEB30', progress: 90 },
  { id: 4, name: 'Meena',   program: 'FS45',  progress: 98 },
];

export default function App() {
  return (
    <>
      <Header title="Ethiroli LMS" />
      <main className="container">
        <h2>Interns</h2>
        <InternList interns={interns} />
      </main>
      <Footer />
    </>
  );
}
```

```jsx
// components/layout/Header.jsx
export default function Header({ title }) {
  return (
    <header className="app-header">
      <h1>{title}</h1>
      <nav>
        <a href="/">Dashboard</a>
        <a href="/interns">Interns</a>
      </nav>
    </header>
  );
}
```

```jsx
// components/intern/InternList.jsx
import InternCard from './InternCard.jsx';

export default function InternList({ interns }) {
  if (!interns?.length) {
    return <p className="empty">No interns to display.</p>;
  }

  return (
    <ul className="intern-list">
      {interns.map(intern => (
        <InternCard key={intern.id} intern={intern} />
      ))}
    </ul>
  );
}
```

```jsx
// components/intern/InternCard.jsx
export default function InternCard({ intern }) {
  const { name, program, progress } = intern;

  const status =
    progress >= 90 ? 'excellent' :
    progress >= 70 ? 'on-track' :
    progress >= 50 ? 'needs-push' : 'at-risk';

  return (
    <li className="intern-card">
      <h3>{name}</h3>
      <p className="program">{program}</p>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <span className={`status status-${status}`}>{progress}%</span>
    </li>
  );
}
```

**20.9 React DevTools**

Install the **React Developer Tools** browser extension. It adds:
- **Components tab** — inspect the tree, see props/state/hooks live
- **Profiler** — find re-render hotspots

This is the single most useful React debugging tool — install it today.

**20.10 Common beginner mistakes**

| Mistake | Fix |
|---|---|
| `<Welcome />` written as `<welcome />` | Capitalise component names |
| `class` in JSX | Use `className` |
| Multiple roots in `return` | Wrap in `<>...</>` or an element |
| `style="color: red"` | Use `style={{ color: 'red' }}` |
| Mutating props | Never — treat props as read-only |
| Defining components inside components | Move them to top level |
| Using `index` as `key` in dynamic lists | Use a stable id |

### 🧪 Quiz — Day 20

1. What does JSX compile to?
   a) HTML b) `React.createElement` calls c) Strings d) CSS
   ✅ **b)**

2. Correct way to write `class` in JSX?
   a) `class="x"` b) `className="x"` c) `classname="x"` d) `cls="x"`
   ✅ **b)**

3. `{items.length && <List />}` renders what when `items` is empty?
   a) Nothing b) `0` c) `false` d) An error
   ✅ **b) `0`** — the falsy `0` is rendered. Use `items.length > 0` instead.

4. Why does a component name need a capital letter?
   a) Style b) React uses the capital to distinguish components from HTML tags c) JS requires it d) Vite requires it
   ✅ **b)**

5. What is `<React.StrictMode>`?
   a) A syntax check b) A dev-only wrapper that double-invokes to surface bugs c) A production optimiser d) A router
   ✅ **b)**

### 🛠️ Task — Day 20
**Deliverable:** `ethiroli-client/` — a working Vite + React app.

1. Scaffold with `npm create vite@latest ethiroli-client -- --template react`
2. Delete the boilerplate in `App.jsx` and `App.css`
3. Build these components in **separate files**:
   - `Header.jsx` — logo + nav
   - `Footer.jsx`
   - `InternList.jsx` — takes `interns` prop
   - `InternCard.jsx` — takes `intern` prop, shows name / program / progress bar / status badge
   - `StatCard.jsx` — a reusable stat card (`label`, `value`, `trend`)
   - `EmptyState.jsx` — shown when a list is empty
4. `App.jsx` renders: Header → 4 StatCards → InternList → Footer
5. Status colour logic lives in `InternCard.jsx`
6. Zero `console.error` in the browser console
7. Add a **conditional**: if `interns.length === 0`, render `<EmptyState />`

**Commit** with message `day20: react scaffold + component library`.

**Rubric (10 pts):** Scaffold correct 1 · 6 components in separate files 4 · Props used correctly 2 · Conditional rendering 2 · No console errors 1

### ✅ Checkpoint
You can create a new component, import it, and pass it data in under 2 minutes.

---

# 🟢 DAY 21 — React Props & Composition

**Course 08:** React.js | **Phase 2**

### 🎯 Learning Objectives
- Pass and validate props
- Use `children` and composition patterns
- Build reusable UI components
- Understand one-way data flow and callbacks
- Apply compound component patterns

### 📘 Content

**21.1 Props basics**

Props are how you pass data from parent to child. They're **read-only** — a child must never mutate them.

```jsx
function Greeting({ name, role = 'Intern' }) {
  return <p>Hello {name}, you are an {role}.</p>;
}

// Usage
<Greeting name="Arun" />
<Greeting name="Divya" role="Mentor" />
```

**Passing all shapes of data:**

```jsx
<Card
  title="Intern"                 // string
  count={42}                     // number
  active={true}                  // boolean
  onClick={() => alert('hi')}    // function
  tags={['js', 'react']}         // array
  author={{ name: 'Arun' }}      // object
  header={<h2>Custom</h2>}       // JSX element
  children={<p>Body</p>}         // or as nested
/>
```

**Destructuring in the signature vs the body:**

```jsx
// ✅ Preferred — self-documenting
function Card({ title, count, onClick }) {
  return <div onClick={onClick}>{title}: {count}</div>;
}

// Also fine
function Card(props) {
  const { title, count, onClick } = props;
  return <div onClick={onClick}>{title}: {count}</div>;
}

// Rest for forwarding
function Input({ label, error, ...rest }) {
  return (
    <label>
      {label}
      <input {...rest} aria-invalid={!!error} />
      {error && <span className="error">{error}</span>}
    </label>
  );
}

<Input label="Email" type="email" required placeholder="you@x.com" />
// `type`, `required`, `placeholder` are forwarded to <input>
```

**21.2 Default props & prop types**

```jsx
// Default values via destructuring (modern, preferred)
function Button({ variant = 'primary', size = 'md', disabled = false, children }) {
  return (
    <button className={`btn btn-${variant} btn-${size}`} disabled={disabled}>
      {children}
    </button>
  );
}

// Legacy defaultProps — avoid in new code
Button.defaultProps = { variant: 'primary' };
```

**Runtime prop validation (dev only) — `prop-types`:**

```bash
npm install prop-types
```

```jsx
import PropTypes from 'prop-types';

function InternCard({ intern, onSelect, showProgress }) {
  return (
    <article onClick={() => onSelect(intern.id)}>
      <h3>{intern.name}</h3>
      {showProgress && <ProgressBar value={intern.progress} />}
    </article>
  );
}

InternCard.propTypes = {
  intern: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    program: PropTypes.string,
    progress: PropTypes.number,
  }).isRequired,
  onSelect: PropTypes.func,
  showProgress: PropTypes.bool,
};
```

**PropTypes cheatsheet:**

```js
PropTypes.string, .number, .bool, .array, .object, .func, .symbol
PropTypes.node          // anything renderable (string, number, element, array, null)
PropTypes.element       // a single JSX element
PropTypes.elementType   // a component type
PropTypes.oneOf(['sm', 'md', 'lg'])
PropTypes.oneOfType([PropTypes.string, PropTypes.number])
PropTypes.arrayOf(PropTypes.string)
PropTypes.shape({ name: PropTypes.string, age: PropTypes.number })
PropTypes.exact({ name: PropTypes.string })   // no extra keys allowed
PropTypes.instanceOf(Date)
PropTypes.isRequired                          // chain onto any of the above
```

If you use **TypeScript**, you get this for free:
```tsx
type InternCardProps = {
  intern: { id: number; name: string; progress?: number };
  onSelect?: (id: number) => void;
  showProgress?: boolean;
};

function InternCard({ intern, onSelect, showProgress = false }: InternCardProps) { ... }
```

**21.3 `children`**

Whatever you nest between a component's tags becomes `props.children`.

```jsx
function Card({ title, children }) {
  return (
    <section className="card">
      <header className="card-header">
        <h3>{title}</h3>
      </header>
      <div className="card-body">{children}</div>
    </section>
  );
}

// Usage
<Card title="Intern Details">
  <p>Name: Arun</p>
  <p>Program: FS45</p>
  <button>View</button>
</Card>
```

`children` can be anything: a string, a number, JSX, an array, a function (render prop), or `null`.

**Multiple "slots":**

```jsx
function Layout({ header, sidebar, children }) {
  return (
    <div className="layout">
      <header>{header}</header>
      <aside>{sidebar}</aside>
      <main>{children}</main>
    </div>
  );
}

<Layout
  header={<h1>Dashboard</h1>}
  sidebar={<Nav />}
>
  <p>Main content here.</p>
</Layout>
```

This is more flexible than passing raw data — the parent controls how each region renders.

**21.4 Composition**

**❌ Inheritance hell — don't do this:**

```jsx
class BaseCard extends React.Component {}
class InternCard extends BaseCard {}
class MentorCard extends BaseCard {}
class AdminCard extends InternCard {}
```

**✅ Composition — children, props, and slots:**

```jsx
function Panel({ children, variant = 'default' }) {
  return <div className={`panel panel-${variant}`}>{children}</div>;
}

function PanelHeader({ children }) {
  return <div className="panel-header">{children}</div>;
}

function PanelBody({ children }) {
  return <div className="panel-body">{children}</div>;
}

function PanelFooter({ children }) {
  return <div className="panel-footer">{children}</div>;
}
```

Use them flexibly:

```jsx
<Panel variant="info">
  <PanelHeader>
    <h2>Intern Progress</h2>
    <button>Refresh</button>
  </PanelHeader>
  <PanelBody>
    <ProgressChart data={data} />
  </PanelBody>
  <PanelFooter>
    <a href="/details">See all →</a>
  </PanelFooter>
</Panel>
```

Now `<Panel>` works for any content — a chart, a table, a form — without ever changing its code.

**21.5 Specialisation via props**

```jsx
function Button({ variant = 'primary', size = 'md', icon, children, ...rest }) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      {...rest}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
  );
}

// Specialised wrappers — full flexibility, zero duplication
function PrimaryButton(props) { return <Button variant="primary" {...props} />; }
function DangerButton(props)  { return <Button variant="danger"  {...props} />; }
function IconButton({ icon, ...rest }) {
  return <Button variant="ghost" size="sm" icon={icon} {...rest} />;
}
```

**21.6 One-way data flow & callbacks**

Data flows **down** via props; events flow **up** via callback props.

```jsx
function InternList({ interns, onDelete, onToggle }) {
  return (
    <ul>
      {interns.map(i => (
        <li key={i.id}>
          <span>{i.name}</span>
          <button onClick={() => onToggle(i.id)}>Toggle</button>
          <button onClick={() => onDelete(i.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
```

The child doesn't know *how* the deletion happens — it only reports "the user clicked delete on id 5." The parent owns the state and decides what to do.

**The callback must call, not invoke at render:**

```jsx
// ❌ Calls handleDelete immediately during render
<button onClick={handleDelete(id)}>Delete</button>

// ✅ Wraps in an arrow — fires on click
<button onClick={() => handleDelete(id)}>Delete</button>

// ✅ Or use .bind
<button onClick={handleDelete.bind(null, id)}>Delete</button>
```

**21.7 Controlled vs uncontrolled components**

```jsx
// Controlled — parent owns the value
function ControlledInput({ value, onChange }) {
  return <input value={value} onChange={e => onChange(e.target.value)} />;
}

// Uncontrolled — the DOM owns it, read via ref
function UncontrolledInput() {
  const ref = useRef(null);
  const submit = () => console.log(ref.current.value);
  return (
    <>
      <input ref={ref} defaultValue="initial" />
      <button onClick={submit}>Read</button>
    </>
  );
}
```

Controlled is the React default — you'll use it constantly.

**21.8 Prop drilling and why `children` solves it**

```jsx
// ❌ Drilling `user` through 3 components that don't need it
<Layout user={user}>
  <Sidebar user={user}>
    <UserMenu user={user} />
  </Sidebar>
</Layout>
```

```jsx
// ✅ Pass the composed element directly
function App({ user }) {
  return (
    <Layout
      sidebar={
        <Sidebar>
          <UserMenu user={user} />
        </Sidebar>
      }
    />
  );
}
```

`Layout` and `Sidebar` never see `user`. When you have many values to pass, use **Context** (Day 25).

**21.9 A complete reusable component library**

```jsx
// components/ui/Button.jsx
export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`btn btn-${variant} btn-${size}`}
      aria-busy={loading}
      {...rest}
    >
      {loading && <span className="spinner" aria-hidden="true" />}
      {children}
    </button>
  );
}
```

```jsx
// components/ui/Card.jsx
export default function Card({ title, subtitle, footer, children, className = '' }) {
  return (
    <article className={`card ${className}`}>
      {(title || subtitle) && (
        <header className="card-header">
          {title && <h3>{title}</h3>}
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </header>
      )}
      <div className="card-body">{children}</div>
      {footer && <footer className="card-footer">{footer}</footer>}
    </article>
  );
}
```

```jsx
// components/ui/StatCard.jsx
export default function StatCard({ label, value, delta, icon, trend = 'neutral' }) {
  const arrow = trend === 'up' ? '▲' : trend === 'down' ? '▼' : '–';
  return (
    <Card className="stat-card">
      <div className="stat-row">
        {icon && <span className="stat-icon">{icon}</span>}
        <div>
          <p className="stat-label">{label}</p>
          <p className="stat-value">{value}</p>
          {delta != null && (
            <p className={`stat-delta stat-${trend}`}>
              {arrow} {delta}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
```

Usage:

```jsx
<div className="stats-grid">
  <StatCard label="Total Interns" value={48} delta="+3" trend="up" icon="👥" />
  <StatCard label="Active Tasks"  value={126} delta="-8" trend="down" icon="✅" />
  <StatCard label="Avg Progress"  value="78%" icon="📈" />
</div>
```

### 🧪 Quiz — Day 21

1. Can a child component mutate its props?
   a) Yes b) No — props are read-only c) Only objects d) Only in dev
   ✅ **b) No**

2. What is `props.children`?
   a) Always an array b) Whatever is nested between the component's opening and closing tags c) The child component's props d) A reserved prop
   ✅ **b)**

3. `<button onClick={handleDelete(id)}>` — what's wrong?
   a) Nothing b) `handleDelete` runs during render instead of on click c) `id` is undefined d) It won't compile
   ✅ **b)**

4. Correct way to pass all extra props to an `<input>`?
   a) `<input {...rest} />` b) `<input props={rest} />` c) `<input rest />` d) Not possible
   ✅ **a) `<input {...rest} />`**

5. Composition vs inheritance — which does React recommend?
   a) Inheritance b) Composition c) Both equally d) Neither
   ✅ **b) Composition**

### 🛠️ Task — Day 21
**Deliverable:** `components/ui/` library with 8 reusable components.

Build and document each with JSDoc-style comments and PropTypes:

1. **`Button`** — variants: primary/secondary/ghost/danger; sizes: sm/md/lg; `loading`, `disabled`, `type`, forwards `...rest`
2. **`Input`** — `label`, `error`, `hint`, forwards `...rest`, accessible `aria-invalid`/`aria-describedby`
3. **`Card`** — `title`, `subtitle`, `footer`, `children`
4. **`Badge`** — `variant` (success/warning/danger/info), `children`
5. **`Avatar`** — `src`, `alt`, `size`, fallback initials
6. **`Modal`** — `isOpen`, `onClose`, `title`, `children`, `footer`; close on Escape and backdrop click
7. **`Tabs`** — `tabs` array + `activeTab` + `onChange`; uses composition
8. **`EmptyState`** — `icon`, `title`, `description`, `action` (a JSX button slot)

Then build a `ComponentShowcase.jsx` page that renders every variant of every component.

**Commit** with message `day21: reusable UI component library`.

**Rubric (10 pts):** 8 components 4 · All variants demonstrated 2 · PropType validation 1 · Accessibility (aria, keyboard) 2 · Showcase page 1

### ✅ Checkpoint
Your UI components can be reused in any future project without changes.

---

# 🟢 DAY 22 — React State & `useState`

**Course 08:** React.js | **Phase 2**

### 🎯 Learning Objectives
- Manage component state with `useState`
- Update state immutably
- Understand batching and functional updates
- Lift state up when shared
- Handle object and array state correctly

### 📘 Content

**22.1 Why state exists**

Props are read-only. When a component needs to remember something that changes over time — a form value, a toggle, a fetched list — that's **state**.

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
```

**What `useState(0)` returns:**
- `count` — the current value
- `setCount` — a function to update it
- `0` — the initial value (used only on the first render)

**Key rules:**

| Rule | Why |
|---|---|
| Only call hooks at the **top level** | React relies on call order |
| Never call hooks inside loops, conditions, or nested functions | Would break the order |
| Call hooks inside React function components or custom hooks | Not in plain JS functions |
| `setState` is async — the variable updates on the **next** render | See §22.4 |

**22.2 Multiple state values**

```jsx
function RegistrationForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(18);
  const [agree, setAgree] = useState(false);

  return (
    <form>
      <input value={name} onChange={e => setName(e.target.value)} />
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <input type="number" value={age} onChange={e => setAge(Number(e.target.value))} />
      <label>
        <input type="checkbox" checked={agree}
               onChange={e => setAgree(e.target.checked)} />
        I agree
      </label>
    </form>
  );
}
```

**One object vs many `useState` calls:**

```jsx
// ❌ Object state for unrelated fields — extra re-renders, more code
const [form, setForm] = useState({ name: '', email: '', age: 18 });

// ✅ Separate — each updates independently
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [age, setAge] = useState(18);

// ✅ Object state IS good when fields update together or form many
const [address, setAddress] = useState({
  street: '', city: '', zip: '',
});
```

Rule of thumb: if fields always change together, group them. Otherwise split them.

**22.3 Updating state — always immutably**

**Primitives (replace the value):**
```jsx
setCount(5);
setName('Arun');
setActive(true);
```

**Objects (spread + override):**
```jsx
const [user, setUser] = useState({ name: 'Arun', age: 22 });

// ❌ Mutating — React won't detect the change
user.name = 'Divya';
setUser(user);

// ✅ New object
setUser({ ...user, name: 'Divya' });

// ✅ Functional form
setUser(prev => ({ ...prev, name: 'Divya' }));

// ✅ Nested (spread each level)
setUser(prev => ({
  ...prev,
  address: { ...prev.address, city: 'Chennai' },
}));
```

**Arrays:**
```jsx
const [items, setItems] = useState([]);

// Add (end)
setItems(prev => [...prev, newItem]);

// Add (start)
setItems(prev => [newItem, ...prev]);

// Insert at index
setItems(prev => [
  ...prev.slice(0, index),
  newItem,
  ...prev.slice(index),
]);

// Remove by id
setItems(prev => prev.filter(i => i.id !== id));

// Update one
setItems(prev =>
  prev.map(i => i.id === id ? { ...i, done: true } : i)
);

// Replace
setItems(newArray);

// Clear
setItems([]);
```

**Never call mutating methods on state:**
```jsx
// ❌ None of these trigger a re-render
items.push(x);      setItems(items);
items.pop();        setItems(items);
items.sort();       setItems(items);
items.splice(0,1);  setItems(items);
items[0] = 'new';   setItems(items);

// ✅
setItems(prev => [...prev, x]);
setItems(prev => prev.slice(0, -1));
setItems(prev => [...prev].sort());
setItems(prev => prev.toSpliced(0, 1));
setItems(prev => prev.with(0, 'new'));
```

**22.4 State updates are asynchronous**

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    console.log(count);   // ❌ still the old value!
  }
  // ...
}
```

The `count` variable is a **snapshot** from the current render. Calling `setCount` schedules a re-render with a new value — but doesn't change the variable you're holding.

**Functional updates — use when the new value depends on the old:**

```jsx
// ❌ Three clicks → only +1
function bad() {
  setCount(count + 1);
  setCount(count + 1);
  setCount(count + 1);
}

// ✅ Three clicks → +3
function good() {
  setCount(prev => prev + 1);
  setCount(prev => prev + 1);
  setCount(prev => prev + 1);
}
```

**Batching (React 18+):**
```jsx
function handleClick() {
  setName('Arun');
  setAge(22);
  setActive(true);
  // Only ONE re-render, not three
}
```

React batches all updates within the same event handler.

**22.5 Re-render triggers**

A component re-renders when:
1. Its state changes (`setState` with a different value)
2. Its parent re-renders
3. Its context value changes

**Bail out of a re-render:**
```jsx
// React compares with Object.is — same value → no re-render
setCount(5);
setCount(5);   // no re-render

// ⚠️ But a new object is ALWAYS different
setUser({ name: 'Arun' });   // re-renders even if the data is identical
```

**22.6 Lazy initial state**

When the initial value is expensive, pass a **function** — it runs only on the first render.

```jsx
// ❌ readFromLocalStorage() runs on every render
const [data, setData] = useState(readFromLocalStorage());

// ✅ Runs once
const [data, setData] = useState(() => readFromLocalStorage());

// ✅ Also fine for a simple case
const [items, setItems] = useState(() =>
  Array.from({ length: 1000 }, (_, i) => ({ id: i }))
);
```

**22.7 Lifting state up**

When two siblings need the same state, move it to their **closest common parent**.

```jsx
// ❌ Siblings can't share — the filter is in one, the list in the other
function Filter() {
  const [query, setQuery] = useState('');
  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
function List() {
  // no access to query 😢
  return <ul>…</ul>;
}

// ✅ Lift to the parent
function InternPage() {
  const [query, setQuery] = useState('');
  const [interns] = useState([/* … */]);

  const filtered = interns.filter(i =>
    i.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <SearchBar value={query} onChange={setQuery} />
      <InternList interns={filtered} />
    </>
  );
}

function SearchBar({ value, onChange }) {
  return <input value={value} onChange={e => onChange(e.target.value)} />;
}
```

**The pattern:** state lives in the parent; children receive the value + a setter via props.

**22.8 Derived state — don't store what you can compute**

```jsx
// ❌ Redundant state — must be kept in sync manually
const [items, setItems] = useState([]);
const [count, setCount] = useState(0);
// every add/remove must update both 😱

// ✅ Derive it
const [items, setItems] = useState([]);
const count = items.length;

// ❌ Also redundant
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [fullName, setFullName] = useState('');
// who sets fullName? 😬

// ✅ Derive
const fullName = `${firstName} ${lastName}`.trim();
```

**Only use state for values that:**
1. Change over time
2. Cannot be computed from existing state or props

**22.9 A complete example — Todo app in React**

```jsx
import { useState } from 'react';

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');   // all | active | completed

  const addTodo = () => {
    const text = input.trim();
    if (!text) return;
    setTodos(prev => [
      ...prev,
      { id: crypto.randomUUID(), text, done: false },
    ]);
    setInput('');
  };

  const toggleTodo = (id) =>
    setTodos(prev =>
      prev.map(t => t.id === id ? { ...t, done: !t.done } : t)
    );

  const deleteTodo = (id) =>
    setTodos(prev => prev.filter(t => t.id !== id));

  const clearCompleted = () =>
    setTodos(prev => prev.filter(t => !t.done));

  // Derived — not state
  const visibleTodos = todos.filter(t => {
    if (filter === 'active') return !t.done;
    if (filter === 'completed') return t.done;
    return true;
  });
  const remaining = todos.filter(t => !t.done).length;

  return (
    <div className="todo-app">
      <h1>Todo</h1>

      <form onSubmit={e => { e.preventDefault(); addTodo(); }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="What needs doing?"
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id} className={todo.done ? 'done' : ''}>
            <label>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
              />
              <span>{todo.text}</span>
            </label>
            <button onClick={() => deleteTodo(todo.id)}>✕</button>
          </li>
        ))}
      </ul>

      <footer>
        <span>{remaining} item{remaining !== 1 ? 's' : ''} left</span>
        <div className="filters">
          {['all', 'active', 'completed'].map(f => (
            <button
              key={f}
              className={filter === f ? 'active' : ''}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <button onClick={clearCompleted}>Clear completed</button>
      </footer>
    </div>
  );
}
```

Everything you learned in Days 15–17 now happens *declaratively*: no DOM queries, no `innerHTML`, no manual render calls.

### 🧪 Quiz — Day 22

1. `setCount(count + 1)` called twice in one handler:
   a) +2 b) +1 c) +0 d) Error
   ✅ **b) +1** — `count` is the same snapshot both times. Use `setCount(prev => prev + 1)` for +2.

2. Which correctly adds to an array state?
   a) `items.push(x); setItems(items);` b) `setItems([...items, x]);` c) `setItems(items.push(x));` d) `setItems(items + x);`
   ✅ **b)**

3. Hooks must be called:
   a) Anywhere b) Only at the top level of a component or custom hook c) Inside loops d) Inside `if` blocks
   ✅ **b)**

4. How do you make a lazy initial state?
   a) `useState(expensive())` b) `useState(() => expensive())` c) `useState(expensive)` d) `useState(expensive, true)`
   ✅ **b)**

5. Two sibling components need the same value. What do you do?
   a) Duplicate the state b) Lift it to their common parent c) Use globals d) Use `localStorage`
   ✅ **b)**

### 🛠️ Task — Day 22
**Deliverable:** `ethiroli-client/src/pages/TodoPage.jsx` + a second app `InternTracker.jsx`.

**Part A — Todo:** Port your Day 17 vanilla Todo to React. All logic must use `useState`; no direct DOM access. Add:
- A filter (all / active / completed) — derived, not state
- A "remaining" counter — derived
- "Clear completed"
- 3 updates batched in one handler — prove with a counter that only one re-render happens (check React DevTools)

**Part B — InternTracker:** Build an intern CRUD page:
- State: `interns` (array of objects), `search`, `sortBy`
- Add intern form (name, program, progress)
- Delete button per row
- Inline edit of progress (number input)
- Search input (derived filter, case-insensitive)
- Sort dropdown (name / progress)
- Stats: total count, average progress, at-risk count — all **derived**

**Constraints:**
- Never mutate state — always return new arrays/objects
- All derived values computed during render, never stored in state
- Use the functional `setState(prev => ...)` form for every update that depends on previous state

**Rubric (10 pts):** Todo complete 3 · Intern CRUD 3 · All state immutable 2 · Derived-not-stored 2

### ✅ Checkpoint
Your React state updates are always immutable, and you never store derived values.

---

# 🟢 DAY 23 — React `useEffect` & Data Fetching

**Course 08:** React.js | **Phase 2**

### 🎯 Learning Objectives
- Run side effects with `useEffect`
- Control when effects run with the dependency array
- Clean up subscriptions and timers
- Fetch data with loading/error states
- Avoid infinite loops and race conditions

### 📘 Content

**23.1 What is a side effect?**

Anything that reaches outside the component: fetching, timers, subscriptions, direct DOM manipulation, `localStorage`, logging.

```jsx
useEffect(() => {
  // side effect code
  return () => {
    // cleanup (optional)
  };
}, [dependencies]);
```

**23.2 When does it run?**

| Dependency array | When the effect runs |
|---|---|
| omitted | After **every** render |
| `[]` | Once, after the first render (mount) |
| `[a, b]` | After the first render, and whenever `a` or `b` changes |

```jsx
// Every render
useEffect(() => { console.log('rendered'); });

// Once
useEffect(() => { console.log('mounted'); }, []);

// When `userId` changes
useEffect(() => { loadUser(userId); }, [userId]);
```

**23.3 Cleanup**

The returned function runs:
- Before the effect re-runs (when deps change)
- On unmount

```jsx
// Interval
useEffect(() => {
  const id = setInterval(() => setTime(new Date()), 1000);
  return () => clearInterval(id);
}, []);

// Event listener
useEffect(() => {
  const handler = () => setWidth(window.innerWidth);
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
}, []);

// WebSocket
useEffect(() => {
  const ws = new WebSocket('wss://api.example.com');
  ws.onmessage = (e) => setMessages(prev => [...prev, e.data]);
  return () => ws.close();
}, []);

// Timeout
useEffect(() => {
  const id = setTimeout(() => setVisible(false), 3000);
  return () => clearTimeout(id);
}, []);
```

**Why cleanup matters:** without it, each re-render adds another listener/interval/timer that never goes away. Components unmount; their side effects must too.

**23.4 Fetching data**

```jsx
import { useState, useEffect } from 'react';

export default function InternList() {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/interns', { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) setInterns(data);
      } catch (err) {
        if (err.name !== 'AbortError' && !cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  if (loading) return <Spinner />;
  if (error)   return <ErrorView message={error.message} onRetry={() => window.location.reload()} />;
  if (!interns.length) return <EmptyState />;

  return (
    <ul>
      {interns.map(i => <li key={i.id}>{i.name}</li>)}
    </ul>
  );
}
```

**Every fetch needs 4 states:** loading, error, empty, and success.

**23.5 Infinite loop — the #1 effect bug**

```jsx
// ❌ Re-renders forever
useEffect(() => {
  setCount(count + 1);
}, [count]);   // count changes → effect runs → setCount changes count → …

// ❌ Same, with an object
useEffect(() => {
  setUser({ name: 'Arun' });   // new object every run
}, [user]);                    // always different → infinite

// ❌ Function defined inside the component
function load() { /* … */ }
useEffect(() => {
  load();
}, [load]);   // load is a new function every render
```

**Fixes:**

```jsx
// ✅ Empty deps — run once
useEffect(() => {
  setCount(c => c + 1);
}, []);

// ✅ Define inside the effect
useEffect(() => {
  async function load() { /* … */ }
  load();
}, []);

// ✅ Or use useCallback (Day 25)
```

**23.6 Race conditions**

Two fetches in flight; the slower one wins and overwrites the newer data.

```jsx
// ❌ Race condition
useEffect(() => {
  fetch(`/api/search?q=${query}`)
    .then(r => r.json())
    .then(setResults);
}, [query]);
// Type "a" (slow) then "ab" (fast) → "a" results may arrive last

// ✅ Abort the previous request
useEffect(() => {
  const controller = new AbortController();
  fetch(`/api/search?q=${query}`, { signal: controller.signal })
    .then(r => r.json())
    .then(setResults)
    .catch(err => { if (err.name !== 'AbortError') console.error(err); });
  return () => controller.abort();
}, [query]);

// ✅ Or a cancelled flag
useEffect(() => {
  let cancelled = false;
  fetch(`/api/search?q=${query}`)
    .then(r => r.json())
    .then(data => { if (!cancelled) setResults(data); });
  return () => { cancelled = true; };
}, [query]);
```

**23.7 Debouncing a search**

```jsx
import { useState, useEffect } from 'react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setResults(data);
      } catch (err) {
        if (err.name !== 'AbortError') console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search…" />
      {loading && <p>Searching…</p>}
      <ul>{results.map(r => <li key={r.id}>{r.name}</li>)}</ul>
    </>
  );
}
```

**23.8 Extracting a custom hook — `useFetch`**

```jsx
// hooks/useFetch.js
import { useState, useEffect } from 'react';

export function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function run() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(url, { ...options, signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setData(await res.json());
      } catch (err) {
        if (err.name !== 'AbortError') setError(err);
      } finally {
        setLoading(false);
      }
    }

    run();
    return () => controller.abort();
    // options intentionally not listed — pass a stable object or use keys
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return { data, loading, error };
}
```

Usage:

```jsx
function InternList() {
  const { data: interns, loading, error } = useFetch('/api/interns');

  if (loading) return <Spinner />;
  if (error)   return <ErrorView error={error} />;
  if (!interns?.length) return <EmptyState />;

  return <ul>{interns.map(i => <li key={i.id}>{i.name}</li>)}</ul>;
}
```

**23.9 `useEffect` vs event handlers — know the difference**

```jsx
// ❌ Using an effect for a user action
useEffect(() => {
  if (submitted) {
    api.post('/interns', data);
  }
}, [submitted]);

// ✅ Do it in the handler
function handleSubmit(e) {
  e.preventDefault();
  api.post('/interns', data);
}
```

**Effects are for synchronising with external systems** — not for reacting to user events. If an action is caused by a click, do it in the click handler.

**23.10 Effects you probably don't need**

```jsx
// ❌ Derived state in an effect
useEffect(() => {
  setFullName(`${first} ${last}`);
}, [first, last]);
// ✅ Just compute during render
const fullName = `${first} ${last}`;

// ❌ Resetting state on prop change
useEffect(() => { setValue(prop); }, [prop]);
// ✅ Use a key on the component to remount it
<Child key={prop} value={prop} />

// ❌ Transforming props for rendering
useEffect(() => { setSorted([...items].sort()); }, [items]);
// ✅
const sorted = useMemo(() => [...items].sort(), [items]);
```

**The rule:** If you can compute it during render, don't use an effect.

**23.11 Complete example — Intern dashboard with polling**

```jsx
import { useState, useEffect, useRef } from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;

    const controller = new AbortController();

    async function load() {
      try {
        const res = await fetch('/api/stats', { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setStats(await res.json());
        setError(null);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err);
      } finally {
        setLoading(false);
      }
    }

    load();
    const id = setInterval(load, 30_000);

    return () => {
      clearInterval(id);
      controller.abort();
    };
  }, [paused]);

  if (loading) return <Spinner />;
  if (error)   return <ErrorView error={error} />;

  return (
    <section>
      <button onClick={() => setPaused(p => !p)}>
        {paused ? 'Resume' : 'Pause'} live updates
      </button>
      <div className="stats">
        <StatCard label="Total Interns" value={stats.total} />
        <StatCard label="Active" value={stats.active} />
        <StatCard label="Avg Progress" value={`${stats.avg}%`} />
      </div>
    </section>
  );
}
```

### 🧪 Quiz — Day 23

1. `useEffect(fn, [])` runs:
   a) Every render b) Once after mount c) Never d) On unmount only
   ✅ **b) Once after mount**

2. When does the cleanup function run?
   a) Only on unmount b) Before the effect re-runs, and on unmount c) Never d) Only on error
   ✅ **b)**

3. Which causes an infinite loop?
   a) `useEffect(() => {}, [])` b) `useEffect(() => setX(x+1), [x])` c) `useEffect(() => {}, [id])` d) `useEffect(() => { fetch('/x') }, [])`
   ✅ **b)**

4. How do you avoid a race condition on search?
   a) `setTimeout` b) `AbortController` in the cleanup c) `try/catch` d) `Promise.all`
   ✅ **b)**

5. Should you fetch data in a click handler via `useEffect`?
   a) Yes b) No — do it directly in the handler c) Only for GET d) Only for POST
   ✅ **b) No**

### 🛠️ Task — Day 23
**Deliverable:** `hooks/useFetch.js` + `pages/InternsPage.jsx` + `pages/SearchPage.jsx`.

1. **`hooks/useFetch.js`** — returns `{ data, loading, error, refetch }`; uses `AbortController`; cleans up on unmount; handles non-OK responses
2. **`InternsPage`** — uses `useFetch('/api/interns')` and renders:
   - `<Spinner />` while loading
   - `<ErrorView />` with a **Retry** button that calls `refetch()`
   - `<EmptyState />` when the array is empty
   - The list on success
3. **`SearchPage`** — a debounced (300ms) search input:
   - Aborts the previous request
   - Shows a "Searching…" indicator
   - Cancels on unmount
4. **`Clock`** component — shows the current time, updates every second, clears the interval on unmount
5. **`WindowSize`** component — displays `window.innerWidth`, updates on resize, removes the listener on unmount
6. **`useLocalStorage.js`** — a custom hook that syncs state to `localStorage`
7. Run React DevTools Profiler and confirm: `InternsPage` re-renders **only once** on mount (excluding StrictMode's dev double-render)

**Rubric (10 pts):** useFetch correct 3 · 4 states rendered 2 · Debounce + abort 2 · Clock 1 · WindowSize 1 · useLocalStorage 1

### ✅ Checkpoint
You can fetch any API with proper loading, error, empty, and success states plus cancellation.

---

# 🟢 DAY 24 — React Lists, Keys & Forms

**Course 08:** React.js | **Phase 2**

### 🎯 Learning Objectives
- Render lists with correct `key` usage
- Build controlled forms with validation
- Handle multiple inputs with one handler
- Use `useRef` for DOM access and uncontrolled inputs
- Manage complex form state

### 📘 Content

**24.1 Rendering lists**

```jsx
function InternList({ interns }) {
  return (
    <ul>
      {interns.map(intern => (
        <li key={intern.id}>{intern.name}</li>
      ))}
    </ul>
  );
}
```

**What a `key` is:** a stable, unique identifier that React uses to match elements between renders. Without it, React falls back to index-based matching and things break when items move, are added, or removed.

**`key` rules:**

| Rule | Note |
|---|---|
| Must be unique **among siblings** | Not globally |
| Must be **stable** | Don't generate a new value each render |
| Must be a **string or number** | Not an object |
| **Never use `Math.random()`** | Forces remounts |
| Avoid `index` unless the list never reorders | Causes state loss and bugs |
| Not passed to the child as a prop | You must pass it separately if needed |

**The `index` key bug:**

```jsx
// ❌ Reorders break state
{items.map((item, index) => <Row key={index} item={item} />)}

// ✅ Use the database id
{items.map(item => <Row key={item.id} item={item} />)}
```

**Demonstration of why index breaks things:** if each `<Row>` has internal state (like an open/closed toggle), reordering the array with `index` as key causes React to keep the state attached to the *position*, not the *item* — so the wrong row appears open.

**When `index` is acceptable:**
- The list is static (never reorders, filters, or adds/removes)
- The items have no internal state

**If you don't have a stable id, generate one when the item is created:**

```jsx
setItems(prev => [...prev, { id: crypto.randomUUID(), text }]);
```

**Rendering nested data:**

```jsx
function ProgramList({ programs }) {
  return (
    <ul>
      {programs.map(program => (
        <li key={program.id}>
          <h3>{program.title}</h3>
          <ul>
            {program.courses.map(course => (
              <li key={course.id}>{course.name}</li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
```

Keys only need to be unique *within their own list*, so `course.id` is fine even if another program has the same course id.

**Filtering and mapping in one pass:**

```jsx
{interns
  .filter(i => i.program === 'FS45')
  .sort((a, b) => b.progress - a.progress)
  .map(i => <InternCard key={i.id} intern={i} />)
}
```

**24.2 Controlled components**

A form element is controlled when React owns its value.

```jsx
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form>
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
    </form>
  );
}
```

**Why controlled?** You know the value every render, so you can validate, disable the submit button, or reset the form programmatically.

**Multiple fields — one handler:**

```jsx
function RegistrationForm() {
  const [form, setForm] = useState({
    name: '', email: '', age: 18, role: 'intern', agree: false,
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  return (
    <form>
      <input name="name"  value={form.name}  onChange={handleChange} />
      <input name="email" value={form.email} onChange={handleChange} />
      <input name="age"   value={form.age}   onChange={handleChange} type="number" />
      <select name="role" value={form.role} onChange={handleChange}>
        <option value="intern">Intern</option>
        <option value="mentor">Mentor</option>
      </select>
      <input name="agree" type="checkbox" checked={form.agree} onChange={handleChange} />
    </form>
  );
}
```

The `name` attribute on each input matches the key in state — one handler covers them all.

**Textarea:**

```jsx
// ⚠️ In HTML: <textarea>value</textarea>
// In React: use the value attribute
<textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} />
```

**Select:**

```jsx
<select value={program} onChange={e => setProgram(e.target.value)}>
  <option value="fs45">45-Day Full Stack</option>
  <option value="web30">30-Day Web</option>
</select>
```

For a multi-select, the value is an array:
```jsx
<select multiple value={skills} onChange={e =>
  setSkills([...e.target.selectedOptions].map(o => o.value))
}>
```

**Radio buttons:**

```jsx
<fieldset>
  <legend>Mode</legend>
  {['online', 'offline'].map(mode => (
    <label key={mode}>
      <input
        type="radio"
        name="mode"
        value={mode}
        checked={form.mode === mode}
        onChange={handleChange}
      />
      {mode}
    </label>
  ))}
</fieldset>
```

Radio buttons need `checked`, not `value`, to be controlled — and they share the same `name`.

**24.3 Form submission**

```jsx
function InternForm({ onCreate }) {
  const [form, setForm] = useState({ name: '', program: 'fs45', progress: 0 });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();           // stop the page reload
    onCreate({
      id: crypto.randomUUID(),
      ...form,
      progress: Number(form.progress),
    });
    setForm({ name: '', program: 'fs45', progress: 0 });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} required />
      <select name="program" value={form.program} onChange={handleChange}>
        <option value="fs45">Full Stack</option>
        <option value="web30">Web</option>
      </select>
      <input name="progress" type="number" value={form.progress} onChange={handleChange} min="0" max="100" />
      <button type="submit">Add</button>
    </form>
  );
}
```

`e.preventDefault()` is **always** needed with `onSubmit`, otherwise the browser reloads the page.

**24.4 Validation**

```jsx
function SignupForm() {
  const [form, setForm] = useState({ email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  function validate(values) {
    const errs = {};
    if (!values.email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      errs.email = 'Invalid email format';
    if (!values.password) errs.password = 'Password is required';
    else if (values.password.length < 8)
      errs.password = 'At least 8 characters';
    if (values.confirm !== values.password)
      errs.confirm = 'Passwords do not match';
    return errs;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    const next = { ...form, [name]: value };
    setForm(next);
    if (touched[name]) setErrors(validate(next));
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(validate(form));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    setTouched({ email: true, password: true, confirm: true });
    if (Object.keys(errs).length) return;
    submit(form);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Input
        name="email" type="email" label="Email"
        value={form.email}
        onChange={handleChange} onBlur={handleBlur}
        error={touched.email && errors.email}
      />
      <Input
        name="password" type="password" label="Password"
        value={form.password}
        onChange={handleChange} onBlur={handleBlur}
        error={touched.password && errors.password}
      />
      <Input
        name="confirm" type="password" label="Confirm Password"
        value={form.confirm}
        onChange={handleChange} onBlur={handleBlur}
        error={touched.confirm && errors.confirm}
      />
      <button type="submit" disabled={Object.keys(errors).length > 0}>
        Sign up
      </button>
    </form>
  );
}
```

**Key ideas:**
- **Validate on blur, not on every keystroke** — otherwise the user sees "invalid" while still typing
- **Track `touched`** — don't show errors before the user has interacted
- **`noValidate`** on the form to disable the browser's native UI and use yours
- **Disable the submit button only as a hint**, but also guard in the handler

**24.5 `useRef`**

`useRef` gives you a mutable box that persists across renders **without** triggering a re-render.

```jsx
import { useRef } from 'react';

// 1. Access DOM nodes
function SearchBox() {
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  return <input ref={inputRef} />;
}

// 2. Store mutable values that shouldn't cause a re-render
function Timer() {
  const intervalRef = useRef(null);

  const start = () => {
    intervalRef.current = setInterval(() => console.log('tick'), 1000);
  };
  const stop = () => clearInterval(intervalRef.current);

  return <><button onClick={start}>Start</button><button onClick={stop}>Stop</button></>;
}

// 3. Track previous values
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => { ref.current = value; }, [value]);
  return ref.current;
}
```

**`useRef` vs `useState`:**

| Use `useRef` when | Use `useState` when |
|---|---|
| The value shouldn't trigger a re-render | You need the UI to update |
| You need DOM access | You're storing user-visible data |
| You're storing a timer/listener id | You're storing form data |

**Uncontrolled form with refs:**

```jsx
function QuickForm({ onSubmit }) {
  const nameRef = useRef();
  const emailRef = useRef();

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      name: nameRef.current.value,
      email: emailRef.current.value,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input ref={nameRef} defaultValue="" />
      <input ref={emailRef} type="email" defaultValue="" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

Simpler for tiny forms, but you lose live validation and the ability to programmatically reset.

**24.6 A complete example — CRUD table with a modal form**

```jsx
import { useState } from 'react';

export default function InternsPage() {
  const [interns, setInterns] = useState([
    { id: 1, name: 'Arun',    program: 'fs45', progress: 91 },
    { id: 2, name: 'Divya',   program: 'fs45', progress: 62 },
  ]);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');

  const visible = interns.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  function save(intern) {
    setInterns(prev =>
      intern.id
        ? prev.map(i => (i.id === intern.id ? intern : i))
        : [...prev, { ...intern, id: crypto.randomUUID() }]
    );
    setEditing(null);
  }

  function remove(id) {
    setInterns(prev => prev.filter(i => i.id !== id));
  }

  return (
    <section>
      <header>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search interns…"
        />
        <button onClick={() => setEditing({})}>New Intern</button>
      </header>

      {editing && (
        <Modal title={editing.id ? 'Edit Intern' : 'New Intern'} onClose={() => setEditing(null)}>
          <InternForm initial={editing} onSubmit={save} onCancel={() => setEditing(null)} />
        </Modal>
      )}

      <table>
        <thead>
          <tr><th>Name</th><th>Program</th><th>Progress</th><th></th></tr>
        </thead>
        <tbody>
          {visible.map(i => (
            <tr key={i.id}>
              <td>{i.name}</td>
              <td>{i.program}</td>
              <td>{i.progress}%</td>
              <td>
                <button onClick={() => setEditing(i)}>Edit</button>
                <button onClick={() => remove(i.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function InternForm({ initial = {}, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    id: initial.id,
    name: initial.name ?? '',
    program: initial.program ?? 'fs45',
    progress: initial.progress ?? 0,
  });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSubmit({ ...form, progress: Number(form.progress) });
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input name="name" value={form.name} onChange={handleChange} />
        {errors.name && <span className="error">{errors.name}</span>}
      </label>

      <label>
        Program
        <select name="program" value={form.program} onChange={handleChange}>
          <option value="fs45">Full Stack</option>
          <option value="web30">Web</option>
        </select>
      </label>

      <label>
        Progress
        <input type="number" name="progress" min="0" max="100"
               value={form.progress} onChange={handleChange} />
      </label>

      <footer>
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit">Save</button>
      </footer>
    </form>
  );
}
```

### 🧪 Quiz — Day 24

1. Why does React need a `key`?
   a) For styling b) To identify elements across renders c) For accessibility d) It's optional
   ✅ **b)**

2. Why is `index` a bad key in reordering lists?
   a) It's slower b) State and DOM may attach to the wrong item c) React refuses it d) It causes errors
   ✅ **b)**

3. In a controlled `<textarea>`, the value is set via:
   a) Children `<textarea>text</textarea>` b) `value` prop c) `defaultValue` d) `content` prop
   ✅ **b) `value`**

4. When should you validate a field?
   a) On every keystroke b) On blur + on submit c) Never d) Only on submit
   ✅ **b) On blur + on submit**

5. `useRef` triggers a re-render when its `.current` changes?
   a) Yes b) No c) Only in StrictMode d) Only on mount
   ✅ **b) No**

### 🛠️ Task — Day 24
**Deliverable:** `pages/InternsCRUD.jsx`

Build a complete CRUD table with a modal form.

Requirements:
1. Table shows: name, program, progress, join date, actions
2. **New Intern** button opens a modal form
3. Form fields: name, email, program (select), progress (number 0–100), join date (date)
4. **Validation** on blur:
   - Name required, min 2 chars
   - Email required, valid format
5. **Save** saves/updates and closes the modal
6. **Delete** removes the row
7. Use realistic mock data (5–10 rows)
8. Keep it simple — no API needed
9. Reuse your previous form layout style if you like
# Full Stack Development Curriculum: Days 24–45 Complete Guide

This comprehensive guide covers every day of your curriculum with full content, code explanations, quizzes, and hands-on tasks. Each day builds on the previous one, taking you from React fundamentals through to a complete deployed full-stack application.

---

## Day 24: React Lists, Keys, Forms

### Full Content

**Rendering Lists in React**

In React, you render lists using JavaScript's `map()` method to transform arrays of data into arrays of JSX elements. The `map()` function iterates over each item and returns a React element for each one.

```jsx
function ItemList({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

**Why Keys Are Essential**

Keys are special string attributes you must include when creating lists of elements. React uses keys to identify which items have changed, been added, or removed. Without keys, React cannot efficiently update the DOM and may re-render unnecessarily.

**Best Practices for Keys:**
- Use unique and stable identifiers (like database IDs)
- Avoid using array indices as keys, especially if the list can be reordered
- Keys should not change between renders
- Keys must be unique among siblings, not globally

**Controlled Components**

In controlled components, form data is handled by React state. The input's value is tied to state, and an `onChange` handler updates that state.

```jsx
import React, { useState } from "react";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login:", { username, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button type="submit">Log In</button>
    </form>
  );
}
```

**Handling Multiple Inputs**

Use computed property names to handle multiple form fields with a single change handler:

```jsx
const [formData, setFormData] = useState({ name: "", email: "", age: "" });

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};
```

**Uncontrolled Components**

Uncontrolled components rely on the DOM for their values, accessed via refs. They are simpler for quick forms but provide less control.

### Quiz

**Question 1:** Why are keys important in React's list rendering?
**Answer:** Keys help React track and update list items efficiently by identifying which items have changed, been added, or removed.

**Question 2:** What happens if you don't assign keys to list elements?
**Answer:** React will issue a warning, and the application may produce incorrect UI on re-renders because React cannot efficiently reconcile list items.

**Question 3:** What is the difference between controlled and uncontrolled components?
**Answer:** Controlled components have their values managed by React state, while uncontrolled components rely on the DOM and use refs to access values.

**Question 4:** Why should you avoid using array indices as keys?
**Answer:** Array indices are not stable identifiers. If the list is reordered, inserted into, or filtered, the indices change, causing React to incorrectly match elements with their previous state.

### Task

Build a **Todo List Application** with the following features:
1. Add new todos via a controlled form input
2. Display todos in a list with unique keys
3. Mark todos as complete (toggle with checkbox)
4. Delete todos from the list
5. Filter todos by status (all/active/completed)

**Bonus:** Add an "Edit" feature that allows inline editing of todo text.

---

## Day 25: React Router & Project Structure

### Full Content

**Setting Up React Router**

React Router enables client-side routing in a single-page application. Install it with `npm install react-router-dom`. The modern approach uses `createBrowserRouter` and `RouterProvider`.

```jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import Home from "./routes/home";
import About from "./routes/about";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
```

**Nested Routes and Layout Components**

Layout components use the `<Outlet />` component to render child routes:

```jsx
import { Outlet, Link } from "react-router-dom";

export default function Root() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
```

**Data Loading with Loaders**

React Router's loaders fetch data before rendering a route, eliminating loading spinners:

```jsx
export async function loader({ params }) {
  const response = await fetch(`/api/users/${params.userId}`);
  if (!response.ok) throw new Response("Not Found", { status: 404 });
  return response.json();
}

// In route config:
{
  path: "users/:userId",
  element: <UserDetail />,
  loader: userLoader,
}
```

**Form Actions**

Actions handle form submissions directly in React Router:

```jsx
export async function action({ request }) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  return redirect("/users");
}
```

**Recommended Project Structure**

```
src/
├── routes/
│   ├── root.jsx
│   ├── home.jsx
│   └── user-detail.jsx
├── components/
│   ├── Navbar.jsx
│   ├── UserCard.jsx
│   └── UserForm.jsx
├── api/
│   └── users.js
├── hooks/
│   └── useAuth.js
├── utils/
│   └── helpers.js
├── main.jsx
└── App.jsx
```

### Quiz

**Question 1:** What is the purpose of the `<Outlet />` component?
**Answer:** The `<Outlet />` component renders the child route's element in a nested routing configuration, allowing layout components to be reused across multiple routes.

**Question 2:** What is the difference between `createBrowserRouter` and `BrowserRouter`?
**Answer:** `createBrowserRouter` is the modern, recommended approach that supports data APIs like loaders and actions. `BrowserRouter` is the older component-based approach.

**Question 3:** How do loaders improve user experience?
**Answer:** Loaders fetch data before rendering the route, so users see the complete page immediately rather than a loading state followed by content.

**Question 4:** What are route params and how are they accessed?
**Answer:** Route params are dynamic segments in the URL (e.g., `:userId`). They are accessed through the `useParams()` hook or the `params` argument in loaders/actions.

### Task

Create a **Multi-Page Blog Application** with:
1. Home page listing all posts
2. Individual post detail pages (`/posts/:postId`)
3. About page
4. Navigation bar with links
5. A loader that fetches post data
6. A 404 error page for invalid routes

**Bonus:** Add a "New Post" form using an action to create posts.

---

## Day 26: Node.js Runtime, Modules, npm, fs

### Full Content

**The Node.js Runtime**

Node.js is a JavaScript runtime built on Chrome's V8 engine that executes JavaScript outside the browser. It uses a single-threaded, event-driven, non-blocking I/O model that allows it to handle many concurrent connections efficiently.

Node.js provides direct access to the operating system, file system, and network, making it ideal for backend development. Unlike browser JavaScript, Node.js has no `window` or `document` objects but has `process`, `Buffer`, and file system APIs.

**Module System**

Node.js organizes code into modules. There are three types:

1. **Built-in modules:** Pre-installed modules like `fs`, `path`, `http`, `events`, `os`
2. **Custom modules:** Your own reusable `.js` files
3. **Third-party modules:** Packages installed via npm

**CommonJS (CJS) Syntax:**

```javascript
// math.js (exporting)
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
module.exports = { add, subtract };

// app.js (importing)
const { add, subtract } = require("./math");
console.log(add(5, 3)); // 8
```

**ES Modules (ESM) Syntax:**

```javascript
// math.js (exporting)
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

// app.js (importing)
import { add, subtract } from "./math.js";
```

**The File System (fs) Module**

The `fs` module provides methods to read, write, update, and delete files and directories. It offers synchronous, callback-based, and promise-based APIs.

```javascript
const fs = require("fs");

// Synchronous read (blocks execution)
const data = fs.readFileSync("file.txt", "utf8");
console.log(data);

// Asynchronous read (non-blocking)
fs.readFile("file.txt", "utf8", (err, data) => {
  if (err) throw err;
  console.log(data);
});

// Promise-based read
const fsPromises = require("fs").promises;
async function readFile() {
  const data = await fsPromises.readFile("file.txt", "utf8");
  console.log(data);
}

// Write file
fs.writeFileSync("output.txt", "Hello World");

// Append to file
fs.appendFileSync("log.txt", "New entry\n");

// Delete file
fs.unlinkSync("temp.txt");

// Check if file exists
if (fs.existsSync("file.txt")) {
  console.log("File exists");
}
```

**npm (Node Package Manager)**

npm manages third-party packages. The `package.json` file stores project metadata and dependencies.

```bash
npm init -y                    # Initialize project
npm install express            # Install dependency
npm install --save-dev jest    # Install dev dependency
npm uninstall express          # Remove dependency
npm update                     # Update packages
npm run <script>               # Run a script
```

**package.json example:**

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "node --watch src/index.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.0"
  },
  "devDependencies": {
    "jest": "^29.0.0"
  }
}
```

### Quiz

**Question 1:** What makes Node.js suitable for handling multiple concurrent requests efficiently?
**Answer:** Node.js uses a single-threaded, event-driven model with non-blocking I/O, allowing it to process many requests concurrently without waiting for previous ones to complete.

**Question 2:** What are the three types of modules in Node.js?
**Answer:** Built-in modules (fs, path, http), custom modules (your own files), and third-party modules (installed via npm).

**Question 3:** What is the difference between `fs.readFileSync` and `fs.readFile`?
**Answer:** `readFileSync` is synchronous and blocks execution until the file is fully read. `readFile` is asynchronous and uses a callback, allowing other operations to continue while the file is being read.

**Question 4:** What is the purpose of `package.json`?
**Answer:** `package.json` stores project metadata, dependencies, scripts, and configuration, ensuring correct package versions are installed when sharing the project.

### Task

Create a **File Management CLI Tool** that:
1. Accepts commands: `read`, `write`, `append`, `delete`, `list`
2. Uses the `fs` module for file operations
3. Handles errors gracefully
4. Uses `process.argv` to parse command-line arguments
5. Includes a `package.json` with npm scripts

**Bonus:** Add a `watch` command that monitors a file and logs changes using `fs.watch()`.

---

## Day 27: Node.js HTTP Module & Event Loop

### Full Content

**The HTTP Module**

Node.js includes a built-in `http` module for creating HTTP servers and clients. HTTP is a first-class citizen in Node.js, designed with streaming and low latency in mind.

```javascript
const http = require("http");

const server = http.createServer((req, res) => {
  // Parse request URL and method
  const { method, url } = req;

  if (method === "GET" && url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hello World");
  } else if (method === "GET" && url === "/api/users") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify([{ id: 1, name: "Alice" }]));
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
```

**Handling Different HTTP Methods:**

```javascript
const server = http.createServer((req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    console.log(`${req.method} ${req.url}`);
    if (req.method === "POST" && req.url === "/api/users") {
      const user = JSON.parse(body);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ id: Date.now(), ...user }));
    } else {
      res.writeHead(404);
      res.end("Not Found");
    }
  });
});
```

**The Event Loop**

Node.js is single-threaded but handles concurrency through the event loop. The event loop continuously checks for events and executes associated callback functions.

**Event Loop Phases:**
1. **Timers:** Executes `setTimeout` and `setInterval` callbacks
2. **Pending callbacks:** Executes I/O callbacks deferred to the next loop iteration
3. **Idle, prepare:** Internal operations
4. **Poll:** Retrieves new I/O events; executes I/O callbacks
5. **Check:** Executes `setImmediate` callbacks
6. **Close callbacks:** Executes close event callbacks

```javascript
console.log("Start");

setTimeout(() => {
  console.log("Timeout");
}, 0);

setImmediate(() => {
  console.log("Immediate");
});

Promise.resolve().then(() => {
  console.log("Promise");
});

process.nextTick(() => {
  console.log("NextTick");
});

console.log("End");

// Output order: Start, End, NextTick, Promise, Timeout/Immediate (order varies)
```

**Key Concepts:**
- `process.nextTick()` has the highest priority, executing before any other I/O
- `setImmediate()` executes in the check phase, after the poll phase
- `setTimeout(fn, 0)` executes in the timers phase but with a minimum delay
- Long-running CPU tasks block the event loop, making Node.js poor for CPU-heavy workloads

### Quiz

**Question 1:** Which queues have the highest priority in the Node.js event loop?
**Answer:** `process.nextTick()` callbacks have the highest priority, followed by microtasks (Promises).

**Question 2:** What is the difference between `process.nextTick()` and `setImmediate()`?
**Answer:** `process.nextTick()` fires immediately after the current operation completes, before the event loop continues. `setImmediate()` fires on the next iteration of the event loop.

**Question 3:** Why is Node.js considered single-threaded but capable of handling concurrency?
**Answer:** Node.js runs JavaScript on a single thread but delegates I/O operations to the system kernel, which handles them asynchronously. The event loop then processes callbacks when operations complete.

**Question 4:** What happens if a CPU-intensive task runs on the main thread?
**Answer:** It blocks the event loop, preventing all other requests from being processed until the task completes.

### Task

Build a **REST API Server** using only the Node.js `http` module (no Express) with:
1. `GET /api/users` - Return all users
2. `GET /api/users/:id` - Return one user
3. `POST /api/users` - Create a user
4. `PUT /api/users/:id` - Update a user
5. `DELETE /api/users/:id` - Delete a user
6. Proper status codes (200, 201, 404, 400)
7. JSON request/response handling

**Bonus:** Add query parameter filtering (e.g., `GET /api/users?role=admin`).

---

## Day 28: Async Node, Env Vars, Project Setup

### Full Content

**Asynchronous Patterns**

Node.js supports multiple async patterns. Understanding when to use each is crucial.

**Callbacks:**

```javascript
function fetchData(callback) {
  setTimeout(() => {
    callback(null, { data: "result" });
  }, 1000);
}

fetchData((err, result) => {
  if (err) return console.error(err);
  console.log(result);
});
```

**Promises:**

```javascript
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ data: "result" });
    }, 1000);
  });
}

fetchData()
  .then((result) => console.log(result))
  .catch((err) => console.error(err));
```

**Async/Await:**

```javascript
async function main() {
  try {
    const result = await fetchData();
    console.log(result);
  } catch (err) {
    console.error(err);
  }
}
main();
```

**Promisifying Callback APIs:**

```javascript
const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);

async function readConfig() {
  const data = await readFile("config.json", "utf8");
  return JSON.parse(data);
}
```

**Environment Variables**

Environment variables store configuration outside your code, keeping secrets secure and enabling different configurations for development, staging, and production.

```bash
# .env file
PORT=3000
DATABASE_URL=mysql://user:pass@localhost:3306/mydb
JWT_SECRET=super-secret-key
NODE_ENV=development
```

```javascript
// Load .env file (must be done first)
require("dotenv").config();

const port = process.env.PORT || 3000;
const dbUrl = process.env.DATABASE_URL;
const jwtSecret = process.env.JWT_SECRET;
const env = process.env.NODE_ENV || "development";

console.log(`Server running on port ${port} in ${env} mode`);
```

**Important:** Never commit `.env` files to version control. Always include a `.env.example` with placeholder values.

**Project Setup Best Practices**

```
project/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── app.js
│   └── server.js
├── tests/
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

**`.gitignore`:**

```
node_modules/
.env
*.log
dist/
build/
coverage/
```

### Quiz

**Question 1:** Why should you use environment variables for configuration?
**Answer:** They keep sensitive data (API keys, database credentials) out of source code, allow different configurations per environment, and follow the twelve-factor app methodology.

**Question 2:** What is the difference between `process.nextTick()` and `setImmediate()`?
**Answer:** `process.nextTick()` executes before the event loop continues to the next phase, while `setImmediate()` executes in the check phase of the next event loop iteration.

**Question 3:** How do you promisify a callback-based function?
**Answer:** Use `util.promisify()` or wrap it manually in a Promise constructor.

**Question 4:** What should never be committed to version control?
**Answer:** `.env` files containing secrets, `node_modules/`, log files, and build artifacts.

### Task

Create a **Configuration Manager** that:
1. Loads environment variables from `.env`
2. Validates required variables (throws if missing)
3. Provides typed access to config values
4. Has separate configurations for development and production
5. Includes a `.env.example` file

**Bonus:** Add a `config.js` module that exports a frozen configuration object.

---

## Day 29: Express Setup, Routing, Middleware

### Full Content

**What is Express?**

Express is a minimal, flexible Node.js web framework that provides routing, middleware, and HTTP utility methods. It builds on top of the Node.js `http` module.

**Basic Setup:**

```javascript
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Built-in middleware
app.use(express.json());          // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(express.static("public")); // Serve static files

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

**Routing**

Routes define how your application responds to client requests to specific endpoints.

```javascript
// Route parameters
app.get("/users/:userId", (req, res) => {
  res.json({ userId: req.params.userId });
});

// Query parameters
app.get("/search", (req, res) => {
  const { q, page = 1, limit = 10 } = req.query;
  res.json({ query: q, page, limit });
});

// Multiple handlers
app.get("/protected", 
  authenticate, 
  authorize("admin"), 
  (req, res) => {
    res.json({ message: "Admin access granted" });
  }
);

// Route chaining
app.route("/users")
  .get((req, res) => res.json({ message: "Get users" }))
  .post((req, res) => res.json({ message: "Create user" }))
  .put((req, res) => res.json({ message: "Update user" }));
```

**Express Router**

Use `express.Router()` to organize routes into modular files.

```javascript
// routes/users.js
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "All users" });
});

router.get("/:id", (req, res) => {
  res.json({ message: `User ${req.params.id}` });
});

module.exports = router;

// app.js
const userRoutes = require("./routes/users");
app.use("/api/users", userRoutes);
```

**Middleware**

Middleware functions have access to the request object, response object, and the `next` function. They can execute code, modify request/response, end the request-response cycle, or call the next middleware.

```javascript
// Application-level middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // Pass control to next middleware
});

// Route-level middleware
const validateUser = (req, res, next) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email required" });
  }
  next();
};

app.post("/users", validateUser, (req, res) => {
  res.status(201).json({ message: "User created" });
});

// Error handling middleware (4 parameters)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
});
```

**Types of Middleware:**

| Type | Example | Usage |
|------|---------|-------|
| Application-level | `app.use(logger)` | All routes |
| Router-level | `router.use(auth)` | Specific router |
| Error-handling | `app.use((err, req, res, next) => {})` | Error processing |
| Built-in | `express.json()` | Body parsing |
| Third-party | `morgan`, `cors`, `helmet` | Common tasks |

### Quiz

**Question 1:** What is middleware in Express?
**Answer:** Middleware are functions that have access to the request and response objects and the next function. They can execute code, modify request/response, end the request cycle, or pass control to the next middleware.

**Question 2:** What is the difference between `app.use()` and `app.get()`?
**Answer:** `app.use()` registers middleware for all HTTP methods, while `app.get()` registers a handler specifically for GET requests.

**Question 3:** How do you pass control to the next middleware?
**Answer:** Call `next()` within the middleware function. If an error occurs, call `next(error)`.

**Question 4:** Why must error-handling middleware have four parameters?
**Answer:** Express identifies error-handling middleware by its four-parameter signature `(err, req, res, next)`. Without all four, Express treats it as regular middleware.

### Task

Build a **REST API** for a **Book Store** with:
1. Separate route files for books and authors
2. Middleware for request logging
3. Middleware for request validation
4. A global error handler
5. Static file serving for a `public` folder
6. Proper HTTP status codes

**Bonus:** Add a custom middleware that adds a `requestId` to every request.

---

## Day 30: Express Controllers & Error Handling

### Full Content

**MVC Architecture**

MVC separates your application into three components:
- **Model:** Data logic and database interactions
- **View:** Presentation (JSON responses in APIs)
- **Controller:** Request handling and business logic

**Controller Pattern:**

```javascript
// controllers/userController.js
const User = require("../models/user");

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json({ data: users });
  } catch (err) {
    next(err); // Pass to error handler
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        error: { code: "USER_NOT_FOUND", message: "User not found" }
      });
    }
    res.json({ data: user });
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    res.status(201).json({ data: user });
  } catch (err) {
    next(err);
  }
};
```

**Custom Error Classes**

```javascript
// errors/AppError.js
class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404, "NOT_FOUND");
  }
}

class ValidationError extends AppError {
  constructor(message = "Validation failed", details = []) {
    super(message, 422, "VALIDATION_ERROR");
    this.details = details;
  }
}

class UnauthorizedError extends AppError {
  constructor(message = "Authentication required") {
    super(message, 401, "UNAUTHORIZED");
  }
}

module.exports = { AppError, NotFoundError, ValidationError, UnauthorizedError };
```

**Global Error Handler**

Error-handling middleware must be defined last and have four parameters:

```javascript
// middleware/errorHandler.js
const { AppError } = require("../errors/AppError");

function errorHandler(err, req, res, next) {
  // Log error for debugging
  console.error(`[ERROR] ${req.method} ${req.url}:`, err.message);

  // Handle known operational errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err.details && { details: err.details }),
      },
    });
  }

  // Handle MySQL duplicate entry
  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({
      error: { code: "DUPLICATE_ENTRY", message: "Resource already exists" },
    });
  }

  // Handle validation errors from libraries
  if (err.name === "ValidationError") {
    return res.status(422).json({
      error: { code: "VALIDATION_ERROR", message: err.message },
    });
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: { code: "INVALID_TOKEN", message: "Invalid token" },
    });
  }

  // Unknown errors - don't leak details in production
  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: process.env.NODE_ENV === "production" 
        ? "Something went wrong" 
        : err.message,
    },
  });
}

module.exports = errorHandler;
```

**Async Wrapper**

Avoid repetitive try/catch blocks with an async wrapper:

```javascript
// utils/catchAsync.js
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Usage in controller
exports.getUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new NotFoundError("User not found");
  res.json({ data: user });
});
```

**Complete MVC Structure:**

```
src/
├── config/
│   └── database.js
├── controllers/
│   ├── userController.js
│   └── authController.js
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   └── validation.js
├── models/
│   ├── user.js
│   └── product.js
├── routes/
│   ├── userRoutes.js
│   └── authRoutes.js
├── errors/
│   └── AppError.js
├── utils/
│   └── catchAsync.js
├── app.js
└── server.js
```

### Quiz

**Question 1:** What is the benefit of using a centralized error handler?
**Answer:** It ensures consistent error response formatting, avoids code duplication in controllers, and provides a single place to log errors and handle different error types.

**Question 2:** Why is error-handling middleware defined last?
**Answer:** Express processes middleware in the order they are defined. Error-handling middleware must be last so it can catch errors from all preceding middleware and routes.

**Question 3:** What is the purpose of the `catchAsync` wrapper?
**Answer:** It wraps async controller functions to automatically catch rejected promises and pass errors to the next middleware, eliminating repetitive try/catch blocks.

**Question 4:** What should an API error response include?
**Answer:** A stable shape with an error code, human-readable message, and optionally details for validation errors. Status codes should be appropriate (400, 404, 422, 500).

### Task

Refactor the **Book Store API** to use:
1. MVC structure with controllers and models
2. Custom error classes (`NotFoundError`, `ValidationError`)
3. A global error handler middleware
4. `catchAsync` utility for async controllers
5. Consistent error response format

**Bonus:** Add request validation middleware that returns 422 with field-level error details.

---

## Day 31: MVC Structure, Static, CORS

### Full Content

**Complete MVC Structure**

A production-ready MVC structure separates concerns:

```javascript
// server.js - Entry point only
const app = require("./app");
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// app.js - Express configuration
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use("/uploads", express.static("uploads"));
app.use(express.static("public"));

// Routes
app.use("/api/users", userRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: { code: "NOT_FOUND", message: `Route ${req.originalUrl} not found` }
  });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
```

**Serving Static Files**

```javascript
// Serve a single file
app.get("/favicon.ico", (req, res) => {
  res.sendFile(__dirname + "/public/favicon.ico");
});

// Serve a directory (accessible at /public/*)
app.use("/public", express.static("public"));

// With options
app.use("/uploads", express.static("uploads", {
  maxAge: "1d",           // Cache for 1 day
  etag: true,             // Enable ETag
  index: "index.html",    // Default file
  dotfiles: "deny",       // Deny dotfiles
}));
```

**CORS (Cross-Origin Resource Sharing)**

CORS is a security feature that restricts which origins can access your API.

```javascript
const cors = require("cors");

// Allow all origins (development only)
app.use(cors());

// Restrict to specific origin
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400, // 24 hours
}));

// Dynamic origin
const allowedOrigins = [
  "http://localhost:5173",
  "https://myapp.com",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
```

**Environment-Specific CORS:**

```javascript
const corsOptions = {
  development: {
    origin: "http://localhost:5173",
    credentials: true,
  },
  production: {
    origin: "https://myapp.com",
    credentials: true,
  },
};

app.use(cors(corsOptions[process.env.NODE_ENV || "development"]));
```

### Quiz

**Question 1:** Why should you separate `app.js` from `server.js`?
**Answer:** Separating the Express app from the server allows you to import and test the app without starting a server, which is essential for integration testing with Supertest.

**Question 2:** What is CORS and why is it needed?
**Answer:** CORS (Cross-Origin Resource Sharing) is a browser security mechanism that blocks requests from different origins by default. It's needed when your frontend (e.g., `localhost:5173`) makes requests to your backend (e.g., `localhost:3000`).

**Question 3:** What does `express.static()` do?
**Answer:** It serves static files (HTML, CSS, images, etc.) from a directory, mapping URLs to files on disk.

**Question 4:** Why is `helmet` recommended for production?
**Answer:** Helmet sets various HTTP headers that protect against common web vulnerabilities like XSS, clickjacking, and MIME-type sniffing.

### Task

Set up a **production-ready Express project** with:
1. Separate `app.js` and `server.js`
2. Helmet for security headers
3. CORS configured for your frontend origin
4. Morgan logging in development
5. Static file serving for a `public` folder
6. Health check endpoint
7. 404 handler
8. Centralized error handler

**Bonus:** Add rate limiting using `express-rate-limit`.

---

## Day 32: MySQL Intro, DDL, SQL Basics

### Full Content

**Introduction to MySQL**

MySQL is a relational database management system (RDBMS) that stores data in tables with rows and columns. It uses SQL (Structured Query Language) for data manipulation.

**DDL (Data Definition Language)**

DDL statements define and modify database structures.

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS bookstore
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE bookstore;

-- Create table
CREATE TABLE authors (
  author_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE,
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE books (
  book_id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  author_id INT,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  stock INT NOT NULL DEFAULT 0,
  published_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES authors(author_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT chk_price CHECK (price >= 0),
  INDEX idx_author (author_id),
  INDEX idx_title (title)
);

-- Alter table
ALTER TABLE books ADD COLUMN isbn VARCHAR(20) UNIQUE;
ALTER TABLE books MODIFY COLUMN title VARCHAR(250) NOT NULL;

-- Drop table
DROP TABLE IF EXISTS books;
```

**DML (Data Manipulation Language)**

```sql
-- INSERT
INSERT INTO authors (name, email, bio) VALUES
  ('Jane Austen', 'jane@example.com', 'English novelist'),
  ('George Orwell', 'george@example.com', 'English novelist');

INSERT INTO books (title, author_id, price, stock, published_date) VALUES
  ('Pride and Prejudice', 1, 12.99, 50, '1813-01-28'),
  ('1984', 2, 14.99, 30, '1949-06-08');

-- SELECT
SELECT * FROM books;
SELECT title, price FROM books WHERE price > 13;
SELECT * FROM books ORDER BY price DESC LIMIT 5;
SELECT DISTINCT author_id FROM books;

-- UPDATE
UPDATE books SET price = 11.99 WHERE book_id = 1;
UPDATE books SET stock = stock - 1 WHERE book_id = 2 AND stock > 0;

-- DELETE
DELETE FROM books WHERE book_id = 5;
```

**Basic SQL Queries**

```sql
-- WHERE clauses
SELECT * FROM books WHERE price BETWEEN 10 AND 20;
SELECT * FROM books WHERE title LIKE '%Pride%';
SELECT * FROM books WHERE author_id IN (1, 2, 3);
SELECT * FROM books WHERE published_date IS NOT NULL;

-- ORDER BY
SELECT * FROM books ORDER BY price ASC, title DESC;

-- LIMIT and OFFSET
SELECT * FROM books LIMIT 10 OFFSET 20; -- Pagination

-- CASE expressions
SELECT title, 
  CASE 
    WHEN price > 15 THEN 'Expensive'
    WHEN price > 10 THEN 'Moderate'
    ELSE 'Budget'
  END AS price_category
FROM books;
```

### Quiz

**Question 1:** What is the difference between DDL and DML?
**Answer:** DDL (Data Definition Language) defines and modifies database structures (CREATE, ALTER, DROP). DML (Data Manipulation Language) works with data (INSERT, SELECT, UPDATE, DELETE).

**Question 2:** What does `AUTO_INCREMENT` do?
**Answer:** It automatically generates a unique sequential integer for each new row, commonly used for primary keys.

**Question 3:** What is the purpose of a foreign key?
**Answer:** A foreign key establishes a link between two tables, enforcing referential integrity by ensuring values exist in the referenced table.

**Question 4:** What is the difference between `WHERE` and `HAVING`?
**Answer:** `WHERE` filters rows before grouping, while `HAVING` filters groups after `GROUP BY`.

### Task

Create a **MySQL database** for a **Library Management System** with:
1. `authors` table (author_id, name, nationality, birth_year)
2. `books` table (book_id, title, author_id, isbn, price, stock)
3. `members` table (member_id, name, email, join_date)
4. `loans` table (loan_id, book_id, member_id, loan_date, return_date)
5. Appropriate foreign keys, indexes, and constraints
6. Insert sample data (at least 5 rows per table)

**Bonus:** Add a `categories` table with a many-to-many relationship to books via a junction table.

---

## Day 33: MySQL CRUD, WHERE, ORDER, LIMIT

### Full Content

**Complete CRUD Operations**

```sql
-- CREATE (INSERT)
INSERT INTO authors (name, email) VALUES ('J.K. Rowling', 'jk@example.com');

-- READ (SELECT)
SELECT * FROM authors;
SELECT author_id, name FROM authors WHERE author_id = 1;
SELECT * FROM authors ORDER BY name ASC LIMIT 5 OFFSET 0;

-- UPDATE
UPDATE authors SET email = 'new@example.com' WHERE author_id = 1;

-- DELETE
DELETE FROM authors WHERE author_id = 5;
```

**Advanced WHERE Clauses**

```sql
-- Comparison operators
SELECT * FROM books WHERE price > 10;
SELECT * FROM books WHERE price >= 10 AND price <= 20;
SELECT * FROM books WHERE price BETWEEN 10 AND 20;

-- Pattern matching
SELECT * FROM books WHERE title LIKE 'The%';
SELECT * FROM books WHERE title LIKE '%War%';
SELECT * FROM books WHERE title LIKE '_he%';

-- IN and NOT IN
SELECT * FROM books WHERE author_id IN (1, 2, 3);
SELECT * FROM books WHERE author_id NOT IN (SELECT author_id FROM authors WHERE name LIKE 'J%');

-- NULL handling
SELECT * FROM books WHERE published_date IS NULL;
SELECT * FROM books WHERE published_date IS NOT NULL;

-- EXISTS
SELECT * FROM authors a WHERE EXISTS (
  SELECT 1 FROM books b WHERE b.author_id = a.author_id
);
```

**ORDER BY**

```sql
-- Single column
SELECT * FROM books ORDER BY price ASC;

-- Multiple columns
SELECT * FROM books ORDER BY author_id ASC, price DESC;

-- By column alias
SELECT title, price * 1.1 AS price_with_tax FROM books ORDER BY price_with_tax;

-- NULL ordering
SELECT * FROM books ORDER BY published_date IS NULL, published_date;
```

**LIMIT and OFFSET (Pagination)**

```sql
-- First 10 records
SELECT * FROM books LIMIT 10;

-- Records 11-20 (page 2, 10 per page)
SELECT * FROM books LIMIT 10 OFFSET 10;

-- Formula: OFFSET = (page_number - 1) * page_size
-- Page 3: OFFSET = (3-1) * 10 = 20
SELECT * FROM books LIMIT 10 OFFSET 20;
```

**Practical Examples:**

```sql
-- Search with multiple filters
SELECT b.title, a.name AS author_name, b.price
FROM books b
JOIN authors a ON b.author_id = a.author_id
WHERE b.price BETWEEN 10 AND 30
  AND b.stock > 0
  AND a.name LIKE '%Rowling%'
ORDER BY b.price ASC
LIMIT 20;

-- Top 5 most expensive books
SELECT title, price FROM books ORDER BY price DESC LIMIT 5;

-- Recently added books
SELECT title, created_at FROM books ORDER BY created_at DESC LIMIT 10;
```

### Quiz

**Question 1:** How do you paginate results in MySQL?
**Answer:** Use `LIMIT` for page size and `OFFSET` for the starting position: `LIMIT page_size OFFSET (page_number - 1) * page_size`.

**Question 2:** What does `LIKE '%war%'` match?
**Answer:** Any string containing "war" anywhere in it, case-insensitive by default in MySQL (depending on collation).

**Question 3:** How do you handle NULL values in WHERE clauses?
**Answer:** Use `IS NULL` or `IS NOT NULL`; regular comparison operators (`=`, `<>`) do not work with NULL.

**Question 4:** What is the difference between `LIMIT 5` and `LIMIT 5, 10`?
**Answer:** `LIMIT 5` returns the first 5 rows. `LIMIT 5, 10` returns 10 rows starting from offset 5 (i.e., rows 6-15).

### Task

Write SQL queries for the **Library Management System** to:
1. Find all books published after 2000 ordered by publication date
2. Find members who joined in the last 6 months
3. Find books that are currently on loan (have no return date)
4. Find the top 3 most borrowed books
5. Search for books by title or author name (case-insensitive)
6. Implement pagination: page 2, 10 items per page

**Bonus:** Create a stored procedure for searching books with multiple optional filters.

---

## Day 34: MySQL Joins & Aggregation

### Full Content

**Types of Joins**

```sql
-- INNER JOIN (only matching rows)
SELECT b.title, a.name AS author
FROM books b
INNER JOIN authors a ON b.author_id = a.author_id;

-- LEFT JOIN (all left rows + matching right)
SELECT a.name, COUNT(b.book_id) AS book_count
FROM authors a
LEFT JOIN books b ON a.author_id = b.author_id
GROUP BY a.author_id, a.name;

-- RIGHT JOIN (all right rows + matching left)
SELECT b.title, a.name
FROM books b
RIGHT JOIN authors a ON b.author_id = a.author_id;

-- FULL OUTER JOIN (emulated with UNION in MySQL)
SELECT a.name, b.title
FROM authors a
LEFT JOIN books b ON a.author_id = b.author_id
UNION
SELECT a.name, b.title
FROM authors a
RIGHT JOIN books b ON a.author_id = b.author_id;

-- CROSS JOIN (Cartesian product)
SELECT a.name, b.title FROM authors a CROSS JOIN books b;

-- SELF JOIN
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.employee_id;
```

**Aggregate Functions**

```sql
-- COUNT
SELECT COUNT(*) AS total_books FROM books;
SELECT COUNT(DISTINCT author_id) AS total_authors FROM books;

-- SUM
SELECT SUM(stock) AS total_stock FROM books;
SELECT author_id, SUM(price * stock) AS inventory_value
FROM books GROUP BY author_id;

-- AVG
SELECT AVG(price) AS average_price FROM books;

-- MIN and MAX
SELECT MIN(price) AS cheapest, MAX(price) AS most_expensive FROM books;

-- GROUP BY
SELECT author_id, COUNT(*) AS book_count, AVG(price) AS avg_price
FROM books
GROUP BY author_id
HAVING book_count > 1;

-- GROUP_CONCAT
SELECT author_id, GROUP_CONCAT(title SEPARATOR ', ') AS books
FROM books GROUP BY author_id;
```

**Joins with Aggregation**

```sql
-- Author with their book count and average price
SELECT a.author_id, a.name, 
  COUNT(b.book_id) AS total_books,
  ROUND(AVG(b.price), 2) AS avg_price,
  SUM(b.stock) AS total_stock
FROM authors a
LEFT JOIN books b ON a.author_id = b.author_id
GROUP BY a.author_id, a.name
ORDER BY total_books DESC;

-- Members with their loan history
SELECT m.member_id, m.name,
  COUNT(l.loan_id) AS total_loans,
  MAX(l.loan_date) AS last_loan_date
FROM members m
LEFT JOIN loans l ON m.member_id = l.member_id
GROUP BY m.member_id, m.name
HAVING total_loans > 0
ORDER BY total_loans DESC;

-- Books never borrowed
SELECT b.title
FROM books b
LEFT JOIN loans l ON b.book_id = l.book_id
WHERE l.loan_id IS NULL;
```

**Subqueries**

```sql
-- Books priced above average
SELECT title, price FROM books
WHERE price > (SELECT AVG(price) FROM books);

-- Authors with more than 2 books
SELECT * FROM authors
WHERE author_id IN (
  SELECT author_id FROM books
  GROUP BY author_id
  HAVING COUNT(*) > 2
);

-- Correlated subquery
SELECT b.title, b.price,
  (SELECT AVG(price) FROM books WHERE author_id = b.author_id) AS author_avg
FROM books b;
```

### Quiz

**Question 1:** What is the difference between INNER JOIN and LEFT JOIN?
**Answer:** INNER JOIN returns only rows with matching values in both tables. LEFT JOIN returns all rows from the left table and matching rows from the right (NULL if no match).

**Question 2:** When do you use HAVING instead of WHERE?
**Answer:** Use HAVING to filter groups after aggregation (e.g., `HAVING COUNT(*) > 5`). Use WHERE to filter individual rows before grouping.

**Question 3:** What does `GROUP_CONCAT` do?
**Answer:** It concatenates values from multiple rows into a single string, useful for aggregating text values within groups.

**Question 4:** How do you find rows in one table that have no match in another?
**Answer:** Use LEFT JOIN with `WHERE right_table.id IS NULL`, or use `NOT EXISTS` with a subquery.

### Task

Write queries for the **Library Management System**:
1. List all authors with their total number of books (including authors with 0 books)
2. Find the average book price per author
3. Find members who have borrowed more than 3 books
4. Find the most popular book category (by loan count)
5. Calculate the total inventory value (price × stock) per author
6. Find books that have never been borrowed

**Bonus:** Create a report showing monthly loan statistics with running totals.

---

## Day 35: MySQL Relationships, Normalization, Indexes

### Full Content

**Database Normalization**

Normalization organizes data to reduce redundancy and improve integrity.

**1NF (First Normal Form):**
- Eliminate repeating groups
- Each column contains atomic values
- Each row is unique

**2NF (Second Normal Form):**
- Must be in 1NF
- No partial dependencies (all non-key columns depend on the full primary key)

**3NF (Third Normal Form):**
- Must be in 2NF
- No transitive dependencies (non-key columns don't depend on other non-key columns)

**Example of Normalization:**

```sql
-- Unnormalized
CREATE TABLE orders_bad (
  order_id INT,
  customer_name VARCHAR(100),
  customer_email VARCHAR(150),
  product1 VARCHAR(100),
  product2 VARCHAR(100),
  product3 VARCHAR(100)
);

-- Normalized (3NF)
CREATE TABLE customers (
  customer_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL
);

CREATE TABLE products (
  product_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL
);

CREATE TABLE orders (
  order_id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id INT NOT NULL,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE order_items (
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  PRIMARY KEY (order_id, product_id),
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);
```

**Relationship Types:**

```sql
-- One-to-Many: Author has many Books
CREATE TABLE books (
  book_id INT PRIMARY KEY AUTO_INCREMENT,
  author_id INT,
  FOREIGN KEY (author_id) REFERENCES authors(author_id)
);

-- Many-to-Many: Books and Categories
CREATE TABLE categories (
  category_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL
);

CREATE TABLE book_categories (
  book_id INT NOT NULL,
  category_id INT NOT NULL,
  PRIMARY KEY (book_id, category_id),
  FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

-- One-to-One: User and Profile
CREATE TABLE users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE profiles (
  profile_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNIQUE NOT NULL,
  bio TEXT,
  avatar_url VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

**Indexes**

Indexes speed up queries but slow down writes.

```sql
-- Single column index
CREATE INDEX idx_books_title ON books(title);

-- Composite index (order matters!)
CREATE INDEX idx_books_author_price ON books(author_id, price);

-- Unique index
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- Full-text index (for text search)
CREATE FULLTEXT INDEX idx_books_description ON books(description);

-- Check existing indexes
SHOW INDEX FROM books;

-- Drop index
DROP INDEX idx_books_title ON books;
```

**When to Create Indexes:**
- Columns used in WHERE, JOIN, ORDER BY clauses
- Foreign key columns
- Columns with high selectivity (many unique values)
- Columns used in frequent queries

**When to Avoid Indexes:**
- Small tables
- Columns with low selectivity (few unique values)
- Tables with heavy write operations
- Columns not used in queries

### Quiz

**Question 1:** What is the purpose of normalization?
**Answer:** Normalization reduces data redundancy, prevents update/insert/delete anomalies, and ensures data integrity.

**Question 2:** What is a many-to-many relationship and how is it implemented?
**Answer:** A many-to-many relationship occurs when multiple rows in one table relate to multiple rows in another. It's implemented using a junction table containing foreign keys to both tables.

**Question 3:** How does an index improve query performance?
**Answer:** An index creates a data structure (typically a B-tree) that allows the database to find rows quickly without scanning the entire table.

**Question 4:** What is the trade-off of adding indexes?
**Answer:** Indexes speed up reads but slow down writes (INSERT, UPDATE, DELETE) because the index must be updated, and they consume additional storage.

### Task

Design a **normalized database schema** for an **E-Commerce Platform** with:
1. Users, products, categories, orders, order_items, reviews
2. Proper relationships (1:1, 1:M, M:N)
3. At least 5 indexes on frequently queried columns
4. Constraints (unique, check, foreign keys)
5. Sample data demonstrating all relationships

**Bonus:** Write a query that uses a composite index and verify it's being used with `EXPLAIN`.

---

## Day 36: REST Principles & Status Codes

### Full Content

**REST Principles**

REST (Representational State Transfer) is an architectural style for designing networked applications.

**Six REST Constraints:**
1. **Client-Server:** Separation of concerns between UI and data storage
2. **Stateless:** Each request contains all information needed; server doesn't store client state
3. **Cacheable:** Responses must define themselves as cacheable or not
4. **Uniform Interface:** Consistent resource identification and manipulation
5. **Layered System:** Client doesn't know if connected directly to server or intermediary
6. **Code on Demand (optional):** Server can send executable code to client

**Resource Naming Conventions:**

```
GET    /api/users           # List users
GET    /api/users/:id       # Get one user
POST   /api/users           # Create user
PUT    /api/users/:id       # Full update
PATCH  /api/users/:id       # Partial update
DELETE /api/users/:id       # Delete user

GET    /api/users/:id/posts # Nested resource
GET    /api/posts?author=1  # Filtering via query params
GET    /api/posts?page=2&limit=10  # Pagination
```

**HTTP Status Codes**

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Missing/invalid auth token |
| 403 | Forbidden | Authenticated but not authorized |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource |
| 422 | Unprocessable Entity | Semantic validation error |
| 500 | Internal Server Error | Unexpected server error |

**Complete API Example:**

```javascript
// GET /api/users - List users
exports.getUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const [users] = await db.query(
    "SELECT id, name, email, created_at FROM users LIMIT ? OFFSET ?",
    [limit, offset]
  );
  const [[{ total }]] = await db.query("SELECT COUNT(*) AS total FROM users");

  res.status(200).json({
    data: users,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
};

// POST /api/users - Create user
exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({
      error: { code: "VALIDATION_ERROR", message: "All fields are required" },
    });
  }

  const [result] = await db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, await bcrypt.hash(password, 10)]
  );

  res.status(201).json({
    data: { id: result.insertId, name, email },
  });
};

// GET /api/users/:id - Get one user
exports.getUser = async (req, res) => {
  const [users] = await db.query(
    "SELECT id, name, email FROM users WHERE id = ?",
    [req.params.id]
  );

  if (users.length === 0) {
    return res.status(404).json({
      error: { code: "USER_NOT_FOUND", message: "User not found" },
    });
  }

  res.status(200).json({ data: users[0] });
};

// DELETE /api/users/:id - Delete user
exports.deleteUser = async (req, res) => {
  const [result] = await db.query("DELETE FROM users WHERE id = ?", [
    req.params.id,
  ]);

  if (result.affectedRows === 0) {
    return res.status(404).json({
      error: { code: "USER_NOT_FOUND", message: "User not found" },
    });
  }

  res.status(204).send();
};
```

### Quiz

**Question 1:** What does status code 201 mean?
**Answer:** 201 Created indicates that a request (typically POST) successfully created a new resource.

**Question 2:** What is the difference between 401 and 403?
**Answer:** 401 Unauthorized means authentication is missing or invalid. 403 Forbidden means the user is authenticated but lacks permission.

**Question 3:** Why is REST stateless?
**Answer:** Being stateless means each request contains all information needed to process it. The server doesn't store client context between requests, improving scalability and reliability.

**Question 4:** What status code should a successful DELETE return?
**Answer:** 204 No Content (or 200 OK if returning a response body).

### Task

Build a **REST API** for a **Task Manager** following REST principles:
1. Proper resource naming (`/api/tasks`, `/api/tasks/:id`)
2. Correct HTTP methods and status codes
3. Consistent JSON response format
4. Pagination for list endpoints
5. Filtering and sorting via query parameters
6. Proper error responses with codes

**Bonus:** Document your API with an OpenAPI/Swagger specification.

---

## Day 37: Build API: Express + MySQL

### Full Content

**Complete Project Structure**

```
src/
├── config/
│   └── database.js
├── controllers/
│   ├── taskController.js
│   └── userController.js
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   └── validate.js
├── models/
│   └── taskModel.js
├── routes/
│   ├── taskRoutes.js
│   └── userRoutes.js
├── errors/
│   └── AppError.js
├── utils/
│   └── catchAsync.js
├── app.js
└── server.js
```

**Database Connection Pool**

```javascript
// config/database.js
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "task_manager",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
});

// Test connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("MySQL connected successfully");
    connection.release();
  } catch (err) {
    console.error("MySQL connection failed:", err.message);
    process.exit(1);
  }
})();

module.exports = pool;
```

**Model Layer**

```javascript
// models/taskModel.js
const pool = require("../config/database");

const Task = {
  async findAll({ userId, status, page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    let query = "SELECT * FROM tasks WHERE user_id = ?";
    const params = [userId];

    if (status) {
      query += " AND status = ?";
      params.push(status);
    }

    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    return rows;
  },

  async findById(id, userId) {
    const [rows] = await pool.query(
      "SELECT * FROM tasks WHERE id = ? AND user_id = ?",
      [id, userId]
    );
    return rows[0];
  },

  async create({ title, description, userId }) {
    const [result] = await pool.query(
      "INSERT INTO tasks (title, description, user_id) VALUES (?, ?, ?)",
      [title, description, userId]
    );
    return this.findById(result.insertId, userId);
  },

  async update(id, userId, updates) {
    const fields = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = [...Object.values(updates), id, userId];

    await pool.query(
      `UPDATE tasks SET ${fields} WHERE id = ? AND user_id = ?`,
      values
    );
    return this.findById(id, userId);
  },

  async delete(id, userId) {
    const [result] = await pool.query(
      "DELETE FROM tasks WHERE id = ? AND user_id = ?",
      [id, userId]
    );
    return result.affectedRows > 0;
  },

  async countByUser(userId) {
    const [[{ total }]] = await pool.query(
      "SELECT COUNT(*) AS total FROM tasks WHERE user_id = ?",
      [userId]
    );
    return total;
  },
};

module.exports = Task;
```

**Controller Layer**

```javascript
// controllers/taskController.js
const Task = require("../models/taskModel");
const catchAsync = require("../utils/catchAsync");
const { NotFoundError, ValidationError } = require("../errors/AppError");

exports.getTasks = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status;

  const tasks = await Task.findAll({
    userId: req.user.id,
    status,
    page,
    limit,
  });
  const total = await Task.countByUser(req.user.id);

  res.json({
    data: tasks,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

exports.getTask = catchAsync(async (req, res) => {
  const task = await Task.findById(req.params.id, req.user.id);
  if (!task) throw new NotFoundError("Task not found");
  res.json({ data: task });
});

exports.createTask = catchAsync(async (req, res) => {
  const { title, description } = req.body;
  if (!title) throw new ValidationError("Title is required");

  const task = await Task.create({
    title,
    description,
    userId: req.user.id,
  });
  res.status(201).json({ data: task });
});

exports.updateTask = catchAsync(async (req, res) => {
  const { title, description, status } = req.body;
  const updates = {};
  if (title) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (status) updates.status = status;

  const task = await Task.update(req.params.id, req.user.id, updates);
  if (!task) throw new NotFoundError("Task not found");
  res.json({ data: task });
});

exports.deleteTask = catchAsync(async (req, res) => {
  const deleted = await Task.delete(req.params.id, req.user.id);
  if (!deleted) throw new NotFoundError("Task not found");
  res.status(204).send();
});
```

**Routes**

```javascript
// routes/taskRoutes.js
const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const authenticate = require("../middleware/auth");

router.use(authenticate); // All routes require auth

router
  .route("/")
  .get(taskController.getTasks)
  .post(taskController.createTask);

router
  .route("/:id")
  .get(taskController.getTask)
  .patch(taskController.updateTask)
  .delete(taskController.deleteTask);

module.exports = router;
```

### Quiz

**Question 1:** Why use a connection pool instead of single connections?
**Answer:** Connection pools reuse database connections, reducing the overhead of creating new connections for each request and improving performance under load.

**Question 2:** How do you prevent SQL injection?
**Answer:** Use parameterized queries (prepared statements) with `?` placeholders, never string concatenation.

**Question 3:** Why separate models from controllers?
**Answer:** Models encapsulate data logic and database queries, while controllers handle HTTP concerns. This separation makes code more testable and maintainable.

**Question 4:** What is the purpose of `req.user`?
**Answer:** `req.user` is set by authentication middleware and contains the authenticated user's data, allowing controllers to scope operations to the current user.

### Task

Build a complete **Task Manager API** with:
1. User registration and login
2. JWT authentication middleware
3. CRUD operations for tasks (scoped to user)
4. Pagination and filtering
5. MySQL database with proper schema
6. Error handling and validation
7. Connection pooling

**Bonus:** Add task categories and allow filtering by category.

---

## Day 38: bcrypt, Sessions vs JWT

### Full Content

**Password Hashing with bcrypt**

bcrypt is a password-hashing function designed to be slow, making brute-force attacks impractical.

```javascript
const bcrypt = require("bcrypt");

// Hash password (during registration)
const saltRounds = 10;
const hashedPassword = await bcrypt.hash("userPassword123", saltRounds);
// Store hashedPassword in database

// Verify password (during login)
const isMatch = await bcrypt.compare("userPassword123", hashedPassword);
if (isMatch) {
  console.log("Password correct");
} else {
  console.log("Invalid password");
}
```

**Sessions vs JWT**

| Feature | Sessions | JWT |
|---------|----------|-----|
| Storage | Server-side (memory, Redis) | Client-side (token) |
| Scalability | Requires shared store | Stateless, easily scalable |
| Revocation | Easy (delete session) | Difficult (need blacklist) |
| Size | Small cookie | Larger token |
| Security | Cookie-based | Token-based |

**Session-Based Auth:**

```javascript
const session = require("express-session");

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}));

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  req.session.userId = user.id;
  res.json({ message: "Logged in" });
});
```

**JWT-Based Auth:**

```javascript
const jwt = require("jsonwebtoken");

// Generate token
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
}

// Generate refresh token
function generateRefreshToken(user) {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
}

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const accessToken = generateToken(user);
  const refreshToken = generateRefreshToken(user);

  // Set refresh token as HTTP-only cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken, user: { id: user.id, email: user.email, role: user.role } });
});

// Refresh endpoint
app.post("/refresh", (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.status(401).json({ error: "No refresh token" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    const accessToken = generateToken(user);
    res.json({ accessToken });
  } catch (err) {
    res.status(401).json({ error: "Invalid refresh token" });
  }
});
```

### Quiz

**Question 1:** Why is bcrypt preferred over MD5 or SHA for passwords?
**Answer:** bcrypt is intentionally slow and includes a salt, making brute-force and rainbow table attacks impractical. MD5 and SHA are fast, making them vulnerable.

**Question 2:** What is the main advantage of JWT over sessions?
**Answer:** JWT is stateless — the server doesn't need to store session data, making it easier to scale horizontally across multiple servers.

**Question 3:** Where should JWT tokens be stored?
**Answer:** Access tokens in memory (not localStorage), refresh tokens in HTTP-only cookies.

**Question 4:** What is the purpose of a refresh token?
**Answer:** Refresh tokens allow obtaining new access tokens without re-authenticating, enabling short-lived access tokens for better security.

### Task

Implement **authentication** for the Task Manager API:
1. User registration with bcrypt password hashing
2. Login endpoint returning JWT access token
3. Refresh token endpoint
4. Logout endpoint (clears refresh token)
5. Password change endpoint
6. Token expiry handling

**Bonus:** Add rate limiting to prevent brute-force attacks on login.

---

## Day 39: JWT + RBAC Middleware

### Full Content

**Authentication Middleware**

```javascript
// middleware/auth.js
const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../errors/AppError");

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new UnauthorizedError("No token provided"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new UnauthorizedError("Token expired"));
    }
    return next(new UnauthorizedError("Invalid token"));
  }
}

module.exports = authenticate;
```

**RBAC Middleware**

```javascript
// middleware/authorize.js
const { ForbiddenError } = require("../errors/AppError");

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError("Not authenticated"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError("Insufficient permissions"));
    }

    next();
  };
}

module.exports = authorize;

// Usage
router.get("/admin/users", 
  authenticate, 
  authorize("admin"), 
  userController.getAllUsers
);

router.delete("/users/:id",
  authenticate,
  authorize("admin", "moderator"),
  userController.deleteUser
);
```

**Resource-Level Authorization**

```javascript
// middleware/checkOwnership.js
const Task = require("../models/taskModel");

function checkTaskOwnership(req, res, next) {
  return async (req, res, next) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return next(new NotFoundError("Task not found"));
    }

    // Admin can access any task
    if (req.user.role === "admin") return next();

    // Users can only access their own tasks
    if (task.user_id !== req.user.id) {
      return next(new ForbiddenError("You don't own this task"));
    }

    req.task = task;
    next();
  };
}
```

**Role-Based Route Protection:**

```javascript
// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const adminController = require("../controllers/adminController");

router.use(authenticate);
router.use(authorize("admin"));

router.get("/users", adminController.getAllUsers);
router.delete("/users/:id", adminController.deleteUser);
router.get("/stats", adminController.getStats);

module.exports = router;
```

**User Roles Schema:**

```sql
ALTER TABLE users ADD COLUMN role ENUM('user', 'moderator', 'admin') DEFAULT 'user';

-- Update existing users
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

### Quiz

**Question 1:** What is the difference between authentication and authorization?
**Answer:** Authentication verifies who the user is (login). Authorization determines what the authenticated user can do (permissions).

**Question 2:** How does RBAC middleware work?
**Answer:** RBAC middleware checks if the authenticated user's role is in the allowed roles list. If not, it returns 403 Forbidden.

**Question 3:** Why check resource ownership separately from role?
**Answer:** A user may have permission to access a resource type (e.g., tasks) but should only access their own resources. Ownership checks prevent users from accessing others' data.

**Question 4:** What status code should be returned for insufficient permissions?
**Answer:** 403 Forbidden.

### Task

Add **RBAC** to the Task Manager API:
1. Add `role` column to users (`user`, `moderator`, `admin`)
2. Admin routes: list all users, delete any task, view statistics
3. Moderator routes: delete any task, view all tasks
4. User routes: manage own tasks only
5. Ownership check middleware for task operations

**Bonus:** Add a permission system where admins can grant specific permissions to users.

---

## Day 40: React ↔ API, Proxy, Env

### Full Content

**API Client Setup**

```javascript
// src/api/client.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor - attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Token expired - try refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post("/api/auth/refresh", {}, {
          withCredentials: true,
        });
        localStorage.setItem("accessToken", data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

**API Service Layer**

```javascript
// src/api/tasks.js
import api from "./client";

export const taskService = {
  getAll: (params) => api.get("/tasks", { params }),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post("/tasks", data),
  update: (id, data) => api.patch(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
};

// src/api/auth.js
export const authService = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (data) => api.post("/auth/register", data),
  logout: () => api.post("/auth/logout"),
  getProfile: () => api.get("/auth/me"),
};
```

**Vite Proxy Configuration**

```javascript
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/uploads": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
```

**Environment Variables in Vite**

```bash
# .env.development
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Task Manager

# .env.production
VITE_API_URL=https://api.myapp.com/api
VITE_APP_NAME=Task Manager
```

```javascript
// Usage in React
const apiUrl = import.meta.env.VITE_API_URL;
const appName = import.meta.env.VITE_APP_NAME;
```

**Important:** Only variables prefixed with `VITE_` are exposed to the client. Never put secrets in `VITE_` variables.

**Custom Hook for API Calls**

```javascript
// src/hooks/useApi.js
import { useState, useEffect, useCallback } from "react";

export function useApi(apiFunc, immediate = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFunc(...args);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || { message: err.message });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  useEffect(() => {
    if (immediate) execute();
  }, [execute, immediate]);

  return { data, loading, error, execute, setData };
}
```

### Quiz

**Question 1:** Why use a proxy in development?
**Answer:** A proxy forwards API requests from the frontend dev server to the backend, avoiding CORS issues during development.

**Question 2:** How do you handle token refresh in an API client?
**Answer:** Use a response interceptor that catches 401 errors, attempts to refresh the token, and retries the original request.

**Question 3:** Why should secrets not be in `VITE_` environment variables?
**Answer:** `VITE_` variables are embedded in the client bundle and visible to anyone, so they must never contain secrets.

**Question 4:** What is the benefit of a service layer for API calls?
**Answer:** It centralizes API logic, makes components cleaner, and provides a single place to update endpoints or request configurations.

### Task

Set up **frontend-backend integration** for the Task Manager:
1. Configure Vite proxy for `/api` and `/uploads`
2. Create an axios client with interceptors
3. Build a task service with CRUD methods
4. Create a `useApi` custom hook
5. Implement token refresh flow
6. Add environment variables for API URL

**Bonus:** Add request cancellation using AbortController.

---

## Day 41: End-to-End CRUD Feature

### Full Content

**Complete CRUD Implementation**

```jsx
// pages/TasksPage.jsx
import { useState, useEffect } from "react";
import { taskService } from "../api/tasks";
import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  async function fetchTasks() {
    try {
      setLoading(true);
      const params = filter !== "all" ? { status: filter } : {};
      const { data } = await taskService.getAll(params);
      setTasks(data.data);
    } catch (err) {
      setError(err.response?.data?.error?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(taskData) {
    try {
      const { data } = await taskService.create(taskData);
      setTasks((prev) => [data.data, ...prev]);
    } catch (err) {
      setError(err.response?.data?.error?.message || "Failed to create task");
    }
  }

  async function handleUpdate(id, updates) {
    try {
      const { data } = await taskService.update(id, updates);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? data.data : t))
      );
    } catch (err) {
      setError(err.response?.data?.error?.message || "Failed to update task");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this task?")) return;
    try {
      await taskService.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.response?.data?.error?.message || "Failed to delete task");
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="tasks-page">
      <h1>My Tasks</h1>

      <div className="filter-bar">
        {["all", "pending", "in_progress", "completed"].map((status) => (
          <button
            key={status}
            className={filter === status ? "active" : ""}
            onClick={() => setFilter(status)}
          >
            {status.replace("_", " ")}
          </button>
        ))}
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      <TaskForm onSubmit={handleCreate} />

      <ul className="task-list">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
      </ul>

      {tasks.length === 0 && (
        <p className="empty-state">No tasks found. Create one above!</p>
      )}
    </div>
  );
}
```

**Task Item Component**

```jsx
// components/TaskItem.jsx
import { useState } from "react";

export default function TaskItem({ task, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  function handleToggle() {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    onUpdate(task.id, { status: newStatus });
  }

  function handleSave() {
    if (editTitle.trim()) {
      onUpdate(task.id, { title: editTitle.trim() });
      setIsEditing(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setEditTitle(task.title);
      setIsEditing(false);
    }
  }

  return (
    <li className={`task-item ${task.status}`}>
      <input
        type="checkbox"
        checked={task.status === "completed"}
        onChange={handleToggle}
      />

      {isEditing ? (
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <span
          className="task-title"
          onDoubleClick={() => setIsEditing(true)}
        >
          {task.title}
        </span>
      )}

      <span className={`badge badge-${task.status}`}>{task.status}</span>

      <button onClick={() => setIsEditing(true)}>Edit</button>
      <button onClick={() => onDelete(task.id)} className="danger">
        Delete
      </button>
    </li>
  );
}
```

### Quiz

**Question 1:** How do you ensure the UI updates after a CRUD operation?
**Answer:** Update local state optimistically or refetch data from the API after the operation completes.

**Question 2:** Why use `key={task.id}` in the task list?
**Answer:** React uses keys to efficiently reconcile list items. Using the database ID ensures stable identity across re-renders.

**Question 3:** How do you handle loading and error states?
**Answer:** Use state variables (`loading`, `error`) that are set before/after API calls and conditionally render loading spinners or error messages.

**Question 4:** What is optimistic UI updates?
**Answer:** Updating the UI immediately before the server confirms the operation, then reverting if it fails. This makes the app feel faster.

### Task

Build a complete **CRUD feature** for a **Product Management** page:
1. List products with pagination
2. Create product form with validation
3. Edit product inline or in a modal
4. Delete with confirmation
5. Search/filter products
6. Loading and error states
7. Optimistic updates

**Bonus:** Add image upload for products.

---

## Day 42: Jest, Supertest, Debugging

### Full Content

**Testing Setup**

```bash
npm install --save-dev jest supertest
```

```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "testEnvironment": "node",
    "setupFilesAfterSetup": ["./tests/setup.js"]
  }
}
```

**Integration Testing with Supertest**

Supertest tests HTTP endpoints without starting a real server on a port.

```javascript
// tests/task.test.js
const request = require("supertest");
const app = require("../src/app");
const pool = require("../src/config/database");

describe("Task API", () => {
  let authToken;
  let taskId;

  beforeAll(async () => {
    // Create test user and get token
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Test User", email: "test@test.com", password: "password123" });
    authToken = res.body.data.accessToken;
  });

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    // Clean up test data
    await pool.query("DELETE FROM tasks WHERE user_id = ?", [userId]);
  });

  describe("POST /api/tasks", () => {
    it("should create a task", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ title: "Test Task", description: "Test description" });

      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data.title).toBe("Test Task");
      taskId = res.body.data.id;
    });

    it("should return 400 for missing title", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ description: "No title" });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("should return 401 without token", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .send({ title: "Test" });

      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/tasks", () => {
    it("should return user's tasks", async () => {
      await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ title: "Task 1" });

      const res = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe("PATCH /api/tasks/:id", () => {
    it("should update a task", async () => {
      const createRes = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ title: "Original" });

      const res = await request(app)
        .patch(`/api/tasks/${createRes.body.data.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ title: "Updated" });

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe("Updated");
    });
  });

  describe("DELETE /api/tasks/:id", () => {
    it("should delete a task", async () => {
      const createRes = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ title: "To Delete" });

      const res = await request(app)
        .delete(`/api/tasks/${createRes.body.data.id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(204);
    });
  });
});
```

**Debugging Techniques**

```javascript
// Using debugger
function calculateTotal(items) {
  debugger; // Execution pauses here in Chrome DevTools
  return items.reduce((sum, item) => sum + item.price, 0);
}

// Console debugging
console.log("Variable:", variable);
console.table(arrayOfObjects);
console.time("operation");
// ... code
console.timeEnd("operation");

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, {
    body: req.body,
    query: req.query,
    params: req.params,
    headers: {
      authorization: req.headers.authorization ? "present" : "missing",
    },
  });
  next();
});
```

**Testing Best Practices:**
- Test both success and error cases
- Use descriptive test names
- Clean up test data in `afterEach`/`afterAll`
- Don't test implementation details, test behavior
- Use `beforeEach` to reset state
- Mock external services

### Quiz

**Question 1:** Why should the Express app be exported without calling `app.listen()`?
**Answer:** Supertest binds the app to an ephemeral port for testing, avoiding port conflicts and allowing parallel test execution.

**Question 2:** What should you test for each endpoint?
**Answer:** Success responses, validation errors, authentication errors, authorization errors, and not-found cases.

**Question 3:** How do you clean up test data?
**Answer:** Use `afterEach` or `afterAll` hooks to delete test records, or use a transaction that rolls back.

**Question 4:** What is the difference between unit and integration tests?
**Answer:** Unit tests test individual functions in isolation. Integration tests test how multiple components work together, like an API endpoint with its database.

### Task

Write **integration tests** for the Task Manager API:
1. Test all CRUD endpoints
2. Test authentication required
3. Test validation errors
4. Test ownership (users can't access others' tasks)
5. Test pagination
6. Achieve >80% coverage

**Bonus:** Add a test for the token refresh flow.

---

## Day 43: Build, Host, Deploy, CI

### Full Content

**Building for Production**

```bash
# Frontend build
cd client
npm run build
# Creates dist/ folder with optimized static files

# Backend - no build needed for Node.js, but validate:
node -c src/server.js  # Syntax check
npm test                 # Run tests
```

**Deployment Options**

| Platform | Frontend | Backend | Database |
|----------|----------|---------|----------|
| Vercel | ✅ | ✅ (Serverless) | External |
| Netlify | ✅ | ❌ | External |
| Railway | ✅ | ✅ | ✅ MySQL |
| Render | ✅ | ✅ | ✅ MySQL |
| AWS EC2 | ✅ | ✅ | ✅ |
| DigitalOcean | ✅ | ✅ | ✅ |

**GitHub Actions CI/CD**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
          cache-dependency-path: |
            server/package-lock.json
            client/package-lock.json

      - name: Install backend dependencies
        working-directory: ./server
        run: npm ci

      - name: Run backend tests
        working-directory: ./server
        run: npm test
        env:
          NODE_ENV: test
          DB_HOST: localhost
          DB_USER: root
          DB_PASSWORD: root
          DB_NAME: test_db
          JWT_SECRET: test-secret

      - name: Install frontend dependencies
        working-directory: ./client
        run: npm ci

      - name: Build frontend
        working-directory: ./client
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Railway
        uses: railwayapp/cli@latest
        with:
          command: up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

**Environment Configuration for Production**

```bash
# Backend .env.production
NODE_ENV=production
PORT=3000
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
JWT_SECRET=your-production-secret
JWT_REFRESH_SECRET=your-refresh-secret
CLIENT_URL=https://your-frontend.com
```

**Docker Deployment**

```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "src/server.js"]
```

```yaml
# docker-compose.yml
version: "3.8"
services:
  api:
    build: ./server
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=db
    depends_on:
      - db

  db:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: task_manager
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

volumes:
  mysql_data:
```

### Quiz

**Question 1:** Why run tests before deploying?
**Answer:** Tests catch regressions and ensure the deployed code works correctly, preventing broken deployments from reaching users.

**Question 2:** What is the difference between CI and CD?
**Answer:** CI (Continuous Integration) automatically tests code changes. CD (Continuous Deployment) automatically deploys passing changes to production.

**Question 3:** Why should environment variables be used instead of hardcoded values?
**Answer:** They allow different configurations per environment without changing code, and keep secrets out of version control.

**Question 4:** What is the purpose of a multi-stage Docker build?
**Answer:** It separates build-time dependencies from runtime, resulting in smaller production images.

### Task

Set up **CI/CD** for the Task Manager:
1. Create a GitHub Actions workflow that runs tests on push
2. Add a build step for the frontend
3. Configure deployment to a hosting platform (Railway, Render, or Vercel)
4. Add environment secrets to GitHub repository
5. Test the pipeline by pushing a change

**Bonus:** Add a staging deployment that runs on pull requests.

---

## Day 44: Final Project — Requirements + Architecture + Build

### Full Content

**Project Requirements Document**

```markdown
# Project: [Your App Name]

## Problem Statement
[Describe the problem your app solves]

## Target Users
[Who will use this app?]

## Core Features
1. User authentication (register, login, logout)
2. [Feature 2 - CRUD operation]
3. [Feature 3 - Search/filter]
4. [Feature 4 - Dashboard/stats]
5. [Feature 5 - Admin panel]

## Technical Requirements
- Frontend: React + Vite + React Router
- Backend: Node.js + Express
- Database: MySQL
- Auth: JWT with refresh tokens
- Testing: Jest + Supertest
- Deployment: [Platform]

## Non-Functional Requirements
- Responsive design (mobile + desktop)
- API response time < 500ms
- Password hashing with bcrypt
- Input validation on all forms
- Error handling with user-friendly messages
```

**Architecture Diagram**

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   React     │────▶│   Express   │────▶│    MySQL    │
│  (Vite)     │◀────│   API       │◀────│  Database   │
│  Port 5173  │     │  Port 3000  │     │  Port 3306  │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │
       │                   │
       ▼                   ▼
┌─────────────┐     ┌─────────────┐
│  Vercel/    │     │  Railway/   │
│  Netlify    │     │  Render     │
└─────────────┘     └─────────────┘
```

**Database Schema**

```sql
-- Users
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- [Your main resource]
CREATE TABLE items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status ENUM('active', 'completed') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_status (user_id, status)
);
```

**Sprint Plan**

| Day | Tasks |
|-----|-------|
| 1 | Project setup, auth backend, database schema |
| 2 | CRUD API, validation, error handling |
| 3 | Frontend auth pages, API client, routing |
| 4 | CRUD frontend, list/detail/form components |
| 5 | Testing, polish, deployment, documentation |

### Quiz

**Question 1:** Why create a requirements document before coding?
**Answer:** It clarifies scope, prevents feature creep, and ensures alignment between what's needed and what's built.

**Question 2:** What should an architecture diagram show?
**Answer:** Components, their responsibilities, data flow, and external dependencies.

**Question 3:** Why plan sprints for a project?
**Answer:** Sprints break large projects into manageable chunks, provide clear daily goals, and enable progress tracking.

### Task

Create your **Final Project Plan**:
1. Write a requirements document
2. Design the database schema (ER diagram)
3. Draw the architecture diagram
4. List all API endpoints
5. Create a sprint plan
6. Set up the project structure

**Deliverable:** A complete project plan document.

---

## Day 45: Final Project — Build, Review, Present, Evaluate

### Full Content

**Build Phase Checklist**

```
Backend:
□ Database schema created
□ All API endpoints implemented
□ Authentication working
□ Validation on all inputs
□ Error handling with consistent format
□ Tests passing (unit + integration)
□ Environment variables configured
□ CORS configured correctly

Frontend:
□ All pages implemented
□ Auth flow working (login, register, logout)
□ CRUD operations working
□ Loading/error states handled
□ Responsive design
□ API integration working
□ Environment variables configured

DevOps:
□ GitHub Actions pipeline working
□ Deployed to production
□ Environment secrets configured
□ Database migrations applied
□ SSL/HTTPS enabled

Documentation:
□ README with setup instructions
□ API documentation
□ Architecture overview
□ User guide
```

**Code Review Checklist**

```markdown
## Code Review Checklist

### Functionality
- [ ] Feature works as specified
- [ ] Edge cases handled
- [ ] Error cases handled gracefully

### Code Quality
- [ ] Follows project conventions
- [ ] No console.log statements in production code
- [ ] No commented-out code
- [ ] Meaningful variable/function names
- [ ] Functions are small and focused

### Security
- [ ] No secrets in code
- [ ] Input validated on server
- [ ] SQL injection prevented (parameterized queries)
- [ ] XSS prevented (output encoding)
- [ ] CORS configured correctly
- [ ] Rate limiting on auth endpoints

### Performance
- [ ] Database queries optimized (indexes)
- [ ] No N+1 queries
- [ ] Pagination implemented
- [ ] Frontend bundle optimized
```

**Presentation Structure**

```markdown
# Final Project Presentation (10 minutes)

## 1. Introduction (1 min)
- Project name and purpose
- Target users

## 2. Demo (3 min)
- Live walkthrough
- Key features
- User flows

## 3. Technical Overview (3 min)
- Architecture
- Tech stack
- Database design
- API design

## 4. Challenges & Solutions (1 min)
- Technical challenges faced
- How you solved them

## 5. Lessons Learned (1 min)
- What you'd do differently
- Key takeaways

## 6. Q&A (1 min)
```

**Evaluation Rubric**

| Criteria | Weight | Excellent (4) | Good (3) | Needs Work (2) |
|----------|--------|---------------|----------|----------------|
| Functionality | 25% | All features work perfectly | Most features work | Some features broken |
| Code Quality | 20% | Clean, well-organized, documented | Mostly clean | Messy, hard to follow |
| Security | 15% | All best practices followed | Most practices followed | Security issues present |
| Testing | 15% | Comprehensive tests, >80% coverage | Basic tests | Minimal/no tests |
| UI/UX | 10% | Polished, responsive, intuitive | Functional | Poor UX |
| Deployment | 10% | Fully deployed, CI/CD working | Deployed manually | Not deployed |
| Presentation | 5% | Clear, engaging, well-structured | Adequate | Unclear |

### Quiz

**Question 1:** Why is a code review important?
**Answer:** Code reviews catch bugs, ensure consistency, share knowledge, and improve code quality through peer feedback.

**Question 2:** What makes a good technical presentation?
**Answer:** Clear structure, live demo, focus on key decisions and challenges, and respect for time limits.

**Question 3:** What should you do if a feature isn't working during the demo?
**Answer:** Acknowledge it calmly, explain what should happen, and show the code or test that demonstrates correct behavior.

**Question 4:** What is the most important lesson from building a full-stack project?
**Answer:** Understanding how all layers (frontend, backend, database, deployment) work together and the importance of planning, testing, and incremental progress.

### Task

**Complete and Submit Your Final Project:**

1. **Build:** Implement all features according to your plan
2. **Test:** Write integration tests, aim for >80% coverage
3. **Deploy:** Deploy frontend and backend to production
4. **Document:** Write a comprehensive README
5. **Review:** Conduct a self-review using the checklist
6. **Present:** Prepare a 10-minute presentation
7. **Evaluate:** Submit your project with all deliverables

**Deliverables:**
- GitHub repository with full source code
- Deployed application URL
- README with setup and API documentation
- Test suite with coverage report
- Presentation slides



**Key Technologies Covered:**
- **Frontend:** React, React Router, Axios, Vite
- **Backend:** Node.js, Express, JWT, bcrypt
- **Database:** MySQL, connection pooling, joins, indexes
- **Testing:** Jest, Supertest
- **DevOps:** GitHub Actions, Docker, deployment

**Core Skills Developed:**
- Building RESTful APIs with proper status codes
- Implementing secure authentication with JWT and RBAC
- Designing normalized database schemas
- Integrating React frontends with Express backends
- Writing integration tests for APIs
- Deploying full-stack applications with CI/CD

