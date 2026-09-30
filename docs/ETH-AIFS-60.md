# ETH-AIFS-60: Advanced Full Stack + AI Developer Internship — Complete 60-Day Curriculum

**Course Code:** `ETH-AIFS-60` | **Total Duration:** 60 Days | **Modules:** 22 | **Daily Structure:** Concepts → Code Walkthrough → Quiz → Hands-On Task → AI Tool Spotlight


## Module 01: Full Stack Development Foundation (Days 1–2)

### Day 1 — How the Web Works & the Full Stack Landscape

**Learning Objectives:** Understand the client-server model, HTTP request/response cycle, DNS, and how frontend, backend, and database layers connect.

**Core Content:**

Every web application rests on a simple loop: a client (browser) sends an HTTP request to a server, the server processes it, queries a database if needed, and returns an HTTP response. The frontend is everything the user sees and interacts with — HTML structure, CSS styling, and JavaScript behaviour. The backend is the server-side logic that handles authentication, business rules, and data persistence. The database stores and retrieves data.

When you type a URL, DNS resolves the domain to an IP address. Your browser opens a TCP connection, sends an HTTP request with a method (GET, POST, PUT, DELETE), headers, and optionally a body. The server receives it, routes it to the correct handler, may query a database, and sends back a status code (200 OK, 404 Not Found, 500 Internal Server Error) along with a response body.

**Code Walkthrough: A Minimal HTTP Server in Node.js**

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  // Log the request method and URL
  console.log(`${req.method} ${req.url}`);

  // Route handling
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Welcome to ETH-AIFS-60' }));
  } else if (req.url === '/api/courses' && req.method === 'GET') {
    const courses = [
      { id: 1, name: 'HTML5' },
      { id: 2, name: 'React.js' },
    ];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(courses));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not found' }));
  }
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

**Explanation:** `http.createServer` creates a server instance. The callback receives `req` (incoming request with method, URL, headers) and `res` (response object used to set status code, headers, and body). `writeHead` sets the HTTP status code and response headers. `res.end()` sends the response body and closes the connection. This is the raw foundation that Express.js abstracts.

**Quiz:**
1. What happens when you type a URL into the browser? (DNS → TCP → HTTP request → server → response)
2. Difference between 200, 404, and 500 status codes.
3. What is the role of the database in a full stack application?
4. Why is HTTP called a "stateless" protocol?
5. What is the difference between frontend and backend?

**Task:** Install Node.js and create the minimal HTTP server above. Add a third route `/api/health` that returns `{ status: 'ok', timestamp: new Date().toISOString() }`. Test all three routes using your browser and `curl`.

**AI Tool Spotlight:** Use **Free.ai Coder** (`pip install freeai-code`) to ask: `free-code ask "Explain what this HTTP server code does line by line"`. It reads your codebase and explains the flow. Free tier: 50K tokens/day.

---

### Day 2 — Environment Setup, CLI, and Developer Workflow

**Learning Objectives:** Set up a professional development environment with VS Code, terminal fundamentals, and Node.js tooling.

**Core Content:**

A productive developer environment reduces friction. Install VS Code with extensions: ESLint, Prettier, GitLens, and Thunder Client (API testing). Learn the terminal: `cd`, `ls`, `mkdir`, `touch`, `cat`, `grep`, `pwd`. Learn Node.js tooling: `npm init -y`, `npm install <package>`, `npm run <script>`, `npx <command>`.

Understand `package.json` — the manifest of your project. `dependencies` are packages your app needs in production; `devDependencies` are tools used during development. `scripts` define reusable commands. Node Version Manager (nvm) lets you switch between Node versions per project.

**Code Walkthrough: Your First npm Project**

```bash
mkdir eth-aifs-demo && cd eth-aifs-demo
npm init -y
npm install express cors dotenv
npm install --save-dev nodemon
```

```json
// package.json (after editing scripts)
{
  "name": "eth-aifs-demo",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "express": "^4.21.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  }
}
```

**Explanation:** `npm init -y` generates a default `package.json`. `npm install` adds production dependencies; `--save-dev` adds development-only dependencies. `nodemon` watches for file changes and restarts the server automatically — a massive productivity boost. `dotenv` loads environment variables from a `.env` file.

**Quiz:**
1. What is the difference between `dependencies` and `devDependencies`?
2. What does `nodemon` do that `node` alone does not?
3. How do you run a custom npm script?
4. What is the purpose of a `.gitignore` file?
5. Explain what `npx` does differently from `npm`.

**Task:** Create a new project, install Express and Nodemon, create an `index.js` that starts a server on port 4000, and add `"dev": "nodemon index.js"` to scripts. Run `npm run dev` and verify the server starts. Change the response message, save, and verify Nodemon restarted automatically.

**AI Tool Spotlight:** Use **OpenCode** — open-source, provider-agnostic AI coding agent that runs in the terminal or IDE. Install via `curl -fsSL https://opencode.ai/install | bash`. Ask it to generate a `.gitignore` for Node.js projects.


## Module 02: HTML5 (Days 3–4)

### Day 3 — Semantic HTML5 & Document Structure

**Learning Objectives:** Master HTML5 semantic elements, document structure, and accessibility-first markup.

**Core Content:**

HTML5 introduced semantic elements that give meaning to content beyond generic `<div>` elements: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`, `<figure>`, `<figcaption>`. These improve accessibility (screen readers understand structure) and SEO (search engines prioritize semantic content).

The HTML5 boilerplate is minimal: `<!DOCTYPE html>` signals HTML5 mode. The `<html lang="en">` attribute helps screen readers and translation tools. `<meta charset="utf-8">` ensures proper character encoding. `<meta name="viewport" content="width=device-width, initial-scale=1.0">` is essential for responsive design.

**Code Walkthrough: A Semantic Blog Post Page**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Understanding Semantic HTML5</title>
</head>
<body>
  <header>
    <h1>DevBlog</h1>
    <nav aria-label="Main navigation">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/articles">Articles</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <article>
      <header>
        <h2>Why Semantic HTML Matters</h2>
        <time datetime="2026-06-15">June 15, 2026</time>
      </header>
      <p>Semantic HTML improves accessibility and SEO...</p>

      <figure>
        <img src="semantic-structure.png" 
             alt="Diagram showing HTML5 semantic elements">
        <figcaption>Figure 1: HTML5 semantic structure</figcaption>
      </figure>

      <section aria-labelledby="benefits-heading">
        <h3 id="benefits-heading">Key Benefits</h3>
        <ul>
          <li>Screen readers navigate by landmarks</li>
          <li>Search engines rank content better</li>
          <li>Code is more readable and maintainable</li>
        </ul>
      </section>
    </article>

    <aside aria-label="Related articles">
      <h3>Related</h3>
      <ul>
        <li><a href="/css-grid">CSS Grid Deep Dive</a></li>
        <li><a href="/accessibility">Accessibility First</a></li>
      </ul>
    </aside>
  </main>

  <footer>
    <p>&copy; 2026 DevBlog. All rights reserved.</p>
  </footer>
</body>
</html>
```

**Explanation:** `<header>` contains introductory content. `<nav>` wraps navigation links. `<main>` holds the dominant content (only one per page). `<article>` is self-contained content. `<aside>` is tangentially related content. `aria-label` provides accessible names for landmarks. `<time datetime="">` gives machine-readable dates. `<figure>` and `<figcaption>` associate images with captions.

**Quiz:**
1. Why is `<main>` limited to one per page?
2. What is the difference between `<article>` and `<section>`?
3. How does `alt` text improve accessibility?
4. What does `aria-label` do?
5. Why is the viewport meta tag critical for responsive design?

**Task:** Build a personal portfolio page using semantic HTML5 elements. Include a header with navigation, a main section with an article about yourself, a figure with an image, and a footer. Validate it with the W3C HTML validator.

**AI Tool Spotlight:** Use **v0.dev** (Vercel's free prompt-to-React generator) to describe a landing page and generate semantic HTML structure instantly.

---

### Day 4 — Forms, Input Validation, and Interactive Elements

**Learning Objectives:** Build accessible, validated forms using HTML5 input types and constraint validation.

**Core Content:**

HTML5 introduced input types that provide built-in validation and mobile-optimised keyboards: `email`, `tel`, `url`, `number`, `date`, `range`, `color`, `search`. Constraint validation attributes: `required`, `minlength`, `maxlength`, `min`, `max`, `pattern`, `type="email"`.

Forms should always pair `<label>` with `<input>` using `for` and `id`. Use `<fieldset>` and `<legend>` to group related inputs. `<datalist>` provides autocomplete suggestions. `<output>` displays calculated results.

**Code Walkthrough: A Validated Registration Form**

```html
<form action="/api/register" method="POST" novalidate>
  <fieldset>
    <legend>Account Details</legend>

    <div class="form-group">
      <label for="username">Username</label>
      <input type="text" id="username" name="username"
             required minlength="3" maxlength="20"
             pattern="[a-zA-Z0-9_]+"
             placeholder="Letters, numbers, underscores">
      <small>3–20 characters, no spaces</small>
    </div>

    <div class="form-group">
      <label for="email">Email</label>
      <input type="email" id="email" name="email"
             required placeholder="you@example.com">
    </div>

    <div class="form-group">
      <label for="age">Age</label>
      <input type="number" id="age" name="age"
             min="18" max="120" required>
    </div>

    <div class="form-group">
      <label for="password">Password</label>
      <input type="password" id="password" name="password"
             required minlength="8">
    </div>

    <div class="form-group">
      <label for="dob">Date of Birth</label>
      <input type="date" id="dob" name="dob" required>
    </div>

    <button type="submit">Create Account</button>
  </fieldset>
</form>
```

```javascript
// Client-side validation with custom error messages
const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
  if (!form.checkValidity()) {
    e.preventDefault();
    form.reportValidity();
  }
});
```

**Explanation:** `novalidate` disables browser default validation so you can implement custom logic. `pattern="[a-zA-Z0-9_]+"` enforces alphanumeric usernames. `minlength` and `maxlength` constrain input. `checkValidity()` returns true if all constraints pass. `reportValidity()` shows browser validation messages.

**Quiz:**
1. What are three HTML5 input types and their mobile benefits?
2. How does `pattern` attribute work?
3. Why use `<label for="">` instead of wrapping input in label?
4. What does `novalidate` do?
5. What is the difference between `minlength` and `min`?

**Task:** Build a multi-section job application form with fieldset grouping. Include fields for personal info, education, and experience. Add HTML5 validation constraints for each field. Style with CSS to show validation states (`:valid` and `:invalid` pseudo-classes).

**AI Tool Spotlight:** Use **Google AI Studio** (free) to generate form validation regex patterns. Paste your requirement and ask for the pattern attribute value.


## Module 03: CSS3 & Responsive Design (Days 5–7)

### Day 5 — CSS Fundamentals, Selectors, and the Box Model

**Learning Objectives:** Master CSS selectors, specificity, the box model, and modern colour systems.

**Core Content:**

CSS (Cascading Style Sheets) controls presentation. The cascade determines which styles win when multiple rules target the same element. Specificity weights: inline styles (1000) > IDs (100) > classes/attributes/pseudo-classes (10) > elements (1). `!important` overrides everything but should be avoided.

The box model: every element is a box with `content`, `padding`, `border`, and `margin`. `box-sizing: border-box` makes `width` include padding and border — use it universally.

Modern CSS colour: `hsl()`, `oklch()`, `color-mix()`, CSS custom properties (variables).

**Code Walkthrough: CSS Architecture Foundation**

```css
/* Reset and custom properties */
:root {
  --color-primary: oklch(0.55 0.18 250);
  --color-text: oklch(0.2 0.01 250);
  --color-bg: oklch(0.98 0.005 250);
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 2rem;
  --radius-md: 8px;
  --font-sans: system-ui, -apple-system, sans-serif;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-sans);
  color: var(--color-text);
  background: var(--color-bg);
  line-height: 1.6;
  padding: var(--space-md);
}

/* Selector specificity examples */
.card {                 /* 0,1,0 */
  background: white;
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  box-shadow: 0 2px 8px oklch(0.2 0.01 250 / 0.1);
}

#featured-card {        /* 1,0,0 — higher specificity */
  border: 2px solid var(--color-primary);
}

.card .title {          /* 0,2,0 */
  font-size: 1.5rem;
  color: var(--color-primary);
}
```

**Explanation:** `:root` defines global custom properties. The universal selector with pseudo-elements resets margins and padding. `box-sizing: border-box` prevents width surprises. `oklch()` is a modern perceptually uniform colour space. Specificity determines cascade winner — `.card .title` (0,2,0) beats `.title` (0,1,0).

**Quiz:**
1. Calculate specificity of `nav ul li.active a:hover`.
2. What does `box-sizing: border-box` do?
3. Difference between `padding` and `margin`.
4. Why are CSS custom properties useful?
5. What is the cascade in CSS?

**Task:** Create a card component with CSS custom properties for colours and spacing. Implement `:hover`, `:focus-visible`, and `:active` states. Use `oklch()` for colours and `clamp()` for fluid typography.

**AI Tool Spotlight:** Use **Qodo Gen** (free VS Code extension) to generate CSS for components from natural language descriptions.

---

### Day 6 — Flexbox: One-Dimensional Layout

**Learning Objectives:** Master Flexbox for row and column layouts, alignment, and responsive components.

**Core Content:**

Flexbox is a one-dimensional layout model. `display: flex` on a container makes its children flex items. Main axis is controlled by `flex-direction` (row/column). `justify-content` aligns along the main axis. `align-items` aligns along the cross axis. `flex-wrap` allows items to wrap. `gap` creates spacing between items.

`flex-grow` determines how much extra space an item takes. `flex-shrink` determines how much an item shrinks when space is tight. `flex-basis` sets the initial size. The shorthand `flex: 1` means `flex-grow: 1; flex-shrink: 1; flex-basis: 0%`.

**Code Walkthrough: A Responsive Navigation Bar with Flexbox**

```html
<nav class="navbar">
  <a href="/" class="logo">DevBlog</a>
  <ul class="nav-links">
    <li><a href="/articles">Articles</a></li>
    <li><a href="/tutorials">Tutorials</a></li>
    <li><a href="/about">About</a></li>
  </ul>
  <div class="nav-actions">
    <button class="btn-outline">Log in</button>
    <button class="btn-primary">Sign up</button>
  </div>
</nav>
```

```css
.navbar {
  display: flex;
  justify-content: space-between;  /* logo left, actions right */
  align-items: center;             /* vertical centering */
  padding: 1rem 2rem;
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.nav-links {
  display: flex;
  gap: 2rem;
  list-style: none;
}

.nav-actions {
  display: flex;
  gap: 1rem;
}

/* Mobile: stack vertically */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    gap: 1rem;
  }
  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
  }
}

/* Card layout using flex-grow */
.card-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}
.card {
  flex: 1 1 300px;  /* grow, shrink, min 300px basis */
}
```

**Explanation:** `justify-content: space-between` pushes logo and actions to opposite ends. `align-items: center` vertically centres them. `gap` replaces margin hacks. On mobile, `flex-direction: column` stacks elements. `flex: 1 1 300px` lets cards grow, shrink, but start at 300px wide.

**Quiz:**
1. Difference between `justify-content` and `align-items`.
2. What does `flex-wrap: wrap` do?
3. Explain `flex: 1 1 auto` vs `flex: 1 1 0`.
4. How does `gap` differ from `margin`?
5. When should you use Flexbox over Grid?

**Task:** Build a responsive card grid for a product listing. Each card has an image, title, description, and price. Use Flexbox with `flex: 1 1 280px` and `flex-wrap: wrap`. Cards should grow evenly on wider screens.

**AI Tool Spotlight:** Use **Continue.dev** (free, open-source VS Code extension) with a local model via Ollama to generate Flexbox layouts.

---

### Day 7 — CSS Grid: Two-Dimensional Layout & Responsive Design

**Learning Objectives:** Master CSS Grid for complex layouts, `grid-template-areas`, and container queries.

**Core Content:**

CSS Grid is a two-dimensional layout system. `display: grid` on a container creates a grid. `grid-template-columns` and `grid-template-rows` define the explicit grid. `gap` sets spacing. `grid-template-areas` provides named areas for readable layouts.

`repeat()`, `minmax()`, and `auto-fill`/`auto-fit` enable responsive grids without media queries. `grid-column: span 2` makes an item span multiple columns. Container queries (`@container`) allow component-level responsiveness.

**Code Walkthrough: A Dashboard Layout with CSS Grid**

```html
<div class="dashboard">
  <aside class="sidebar">
    <nav>
      <a href="/dashboard">Dashboard</a>
      <a href="/courses">Courses</a>
      <a href="/settings">Settings</a>
    </nav>
  </aside>
  <header class="topbar">
    <h1>Dashboard</h1>
  </header>
  <main class="content">
    <div class="stat-card">...</div>
    <div class="stat-card">...</div>
    <div class="chart">...</div>
    <div class="activity">...</div>
  </main>
</div>
```

```css
.dashboard {
  display: grid;
  grid-template-areas:
    "sidebar topbar"
    "sidebar content";
  grid-template-columns: 250px 1fr;
  grid-template-rows: 64px 1fr;
  min-height: 100vh;
  gap: 0;
}

.sidebar { grid-area: sidebar; background: #1a1a2e; color: white; padding: 1rem; }
.topbar  { grid-area: topbar;  background: white; border-bottom: 1px solid #eee; }
.content {
  grid-area: content;
  padding: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* Responsive: stack on mobile */
@media (max-width: 768px) {
  .dashboard {
    grid-template-areas:
      "topbar"
      "sidebar"
      "content";
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr;
  }
}

/* Container query for stat cards */
.stat-card-wrapper {
  container-type: inline-size;
}
@container (min-width: 400px) {
  .stat-card { display: flex; gap: 1rem; }
}
```

**Explanation:** `grid-template-areas` creates a readable map of the layout. `1fr` takes remaining space. `repeat(auto-fit, minmax(280px, 1fr))` creates responsive columns that fit as many as possible. Container queries respond to the component's container width, not the viewport — enabling truly reusable components.

**Quiz:**
1. Difference between `auto-fit` and `auto-fill`.
2. What does `grid-template-areas` syntax mean?
3. How does `minmax()` enable responsiveness?
4. What is a container query and when use it?
5. How do you make a grid item span two columns?

**Task:** Build a responsive photo gallery with CSS Grid. Use `repeat(auto-fit, minmax(200px, 1fr))` for the grid. Add a featured image that spans 2 columns and 2 rows on larger screens using `grid-column: span 2; grid-row: span 2`.

**AI Tool Spotlight:** Use **v0.dev** to describe a dashboard layout and generate the Grid CSS. Refine with natural language prompts.


## Module 04: UI/UX & Design Systems (Days 8–10)

### Day 8 — Design Principles for Developers

**Learning Objectives:** Understand colour theory, typography, spacing systems, and visual hierarchy.

**Core Content:**

Good design is not decoration — it is communication. Visual hierarchy guides the eye: size, weight, colour, spacing, and position create importance. The 8-point spacing system (`4px, 8px, 16px, 24px, 32px, 48px, 64px`) creates rhythm and consistency. Typography scales: use a modular scale (1.25×, 1.333×, 1.5×) for harmonious sizes.

Colour theory: use a primary colour for actions, neutrals for text and backgrounds, and semantic colours (red for errors, green for success, amber for warnings). Ensure WCAG contrast ratios: 4.5:1 for normal text, 3:1 for large text.

**Code Walkthrough: A Design Token System**

```css
:root {
  /* Colour tokens */
  --color-primary-500: oklch(0.55 0.18 250);
  --color-primary-600: oklch(0.48 0.18 250);
  --color-neutral-0:   oklch(1 0 0);
  --color-neutral-100: oklch(0.96 0.005 250);
  --color-neutral-500: oklch(0.55 0.01 250);
  --color-neutral-900: oklch(0.15 0.01 250);
  --color-error:       oklch(0.55 0.2 25);
  --color-success:     oklch(0.6 0.15 145);

  /* Typography scale (1.25×) */
  --text-xs:   0.64rem;
  --text-sm:   0.8rem;
  --text-base: 1rem;
  --text-lg:   1.25rem;
  --text-xl:   1.563rem;
  --text-2xl:  1.953rem;
  --text-3xl:  2.441rem;

  /* Spacing (8-point) */
  --space-1: 0.25rem;  /* 4px  */
  --space-2: 0.5rem;   /* 8px  */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */

  /* Shadows */
  --shadow-sm: 0 1px 2px oklch(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px oklch(0 0 0 / 0.07);
  --shadow-lg: 0 10px 25px oklch(0 0 0 / 0.1);

  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-full: 9999px;
}
```

**Explanation:** Design tokens are named values for colours, spacing, typography, shadows, and radii. Using tokens ensures consistency and makes theme changes (dark mode) trivial. `oklch()` provides perceptually uniform colour manipulation.

**Quiz:**
1. Why use an 8-point spacing system?
2. What WCAG contrast ratio is required for normal text?
3. What is a modular typography scale?
4. How do design tokens help with dark mode?
5. What is visual hierarchy and name three ways to create it.

**Task:** Create a design token file for a fictional brand. Define colours (primary, neutral, semantic), typography scale, spacing, shadows, and radii. Build a simple button component using only these tokens.

**AI Tool Spotlight:** Use **UXPin** free tier or **Figma** community plugins to generate colour palettes from a brand description.

---

### Day 9 — Component-Driven Design Systems

**Learning Objectives:** Build reusable UI components with variants, states, and documentation.

**Core Content:**

A design system is a single source of truth for an organisation's UI — combining design tokens, component libraries, documentation, and tooling. Components should have variants (primary, secondary, ghost, danger), sizes (sm, md, lg), and states (default, hover, focus, active, disabled, loading).

Documentation is part of the component. Use Storybook or simple markdown to document props, usage, and accessibility notes. Components should be composable — small building blocks combined into larger patterns.

**Code Walkthrough: A Button Component with Variants**

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: var(--text-base);
  font-weight: 500;
  cursor: pointer;
  transition: background 150ms ease, box-shadow 150ms ease;
}

.btn:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Variants */
.btn--primary {
  background: var(--color-primary-500);
  color: white;
}
.btn--primary:hover:not(:disabled) {
  background: var(--color-primary-600);
}

.btn--secondary {
  background: transparent;
  border-color: var(--color-neutral-500);
  color: var(--color-neutral-900);
}

.btn--ghost {
  background: transparent;
  color: var(--color-primary-500);
}

.btn--danger {
  background: var(--color-error);
  color: white;
}

/* Sizes */
.btn--sm { padding: var(--space-1) var(--space-3); font-size: var(--text-sm); }
.btn--lg { padding: var(--space-3) var(--space-6); font-size: var(--text-lg); }

/* Loading state */
.btn--loading {
  position: relative;
  color: transparent;
}
.btn--loading::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid white;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
```

**Explanation:** BEM naming (`btn--primary`) keeps variants scoped. `:focus-visible` shows focus rings only for keyboard users. `:disabled` states prevent interaction. The loading state uses `::after` with a spinner animation.

**Quiz:**
1. What is BEM naming convention?
2. Why use `:focus-visible` instead of `:focus`?
3. How do component variants improve consistency?
4. What should be documented for each component?
5. What is the difference between a pattern library and a component library?

**Task:** Build a complete component library with Button, Input, Card, Badge, and Alert components. Each should have variants, sizes, and states. Create a simple HTML page documenting all variants.

**AI Tool Spotlight:** Use **Cline** (free, open-source VS Code agent) to generate component code from descriptions. Bring your own API key.

---

### Day 10 — Responsive Design, Accessibility, and Mobile-First

**Learning Objectives:** Implement mobile-first responsive design, WCAG accessibility, and progressive enhancement.

**Core Content:**

Mobile-first means designing for small screens first, then progressively enhancing for larger screens with `min-width` media queries. Breakpoints should be content-driven, not device-driven. Common breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl).

Accessibility (a11y): semantic HTML first, ARIA only when needed. Keyboard navigability: all interactive elements must be reachable and usable via keyboard. Focus management: visible focus indicators, logical tab order. Colour contrast: 4.5:1 for text. Screen reader testing with VoiceOver/NVDA.

**Code Walkthrough: Mobile-First Responsive Component**

```css
/* Mobile first: base styles for small screens */
.card {
  padding: var(--space-4);
  border-radius: var(--radius-md);
  background: white;
  box-shadow: var(--shadow-sm);
}

.card__image {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: var(--radius-sm);
}

/* Tablet: 768px and up */
@media (min-width: 768px) {
  .card {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: var(--space-4);
    align-items: start;
  }
  .card__image {
    aspect-ratio: 1 / 1;
  }
}

/* Desktop: 1024px and up */
@media (min-width: 1024px) {
  .card {
    grid-template-columns: 280px 1fr;
  }
}

/* Reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

/* Dark mode preference */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: oklch(0.15 0.01 250);
    --color-text: oklch(0.95 0.005 250);
  }
}
```

**Explanation:** Base styles target mobile. `min-width` media queries enhance for larger screens. `prefers-reduced-motion` respects user motion preferences. `prefers-color-scheme` automatically adapts to dark mode.

**Quiz:**
1. Why mobile-first instead of desktop-first?
2. What is progressive enhancement?
3. How do you make a custom dropdown accessible?
4. What is the minimum touch target size?
5. Why respect `prefers-reduced-motion`?

**Task:** Take the component library from Day 9 and make every component fully responsive and accessible. Test keyboard navigation (Tab, Enter, Escape, arrow keys). Run Lighthouse accessibility audit and fix all issues.

**AI Tool Spotlight:** Use **Accessibility Insights** (free Microsoft browser extension) to audit your pages. Use **Pa11y** (free CLI) for automated accessibility testing in CI.


## Module 05: Git & GitHub (Days 11–12)

### Day 11 — Git Fundamentals: Version Control from Zero

**Learning Objectives:** Master Git basics: init, add, commit, status, log, diff, and the three-stage workflow.

**Core Content:**

Git is a distributed version control system. Every developer has a full copy of the repository history. The three stages: working directory (files you edit), staging area (index — files prepared for commit), and repository (committed history).

Core commands: `git init` creates a repository. `git add <file>` stages changes. `git commit -m "message"` saves a snapshot. `git status` shows current state. `git log --oneline` shows compact history. `git diff` shows unstaged changes.

**Code Walkthrough: Complete Git Workflow**

```bash
# Initialize a new repository
mkdir my-project && cd my-project
git init

# Configure identity (one-time)
git config --global user.name "Your Name"
git config --global user.email "you@example.com"

# Create and stage files
echo "# My Project" > README.md
echo "node_modules/" > .gitignore
git add README.md .gitignore
git status  # Shows staged files in green

# Commit
git commit -m "Initial commit: README and gitignore"

# Make changes and view diff
echo "## Installation" >> README.md
git diff  # Shows unstaged changes

# Stage and commit
git add README.md
git commit -m "Add installation section"

# View history
git log --oneline --graph --all
```

```bash
# Undoing changes
git checkout -- README.md        # Discard unstaged changes (dangerous)
git reset HEAD README.md         # Unstage (keep changes)
git commit --amend -m "New msg"  # Amend last commit
```

**Explanation:** `.gitignore` prevents `node_modules/` from being tracked. `git add` moves changes to staging. `git commit` creates a permanent snapshot. `git log --oneline --graph` visualises history.

**Quiz:**
1. What are the three stages of Git?
2. Difference between `git add` and `git commit`.
3. How do you undo a commit that hasn't been pushed?
4. What does `.gitignore` do?
5. What is the difference between `git diff` and `git diff --staged`?

**Task:** Create a new repository for your portfolio project. Make at least 5 commits with meaningful messages. Use `git log --oneline` to verify history. Practice undoing changes with `git checkout --`, `git reset`, and `git commit --amend`.

**AI Tool Spotlight:** Use **GitLens** (free VS Code extension) for inline git blame, history, and commit graph visualisation.

---

### Day 12 — GitHub Collaboration: Branches, PRs, and Workflows

**Learning Objectives:** Master branching, merging, pull requests, and team collaboration workflows.

**Core Content:**

A branch is an independent line of development. `git branch <name>` creates a branch. `git checkout <name>` switches to it. `git checkout -b <name>` creates and switches. `git merge <branch>` merges into current branch.

Pull requests (PRs) are GitHub's mechanism for code review before merging. A PR shows the diff, allows comments, and runs CI checks. Feature branch workflow: create branch from main → commit changes → push → open PR → review → merge.

**Code Walkthrough: Feature Branch Workflow**

```bash
# Create and switch to a feature branch
git checkout -b feature/user-auth

# Make changes
touch auth.js
# ... write code ...
git add auth.js
git commit -m "Add JWT authentication module"

# Push branch to GitHub
git push -u origin feature/user-auth

# On GitHub: open Pull Request → review → merge
# After merge, update local main
git checkout main
git pull origin main
git branch -d feature/user-auth  # Delete local branch
```

```bash
# Resolving merge conflicts
git checkout main
git pull
git checkout feature/user-auth
git merge main  # Conflict occurs
# Edit conflicted files (look for <<<<<<< markers)
git add .
git commit -m "Resolve merge conflict"
```

**Explanation:** Feature branches isolate work. `-u origin` sets upstream tracking. After PR merge, `git pull` on main syncs local. Merge conflicts occur when the same lines are changed in both branches — resolve by editing files and committing.

**Quiz:**
1. Why use feature branches instead of committing to main?
2. What is the difference between `git merge` and `git rebase`?
3. How do you resolve a merge conflict?
4. What should a good PR description contain?
5. What is a fork and when would you use one?

**Task:** Create a GitHub repository for your project. Create a `develop` branch and a feature branch from it. Make changes, push, and open a PR. Review your own PR and merge it. Create a deliberate merge conflict between two branches and resolve it.

**AI Tool Spotlight:** Use **GitHub Copilot** free tier for commit message generation and PR description drafting.


## Module 06: JavaScript Fundamentals (Days 13–17)

### Day 13 — Variables, Data Types, and Operators

**Learning Objectives:** Master `let`/`const`/`var`, primitive types, type coercion, and operators.

**Core Content:**

JavaScript has three variable declarations: `var` (function-scoped, hoisted, avoid), `let` (block-scoped, reassignable), `const` (block-scoped, immutable binding). Prefer `const` by default, `let` when reassignment is needed.

Primitive types: `string`, `number`, `bigint`, `boolean`, `undefined`, `null`, `symbol`. Objects and arrays are reference types. Type coercion: `==` does loose comparison with coercion; `===` does strict comparison. Always use `===`. Falsy values: `false`, `0`, `""`, `null`, `undefined`, `NaN`.

**Code Walkthrough: Variables and Types**

```javascript
// Variable declarations
const name = "Alice";       // Cannot be reassigned
let age = 25;               // Can be reassigned
age = 26;

// Primitive types
const str = "hello";                    // string
const num = 42;                         // number
const bool = true;                      // boolean
const undef = undefined;                // undefined
const nul = null;                       // null
const sym = Symbol("id");               // symbol

// Type coercion pitfalls
console.log(1 == "1");    // true  (coercion)
console.log(1 === "1");   // false (strict — preferred)
console.log(0 == false);  // true
console.log(0 === false); // false

// Template literals
const greeting = `Hello, ${name}! You are ${age}.`;

// Nullish coalescing (??) — only falls back for null/undefined
const displayName = name ?? "Anonymous";

// Optional chaining (?.)
const user = { profile: { email: "a@b.com" } };
console.log(user.profile?.email);   // "a@b.com"
console.log(user.address?.city);    // undefined (no error)

// Ternary operator
const status = age >= 18 ? "adult" : "minor";
```

**Explanation:** `const` prevents reassignment but does not make objects immutable. `===` avoids coercion surprises. Template literals allow multi-line strings and interpolation. `??` only falls back for `null`/`undefined` (unlike `||` which falls back for any falsy value). Optional chaining prevents "cannot read property of undefined" errors.

**Quiz:**
1. Difference between `let`, `const`, and `var`.
2. Why prefer `===` over `==`?
3. What are the falsy values in JavaScript?
4. Difference between `null` and `undefined`.
5. What does `?.` do?

**Task:** Write a script that declares variables of each primitive type, demonstrates type coercion with `==` vs `===`, and uses template literals to build a user profile string. Use optional chaining to safely access nested object properties.

**AI Tool Spotlight:** Use **Free.ai Coder** to ask: `free-code ask "What is the difference between == and === in JavaScript?"`

---

### Day 14 — Functions, Scope, and Closures

**Learning Objectives:** Master function declarations, expressions, arrow functions, scope chain, and closures.

**Core Content:**

Function declarations are hoisted — callable before definition. Function expressions are not hoisted. Arrow functions inherit `this` from surrounding scope and cannot be used as constructors. Scope: global, function, block. The scope chain determines variable resolution.

A closure is a function that retains access to its lexical scope even when executed outside that scope. Closures enable data privacy, function factories, and memoisation.

**Code Walkthrough: Functions and Closures**

```javascript
// Function declaration — hoisted
function add(a, b) { return a + b; }

// Function expression — not hoisted
const subtract = function(a, b) { return a - b; };

// Arrow function
const multiply = (a, b) => a * b;

// Arrow with block body
const divide = (a, b) => {
  if (b === 0) throw new Error("Cannot divide by zero");
  return a / b;
};

// Default parameters
function greet(name = "World") {
  return `Hello, ${name}!`;
}

// Rest parameters
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}
sum(1, 2, 3, 4); // 10

// Closure: counter factory
function createCounter() {
  let count = 0;  // Private variable
  return {
    increment() { count++; return count; },
    decrement() { count--; return count; },
    getCount() { return count; }
  };
}

const counter = createCounter();
counter.increment(); // 1
counter.increment(); // 2
console.log(counter.getCount()); // 2
// count is not accessible directly — closure protects it

// Closure: memoisation
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
```

**Explanation:** Arrow functions do not have their own `this` — they inherit it. `createCounter` returns an object whose methods close over `count`, making it private. `memoize` caches function results, trading memory for speed. Closures are the foundation of React hooks.

**Quiz:**
1. Difference between function declaration and expression.
2. How does `this` behave in arrow functions vs regular functions?
3. What is a closure and give a practical use case.
4. What does the scope chain determine?
5. What is the temporal dead zone?

**Task:** Implement a `createBankAccount` function that returns an object with `deposit`, `withdraw`, and `getBalance` methods. The balance should be private via closure. Add validation: no negative deposits, no overdrafts.

**AI Tool Spotlight:** Use **Qodo Gen** to generate unit tests for your closure-based modules.

---

### Day 15 — Arrays, Objects, and Destructuring

**Learning Objectives:** Master array methods, object manipulation, destructuring, and the spread/rest operators.

**Core Content:**

Array methods: `map`, `filter`, `reduce`, `find`, `findIndex`, `some`, `every`, `flat`, `flatMap`, `sort`, `includes`. These are non-mutating except `sort` (which mutates). Use `toSorted()` (ES2023) for non-mutating sort.

Object methods: `Object.keys`, `Object.values`, `Object.entries`, `Object.assign`, `Object.freeze`, `Object.fromEntries`. Destructuring extracts values from arrays and objects. Spread `...` copies arrays/objects. Rest `...` collects remaining elements.

**Code Walkthrough: Data Transformation Pipeline**

```javascript
const users = [
  { id: 1, name: "Alice", age: 28, role: "admin", active: true },
  { id: 2, name: "Bob", age: 22, role: "user", active: false },
  { id: 3, name: "Charlie", age: 35, role: "user", active: true },
  { id: 4, name: "Diana", age: 30, role: "moderator", active: true },
];

// Filter active users
const activeUsers = users.filter(u => u.active);

// Map to names
const names = activeUsers.map(u => u.name);

// Reduce to count by role
const roleCounts = users.reduce((acc, user) => {
  acc[user.role] = (acc[user.role] || 0) + 1;
  return acc;
}, {});
// { admin: 1, user: 2, moderator: 1 }

// Chain: average age of active users
const avgAge = users
  .filter(u => u.active)
  .map(u => u.age)
  .reduce((sum, age) => sum + age, 0) / activeUsers.length;

// Destructuring
const { name, age, ...rest } = users[0];
// name: "Alice", age: 28, rest: { id: 1, role: "admin", active: true }

// Array destructuring
const [first, second, ...others] = [10, 20, 30, 40];
// first: 10, second: 20, others: [30, 40]

// Spread: merge objects
const defaultSettings = { theme: "light", fontSize: 14 };
const userSettings = { theme: "dark" };
const merged = { ...defaultSettings, ...userSettings };
// { theme: "dark", fontSize: 14 }

// Non-mutating sort (ES2023)
const sorted = users.toSorted((a, b) => a.age - b.age);
```

**Explanation:** `filter` returns a new array. `map` transforms each element. `reduce` accumulates a single value. Destructuring with rest collects remaining properties. Spread merges objects (later properties override earlier). `toSorted` avoids mutating the original array.

**Quiz:**
1. Difference between `map` and `forEach`.
2. What does `reduce` do and what are its parameters?
3. How do you merge two objects without mutation?
4. What is the difference between spread and rest?
5. How do you sort an array without mutating it?

**Task:** Given an array of products (name, price, category, inStock), write functions to: (1) get all in-stock products under $50, (2) group products by category, (3) find the most expensive product, (4) calculate total inventory value. Use only array methods, no loops.

**AI Tool Spotlight:** Use **Google AI Studio** to generate test data arrays and expected outputs for your array method exercises.

---

### Day 16 — Asynchronous JavaScript: Callbacks, Promises, Async/Await

**Learning Objectives:** Master asynchronous patterns, the event loop, and error handling in async code.

**Core Content:**

JavaScript is single-threaded but non-blocking. The event loop processes the call stack, then the microtask queue (Promises), then the macrotask queue (`setTimeout`, I/O). Callbacks are functions passed to other functions to be executed later. Promises represent a future value: `pending`, `fulfilled`, or `rejected`. `async/await` is syntactic sugar over Promises.

**Code Walkthrough: Async Patterns**

```javascript
// Callback pattern (avoid — callback hell)
function fetchUserCallback(id, callback) {
  setTimeout(() => {
    callback({ id, name: "Alice" });
  }, 1000);
}

// Promise pattern
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) {
        resolve({ id, name: "Alice" });
      } else {
        reject(new Error("Invalid ID"));
      }
    }, 1000);
  });
}

// Promise chaining
fetchUser(1)
  .then(user => fetchPosts(user.id))
  .then(posts => console.log(posts))
  .catch(err => console.error(err))
  .finally(() => console.log("Done"));

// Async/await (preferred)
async function getUserData(id) {
  try {
    const user = await fetchUser(id);
    const posts = await fetchPosts(user.id);
    return { user, posts };
  } catch (error) {
    console.error("Failed:", error.message);
    throw error;
  }
}

// Parallel execution
async function getMultipleUsers(ids) {
  const promises = ids.map(id => fetchUser(id));
  return Promise.all(promises);  // Waits for all
}

// Promise.allSettled — waits for all, never rejects
const results = await Promise.allSettled([fetchUser(1), fetchUser(-1)]);
// results[0]: { status: 'fulfilled', value: {...} }
// results[1]: { status: 'rejected', reason: Error }

// Promise.race — first to settle wins
const fastest = await Promise.race([fetchUser(1), fetchUser(2)]);
```

**Explanation:** Promises chain with `.then()`. `async/await` makes async code read like synchronous code. `Promise.all` fails fast if any promise rejects. `Promise.allSettled` waits for all regardless. `try/catch` handles errors in async/await.

**Quiz:**
1. What are the three states of a Promise?
2. Difference between `Promise.all` and `Promise.allSettled`.
3. What does `await` do to execution?
4. How does the event loop handle microtasks vs macrotasks?
5. How do you handle errors in async/await?

**Task:** Build a function that fetches data from three different "APIs" (simulated with `setTimeout` and random success/failure). Use `Promise.allSettled` to get all results, then process successes and log failures. Add a timeout wrapper that rejects after 5 seconds.

**AI Tool Spotlight:** Use **OpenCode** to explain event loop behaviour: `opencode ask "Explain the JavaScript event loop with microtasks and macrotasks"`

---

### Day 17 — ES6+ Features & Modules

**Learning Objectives:** Master ES modules, classes, iterators, generators, and modern syntax.

**Core Content:**

ES modules use `import`/`export`. Named exports export multiple values; default exports export one. Classes are syntactic sugar over prototype-based inheritance. Getters/setters control property access. Static methods belong to the class, not instances. Private fields (`#field`) are truly private.

Iterators implement the `[Symbol.iterator]()` protocol. Generators (`function*`) produce sequences lazily with `yield`.

**Code Walkthrough: Modules and Classes**

```javascript
// math.js — named exports
export const PI = 3.14159;
export function add(a, b) { return a + b; }
export function multiply(a, b) { return a * b; }

// logger.js — default export
export default class Logger {
  #prefix;  // Private field

  constructor(prefix) {
    this.#prefix = prefix;
  }

  log(message) {
    console.log(`[${this.#prefix}] ${message}`);
  }

  static create(prefix) {
    return new Logger(prefix);
  }
}

// main.js — imports
import Logger from './logger.js';
import { add, multiply, PI } from './math.js';
import * as math from './math.js';  // Namespace import

const logger = new Logger('APP');
logger.log(`PI is ${PI}`);
```

```javascript
// Generator example
function* idGenerator() {
  let id = 1;
  while (true) {
    yield id++;
  }
}

const gen = idGenerator();
gen.next().value; // 1
gen.next().value; // 2

// Iterator protocol
const range = {
  from: 1,
  to: 5,
  [Symbol.iterator]() {
    let current = this.from;
    const last = this.to;
    return {
      next() {
        return current <= last
          ? { value: current++, done: false }
          : { value: undefined, done: true };
      }
    };
  }
};

for (const num of range) console.log(num); // 1,2,3,4,5
```

**Explanation:** `export` and `import` enable modular code. Classes encapsulate state and behaviour. `#prefix` is a private field — not accessible outside the class. Generators produce values lazily. Custom iterators make objects work with `for...of`.

**Quiz:**
1. Difference between named and default exports.
2. How do private class fields work?
3. What is a generator and when use it?
4. What does `[Symbol.iterator]` enable?
5. Difference between `import * as ns` and named imports.

**Task:** Refactor your array methods utilities into separate ES modules. Create a `utils/` folder with `arrays.js`, `objects.js`, and `strings.js`. Each exports named functions. Create an `index.js` that re-exports everything. Import and use in a demo script.

**AI Tool Spotlight:** Use **Continue.dev** with a local model to generate module boilerplate and JSDoc comments.


## Module 07: JavaScript Advanced (Days 18–20)

### Day 18 — Execution Context, Hoisting, and the `this` Keyword

**Learning Objectives:** Understand how JavaScript executes code, hoisting rules, and `this` binding rules.

**Core Content:**

Every function call creates an execution context with a variable environment, scope chain, and `this` binding. Global execution context is created first. Hoisting moves declarations to the top of their scope: `var` declarations are hoisted and initialised to `undefined`; function declarations are fully hoisted; `let`/`const` are hoisted but in the temporal dead zone (TDZ) until initialisation.

`this` binding rules: (1) default — global object (or `undefined` in strict mode); (2) implicit — object before the dot; (3) explicit — `call`, `apply`, `bind`; (4) `new` — newly created object; (5) arrow functions — lexically inherited.

**Code Walkthrough: This Binding**

```javascript
const person = {
  name: "Alice",
  greet() {
    console.log(`Hello, ${this.name}`);  // "this" = person
  }
};
person.greet(); // "Hello, Alice"

// Losing this
const greetFn = person.greet;
greetFn(); // "Hello, undefined" (or error in strict mode)

// Fix with bind
const boundGreet = person.greet.bind(person);
boundGreet(); // "Hello, Alice"

// Arrow function inherits this
const team = {
  name: "Dev",
  members: ["Alice", "Bob"],
  listMembers() {
    this.members.forEach(member => {
      console.log(`${member} is on ${this.name}`);  // "this" = team
    });
  }
};

// Hoisting demonstration
console.log(x);  // undefined (var hoisted)
var x = 5;
console.log(x);  // 5

// console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 10;

hoistedFn(); // Works — function declaration hoisted
function hoistedFn() { console.log("Hoisted!"); }

// notHoisted(); // TypeError: notHoisted is not a function
const notHoisted = () => console.log("Not hoisted");
```

**Explanation:** `this` is determined by how a function is called, not where it's defined. Arrow functions capture `this` from their enclosing scope. `var` hoisting initialises to `undefined`; `let`/`const` enter TDZ. Function declarations are fully hoisted.

**Quiz:**
1. What are the four rules of `this` binding?
2. Why do arrow functions not have their own `this`?
3. What is the temporal dead zone?
4. Difference between hoisting of `var` vs `let`.
5. How do you fix a lost `this` reference?

**Task:** Create an object with methods that demonstrate all four `this` binding rules. Show the lost `this` problem and fix it with `bind`, `call`, and `apply`. Write a comparison of `var`, `let`, and `const` hoisting behaviour.

**AI Tool Spotlight:** Use **Free.ai Coder** to quiz yourself: `free-code ask "Generate 5 interview questions about this binding in JavaScript"`

---

### Day 19 — Prototypes, Inheritance, and Object-Oriented Patterns

**Learning Objectives:** Master prototype chain, prototypal inheritance, and composition over inheritance.

**Core Content:**

Every JavaScript object has a prototype. When accessing a property, JavaScript walks the prototype chain until it finds it or reaches `null`. `Object.create(proto)` creates an object with a specific prototype. `class` syntax is sugar over prototypes.

Composition is often preferred over inheritance: build objects by combining small behaviours rather than deep class hierarchies.

**Code Walkthrough: Prototypes and Composition**

```javascript
// Constructor function (pre-class syntax)
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function() {
  console.log(`${this.name} makes a sound`);
};

function Dog(name, breed) {
  Animal.call(this, name);  // Super call
  this.breed = breed;
}
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;
Dog.prototype.speak = function() {
  console.log(`${this.name} barks`);
};

const dog = new Dog("Rex", "Labrador");
dog.speak(); // "Rex barks"

// Class syntax (same behaviour)
class Animal2 {
  constructor(name) { this.name = name; }
  speak() { console.log(`${this.name} makes a sound`); }
}
class Dog2 extends Animal2 {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
  speak() { console.log(`${this.name} barks`); }
}

// Composition
const canSwim = (state) => ({
  swim: () => console.log(`${state.name} swims`)
});
const canFly = (state) => ({
  fly: () => console.log(`${state.name} flies`)
});

function createDuck(name) {
  const state = { name };
  return { ...state, ...canSwim(state), ...canFly(state) };
}

const duck = createDuck("Donald");
duck.swim(); // "Donald swims"
duck.fly();  // "Donald flies"
```

**Explanation:** `Object.create` sets the prototype. `class extends` and `super` are sugar. Composition with spread merges behaviours — more flexible than deep inheritance chains.

**Quiz:**
1. What is the prototype chain?
2. Difference between `__proto__` and `prototype`.
3. Why prefer composition over inheritance?
4. How does `class` relate to prototypes?
5. What does `Object.create(null)` create?

**Task:** Build a shape system using composition. Create behaviours for `area`, `perimeter`, and `scalable`. Compose them into `Circle`, `Rectangle`, and `Triangle` objects. Compare with a class-based implementation and discuss trade-offs.

**AI Tool Spotlight:** Use **Cline** to refactor a class-based hierarchy into composition.

---

### Day 20 — Error Handling, Regular Expressions, and Performance

**Learning Objectives:** Master error handling patterns, regex, and JavaScript performance profiling.

**Core Content:**

Error handling: `try/catch/finally`, custom error classes, async error handling. Never swallow errors silently. Log with context. `Error.captureStackTrace` for V8.

Regular expressions: `test()`, `match()`, `replace()`, `matchAll()`, named capture groups, lookahead/lookbehind. Performance: avoid `JSON.parse(JSON.stringify())` for deep clone, use `structuredClone()`. Debounce and throttle expensive operations.

**Code Walkthrough: Custom Errors and Regex**

```javascript
// Custom error classes
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, field) {
    super(message, 400);
    this.name = "ValidationError";
    this.field = field;
  }
}

// Usage
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    throw new ValidationError("Invalid email format", "email");
  }
  return email.toLowerCase();
}

try {
  validateEmail("not-an-email");
} catch (err) {
  if (err instanceof ValidationError) {
    console.log(`Validation failed on ${err.field}: ${err.message}`);
  } else {
    console.error("Unexpected error:", err);
  }
}

// Named capture groups
const dateRegex = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const match = "2026-06-15".match(dateRegex);
console.log(match.groups.year);  // "2026"

// Debounce
function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

const search = debounce((query) => {
  console.log(`Searching for: ${query}`);
}, 300);

// Structured clone (deep copy)
const original = { nested: { arr: [1, 2, 3] } };
const clone = structuredClone(original);
clone.nested.arr.push(4);
console.log(original.nested.arr); // [1, 2, 3] — unchanged
```

**Explanation:** Custom errors carry semantic meaning and status codes. Regex named groups make matches readable. Debounce limits function calls during rapid events. `structuredClone` is the modern deep clone solution.

**Quiz:**
1. Why create custom error classes?
2. What does `finally` guarantee?
3. Difference between `match` and `matchAll`.
4. What is debounce vs throttle?
5. Why is `structuredClone` better than `JSON.parse(JSON.stringify())`?

**Task:** Build a form validation library with custom errors for each field type. Use regex for email, phone, URL, and password strength. Implement a debounced search function that logs queries only after the user stops typing for 500ms.

**AI Tool Spotlight:** Use **BrowserStack** or **Lighthouse** to profile JavaScript performance. Use **Regex101.com** (free) to test regex patterns.


## Module 08: React.js (Days 21–26)

### Day 21 — React Fundamentals: JSX, Components, Props

**Learning Objectives:** Understand React's component model, JSX syntax, and one-way data flow.

**Core Content:**

React is a component-based library for building UIs. Components are functions that return JSX (JavaScript XML). Props are read-only inputs passed from parent to child. One-way data flow makes applications predictable and debuggable.

JSX looks like HTML but compiles to `React.createElement()` calls. Use `{}` to embed JavaScript expressions. `className` instead of `class`. Self-closing tags required.

**Code Walkthrough: First React Components**

```jsx
// App.jsx
function Header({ title, subtitle }) {
  return (
    <header className="app-header">
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </header>
  );
}

function UserCard({ name, email, role = "user" }) {
  return (
    <div className="user-card">
      <h3>{name}</h3>
      <p>{email}</p>
      <span className={`badge badge--${role}`}>{role}</span>
    </div>
  );
}

function UserList({ users }) {
  return (
    <ul className="user-list">
      {users.map(user => (
        <li key={user.id}>
          <UserCard {...user} />
        </li>
      ))}
    </ul>
  );
}

export default function App() {
  const users = [
    { id: 1, name: "Alice", email: "alice@example.com", role: "admin" },
    { id: 2, name: "Bob", email: "bob@example.com" },
  ];

  return (
    <div className="app">
      <Header title="User Directory" subtitle="All registered users" />
      <UserList users={users} />
    </div>
  );
}
```

**Explanation:** Components are functions returning JSX. Props are destructured in the parameter list. Default values via `role = "user"`. `.map()` renders lists — `key` is required for React's reconciliation. Spread `{...user}` passes all object properties as props.

**Quiz:**
1. What is JSX and what does it compile to?
2. Why are props read-only?
3. Why does `.map()` need a `key` prop?
4. What is the difference between a component and an element?
5. How do you conditionally render content?

**Task:** Build a product listing page with `ProductCard`, `ProductList`, and `ProductFilter` components. Pass data via props. Render a grid of products with conditional "Out of Stock" badges.

**AI Tool Spotlight:** Use **v0.dev** to generate a React component from a description. Use **React DevTools** (free browser extension) to inspect props.

---

### Day 22 — State Management with `useState`

**Learning Objectives:** Master `useState`, state updates, and controlled components.

**Core Content:**

State is data that changes over time and triggers re-renders. `useState(initialValue)` returns `[state, setState]`. State updates are asynchronous and batched. Never mutate state directly — always create new objects/arrays. Functional updates (`setState(prev => ...)`) are safer when new state depends on old.

**Code Walkthrough: Stateful Components**

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(prev => prev - 1)}>-1</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos(prev => [
      ...prev,
      { id: Date.now(), text: input, done: false }
    ]);
    setInput("");
  };

  const toggleTodo = (id) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  return (
    <div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === "Enter" && addTodo()}
        placeholder="Add a todo..."
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <span
              style={{ textDecoration: todo.done ? "line-through" : "none" }}
              onClick={() => toggleTodo(todo.id)}
            >
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**Explanation:** `useState` returns a tuple. Functional updates (`prev => ...`) avoid stale closures. Spread creates new arrays. `.map()` with spread creates new objects. Controlled inputs bind `value` to state and update via `onChange`.

**Quiz:**
1. Why must state be updated immutably?
2. Difference between `setCount(count + 1)` and `setCount(prev => prev + 1)`.
3. What happens if you mutate state directly?
4. What is a controlled component?
5. Why are state updates batched?

**Task:** Build a shopping cart with add, remove, quantity update, and total calculation. State should be an array of cart items. Implement all mutations immutably.

**AI Tool Spotlight:** Use **React DevTools** to inspect state changes in real time. Use **Free.ai Coder** to review your state logic.

---

### Day 23 — Side Effects with `useEffect`

**Learning Objectives:** Master `useEffect`, dependency arrays, cleanup, and data fetching patterns.

**Core Content:**

`useEffect` runs side effects after render. The dependency array controls when it runs: `[]` runs once on mount; `[dep]` runs when `dep` changes; no array runs after every render. Cleanup functions prevent memory leaks (clear timers, abort fetches, unsubscribe).

**Code Walkthrough: Effect Patterns**

```jsx
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchUser() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/users/${userId}`, {
          signal: controller.signal
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setUser(data);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
    return () => controller.abort();  // Cleanup
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!user) return null;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}

// Timer with cleanup
function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);

    return () => clearInterval(interval);  // Cleanup
  }, []);

  return <p>Seconds: {seconds}</p>;
}
```

**Explanation:** `AbortController` cancels fetch on unmount or `userId` change. Cleanup prevents state updates on unmounted components. The dependency array `[userId]` ensures refetch when `userId` changes. `setSeconds(s => s + 1)` uses functional update to avoid stale closures.

**Quiz:**
1. When does `useEffect` run with an empty dependency array?
2. Why is cleanup important?
3. How do you prevent state updates on unmounted components?
4. What happens if you omit the dependency array?
5. How do you fetch data when a prop changes?

**Task:** Build a search component that fetches results when the query changes. Debounce the fetch by 300ms. Handle loading, error, and empty states. Abort previous requests when a new query is typed.

**AI Tool Spotlight:** Use **React DevTools Profiler** to measure effect performance. Use **OpenCode** to explain effect dependencies.

---

### Day 24 — Lists, Keys, and Forms in React

**Learning Objectives:** Master list rendering, key selection, controlled forms, and form validation.

**Core Content:**

Keys must be unique and stable. Avoid array indices as keys when list order can change. Controlled forms bind every input to state. Uncontrolled forms use refs — less code but less control. React Hook Form is the modern standard for complex forms.

**Code Walkthrough: Complex Form with Validation**

```jsx
import { useState } from 'react';

function RegistrationForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = (data) => {
    const errs = {};
    if (data.username.length < 3) errs.username = "Min 3 characters";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      errs.email = "Invalid email";
    if (data.password.length < 8) errs.password = "Min 8 characters";
    if (data.password !== data.confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    if (touched[name]) {
      setErrors(validate(updated));
    }
  };

  const handleBlur = (e) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
    setErrors(validate(formData));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate(formData);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {["username", "email", "password", "confirmPassword"].map(field => (
        <div key={field} className="form-group">
          <label htmlFor={field}>
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
          <input
            id={field}
            name={field}
            type={field.includes("assword") ? "password" : "text"}
            value={formData[field]}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={!!errors[field]}
            aria-describedby={errors[field] ? `${field}-error` : undefined}
          />
          {errors[field] && touched[field] && (
            <span id={`${field}-error`} className="error" role="alert">
              {errors[field]}
            </span>
          )}
        </div>
      ))}
      <button type="submit">Register</button>
    </form>
  );
}
```

**Explanation:** `[name]: value` computed property updates the correct field. Validation runs on blur and submit. `aria-invalid` and `aria-describedby` make errors accessible. Keys are field names — stable and unique.

**Quiz:**
1. Why are array indices bad keys?
2. Difference between controlled and uncontrolled forms.
3. How do you handle form validation in React?
4. What is React Hook Form and why use it?
5. How do you make form errors accessible?

**Task:** Build a multi-step form (3 steps: personal info → address → review). Each step validates before proceeding. Use a single state object for all form data. Display a review step with all entered data before final submission.

**AI Tool Spotlight:** Use **React Hook Form** (free, open-source) with **Zod** for schema validation.

---

### Day 25 — React Router and Navigation

**Learning Objectives:** Master client-side routing, nested routes, and route protection.

**Core Content:**

React Router enables client-side navigation without full page reloads. `BrowserRouter` wraps the app. `Routes` and `Route` define mappings. `Link` and `NavLink` navigate without reload. `useNavigate` programmatic navigation. `useParams` accesses URL parameters. Nested routes render child routes inside parent layouts.

**Code Walkthrough: Protected Routes and Nested Layouts**

```jsx
import { BrowserRouter, Routes, Route, Link, NavLink,
         Outlet, Navigate, useParams, useNavigate } from 'react-router-dom';

// Layout with nested routes
function DashboardLayout() {
  return (
    <div className="dashboard">
      <nav>
        <NavLink to="/dashboard" end>Overview</NavLink>
        <NavLink to="/dashboard/courses">Courses</NavLink>
        <NavLink to="/dashboard/settings">Settings</NavLink>
      </nav>
      <main>
        <Outlet />  {/* Child routes render here */}
      </main>
    </div>
  );
}

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <h2>Course {id}</h2>
      <button onClick={() => navigate("/dashboard/courses")}>
        Back to Courses
      </button>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("token") !== null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <ProtectedRoute><DashboardLayout /></ProtectedRoute>
        }>
          <Route index element={<Overview />} />
          <Route path="courses" element={<CourseList />} />
          <Route path="courses/:id" element={<CourseDetail />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

**Explanation:** `<Outlet />` renders child route content. `NavLink` adds active styling. `useParams` extracts URL parameters. `ProtectedRoute` redirects unauthenticated users. `path="*"` catches 404s.

**Quiz:**
1. How does client-side routing differ from server-side?
2. What does `<Outlet />` do?
3. How do you protect routes in React Router?
4. Difference between `Link` and `NavLink`.
5. How do you access URL parameters?

**Task:** Build a blog with routes: `/` (home), `/posts` (list), `/posts/:id` (detail), `/about`, and `/admin` (protected). Use nested routes for an admin layout with `/admin/posts` and `/admin/users`.

**AI Tool Spotlight:** Use **React Router DevTools** (free) to visualise route hierarchy.

---

### Day 26 — Context API and State Management

**Learning Objectives:** Master Context API, `useReducer`, and when to use external state libraries.

**Core Content:**

Context provides a way to pass data through the component tree without prop drilling. `createContext` creates context. `useContext` consumes it. `useReducer` manages complex state logic with actions and a reducer function — similar to Redux but built-in.

For large apps, Zustand (lightweight) or Redux Toolkit (structured) may be appropriate. But start with Context + `useReducer` — it covers 80% of use cases.

**Code Walkthrough: Theme Context and Cart Reducer**

```jsx
import { createContext, useContext, useReducer } from 'react';

// Theme Context
const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () =>
    setTheme(prev => prev === "light" ? "dark" : "light");

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}

// Cart Reducer
const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.find(item => item.id === action.payload.id);
      if (existing) {
        return state.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    }
    case "REMOVE_ITEM":
      return state.filter(item => item.id !== action.payload);
    case "UPDATE_QUANTITY":
      return state.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
    case "CLEAR_CART":
      return [];
    default:
      return state;
  }
};

function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);

  const addItem = (item) => dispatch({ type: "ADD_ITEM", payload: item });
  const removeItem = (id) => dispatch({ type: "REMOVE_ITEM", payload: id });
  const updateQuantity = (id, quantity) =>
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  return (
    <CartContext.Provider value={{
      cart, addItem, removeItem, updateQuantity, clearCart, total
    }}>
      {children}
    </CartContext.Provider>
  );
}

function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
```

**Explanation:** Context eliminates prop drilling. `useReducer` centralises state logic in a pure function. Actions are plain objects with `type` and `payload`. Custom hooks (`useCart`, `useTheme`) provide a clean API and guard against missing providers.

**Quiz:**
1. What problem does Context solve?
2. When should you use `useReducer` over `useState`?
3. Why create custom hooks for context?
4. What causes unnecessary re-renders with Context?
5. How does Redux differ from Context + useReducer?

**Task:** Build a notification system with Context. Provide `addNotification`, `removeNotification`, and `clearAll`. Notifications have type (info, success, warning, error), message, and auto-dismiss after 5 seconds.

**AI Tool Spotlight:** Use **Zustand** (free, lightweight state management) if Context becomes unwieldy. Use **Redux DevTools** for time-travel debugging.


## Module 09: Advanced React (Days 27–29)

### Day 27 — Performance Optimization: Memoisation and Code Splitting

**Learning Objectives:** Master `React.memo`, `useMemo`, `useCallback`, lazy loading, and profiling.

**Core Content:**

React re-renders components when state or props change. Unnecessary re-renders hurt performance. `React.memo` prevents re-render if props are referentially equal. `useMemo` caches expensive calculations. `useCallback` caches function references. `React.lazy` and `Suspense` enable code splitting.

Profiling with React DevTools Profiler identifies actual bottlenecks. Measure before optimising.

**Code Walkthrough: Optimised Component**

```jsx
import { useState, useMemo, useCallback, memo, lazy, Suspense } from 'react';

// Expensive child — memoised
const ExpensiveChart = memo(function ExpensiveChart({ data, onBarClick }) {
  console.log("Chart rendered");
  const maxValue = useMemo(
    () => Math.max(...data.map(d => d.value)),
    [data]
  );

  return (
    <div className="chart">
      {data.map(item => (
        <div
          key={item.id}
          style={{ height: `${(item.value / maxValue) * 100}%` }}
          onClick={() => onBarClick(item.id)}
        />
      ))}
    </div>
  );
});

// Lazy-loaded heavy component
const HeavyEditor = lazy(() => import('./HeavyEditor'));

function Dashboard() {
  const [data, setData] = useState([
    { id: 1, value: 40 },
    { id: 2, value: 75 },
    { id: 3, value: 60 },
  ]);
  const [filter, setFilter] = useState("");
  const [showEditor, setShowEditor] = useState(false);

  // Stable callback reference
  const handleBarClick = useCallback((id) => {
    console.log("Bar clicked:", id);
  }, []);

  // Memoised filtered data
  const filteredData = useMemo(
    () => data.filter(d => d.value > 50),
    [data]
  );

  return (
    <div>
      <input
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="Filter..."
      />
      <ExpensiveChart data={filteredData} onBarClick={handleBarClick} />
      <button onClick={() => setShowEditor(true)}>Open Editor</button>
      {showEditor && (
        <Suspense fallback={<p>Loading editor...</p>}>
          <HeavyEditor />
        </Suspense>
      )}
    </div>
  );
}
```

**Explanation:** `memo` prevents `ExpensiveChart` from re-rendering when parent state changes but its props haven't. `useMemo` caches `filteredData` computation. `useCallback` stabilises `handleBarClick` so memo works. `lazy` splits `HeavyEditor` into a separate bundle loaded on demand.

**Quiz:**
1. What does `React.memo` compare?
2. Difference between `useMemo` and `useCallback`.
3. How does code splitting improve initial load time?
4. When should you NOT use memoisation?
5. How do you profile React performance?

**Task:** Optimise a todo list app. The list has 1000 items. Add search/filter. Use `memo` on list items, `useCallback` on handlers, and `useMemo` on filtered results. Profile before and after with React DevTools Profiler.

**AI Tool Spotlight:** Use **React DevTools Profiler** (free) to identify wasted renders. Use **Bundle Analyzer** (`source-map-explorer`) to visualise bundle size.

---

### Day 28 — Custom Hooks and Composition Patterns

**Learning Objectives:** Build reusable custom hooks and master compound component patterns.

**Core Content:**

Custom hooks extract reusable stateful logic. A custom hook is a function starting with `use` that calls other hooks. Compound components share implicit state via Context — like `<Select>` and `<Option>`. Render props pass functions as children/props. Higher-order components (HOCs) wrap components with additional props.

**Code Walkthrough: Custom Hooks and Compound Components**

```jsx
import { useState, useEffect, useRef, createContext, useContext } from 'react';

// Custom hook: useLocalStorage
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// Custom hook: useFetch
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(url, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setData)
      .catch(err => {
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}

// Custom hook: useDebounce
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

// Compound component: Tabs
const TabsContext = createContext();

function Tabs({ children, defaultTab }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({ children }) {
  return <div className="tab-list" role="tablist">{children}</div>;
}

function Tab({ id, children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  return (
    <button
      role="tab"
      aria-selected={activeTab === id}
      className={activeTab === id ? "tab active" : "tab"}
      onClick={() => setActiveTab(id)}
    >
      {children}
    </button>
  );
}

function TabPanel({ id, children }) {
  const { activeTab } = useContext(TabsContext);
  if (activeTab !== id) return null;
  return <div role="tabpanel">{children}</div>;
}

// Usage
function App() {
  const [name, setName] = useLocalStorage("name", "");
  const { data, loading } = useFetch("/api/courses");
  const search = useDebounce(name, 500);

  return (
    <Tabs defaultTab="overview">
      <TabList>
        <Tab id="overview">Overview</Tab>
        <Tab id="courses">Courses</Tab>
      </TabList>
      <TabPanel id="overview">Welcome, {name}</TabPanel>
      <TabPanel id="courses">
        {loading ? <p>Loading...</p> : <CourseList data={data} />}
      </TabPanel>
    </Tabs>
  );
}
```

**Explanation:** `useLocalStorage` syncs state with localStorage. `useFetch` abstracts fetch with loading/error states and cleanup. `useDebounce` delays value updates. Compound components share state via Context without prop drilling.

**Quiz:**
1. What makes a function a custom hook?
2. When should you extract a custom hook?
3. How do compound components share state?
4. What is the render props pattern?
5. How do custom hooks improve testability?

**Task:** Build a `useForm` custom hook that manages form state, validation, and submission. Support field-level validation, touched state, and error display. Use it to refactor the registration form from Day 24.

**AI Tool Spotlight:** Use **OpenCode** to generate custom hook boilerplate. Use **React Testing Library** to test hooks.

---

### Day 29 — Testing React Applications

**Learning Objectives:** Master React Testing Library, user-event, and testing best practices.

**Core Content:**

Test behaviour, not implementation. React Testing Library queries by role, label, and text — the way users interact. `user-event` simulates real user interactions. Mock API calls with MSW (Mock Service Worker). Test loading, error, and success states.

**Code Walkthrough: Component Testing**

```jsx
// TodoList.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import TodoList from './TodoList';

// Mock API
const server = setupServer(
  rest.get('/api/todos', (req, res, ctx) => {
    return res(ctx.json([
      { id: 1, text: "Learn React", done: false },
      { id: 2, text: "Build project", done: true },
    ]));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('TodoList', () => {
  test('renders todos from API', async () => {
    render(<TodoList />);

    // Loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for data
    await waitFor(() => {
      expect(screen.getByText("Learn React")).toBeInTheDocument();
      expect(screen.getByText("Build project")).toBeInTheDocument();
    });
  });

  test('adds a new todo', async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    await waitFor(() => screen.getByText("Learn React"));

    const input = screen.getByPlaceholderText(/add a todo/i);
    await user.type(input, "New todo");
    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(screen.getByText("New todo")).toBeInTheDocument();
  });

  test('toggles todo completion', async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    await waitFor(() => screen.getByText("Learn React"));

    const checkbox = screen.getByRole('checkbox', { name: /learn react/i });
    await user.click(checkbox);

    expect(checkbox).toBeChecked();
  });
});
```

**Explanation:** `screen.getByRole` queries accessible roles. `userEvent.setup()` provides realistic interactions. `waitFor` handles async rendering. MSW intercepts network requests at the service worker level.

**Quiz:**
1. Why query by role instead of test ID?
2. What does `waitFor` do?
3. How do you mock API calls in tests?
4. Difference between `getBy` and `findBy`.
5. What should you NOT test?

**Task:** Write tests for your shopping cart: add item, remove item, update quantity, calculate total, and clear cart. Mock the product API with MSW. Test error states (API failure) and loading states.

**AI Tool Spotlight:** Use **Qodo Gen** (free VS Code extension) to generate tests for your components. Use **Cypress** or **Playwright** for E2E testing.


## Module 10: Node.js (Days 30–32)

### Day 30 — Node.js Core: Runtime, Modules, and File System

**Learning Objectives:** Understand Node.js architecture, the module system, and core APIs.

**Core Content:**

Node.js is a JavaScript runtime built on Chrome's V8 engine. It uses an event-driven, non-blocking I/O model. The `fs` module reads/writes files. `path` handles file paths. `os` provides system information. `process` gives access to environment variables and CLI arguments.

CommonJS (`require`/`module.exports`) is the traditional module system. ES modules (`import`/`export`) are now supported with `"type": "module"` in `package.json` or `.mjs` extension. Prefer ES modules for new projects.

**Code Walkthrough: File Operations and CLI**

```javascript
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read file
async function readConfig() {
  try {
    const data = await fs.readFile(
      path.join(__dirname, 'config.json'), 'utf-8'
    );
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('Config not found, using defaults');
      return { port: 3000 };
    }
    throw err;
  }
}

// Write file
async function saveLog(message) {
  const logLine = `[${new Date().toISOString()}] ${message}\n`;
  await fs.appendFile(
    path.join(__dirname, 'app.log'), logLine
  );
}

// List directory
async function listFiles(dir) {
  const files = await fs.readdir(dir, { withFileTypes: true });
  return files.map(f => ({
    name: f.name,
    isDirectory: f.isDirectory(),
    path: path.join(dir, f.name)
  }));
}

// CLI arguments
const args = process.argv.slice(2);
console.log('Arguments:', args);
// node script.js --port 4000
// args: ['--port', '4000']

// Environment variables
const PORT = process.env.PORT || 3000;
console.log(`Server will run on port ${PORT}`);
```

**Explanation:** `fs/promises` provides async file operations. `path.join` constructs cross-platform paths. `import.meta.url` gives the current module URL. `process.argv` accesses CLI arguments. `process.env` reads environment variables.

**Quiz:**
1. What is the event loop in Node.js?
2. Difference between CommonJS and ES modules.
3. How do you read a file asynchronously?
4. What does `process.env` provide?
5. How do you construct safe file paths?

**Task:** Build a CLI tool that reads a directory, lists all `.js` files, counts lines in each, and outputs a summary table. Support `--path` and `--ext` arguments. Handle errors gracefully.

**AI Tool Spotlight:** Use **Free.ai Coder** to explain Node.js internals: `free-code ask "How does the Node.js event loop work?"`

---

### Day 31 — Building HTTP Servers with Node.js

**Learning Objectives:** Build raw HTTP servers, handle routing, parse bodies, and serve static files.

**Core Content:**

The `http` module creates servers. `createServer` returns a server instance. Routing parses `req.url` and `req.method`. Body parsing collects chunks from `req` stream. Static file serving reads from disk and pipes to response with correct MIME types.

**Code Walkthrough: A Simple API Server**

```javascript
import http from 'node:http';
import { URL } from 'node:url';

const users = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
];

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const method = req.method;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // JSON helper
  const json = (status, data) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  };

  // GET /api/users
  if (url.pathname === '/api/users' && method === 'GET') {
    return json(200, users);
  }

  // GET /api/users/:id
  const userMatch = url.pathname.match(/^\/api\/users\/(\d+)$/);
  if (userMatch && method === 'GET') {
    const user = users.find(u => u.id === parseInt(userMatch[1]));
    return user ? json(200, user) : json(404, { error: 'User not found' });
  }

  // POST /api/users
  if (url.pathname === '/api/users' && method === 'POST') {
    const body = await parseBody(req);
    const newUser = { id: users.length + 1, ...body };
    users.push(newUser);
    return json(201, newUser);
  }

  // 404
  json(404, { error: 'Route not found' });
});

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}

server.listen(3000, () => {
  console.log('API server running on http://localhost:3000');
});
```

**Explanation:** `URL` parses query strings and pathnames. Route matching uses regex. `parseBody` collects chunks and parses JSON. CORS headers enable cross-origin requests. `OPTIONS` handles preflight requests.

**Quiz:**
1. How does the `http` module differ from Express?
2. What is the role of `Access-Control-Allow-Origin`?
3. How do you parse a JSON request body?
4. What is a preflight request?
5. How do you serve static files?

**Task:** Extend the server above with PUT and DELETE routes. Add request logging (method, URL, timestamp, response time). Add a `/api/health` endpoint. Test all routes with `curl` and Postman.

**AI Tool Spotlight:** Use **Postman** (free) to test your API endpoints. Use **Thunder Client** (VS Code extension) as a lightweight alternative.

---

### Day 32 — npm Ecosystem, Security, and Environment Management

**Learning Objectives:** Master npm scripts, package management, security auditing, and environment configuration.

**Core Content:**

`npm audit` finds vulnerabilities. `npm outdated` shows outdated packages. `npm update` updates packages. Semantic versioning: `^1.2.3` allows minor updates, `~1.2.3` allows patch updates, `1.2.3` is exact. Lock files (`package-lock.json`) ensure reproducible installs.

Environment variables: `.env` files with `dotenv`. Never commit secrets. Use `dotenv` only in development; production environments inject variables directly. Validate required env vars at startup.

**Code Walkthrough: Environment Configuration**

```javascript
// config.js
import dotenv from 'dotenv';
dotenv.config();

const required = ['DATABASE_URL', 'JWT_SECRET', 'PORT'];
const missing = required.filter(key => !process.env[key]);

if (missing.length > 0) {
  console.error(`Missing required env vars: ${missing.join(', ')}`);
  process.exit(1);
}

export const config = {
  port: parseInt(process.env.PORT, 10),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV !== 'production',
};
```

```bash
# .env (never commit)
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
JWT_SECRET=super-secret-key-change-in-production
PORT=3000
NODE_ENV=development
```

```bash
# .gitignore
node_modules/
.env
.env.local
.env.production
*.log
```

```bash
# Security audit
npm audit
npm audit fix
npm audit fix --force  # Breaking changes — review carefully
```

**Explanation:** `dotenv.config()` loads `.env` into `process.env`. Validating required vars at startup fails fast. `.gitignore` prevents secrets from being committed. `npm audit` identifies known vulnerabilities.

**Quiz:**
1. What does `^` and `~` mean in semver?
2. Why should `.env` never be committed?
3. What does `npm audit fix --force` do?
4. How do you validate environment variables?
5. What is a lock file and why does it matter?

**Task:** Add environment configuration to your API server. Validate `PORT`, `DATABASE_URL`, and `JWT_SECRET`. Create `.env.example` with placeholder values. Run `npm audit` and fix any issues. Set up `npm run dev` with `nodemon` and `npm start` for production.

**AI Tool Spotlight:** Use **Snyk** (free tier) for continuous dependency vulnerability scanning. Use **Dotenv Vault** for secret management.


## Module 11: Express.js (Days 33–35)

### Day 33 — Express Fundamentals: Routing and Middleware

**Learning Objectives:** Master Express routing, middleware pipeline, and error handling.

**Core Content:**

Express is a minimal, unopinionated web framework for Node.js. `app.get()`, `app.post()`, `app.put()`, `app.delete()` define routes. Middleware functions receive `(req, res, next)` and can modify request/response, end the cycle, or call `next()`. Error-handling middleware has four parameters `(err, req, res, next)`.

Middleware order matters — it executes in the order defined. `express.json()` parses JSON bodies. `cors` enables cross-origin requests. Custom middleware for logging, authentication, rate limiting.

**Code Walkthrough: Complete Express API**

```javascript
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app = express();

// Built-in and third-party middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));  // Request logging

// Custom logging middleware
app.use((req, res, next) => {
  req.startTime = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - req.startTime;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });
  next();
});

// Rate limiting middleware (simple)
const requestCounts = new Map();
app.use((req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 100;

  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
    return next();
  }

  const record = requestCounts.get(ip);
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
    return next();
  }

  if (record.count >= maxRequests) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  record.count++;
  next();
});

// Routes
const users = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
];

// Router for modular routes
import { Router } from 'express';
const userRouter = Router();

userRouter.get('/', (req, res) => {
  res.json({ success: true, data: users });
});

userRouter.get('/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }
  res.json({ success: true, data: user });
});

userRouter.post('/', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: 'Name and email are required'
    });
  }
  const newUser = { id: users.length + 1, name, email };
  users.push(newUser);
  res.status(201).json({ success: true, data: newUser });
});

userRouter.put('/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { name, email } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;
  res.json({ success: true, data: user });
});

userRouter.delete('/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'User not found' });
  users.splice(index, 1);
  res.json({ success: true, message: 'User deleted' });
});

app.use('/api/users', userRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Error handler (4 params)
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
```

**Explanation:** Middleware executes in order. `Router` groups related routes. Error-handling middleware must have 4 parameters. The 404 handler is last before the error handler. Rate limiting prevents abuse.

**Quiz:**
1. What is middleware and how does `next()` work?
2. How do you mount a router on a path?
3. What is the difference between `app.use` and `app.get`?
4. How does error-handling middleware differ from regular middleware?
5. What does `express.json()` do?

**Task:** Build a complete REST API for a bookstore with books and authors. Use separate routers for each resource. Add request logging, rate limiting, and proper error handling. Test all endpoints with Postman.

**AI Tool Spotlight:** Use **Postman** collections to organise and run API tests. Use **Express Generator** (`npx express-generator`) for project scaffolding.

---

### Day 34 — Express Advanced: Validation, File Uploads, and Modular Architecture

**Learning Objectives:** Master input validation, file uploads with Multer, and controller/service/repository architecture.

**Core Content:**

Input validation: `express-validator` or `zod` schemas. Never trust client input. Sanitise and validate every request body, query parameter, and URL parameter.

File uploads: `multer` handles `multipart/form-data`. Configure storage (disk or memory), file filters (MIME type, size), and limits.

Modular architecture: routes → controllers → services → repositories. Controllers handle HTTP, services contain business logic, repositories handle data access. This separation enables testing and maintainability.

**Code Walkthrough: Validated Routes with File Upload**

```javascript
import { Router } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import multer from 'multer';
import path from 'node:path';

const router = Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },  // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP images allowed'));
    }
  }
});

// Validation middleware
const validate = (validations) => async (req, res, next) => {
  await Promise.all(validations.map(v => v.run(req)));
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  res.status(400).json({
    success: false,
    errors: errors.array().map(e => ({
      field: e.path,
      message: e.msg
    }))
  });
};

// POST /api/products — create with image
router.post(
  '/',
  upload.single('image'),
  validate([
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ min: 2, max: 100 }),
    body('price')
      .isFloat({ min: 0 }).withMessage('Price must be positive'),
    body('category')
      .isIn(['electronics', 'clothing', 'books'])
      .withMessage('Invalid category'),
  ]),
  async (req, res) => {
    const { name, price, category } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // In production: save to database via service layer
    const product = { id: Date.now(), name, price, category, imageUrl };
    res.status(201).json({ success: true, data: product });
  }
);

// GET /api/products with query validation
router.get(
  '/',
  validate([
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('category').optional().isIn(['electronics', 'clothing', 'books']),
  ]),
  async (req, res) => {
    const { page = 1, limit = 10, category } = req.query;
    // In production: query database
    res.json({
      success: true,
      data: [],
      pagination: { page, limit, total: 0 }
    });
  }
);

export default router;
```

**Explanation:** `multer.diskStorage` configures upload destination and filename. `fileFilter` restricts file types. `express-validator` chains run in parallel. `validationResult` collects errors. `toInt()` converts string query params to numbers.

**Quiz:**
1. Why validate input on the server if the client validates?
2. How does `multer` handle file uploads?
3. What is the difference between `body()`, `param()`, and `query()` validators?
4. How do you limit file upload size?
5. What is the controller/service/repository pattern?

**Task:** Build a product API with image upload. Validate all inputs. Implement pagination and filtering. Create a service layer that could swap between in-memory and database storage. Test with Postman including file upload.

**AI Tool Spotlight:** Use **Zod** (TypeScript-first schema validation) for runtime type checking. Use **Multer** documentation for advanced upload configurations.

---

### Day 35 — Express Middleware Deep Dive & Project Structure

**Learning Objectives:** Master middleware patterns, project organisation, and production-ready Express architecture.

**Core Content:**

Middleware types: application-level (`app.use`), router-level (`router.use`), error-handling, built-in (`express.json`, `express.static`), third-party (`cors`, `helmet`, `compression`).

Production middleware: `helmet` sets security headers, `compression` gzips responses, `express-rate-limit` prevents abuse, `hpp` prevents HTTP parameter pollution.

Project structure: `src/` with `config/`, `controllers/`, `middleware/`, `models/`, `routes/`, `services/`, `utils/`, `validators/`. `app.js` configures Express; `server.js` starts the server (separating concerns enables testing).

**Code Walkthrough: Production Express Setup**

```javascript
// src/app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';

const app = express();

// Security
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(compression());

// Rate limiting
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // 100 requests per window
  message: { error: 'Too many requests, please try again later' }
}));

// Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging (skip in test)
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Static files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// 404 and error handling (must be last)
app.use(notFound);
app.use(errorHandler);

export default app;
```

```javascript
// src/middleware/errorHandler.js
export function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
    return res.status(status).json({
      success: false,
      error: message,
      stack: err.stack
    });
  }

  res.status(status).json({ success: false, error: message });
}

// src/middleware/notFound.js
export function notFound(req, res, next) {
  const error = new Error(`Not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}
```

```javascript
// src/server.js
import app from './app.js';
import { config } from './config/index.js';

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
});
```

**Explanation:** Separating `app.js` from `server.js` allows importing the app in tests without starting a server. `helmet` sets 11 security headers. `compression` reduces response size. The error handler formats errors differently for development vs production.

**Quiz:**
1. Why separate `app.js` from `server.js`?
2. What does `helmet` do?
3. How does `compression` improve performance?
4. What is HTTP parameter pollution and how do you prevent it?
5. Why should error handling be last?

**Task:** Restructure your API into the production project structure. Add `helmet`, `compression`, and `express-rate-limit`. Write tests that import `app.js` without starting a server. Add environment-specific error formatting.

**AI Tool Spotlight:** Use **Express Generator** for scaffolding, then refactor to the modular structure. Use **Snyk** to scan Express dependencies.


## Module 12: MySQL (Days 36–39)

### Day 36 — Relational Database Design & SQL Fundamentals

**Learning Objectives:** Master relational modelling, normalisation, and core SQL queries.

**Core Content:**

Relational databases store data in tables with rows and columns. Primary keys uniquely identify rows. Foreign keys link tables. Normalisation (1NF, 2NF, 3NF) eliminates redundancy. One-to-one, one-to-many, and many-to-many relationships.

SQL categories: DDL (CREATE, ALTER, DROP), DML (SELECT, INSERT, UPDATE, DELETE), DCL (GRANT, REVOKE). Use `PRIMARY KEY`, `FOREIGN KEY`, `UNIQUE`, `NOT NULL`, `CHECK` constraints. Choose correct data types: `INT`, `VARCHAR`, `TEXT`, `DECIMAL`, `DATE`, `TIMESTAMP`, `ENUM`.

**Code Walkthrough: E-Commerce Schema**

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS ecommerce
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE ecommerce;

-- Users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin', 'moderator') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB;

-- Categories table
CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  parent_id INT NULL,
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Products table
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  category_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_category (category_id),
  INDEX idx_price (price),
  FULLTEXT idx_name_desc (name, description)
) ENGINE=InnoDB;

-- Orders table
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  status ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled')
    DEFAULT 'pending',
  total DECIMAL(12, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_status (user_id, status),
  INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- Order items (many-to-many between orders and products)
CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
  UNIQUE KEY unique_order_product (order_id, product_id)
) ENGINE=InnoDB;

-- Seed data
INSERT INTO categories (name, slug) VALUES
  ('Electronics', 'electronics'),
  ('Clothing', 'clothing'),
  ('Books', 'books');

INSERT INTO products (name, price, stock, category_id) VALUES
  ('Laptop', 999.99, 50, 1),
  ('T-Shirt', 19.99, 200, 2),
  ('JavaScript Book', 39.99, 100, 3);
```

**Explanation:** `AUTO_INCREMENT` generates IDs. `UNIQUE` prevents duplicates. `ENUM` restricts values. `ON DELETE CASCADE` deletes child rows when parent is deleted. `ON DELETE SET NULL` nullifies foreign keys. Indexes speed up queries on frequently filtered columns. `DECIMAL(10,2)` avoids floating-point errors for money.

**Quiz:**
1. What is the difference between `ON DELETE CASCADE` and `ON DELETE SET NULL`?
2. Why use `DECIMAL` instead of `FLOAT` for prices?
3. What is the purpose of an index?
4. Difference between `UNIQUE` and `PRIMARY KEY`.
5. When would you use `ENUM` vs a lookup table?

**Task:** Design a schema for a learning management system (LMS): users, courses, lessons, enrollments, progress. Include appropriate constraints, indexes, and foreign keys. Seed with sample data.

**AI Tool Spotlight:** Use **MySQL Workbench** (free) for visual schema design. Use **dbdiagram.io** (free) for ER diagram generation.

---

### Day 37 — Advanced Queries: Joins, Subqueries, and Aggregations

**Learning Objectives:** Master `JOIN` types, subqueries, CTEs, window functions, and aggregation.

**Core Content:**

Join types: `INNER JOIN` (matching rows), `LEFT JOIN` (all left rows), `RIGHT JOIN` (all right rows), `FULL OUTER JOIN` (all rows — MySQL uses `UNION`). Self-joins for hierarchical data. Subqueries in `SELECT`, `FROM`, and `WHERE`. Common Table Expressions (CTEs) with `WITH`. Window functions: `ROW_NUMBER()`, `RANK()`, `LAG()`, `LEAD()`, `SUM() OVER`.

**Code Walkthrough: Analytical Queries**

```sql
-- INNER JOIN: products with category names
SELECT p.name AS product, p.price, c.name AS category
FROM products p
INNER JOIN categories c ON p.category_id = c.id
WHERE p.price > 20
ORDER BY p.price DESC;

-- LEFT JOIN: all users with their order count (including users with no orders)
SELECT u.username, COUNT(o.id) AS order_count,
       COALESCE(SUM(o.total), 0) AS total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.username
ORDER BY total_spent DESC;

-- Subquery: products above average price
SELECT name, price
FROM products
WHERE price > (SELECT AVG(price) FROM products);

-- CTE: monthly revenue report
WITH monthly_revenue AS (
  SELECT
    DATE_FORMAT(created_at, '%Y-%m') AS month,
    COUNT(*) AS order_count,
    SUM(total) AS revenue
  FROM orders
  WHERE status != 'cancelled'
  GROUP BY DATE_FORMAT(created_at, '%Y-%m')
)
SELECT
  month,
  order_count,
  revenue,
  LAG(revenue) OVER (ORDER BY month) AS prev_month_revenue,
  ROUND(
    (revenue - LAG(revenue) OVER (ORDER BY month)) /
    LAG(revenue) OVER (ORDER BY month) * 100, 2
  ) AS growth_pct
FROM monthly_revenue
ORDER BY month;

-- Window function: rank products by price within category
SELECT
  name,
  category_id,
  price,
  ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY price DESC) AS price_rank,
  RANK() OVER (PARTITION BY category_id ORDER BY price DESC) AS price_rank_with_ties
FROM products;

-- Multi-table join: order details with user and product info
SELECT
  o.id AS order_id,
  u.username,
  o.status,
  o.created_at,
  GROUP_CONCAT(p.name SEPARATOR ', ') AS products,
  COUNT(oi.id) AS item_count,
  SUM(oi.quantity * oi.unit_price) AS order_total
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
GROUP BY o.id, u.username, o.status, o.created_at
HAVING order_total > 100
ORDER BY o.created_at DESC;
```

**Explanation:** `LEFT JOIN` preserves users without orders; `COALESCE` converts NULL to 0. CTEs make complex queries readable. `LAG` accesses the previous row's value for growth calculation. `ROW_NUMBER` assigns sequential ranks; `RANK` handles ties with gaps. `GROUP_CONCAT` aggregates strings.

**Quiz:**
1. Difference between `INNER JOIN` and `LEFT JOIN`.
2. What does `COALESCE` do?
3. When would you use a CTE over a subquery?
4. Difference between `ROW_NUMBER`, `RANK`, and `DENSE_RANK`.
5. How does `HAVING` differ from `WHERE`?

**Task:** Write queries for an e-commerce dashboard: (1) top 10 customers by total spending, (2) products never ordered, (3) month-over-month revenue growth, (4) most popular category by order count, (5) average order value per user.

**AI Tool Spotlight:** Use **MySQL Workbench** query editor with visual explain plans. Use **Chat2DB** (free) for AI-generated SQL from natural language.

---

### Day 38 — Indexing, Transactions, and Performance Tuning

**Learning Objectives:** Master indexing strategies, transactions, locking, and query optimisation.

**Core Content:**

Indexes speed up reads but slow down writes. B-tree indexes for equality and range queries. Composite indexes: column order matters — leftmost prefix rule. Covering indexes include all columns needed by a query. `EXPLAIN` shows query execution plans.

Transactions: `BEGIN`, `COMMIT`, `ROLLBACK`. ACID properties: Atomicity, Consistency, Isolation, Durability. Isolation levels: READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE. Deadlocks occur when transactions wait for each other.

**Code Walkthrough: Indexing and Transactions**

```sql
-- Create indexes
CREATE INDEX idx_products_category_price ON products(category_id, price);
-- This index supports:
--   WHERE category_id = 1 AND price > 50
--   WHERE category_id = 1
--   WHERE category_id = 1 ORDER BY price
-- But NOT:
--   WHERE price > 50  (without category_id — leftmost prefix)

-- Covering index (all columns in query)
CREATE INDEX idx_orders_covering ON orders(user_id, status, total, created_at);

-- EXPLAIN to analyse query
EXPLAIN SELECT p.name, p.price
FROM products p
WHERE p.category_id = 1 AND p.price > 50
ORDER BY p.price;
-- Look for: type=ref (good), key=idx_products_category_price, rows=low

-- Transaction example
START TRANSACTION;

-- Deduct stock
UPDATE products SET stock = stock - 2 WHERE id = 1 AND stock >= 2;

-- Check if update succeeded
SELECT ROW_COUNT() AS affected;
-- If affected = 0, insufficient stock → ROLLBACK

INSERT INTO orders (user_id, status, total) VALUES (1, 'pending', 1999.98);
SET @order_id = LAST_INSERT_ID();

INSERT INTO order_items (order_id, product_id, quantity, unit_price)
VALUES (@order_id, 1, 2, 999.99);

COMMIT;

-- Rollback example
START TRANSACTION;
UPDATE products SET stock = 0 WHERE id = 999999;  -- Non-existent
SELECT ROW_COUNT();  -- 0
ROLLBACK;

-- Deadlock avoidance: access tables in consistent order
-- Transaction 1: orders → order_items
-- Transaction 2: orders → order_items (same order prevents deadlock)
```

**Explanation:** Composite index `(category_id, price)` supports queries filtering on category and sorting/filtering by price. `EXPLAIN` reveals whether indexes are used. Transactions ensure atomicity. `ROW_COUNT()` checks affected rows. `LAST_INSERT_ID()` gets the auto-generated ID.

**Quiz:**
1. What is the leftmost prefix rule for composite indexes?
2. How does `EXPLAIN` help optimise queries?
3. What are ACID properties?
4. What causes deadlocks and how do you prevent them?
5. When should you NOT create an index?

**Task:** Analyse slow queries on your e-commerce database using `EXPLAIN`. Create appropriate indexes. Write a transaction that transfers stock between products atomically. Test rollback on failure.

**AI Tool Spotlight:** Use **Percona Toolkit** (free) for query analysis. Use **MySQL Workbench** visual explain for execution plan inspection.

---

### Day 39 — Node.js + MySQL Integration

**Learning Objectives:** Connect Node.js to MySQL, use connection pools, and implement repository pattern.

**Core Content:**

Use `mysql2` (not `mysql`) — it supports Promises and prepared statements. Connection pooling reuses connections. Prepared statements prevent SQL injection. Repository pattern abstracts database access from business logic.

**Code Walkthrough: Database Layer**

```javascript
// db/pool.js
import mysql from 'mysql2/promise';
import { config } from '../config/index.js';

export const pool = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.name,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: 'Z',
  dateStrings: false,
});

// Test connection
export async function testConnection() {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log('Database connected');
  } catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  }
}
```

```javascript
// repositories/userRepository.js
import { pool } from '../db/pool.js';

export const userRepository = {
  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  },

  async create({ username, email, passwordHash }) {
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, passwordHash]
    );
    return this.findById(result.insertId);
  },

  async update(id, fields) {
    const allowed = ['username', 'email'];
    const updates = Object.keys(fields)
      .filter(k => allowed.includes(k))
      .map(k => `${k} = ?`)
      .join(', ');

    if (!updates) return this.findById(id);

    const values = Object.keys(fields)
      .filter(k => allowed.includes(k))
      .map(k => fields[k]);

    await pool.execute(
      `UPDATE users SET ${updates} WHERE id = ?`,
      [...values, id]
    );
    return this.findById(id);
  },

  async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM users WHERE id = ?', [id]
    );
    return result.affectedRows > 0;
  },

  async findAll({ page = 1, limit = 10, role } = {}) {
    const offset = (page - 1) * limit;
    let query = 'SELECT id, username, email, role FROM users';
    const params = [];

    if (role) {
      query += ' WHERE role = ?';
      params.push(role);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.execute(query, params);

    const [countResult] = await pool.execute(
      'SELECT COUNT(*) AS total FROM users' + (role ? ' WHERE role = ?' : ''),
      role ? [role] : []
    );

    return {
      data: rows,
      pagination: {
        page,
        limit,
        total: countResult[0].total,
        totalPages: Math.ceil(countResult[0].total / limit)
      }
    };
  }
};
```

**Explanation:** `pool.execute` uses prepared statements — parameters are escaped automatically. The repository pattern encapsulates all SQL. `?` placeholders prevent SQL injection. `result.insertId` returns the auto-generated ID.

**Quiz:**
1. Why use `mysql2` over `mysql`?
2. What is a connection pool and why use it?
3. How do prepared statements prevent SQL injection?
4. What does the repository pattern abstract?
5. How do you handle pagination efficiently?

**Task:** Build a complete user repository with CRUD operations. Add a service layer that uses the repository. Write integration tests that use a test database. Implement transaction support for multi-table operations.

**AI Tool Spotlight:** Use **Prisma** (free ORM) or **Drizzle** as alternatives to raw SQL. Use **Knex.js** query builder for complex queries.


## Module 13: MongoDB (Days 40–41)

### Day 40 — MongoDB Fundamentals: Documents, Collections, and CRUD

**Learning Objectives:** Master MongoDB data model, `mongosh`, and CRUD operations.

**Core Content:**

MongoDB is a NoSQL document database. Documents are BSON (binary JSON) stored in collections. Unlike SQL, there is no fixed schema — documents in the same collection can have different fields. `_id` is the primary key, auto-generated as ObjectId.

CRUD: `insertOne`, `insertMany`, `find`, `findOne`, `updateOne`, `updateMany`, `replaceOne`, `deleteOne`, `deleteMany`. Query operators: `$eq`, `$gt`, `$gte`, `$lt`, `$lte`, `$in`, `$nin`, `$and`, `$or`, `$not`, `$exists`, `$regex`. Update operators: `$set`, `$unset`, `$inc`, `$push`, `$pull`, `$addToSet`.

**Code Walkthrough: MongoDB CRUD**

```javascript
// Using MongoDB Node.js driver
import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();

const db = client.db('ecommerce');
const users = db.collection('users');

// Create
const insertResult = await users.insertOne({
  name: "Alice",
  email: "alice@example.com",
  age: 28,
  roles: ["user", "admin"],
  address: {
    city: "Delhi",
    country: "India"
  },
  createdAt: new Date()
});
console.log('Inserted ID:', insertResult.insertedId);

// Read
const allUsers = await users.find().toArray();
const filtered = await users.find({
  age: { $gte: 25 },
  roles: { $in: ["admin"] }
}).toArray();

const projected = await users.find(
  { email: /example\.com$/ },
  { projection: { name: 1, email: 1, _id: 0 } }
).toArray();

// Update
await users.updateOne(
  { _id: insertResult.insertedId },
  {
    $set: { age: 29 },
    $push: { roles: "moderator" },
    $inc: { loginCount: 1 }
  }
);

// Upsert — insert if not exists
await users.updateOne(
  { email: "bob@example.com" },
  { $set: { name: "Bob", age: 32 } },
  { upsert: true }
);

// Delete
await users.deleteOne({ _id: insertResult.insertedId });

// Bulk operations
const bulkOps = [
  { insertOne: { document: { name: "Charlie", age: 35 } } },
  { updateOne: {
      filter: { name: "Bob" },
      update: { $set: { age: 33 } }
  }},
  { deleteOne: { filter: { name: "Alice" } } }
];
await users.bulkWrite(bulkOps);

// Indexes
await users.createIndex({ email: 1 }, { unique: true });
await users.createIndex({ age: -1 });
await users.createIndex({ name: "text", bio: "text" });  // Text index

await client.close();
```

**Explanation:** `insertOne` returns `insertedId`. `find` accepts a filter and options. `$gte` means greater-than-or-equal. `$push` adds to array; `$addToSet` only adds if not present. `upsert` creates if filter matches nothing. `createIndex` improves query performance.

**Quiz:**
1. How does MongoDB differ from MySQL?
2. What is a BSON document?
3. Difference between `$set` and `$push`.
4. What does `upsert` do?
5. How do you create a unique index?

**Task:** Build a blog post system with MongoDB. Create posts, comments (embedded or referenced), and tags. Implement CRUD operations for posts. Add indexes for common queries (by author, by tag, by date).

**AI Tool Spotlight:** Use **MongoDB Compass** (free GUI) to visualise documents and analyse query performance. Use **MongoDB Atlas** free tier for cloud hosting.

---

### Day 41 — MongoDB Aggregation Framework and Mongoose

**Learning Objectives:** Master aggregation pipelines, `$lookup`, `$group`, and Mongoose ODM.

**Core Content:**

The aggregation pipeline processes documents through stages. Key stages: `$match` (filter), `$project` (reshape), `$group` (aggregate), `$sort`, `$limit`, `$skip`, `$lookup` (join), `$unwind` (deconstruct arrays), `$addFields` (compute), `$facet` (multiple pipelines).

Mongoose is an ODM (Object Document Mapper) that provides schema validation, middleware, and population (referencing other collections).

**Code Walkthrough: Aggregation Pipeline**

```javascript
// Aggregation: top-selling products
const topProducts = await orders.aggregate([
  { $match: { status: { $in: ["paid", "shipped", "delivered"] } } },
  { $unwind: "$items" },
  { $group: {
      _id: "$items.productId",
      totalSold: { $sum: "$items.quantity" },
      totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
  }},
  { $lookup: {
      from: "products",
      localField: "_id",
      foreignField: "_id",
      as: "product"
  }},
  { $unwind: "$product" },
  { $project: {
      _id: 0,
      name: "$product.name",
      totalSold: 1,
      totalRevenue: 1,
      averagePrice: { $divide: ["$totalRevenue", "$totalSold"] }
  }},
  { $sort: { totalRevenue: -1 } },
  { $limit: 10 }
]).toArray();

// Faceted search: multiple aggregations in one query
const facetedResults = await products.aggregate([
  { $match: { category: "electronics" } },
  { $facet: {
      byPrice: [
        { $bucket: {
            groupBy: "$price",
            boundaries: [0, 50, 100, 500, 1000],
            default: "1000+",
            output: { count: { $sum: 1 } }
        }}
      ],
      byBrand: [
        { $group: { _id: "$brand", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ],
      stats: [
        { $group: {
            _id: null,
            avgPrice: { $avg: "$price" },
            minPrice: { $min: "$price" },
            maxPrice: { $max: "$price" },
            total: { $sum: 1 }
        }}
      ]
  }}
]).toArray();
```

```javascript
// Mongoose schema with validation and methods
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: 100
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    enum: ['electronics', 'clothing', 'books'],
    required: true
  },
  tags: [String],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: { type: Date, default: Date.now }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual property
productSchema.virtual('priceFormatted').get(function() {
  return `$${this.price.toFixed(2)}`;
});

// Instance method
productSchema.methods.applyDiscount = function(percent) {
  this.price = this.price * (1 - percent / 100);
  return this.save();
};

// Static method
productSchema.statics.findByCategory = function(category) {
  return this.find({ category }).sort({ createdAt: -1 });
};

// Middleware (pre/post hooks)
productSchema.pre('save', function(next) {
  this.name = this.name.trim();
  next();
});

const Product = mongoose.model('Product', productSchema);

// Usage
const product = await Product.create({
  name: "Laptop",
  price: 999.99,
  category: "electronics",
  seller: userId
});

const populated = await Product.findById(product._id).populate('seller', 'name email');
```

**Explanation:** `$unwind` flattens array items. `$lookup` performs a left join. `$facet` runs multiple aggregation pipelines in parallel. Mongoose schemas enforce validation at the application level. Virtuals compute derived properties. Middleware runs before/after operations.

**Quiz:**
1. What does `$unwind` do?
2. How does `$lookup` differ from SQL JOIN?
3. What is the purpose of `$facet`?
4. How does Mongoose validation differ from MongoDB validation?
5. What is a virtual property in Mongoose?

**Task:** Build an analytics dashboard using MongoDB aggregation. Create pipelines for: top customers, revenue by month, category performance, and product ratings. Use `$facet` for multi-metric queries. Create Mongoose models with validation, virtuals, and methods.

**AI Tool Spotlight:** Use **MongoDB Compass** aggregation builder for visual pipeline construction. Use **Mongoose** documentation for schema design patterns.


## Module 14: REST API Development (Days 42–43)

### Day 42 — RESTful Design Principles and API Versioning

**Learning Objectives:** Master REST constraints, resource naming, status codes, and versioning strategies.

**Core Content:**

REST (Representational State Transfer) is an architectural style, not a protocol. Constraints: client-server, stateless, cacheable, uniform interface, layered system, code-on-demand (optional). Resources are nouns, actions are HTTP methods. Use plural nouns for collections: `/users`, `/users/42`, `/users/42/orders`.

Status codes: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable Entity, 429 Too Many Requests, 500 Internal Server Error.

Versioning: URL path (`/api/v1/users`), query parameter (`/api/users?version=1`), or header (`Accept: application/vnd.api.v1+json`). URL path versioning is most common and simplest.

**Code Walkthrough: RESTful Resource Design**

```javascript
// Complete RESTful resource with proper status codes
import { Router } from 'express';

const router = Router();

// GET /api/v1/courses — list with pagination, filtering, sorting
router.get('/', async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sort = '-createdAt',
    category,
    search
  } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (search) filter.$text = { $search: search };

  const courses = await Course.find(filter)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Course.countDocuments(filter);

  res.json({
    success: true,
    data: courses,
    meta: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit)
    },
    links: {
      self: `/api/v1/courses?page=${page}&limit=${limit}`,
      next: page * limit < total
        ? `/api/v1/courses?page=${parseInt(page) + 1}&limit=${limit}`
        : null,
      prev: page > 1
        ? `/api/v1/courses?page=${parseInt(page) - 1}&limit=${limit}`
        : null
    }
  });
});

// GET /api/v1/courses/:id — single resource
router.get('/:id', async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'COURSE_NOT_FOUND',
        message: `Course with ID ${req.params.id} not found`
      }
    });
  }
  res.json({ success: true, data: course });
});

// POST /api/v1/courses — create resource
router.post('/', async (req, res) => {
  const course = await Course.create(req.body);
  res.status(201)
    .location(`/api/v1/courses/${course._id}`)
    .json({ success: true, data: course });
});

// PATCH /api/v1/courses/:id — partial update
router.patch('/:id', async (req, res) => {
  const course = await Course.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  );
  if (!course) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true, data: course });
});

// PUT /api/v1/courses/:id — full replacement
router.put('/:id', async (req, res) => {
  const course = await Course.findOneAndReplace(
    { _id: req.params.id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!course) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true, data: course });
});

// DELETE /api/v1/courses/:id
router.delete('/:id', async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) return res.status(404).json({ error: 'Not found' });
  res.status(204).send();  // No content
});

export default router;
```

**Explanation:** `POST` returns 201 with `Location` header. `PATCH` does partial update; `PUT` replaces entirely. `DELETE` returns 204 No Content. Error responses include machine-readable `code` and human-readable `message`. Pagination metadata and HATEOAS-style links improve API usability.

**Quiz:**
1. Why use plural nouns for REST resources?
2. Difference between `PUT` and `PATCH`.
3. When to return 204 vs 200.
4. How do you version a REST API?
5. What does statelessness mean in REST?

**Task:** Design and implement a RESTful API for a library system: books, authors, members, loans. Include proper status codes, pagination, filtering, and error responses. Document with OpenAPI/Swagger.

**AI Tool Spotlight:** Use **Swagger Editor** (free) to design APIs with OpenAPI spec. Use **Postman** to generate documentation from collections.

---

### Day 43 — API Documentation, Testing, and Versioning

**Learning Objectives:** Master OpenAPI/Swagger documentation, Postman testing, and API versioning strategies.

**Core Content:**

OpenAPI Specification (formerly Swagger) describes REST APIs in YAML/JSON. Tools: Swagger Editor (design), Swagger UI (interactive docs), Swagger Codegen (generate client SDKs). Document endpoints, parameters, request bodies, responses, and authentication.

API testing with Postman: collections, environments (dev/staging/prod), test scripts with `pm.test()`, pre-request scripts, and collection runner for CI.

**Code Walkthrough: OpenAPI Specification**

```yaml
# openapi.yaml
openapi: 3.0.3
info:
  title: Course API
  version: 1.0.0
  description: API for managing courses

servers:
  - url: http://localhost:3000/api/v1
    description: Development

paths:
  /courses:
    get:
      summary: List all courses
      parameters:
        - name: page
          in: query
          schema: { type: integer, default: 1 }
        - name: limit
          in: query
          schema: { type: integer, default: 10, maximum: 100 }
        - name: category
          in: query
          schema: { type: string, enum: [frontend, backend, fullstack] }
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  data:
                    type: array
                    items: { $ref: '#/components/schemas/Course' }
                  meta: { $ref: '#/components/schemas/PaginationMeta' }
    post:
      summary: Create a course
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/CourseInput' }
      responses:
        '201':
          description: Course created
        '400':
          description: Validation error

  /courses/{id}:
    get:
      summary: Get course by ID
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: string }
      responses:
        '200':
          description: Course found
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Course' }
        '404':
          description: Course not found

components:
  schemas:
    Course:
      type: object
      properties:
        id: { type: string }
        title: { type: string }
        description: { type: string }
        category: { type: string, enum: [frontend, backend, fullstack] }
        price: { type: number, format: float }
        createdAt: { type: string, format: date-time }

    CourseInput:
      type: object
      required: [title, category, price]
      properties:
        title: { type: string, minLength: 2, maxLength: 100 }
        description: { type: string }
        category: { type: string, enum: [frontend, backend, fullstack] }
        price: { type: number, minimum: 0 }

    PaginationMeta:
      type: object
      properties:
        page: { type: integer }
        limit: { type: integer }
        total: { type: integer }
        totalPages: { type: integer }

  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

security:
  - bearerAuth: []
```

```javascript
// Postman test script
// In the Tests tab of a Postman request:
pm.test('Status code is 200', () => {
  pm.response.to.have.status(200);
});

pm.test('Response has success property', () => {
  const json = pm.response.json();
  pm.expect(json).to.have.property('success', true);
});

pm.test('Response time is acceptable', () => {
  pm.expect(pm.response.responseTime).to.be.below(500);
});

pm.test('Data is an array', () => {
  const json = pm.response.json();
  pm.expect(json.data).to.be.an('array');
});

// Save token for subsequent requests
pm.test('Save auth token', () => {
  const json = pm.response.json();
  pm.environment.set('token', json.token);
});
```

**Explanation:** OpenAPI documents the contract between frontend and backend. Swagger UI generates interactive documentation. Postman test scripts run assertions and can be executed in CI with `newman`.

**Quiz:**
1. What is the OpenAPI Specification?
2. How do you document authentication in OpenAPI?
3. How do you run Postman collections in CI?
4. What is the difference between Swagger 2.0 and OpenAPI 3.0?
5. Why document APIs?

**Task:** Write an OpenAPI spec for your library API. Generate interactive docs with Swagger UI. Create a Postman collection with test scripts for all endpoints. Run the collection with Newman in a CI pipeline.

**AI Tool Spotlight:** Use **Swagger Editor** (free, online) to write OpenAPI specs. Use **Newman** CLI for CI-integrated API testing.


## Module 15: Authentication & RBAC (Days 44–45)

### Day 44 — JWT Authentication: Registration, Login, and Token Management

**Learning Objectives:** Implement JWT-based authentication with secure password hashing and token refresh.

**Core Content:**

Authentication verifies identity; authorisation determines access. JWT (JSON Web Token) has three parts: header, payload, signature. The payload contains claims (user ID, role, expiry). The signature prevents tampering. Tokens are stateless — the server does not store sessions.

Access tokens are short-lived (15 min). Refresh tokens are long-lived (7 days) and stored securely (httpOnly cookie). Password hashing with `bcrypt` (cost factor 12+). Never store plain passwords.

**Code Walkthrough: Complete Auth Flow**

```javascript
// services/authService.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/userRepository.js';
import { config } from '../config/index.js';

const SALT_ROUNDS = 12;

export const authService = {
  async register({ username, email, password }) {
    // Check if user exists
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      const err = new Error('Email already registered');
      err.statusCode = 409;
      throw err;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const user = await userRepository.create({
      username,
      email,
      passwordHash
    });

    // Generate tokens
    return this.generateTokens(user);
  },

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const err = new Error('Invalid credentials');
      err.statusCode = 401;
      throw err;
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      const err = new Error('Invalid credentials');
      err.statusCode = 401;
      throw err;
    }

    return this.generateTokens(user);
  },

  generateTokens(user) {
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      config.jwtSecret,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, type: 'refresh' },
      config.jwtRefreshSecret,
      { expiresIn: '7d' }
    );

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      accessToken,
      refreshToken
    };
  },

  async refreshToken(token) {
    try {
      const decoded = jwt.verify(token, config.jwtRefreshSecret);
      if (decoded.type !== 'refresh') throw new Error('Invalid token type');

      const user = await userRepository.findById(decoded.userId);
      if (!user) throw new Error('User not found');

      const accessToken = jwt.sign(
        { userId: user.id, role: user.role },
        config.jwtSecret,
        { expiresIn: '15m' }
      );

      return { accessToken };
    } catch (err) {
      const error = new Error('Invalid refresh token');
      error.statusCode = 401;
      throw error;
    }
  }
};
```

```javascript
// middleware/auth.js
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    const err = new Error('Authentication required');
    err.statusCode = 401;
    return next(err);
  }

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = { id: decoded.userId, role: decoded.role };
    next();
  } catch (err) {
    const error = new Error(
      err.name === 'TokenExpiredError'
        ? 'Token expired'
        : 'Invalid token'
    );
    error.statusCode = 401;
    next(error);
  }
}
```

```javascript
// routes/auth.js
import { Router } from 'express';
import { authService } from '../services/authService.js';

const router = Router();

router.post('/register', async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) { next(err); }
});

router.post('/login', async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
    });
    res.json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken
      }
    });
  } catch (err) { next(err); }
});

router.post('/refresh', async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) throw new Error('No refresh token');
    const result = await authService.refreshToken(token);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

router.post('/logout', (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logged out' });
});

export default router;
```

**Explanation:** `bcrypt.hash` with 12 rounds is computationally expensive — good for security. Access tokens are short-lived; refresh tokens are stored in httpOnly cookies (not accessible via JavaScript, preventing XSS theft). `authenticate` middleware verifies the access token on protected routes.

**Quiz:**
1. What are the three parts of a JWT?
2. Why use short-lived access tokens?
3. Why store refresh tokens in httpOnly cookies?
4. How does bcrypt work?
5. What happens if a JWT secret is compromised?

**Task:** Implement the complete auth flow: register, login, refresh, logout, and protected route. Write integration tests for each endpoint. Add rate limiting to login (prevent brute force). Test with Postman.

**AI Tool Spotlight:** Use **JWT.io** (free) to decode and inspect JWTs. Use **OWASP ZAP** (free) for security testing of auth endpoints.

---

### Day 45 — Role-Based Access Control (RBAC) and Permissions

**Learning Objectives:** Implement RBAC with role hierarchies, permission checks, and resource ownership.

**Core Content:**

RBAC assigns permissions to roles, and roles to users. Role hierarchy: super-admin > admin > moderator > user > guest. Permission-based access: fine-grained control where each role has a set of permissions (`user:read`, `user:write`, `post:delete`). Resource ownership: users can only modify their own resources unless they have admin role.

**Code Walkthrough: RBAC Middleware**

```javascript
// middleware/rbac.js

// Role-based middleware
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      const err = new Error('Authentication required');
      err.statusCode = 401;
      return next(err);
    }

    if (!roles.includes(req.user.role)) {
      const err = new Error('Insufficient permissions');
      err.statusCode = 403;
      return next(err);
    }

    next();
  };
}

// Permission-based middleware
const ROLE_PERMISSIONS = {
  admin: ['user:read', 'user:write', 'user:delete',
          'post:read', 'post:write', 'post:delete',
          'comment:read', 'comment:write', 'comment:delete'],
  moderator: ['user:read', 'post:read', 'post:write',
              'comment:read', 'comment:write', 'comment:delete'],
  user: ['post:read', 'post:write', 'comment:read', 'comment:write'],
  guest: ['post:read', 'comment:read']
};

export function requirePermission(...permissions) {
  return (req, res, next) => {
    if (!req.user) {
      const err = new Error('Authentication required');
      err.statusCode = 401;
      return next(err);
    }

    const userPermissions = ROLE_PERMISSIONS[req.user.role] || [];
    const hasPermission = permissions.every(p =>
      userPermissions.includes(p)
    );

    if (!hasPermission) {
      const err = new Error('Insufficient permissions');
      err.statusCode = 403;
      return next(err);
    }

    next();
  };
}

// Resource ownership check
export function requireOwnership(getResourceUserId) {
  return async (req, res, next) => {
    try {
      const resourceUserId = await getResourceUserId(req);
      if (
        req.user.role !== 'admin' &&
        req.user.id !== resourceUserId
      ) {
        const err = new Error('You can only modify your own resources');
        err.statusCode = 403;
        return next(err);
      }
      next();
    } catch (err) { next(err); }
  };
}
```

```javascript
// Usage in routes
import { authenticate } from '../middleware/auth.js';
import { requireRole, requirePermission, requireOwnership } from '../middleware/rbac.js';

// Only admins can list all users
router.get('/users',
  authenticate,
  requireRole('admin'),
  userController.list
);

// Users with user:write permission can create posts
router.post('/posts',
  authenticate,
  requirePermission('post:write'),
  postController.create
);

// Only post owner or admin can edit
router.patch('/posts/:id',
  authenticate,
  requirePermission('post:write'),
  requireOwnership(async (req) => {
    const post = await Post.findById(req.params.id);
    return post.author.toString();
  }),
  postController.update
);

// Public route — no auth
router.get('/posts', postController.listPublic);
```

**Explanation:** `requireRole` checks exact role match. `requirePermission` checks granular permissions. `requireOwnership` compares resource owner with current user, allowing admins to bypass. Middleware composes for flexible access control.

**Quiz:**
1. Difference between role-based and permission-based access control?
2. How do you handle resource ownership in RBAC?
3. Why allow admins to bypass ownership checks?
4. How do you test RBAC middleware?
5. What is the principle of least privilege?

**Task:** Build a complete RBAC system for a blog platform. Roles: admin, editor, author, reader. Permissions: create/edit/delete/publish posts, manage users, manage comments. Authors can only edit their own posts. Editors can edit any post but not manage users. Write tests for every role/resource combination.

**AI Tool Spotlight:** Use **Casbin** (free, open-source) for more complex access control models (ABAC, RBAC with domains). Use **Postman** to test all role combinations.


## Module 16: Testing & Debugging (Days 46–47)

### Day 46 — Unit and Integration Testing with Jest

**Learning Objectives:** Master Jest testing: unit tests, integration tests, mocking, and coverage.

**Core Content:**

Unit tests test individual functions in isolation. Integration tests test multiple units together (e.g., API endpoint + database). Jest provides `describe`, `test`/`it`, `expect`, `beforeEach`/`afterEach`, `beforeAll`/`afterAll`, and mocking utilities.

Test pyramid: many unit tests, fewer integration tests, fewest E2E tests. Aim for high coverage on critical paths, not 100% coverage everywhere.

**Code Walkthrough: Testing an Express API**

```javascript
// tests/setup.js
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
```

```javascript
// tests/course.test.js
import request from 'supertest';
import app from '../src/app.js';
import { Course } from '../src/models/Course.js';

describe('Course API', () => {
  const validCourse = {
    title: "JavaScript Fundamentals",
    category: "frontend",
    price: 49.99
  };

  describe('POST /api/v1/courses', () => {
    test('creates a course with valid data', async () => {
      const res = await request(app)
        .post('/api/v1/courses')
        .send(validCourse);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(validCourse.title);
      expect(res.body.data._id).toBeDefined();
    });

    test('returns 400 with missing title', async () => {
      const res = await request(app)
        .post('/api/v1/courses')
        .send({ category: "frontend", price: 49.99 });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    test('returns 400 with negative price', async () => {
      const res = await request(app)
        .post('/api/v1/courses')
        .send({ ...validCourse, price: -10 });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/v1/courses', () => {
    beforeEach(async () => {
      await Course.create([
        { ...validCourse, title: "React Basics" },
        { ...validCourse, title: "Node.js Guide", category: "backend" },
        { ...validCourse, title: "CSS Mastery", price: 29.99 }
      ]);
    });

    test('returns paginated courses', async () => {
      const res = await request(app)
        .get('/api/v1/courses?page=1&limit=2');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.meta.total).toBe(3);
      expect(res.body.meta.totalPages).toBe(2);
    });

    test('filters by category', async () => {
      const res = await request(app)
        .get('/api/v1/courses?category=backend');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].title).toBe("Node.js Guide");
    });
  });

  describe('GET /api/v1/courses/:id', () => {
    test('returns 404 for non-existent ID', async () => {
      const res = await request(app)
        .get('/api/v1/courses/000000000000000000000000');

      expect(res.status).toBe(404);
    });
  });
});
```

```javascript
// Unit test with mocking
import { authService } from '../src/services/authService.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../src/repositories/userRepository.js';

jest.mock('../src/repositories/userRepository.js');
jest.mock('bcrypt');

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('register hashes password and returns tokens', async () => {
    const mockUser = {
      id: 1,
      username: 'alice',
      email: 'alice@example.com',
      role: 'user'
    };

    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.create.mockResolvedValue(mockUser);
    bcrypt.hash.mockResolvedValue('hashed_password');

    const result = await authService.register({
      username: 'alice',
      email: 'alice@example.com',
      password: 'password123'
    });

    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 12);
    expect(userRepository.create).toHaveBeenCalledWith({
      username: 'alice',
      email: 'alice@example.com',
      passwordHash: 'hashed_password'
    });
    expect(result.accessToken).toBeDefined();
    expect(result.user.email).toBe('alice@example.com');
  });

  test('login throws on invalid credentials', async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    await expect(
      authService.login({ email: 'wrong@example.com', password: 'wrong' })
    ).rejects.toThrow('Invalid credentials');
  });
});
```

**Explanation:** `MongoMemoryServer` provides an in-memory MongoDB for tests. `supertest` makes HTTP requests to the Express app without starting a server. `jest.mock()` replaces modules with mocks. `jest.clearAllMocks()` resets mock state between tests.

**Quiz:**
1. What is the test pyramid?
2. Difference between unit and integration tests?
3. How do you mock a module in Jest?
4. What does `beforeEach` do?
5. How do you test error responses?

**Task:** Write comprehensive tests for your API: unit tests for services and utilities, integration tests for all endpoints, and error case tests. Achieve 80%+ coverage on critical paths. Set up CI to run tests on every push.

**AI Tool Spotlight:** Use **Qodo Gen** to generate test scaffolds. Use **Jest** coverage reports (`--coverage`) to identify untested code.

---

### Day 47 — Debugging: Node.js Inspector, Logging, and Error Tracking

**Learning Objectives:** Master Node.js debugger, structured logging, and error tracking.

**Core Content:**

Debugging techniques: `console.log`, `debugger` statement, Node.js inspector (`node --inspect`), VS Code debugger with breakpoints, watch expressions, call stack, and step-through.

Structured logging with `pino` or `winston`: JSON logs with levels (`debug`, `info`, `warn`, `error`, `fatal`), request IDs for tracing, and log aggregation. Error tracking with Sentry (free tier) captures stack traces, context, and user info.

**Code Walkthrough: Debugging and Logging Setup**

```javascript
// logger.js — structured logging with pino
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development'
    ? { target: 'pino-pretty', options: { colorize: true } }
    : undefined,
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      headers: {
        'user-agent': req.headers['user-agent'],
        'content-type': req.headers['content-type']
      }
    }),
    err: pino.stdSerializers.err
  }
});

// Request logging middleware
export function requestLogger(req, res, next) {
  const start = Date.now();
  const requestId = crypto.randomUUID();

  req.log = logger.child({ requestId });
  req.log.info({ req }, 'Request started');

  res.on('finish', () => {
    const duration = Date.now() - start;
    req.log.info({
      res: { statusCode: res.statusCode },
      duration
    }, 'Request completed');
  });

  next();
}
```

```javascript
// Error tracking with Sentry (free tier)
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,  // 10% of transactions
});

// Error handler
app.use(Sentry.Handlers.errorHandler());

app.use((err, req, res, next) => {
  req.log.error({ err }, 'Unhandled error');

  Sentry.captureException(err, {
    extra: {
      requestId: req.id,
      userId: req.user?.id,
      path: req.path
    }
  });

  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message
    }
  });
});
```

```javascript
// Debugging with VS Code launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Server",
      "program": "${workspaceFolder}/src/server.js",
      "env": { "NODE_ENV": "development" },
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Tests",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand", "--no-cache"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

**Explanation:** Pino logs structured JSON — easy to parse and query. Request IDs trace a request through logs. Sentry captures exceptions with context. VS Code debugger allows breakpoints, watch expressions, and step-through.

**Quiz:**
1. How do you start the Node.js inspector?
2. What is structured logging and why use it?
3. How does Sentry help with production debugging?
4. What is a request ID and why is it useful?
5. How do you debug Jest tests in VS Code?

**Task:** Set up pino logging with request IDs. Add Sentry error tracking. Debug a deliberately broken endpoint using VS Code breakpoints. Add log statements at critical points and verify structured output.

**AI Tool Spotlight:** Use **Sentry** (free tier) for error tracking. Use **Pino** with **pino-pretty** for readable development logs. Use **OpenCode** to debug complex issues: `opencode ask "Why is this function returning undefined?"`


## Module 17: AI Tools for Developers (Days 48–50)

### Day 48 — AI Coding Assistants: Setup and Effective Prompting

**Learning Objectives:** Set up AI coding assistants and master prompt engineering for code generation.

**Core Content:**

AI coding assistants accelerate development: code completion, generation, refactoring, explanation, and test generation. Tools: GitHub Copilot (free tier), Cursor (free hobby plan), OpenCode (free, open-source), Cline (free, BYO key), Continue.dev (free, open-source), Free.ai Coder (free, 50K tokens/day).

Effective prompting: be specific about requirements, provide context (language, framework, constraints), ask for explanations, request tests alongside code, iterate on output.

**Code Walkthrough: AI-Assisted Development Workflow**

```bash
# Free.ai Coder — terminal AI assistant
# Install
pip install freeai-code

# Initialize in project
cd my-project
free-code init

# Ask about codebase
free-code ask "How does the authentication middleware work?"

# Execute a coding task
free-code run "Add input validation to the registration endpoint using zod"

# Generate tests
free-code run "Write Jest tests for the authService including error cases"

# Refactor
free-code run "Refactor the user controller to use async/await consistently"
```

```javascript
// Example: Prompting for a specific function
// Prompt: "Create a Node.js utility function that validates an email address
// using a regex. The function should throw a ValidationError with field 'email'
// and message 'Invalid email format' if invalid. Return the normalized
// (lowercased, trimmed) email if valid."

// Generated code:
import { ValidationError } from './errors.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email) {
  if (typeof email !== 'string') {
    throw new ValidationError('Email must be a string', 'email');
  }

  const normalized = email.trim().toLowerCase();

  if (!EMAIL_REGEX.test(normalized)) {
    throw new ValidationError('Invalid email format', 'email');
  }

  return normalized;
}

// Follow-up prompt: "Add JSDoc comments and write 5 test cases"
```

**Explanation:** `free-code ask` queries the codebase with context. `free-code run` executes tasks with file read/write capabilities. Specific prompts with constraints produce better output. Always review generated code — AI can hallucinate APIs or miss edge cases.

**Quiz:**
1. What makes a good AI coding prompt?
2. How do you provide context to AI assistants?
3. Why should you review AI-generated code?
4. What is the difference between `ask` and `run` modes?
5. How do AI assistants handle large codebases?

**Task:** Install Free.ai Coder and Cline. Use them to: (1) explain an unfamiliar codebase, (2) generate CRUD endpoints for a new resource, (3) write tests for existing code, (4) refactor a messy function. Compare outputs from different tools.

**AI Tool Spotlight:** Tools to explore: **OpenCode** (free, open-source, model-agnostic), **Cline** (free, BYO key), **Continue.dev** (free, open-source), **Tabby** (self-hosted), **Supermaven Free** (300K context).

---

### Day 49 — AI for Code Review, Documentation, and Debugging

**Learning Objectives:** Use AI for automated code review, documentation generation, and debugging assistance.

**Core Content:**

AI can review code for bugs, security issues, performance problems, and style violations. It can generate JSDoc/TypeDoc comments, README files, and API documentation. For debugging, AI can suggest causes, fixes, and test cases.

**Code Walkthrough: AI-Assisted Code Review**

```javascript
// Original code (with issues)
function processOrder(order) {
  let total = 0;
  for (let i = 0; i < order.items.length; i++) {
    total += order.items[i].price * order.items[i].quantity;
  }
  if (order.discount) {
    total = total - order.discount;
  }
  return total;
}

// AI review prompt: "Review this function for bugs, edge cases,
// performance, and code style. Suggest improvements."

// AI-suggested improvements:
// 1. Missing validation — order may be null/undefined
// 2. No handling for empty items array
// 3. Discount can make total negative
// 4. Floating point precision issues with money
// 5. No input validation on price/quantity

// Refactored version:
import { ValidationError } from './errors.js';

/**
 * Calculate the total for an order including discounts.
 * @param {Object} order - The order object
 * @param {Array<{price: number, quantity: number}>} order.items - Order items
 * @param {number} [order.discount=0] - Discount amount to subtract
 * @returns {number} The final total, rounded to 2 decimal places
 * @throws {ValidationError} If order is invalid
 */
export function processOrder(order) {
  if (!order || !Array.isArray(order.items)) {
    throw new ValidationError('Order must have an items array', 'order');
  }

  if (order.items.length === 0) {
    return 0;
  }

  const subtotal = order.items.reduce((sum, item) => {
    if (typeof item.price !== 'number' || typeof item.quantity !== 'number') {
      throw new ValidationError('Item price and quantity must be numbers', 'items');
    }
    if (item.price < 0 || item.quantity < 0) {
      throw new ValidationError('Price and quantity cannot be negative', 'items');
    }
    return sum + item.price * item.quantity;
  }, 0);

  const discount = order.discount || 0;
  if (discount < 0) {
    throw new ValidationError('Discount cannot be negative', 'discount');
  }

  const total = Math.max(0, subtotal - discount);
  return Math.round(total * 100) / 100;  // Handle floating point
}
```

**Explanation:** AI review identified multiple issues: missing validation, edge cases, floating-point precision, and negative totals. The refactored version adds JSDoc, input validation, and uses `Math.round` for currency precision.

**Quiz:**
1. What should you look for in AI code review?
2. How do you prompt AI for documentation?
3. What are AI's limitations in code review?
4. How do you verify AI-suggested fixes?
5. Can AI review security vulnerabilities?

**Task:** Use AI to review your entire codebase. Ask for: security issues, performance improvements, edge cases, and documentation gaps. Apply at least 5 suggestions and verify each fix with tests.

**AI Tool Spotlight:** Use **Cline** with Claude or GPT-4o for code review. Use **Qodo Gen** for test generation and review.

---

### Day 50 — Building AI-Powered Features in Applications

**Learning Objectives:** Integrate AI APIs into applications for intelligent features.

**Core Content:**

AI APIs: OpenAI (GPT-4o, free tier limited), Anthropic (Claude), Google Gemini (free tier), Groq (fast inference), Together AI. Use cases: chatbots, content generation, summarisation, sentiment analysis, code generation, semantic search.

**Code Walkthrough: AI-Powered API Endpoint**

```javascript
// services/aiService.js
import OpenAI from 'openai';
import { config } from '../config/index.js';

const openai = new OpenAI({ apiKey: config.openaiApiKey });

export const aiService = {
  async summarise(text, maxLength = 100) {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Summarise the following text in ${maxLength} words or fewer. Return only the summary.`
        },
        { role: 'user', content: text }
      ],
      max_tokens: maxLength * 2,
      temperature: 0.3
    });

    return response.choices[0].message.content;
  },

  async generateTags(content) {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Extract 3-5 relevant tags from the content. Return as a JSON array of strings.'
        },
        { role: 'user', content }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2
    });

    return JSON.parse(response.choices[0].message.content).tags;
  },

  async chat(messages, context = '') {
    const systemMessage = context
      ? `You are a helpful assistant. Context: ${context}`
      : 'You are a helpful assistant.';

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemMessage },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    return response.choices[0].message.content;
  }
};
```

```javascript
// routes/ai.js
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { aiService } from '../services/aiService.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// AI rate limiter — expensive operations
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  max: 20,                     // 20 AI requests per hour
  message: { error: 'AI rate limit exceeded. Try again later.' }
});

router.use(authenticate);
router.use(aiLimiter);

router.post('/summarise', async (req, res, next) => {
  try {
    const { text, maxLength } = req.body;
    if (!text || text.length < 50) {
      return res.status(400).json({
        error: 'Text must be at least 50 characters'
      });
    }
    const summary = await aiService.summarise(text, maxLength);
    res.json({ success: true, data: { summary } });
  } catch (err) { next(err); }
});

router.post('/chat', async (req, res, next) => {
  try {
    const { messages, context } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array required' });
    }
    const reply = await aiService.chat(messages, context);
    res.json({ success: true, data: { reply } });
  } catch (err) { next(err); }
});

export default router;
```

**Explanation:** AI APIs are called server-side to keep API keys secure. Rate limiting prevents abuse and controls costs. `response_format: { type: 'json_object' }` ensures structured output. `temperature` controls randomness (lower = more deterministic).

**Quiz:**
1. Why call AI APIs from the backend, not frontend?
2. How do you control AI costs?
3. What is temperature in AI models?
4. How do you handle AI API failures gracefully?
5. What are the ethical considerations of AI features?

**Task:** Build an AI-powered blog assistant: summarise long articles, generate tags, suggest titles, and answer questions about content. Add rate limiting and caching (to avoid duplicate API calls for the same content).

**AI Tool Spotlight:** Use **Google Gemini API** (free tier) as a cost-effective alternative. Use **Groq** for fast inference. Use **OpenRouter** for access to multiple models with one API.


## Module 18: AI-Assisted Development (Days 51–52)

### Day 51 — AI Pair Programming: Workflows and Patterns

**Learning Objectives:** Master AI pair programming workflows for planning, coding, reviewing, and refactoring.

**Core Content:**

AI pair programming patterns: driver-navigator (you drive, AI navigates), ping-pong (alternate writing), and rubber duck (AI explains). Use AI for: generating boilerplate, exploring APIs, debugging, writing tests, and refactoring.

**Code Walkthrough: AI-Assisted Feature Development**

```markdown
# Workflow: Adding a New Feature with AI Assistance

## Step 1: Planning
Prompt: "I need to add a notification system to my Express API.
Users should receive notifications when:
- Someone comments on their post
- Their order status changes
- They're mentioned in a comment

Design the database schema, API endpoints, and service layer.
Return a plan with file structure."

## Step 2: Schema Design
Prompt: "Generate a Mongoose schema for notifications with:
- recipient (User ref)
- type (enum: comment, order_update, mention)
- message (string)
- read (boolean, default false)
- link (string, optional)
- createdAt (timestamp)
Add indexes for efficient querying."

## Step 3: Service Layer
Prompt: "Create a notificationService with methods:
- createNotification(data)
- getUserNotifications(userId, { page, limit, unreadOnly })
- markAsRead(notificationId, userId)
- markAllAsRead(userId)
- getUnreadCount(userId)
Include error handling and validation."

## Step 4: Routes
Prompt: "Create Express routes for the notification service.
All routes require authentication.
Include pagination for the list endpoint."

## Step 5: Tests
Prompt: "Write Jest tests for notificationService covering:
- Creating notifications
- Pagination
- Marking as read (own notifications only)
- Unread count
- Error cases"
```

**Explanation:** Breaking features into discrete prompts produces better results than one massive prompt. Each step builds on the previous. The AI maintains context across the conversation.

**Quiz:**
1. What are the benefits of AI pair programming?
2. How do you break down a feature for AI assistance?
3. When should you NOT use AI pair programming?
4. How do you maintain code quality with AI-generated code?
5. What is the rubber duck debugging pattern with AI?

**Task:** Implement the notification system using the workflow above. Use AI at each step. Review and refine each output. Write tests and verify all functionality.

**AI Tool Spotlight:** Use **Goose** (free, agentic AI workspace) for task-driven development. Use **OpenDevin** (free, open-source) for autonomous software engineering tasks.

---

### Day 52 — AI for Codebase Understanding and Documentation

**Learning Objectives:** Use AI to navigate large codebases and generate comprehensive documentation.

**Core Content:**

AI can analyse codebases and answer questions about architecture, data flow, and dependencies. It can generate README files, API documentation, architecture diagrams (Mermaid), and onboarding guides.

**Code Walkthrough: AI-Generated Documentation**

```markdown
# Generated README.md structure

## Project Name
Brief description

## Architecture
```mermaid
graph TD
    A[Client] --> B[API Gateway]
    B --> C[Auth Service]
    B --> D[User Service]
    B --> E[Course Service]
    C --> F[(PostgreSQL)]
    D --> F
    E --> G[(MongoDB)]
    E --> H[AI Service]
```

## Getting Started
- Prerequisites
- Installation
- Environment variables
- Running locally
- Running tests

## API Reference
- Authentication
- Endpoints table with methods, paths, descriptions

## Database Schema
- Entity relationships
- Migration commands

## Deployment
- Docker build
- CI/CD pipeline
- Environment configuration
```

```javascript
// Prompt: "Analyse this Express project and generate:
// 1. A Mermaid diagram of the request flow
// 2. A list of all API endpoints grouped by resource
// 3. The authentication flow
// 4. Database relationships
// 5. An onboarding guide for new developers"

// AI-generated endpoint table:
// | Method | Path | Auth | Description |
// |--------|------|------|-------------|
// | POST | /api/v1/auth/register | No | Register new user |
// | POST | /api/v1/auth/login | No | Login |
// | GET | /api/v1/users | Admin | List users |
// | GET | /api/v1/courses | No | List courses |
// | POST | /api/v1/courses | User | Create course |
// | PATCH | /api/v1/courses/:id | Owner/Admin | Update course |
```

**Explanation:** AI-generated Mermaid diagrams visualise architecture. Endpoint tables provide quick API reference. Onboarding guides reduce time-to-productivity for new developers.

**Quiz:**
1. How does AI help with codebase onboarding?
2. What documentation can AI generate?
3. How do you verify AI-generated documentation is accurate?
4. What is Mermaid and how does it help?
5. How do you keep AI-generated docs up to date?

**Task:** Use AI to generate complete documentation for your project: README, architecture diagram (Mermaid), API reference, database schema, and onboarding guide. Verify accuracy by cross-referencing with the actual code.

**AI Tool Spotlight:** Use **Mermaid Live Editor** (free) to render diagrams. Use **OpenCode** to analyse codebase architecture: `opencode ask "Explain the data flow from HTTP request to database"`


## Module 19: API & Third-Party Integrations (Days 53–54)

### Day 53 — OAuth 2.0 and Third-Party Authentication

**Learning Objectives:** Implement OAuth 2.0 for Google, GitHub, and other providers.

**Core Content:**

OAuth 2.0 is an authorisation framework. The flow: user clicks "Login with Google" → redirected to Google → authorises → redirected back with code → server exchanges code for access token → fetches user profile → creates/links local account → issues own JWT.

Use `passport.js` with strategies for each provider. Or implement manually with `passport-google-oauth20`, `passport-github2`, etc.

**Code Walkthrough: Google OAuth Integration**

```javascript
// config/passport.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { userRepository } from '../repositories/userRepository.js';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/v1/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Find or create user
      let user = await userRepository.findByEmail(
        profile.emails[0].value
      );

      if (!user) {
        user = await userRepository.create({
          username: profile.displayName,
          email: profile.emails[0].value,
          passwordHash: null,  // OAuth users have no password
          oauthProvider: 'google',
          oauthId: profile.id,
          avatar: profile.photos[0]?.value
        });
      } else if (!user.oauthProvider) {
        // Link OAuth to existing local account
        await userRepository.linkOAuth(user.id, 'google', profile.id);
      }

      done(null, user);
    } catch (err) {
      done(err);
    }
  }
));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: '/api/v1/auth/github/callback',
    scope: ['user:email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) return done(new Error('No email from GitHub'));

      let user = await userRepository.findByEmail(email);
      if (!user) {
        user = await userRepository.create({
          username: profile.username,
          email,
          passwordHash: null,
          oauthProvider: 'github',
          oauthId: profile.id,
          avatar: profile.photos[0]?.value
        });
      }

      done(null, user);
    } catch (err) { done(err); }
  }
));
```

```javascript
// routes/oauth.js
import { Router } from 'express';
import passport from 'passport';
import { authService } from '../services/authService.js';

const router = Router();

// Google
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const tokens = authService.generateTokens(req.user);
    res.redirect(`${process.env.CLIENT_URL}/oauth/callback?` +
      `accessToken=${tokens.accessToken}&` +
      `refreshToken=${tokens.refreshToken}`);
  }
);

// GitHub
router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback',
  passport.authenticate('github', { session: false }),
  (req, res) => {
    const tokens = authService.generateTokens(req.user);
    res.redirect(`${process.env.CLIENT_URL}/oauth/callback?` +
      `accessToken=${tokens.accessToken}&` +
      `refreshToken=${tokens.refreshToken}`);
  }
);

export default router;
```

**Explanation:** Passport strategies handle the OAuth flow. The callback receives the user profile, which is used to find or create a local user. OAuth users have `passwordHash: null` — they can only log in via OAuth. Tokens are passed to the frontend via redirect query parameters (or httpOnly cookies for better security).

**Quiz:**
1. What are the steps of the OAuth 2.0 flow?
2. How do you link OAuth to an existing account?
3. Why do OAuth users have no password?
4. What is the difference between OAuth and OpenID Connect?
5. How do you securely pass tokens to the frontend after OAuth?

**Task:** Add Google and GitHub OAuth to your auth system. Handle account linking (existing email). Test the full flow in development. Add profile pictures from OAuth providers.

**AI Tool Spotlight:** Use **Passport.js** documentation for strategy setup. Use **Google Cloud Console** and **GitHub Developer Settings** to create OAuth apps (free).

---

### Day 54 — Payment Integration and External APIs

**Learning Objectives:** Integrate Stripe for payments, handle webhooks, and consume third-party APIs.

**Core Content:**

Stripe Checkout handles PCI compliance — you never handle card details. Server creates a checkout session, redirects user to Stripe, user pays, Stripe redirects back. Webhooks confirm payment asynchronously.

Third-party APIs: TMDB (movies), OpenWeather (weather), SendGrid (email), Twilio (SMS). Always validate responses, handle rate limits, and cache where appropriate.

**Code Walkthrough: Stripe Checkout and Webhooks**

```javascript
// services/stripeService.js
import Stripe from 'stripe';
import { config } from '../config/index.js';

const stripe = new Stripe(config.stripeSecretKey);

export const stripeService = {
  async createCheckoutSession(userId, items) {
    // items: [{ name, price, quantity, image }]

    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : []
        },
        unit_amount: Math.round(item.price * 100)  // Stripe uses cents
      },
      quantity: item.quantity
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${config.clientUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.clientUrl}/checkout/cancel`,
      metadata: { userId: userId.toString() },
      customer_email: undefined  // Let Stripe collect
    });

    return session;
  },

  async handleWebhook(rawBody, signature) {
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        config.stripeWebhookSecret
      );
    } catch (err) {
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata.userId;
        // Fulfill order — update database
        await fulfilOrder(userId, session.id, session.amount_total);
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        console.error('Payment failed:', paymentIntent.id);
        // Notify user
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }
};
```

```javascript
// routes/webhooks.js — MUST use raw body for signature verification
import { Router } from 'express';
import express from 'express';
import { stripeService } from '../services/stripeService.js';

const router = Router();

router.post('/stripe',
  express.raw({ type: 'application/json' }),
  async (req, res, next) => {
    try {
      const signature = req.headers['stripe-signature'];
      const result = await stripeService.handleWebhook(req.body, signature);
      res.json(result);
    } catch (err) {
      console.error('Webhook error:', err.message);
      res.status(400).json({ error: err.message });
    }
  }
);

export default router;
```

**Explanation:** Stripe Checkout handles the entire payment UI and PCI compliance. `Math.round(price * 100)` converts dollars to cents. Webhooks are the source of truth for payment confirmation — the redirect back to your site can be faked. Raw body parsing is required for signature verification.

**Quiz:**
1. Why use Stripe Checkout instead of custom payment forms?
2. How do webhooks differ from redirects for payment confirmation?
3. Why is raw body needed for webhook verification?
4. How do you test Stripe webhooks locally?
5. What is idempotency and why does it matter for payments?

**Task:** Integrate Stripe Checkout for your e-commerce API. Create a checkout session endpoint, handle the success redirect, and process the `checkout.session.completed` webhook. Test with Stripe CLI (`stripe listen --forward-to localhost:3000/api/v1/webhooks/stripe`).

**AI Tool Spotlight:** Use **Stripe CLI** (free) to test webhooks locally. Use **Stripe Testing Dashboard** for test cards and payment simulation.


## Module 20: Deployment & Production (Days 55–56)

### Day 55 — Docker, CI/CD, and Cloud Deployment

**Learning Objectives:** Containerise applications with Docker, set up CI/CD, and deploy to production.

**Core Content:**

Docker packages applications with dependencies into portable containers. `Dockerfile` defines the build. Multi-stage builds keep images small. `docker-compose` orchestrates multiple services (API + database + Redis).

CI/CD with GitHub Actions: lint → test → build → deploy. Deploy frontend to Vercel/Netlify, backend to Render/Railway/Fly.io, databases to managed services (MongoDB Atlas, PlanetScale, Supabase).

**Code Walkthrough: Dockerfile and CI/CD**

```dockerfile
# Dockerfile — multi-stage build for Node.js

# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files first (leverage cache)
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Stage 2: Production
FROM node:22-alpine AS production

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy from builder
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app .

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/api/health').then(r => process.exit(r.ok ? 0 : 1))"

CMD ["node", "src/server.js"]
```

```yaml
# docker-compose.yml — local development
version: '3.9'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@db:5432/app
      - MONGO_URL=mongodb://mongo:27017/app
      - REDIS_URL=redis://redis:6379
    depends_on:
      db:
        condition: service_healthy
      mongo:
        condition: service_started
    volumes:
      - ./src:/app/src  # Hot reload in development
    command: npm run dev

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: app
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongodata:/data/db

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  pgdata:
  mongodata:
```

```yaml
# .github/workflows/deploy.yml — CI/CD pipeline
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_DB: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --coverage
        env:
          DATABASE_URL: postgresql://postgres:test@localhost:5432/test
          JWT_SECRET: test-secret

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Render
        uses: johnbeynon/render-deploy-action@v0.0.8
        with:
          service-id: ${{ secrets.RENDER_SERVICE_ID }}
          api-key: ${{ secrets.RENDER_API_KEY }}
```

**Explanation:** Multi-stage Docker builds separate build dependencies from runtime, reducing image size. `npm ci` installs exact versions from lock file. Non-root user improves security. Health checks enable container orchestration. GitHub Actions runs tests before deploying.

**Quiz:**
1. Why use multi-stage Docker builds?
2. What is `npm ci` vs `npm install`?
3. How does CI/CD improve deployment reliability?
4. Why run containers as non-root?
5. What is a health check and why is it important?

**Task:** Dockerise your API. Create a `Dockerfile` and `docker-compose.yml`. Test locally with `docker compose up`. Set up a GitHub Actions workflow that runs tests on push and deploys to Render on merge to main. Deploy your frontend to Vercel.

**AI Tool Spotlight:** Use **Docker** (free for development) and **GitHub Actions** (free for public repos, 2000 minutes/month for private). Use **Railway** or **Render** for simple backend deployment (free tiers available).

---

### Day 56 — Production Monitoring, Logging, and Scaling

**Learning Objectives:** Set up production monitoring, logging, and performance optimisation.

**Core Content:**

Production monitoring: application performance (APM), error tracking, uptime monitoring, database performance. Tools: Sentry (errors), LogRocket (session replay), UptimeRobot (uptime), New Relic/Datadog (APM — free tiers).

Logging: structured JSON logs, log levels, log aggregation (Papertrail, Logtail), correlation IDs. Alerting: Slack/email notifications for errors, performance degradation, and uptime issues.

**Code Walkthrough: Production Monitoring Setup**

```javascript
// monitoring/health.js
import { pool } from '../db/pool.js';
import mongoose from 'mongoose';

export async function healthCheck(req, res) {
  const checks = {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    status: 'ok',
    services: {}
  };

  // Check PostgreSQL
  try {
    await pool.execute('SELECT 1');
    checks.services.postgres = 'healthy';
  } catch (err) {
    checks.services.postgres = 'unhealthy';
    checks.status = 'degraded';
  }

  // Check MongoDB
  try {
    await mongoose.connection.db.admin().ping();
    checks.services.mongodb = 'healthy';
  } catch (err) {
    checks.services.mongodb = 'unhealthy';
    checks.status = 'degraded';
  }

  // Check Redis
  try {
    const redis = (await import('../db/redis.js')).default;
    await redis.ping();
    checks.services.redis = 'healthy';
  } catch (err) {
    checks.services.redis = 'unhealthy';
    checks.status = 'degraded';
  }

  const statusCode = checks.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(checks);
}
```

```javascript
// middleware/metrics.js — request timing and counting
const metrics = {
  requests: { total: 0, byStatus: {}, byPath: {} },
  responseTimes: []
};

export function metricsMiddleware(req, res, next) {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const duration = Number(process.hrtime.bigint() - start) / 1e6;  // ms

    metrics.requests.total++;

    const status = res.statusCode;
    metrics.requests.byStatus[status] =
      (metrics.requests.byStatus[status] || 0) + 1;

    const path = req.route?.path || req.path;
    if (!metrics.requests.byPath[path]) {
      metrics.requests.byPath[path] = { count: 0, totalTime: 0 };
    }
    metrics.requests.byPath[path].count++;
    metrics.requests.byPath[path].totalTime += duration;

    // Keep last 1000 response times
    metrics.responseTimes.push(duration);
    if (metrics.responseTimes.length > 1000) {
      metrics.responseTimes.shift();
    }
  });

  next();
}

export function getMetrics(req, res) {
  const times = metrics.responseTimes;
  const sorted = [...times].sort((a, b) => a - b);

  res.json({
    requests: {
      total: metrics.requests.total,
      byStatus: metrics.requests.byStatus,
      byPath: metrics.requests.byPath
    },
    responseTimes: {
      count: times.length,
      avg: times.reduce((a, b) => a + b, 0) / times.length || 0,
      p50: sorted[Math.floor(sorted.length * 0.5)] || 0,
      p95: sorted[Math.floor(sorted.length * 0.95)] || 0,
      p99: sorted[Math.floor(sorted.length * 0.99)] || 0,
      max: Math.max(...times, 0)
    }
  });
}
```

**Explanation:** `/health` reports service status for load balancers and orchestrators. Metrics middleware tracks request counts, status codes, and response times. P95 latency is a key performance indicator. The health endpoint returns 503 when degraded, causing load balancers to route traffic away.

**Quiz:**
1. What should a health check endpoint include?
2. What is P95 latency and why does it matter?
3. How do you monitor database performance?
4. What alerts should a production system have?
5. How do you scale a Node.js application?

**Task:** Add a health check endpoint and metrics endpoint to your API. Set up uptime monitoring with UptimeRobot (free). Configure Sentry alerts for error spikes. Add a `/metrics` dashboard page to your frontend.

**AI Tool Spotlight:** Use **UptimeRobot** (free, 50 monitors), **Sentry** (free tier, 5K errors/month), **Better Stack** (free tier for logging and uptime).


## Module 21: Security Fundamentals (Day 57)

### Day 57 — OWASP Top 10 and Security Best Practices

**Learning Objectives:** Implement defences against the OWASP Top 10 vulnerabilities.

**Core Content:**

OWASP Top 10 (2021): Broken Access Control, Cryptographic Failures, Injection, Insecure Design, Security Misconfiguration, Vulnerable Components, Authentication Failures, Software and Data Integrity Failures, Logging and Monitoring Failures, Server-Side Request Forgery.

Defences: input validation, parameterised queries, output encoding, CSP headers, HTTPS, secure cookies, rate limiting, dependency scanning.

**Code Walkthrough: Security Middleware and Practices**

```javascript
// security.js — comprehensive security middleware
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { body, validationResult } from 'express-validator';
import hpp from 'hpp';
import xss from 'xss-clean';

export function applySecurity(app) {
  // Security headers (helmet)
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "https://images.example.com"],
        connectSrc: ["'self'", "https://api.example.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"]
      }
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: { policy: "same-site" },
    dnsPrefetchControl: true,
    frameguard: { action: "deny" },
    hidePoweredBy: true,
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    ieNoOpen: true,
    noSniff: true,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    xssFilter: true
  }));

  // CORS (restrict origins in production)
  app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // Rate limiting
  app.use('/api', rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
  }));

  // Prevent HTTP Parameter Pollution
  app.use(hpp());

  // XSS cleaning
  app.use(xss());
}

// Input validation middleware
export const validateRequest = (validations) => async (req, res, next) => {
  await Promise.all(validations.map(v => v.run(req)));
  const errors = validationResult(req);

  if (errors.isEmpty()) return next();

  const err = new Error('Validation failed');
  err.statusCode = 400;
  err.errors = errors.array().map(e => ({
    field: e.path,
    message: e.msg,
    value: e.value
  }));
  next(err);
};

// SQL injection prevention — always use parameterised queries
// GOOD: pool.execute('SELECT * FROM users WHERE id = ?', [id])
// BAD:  pool.query(`SELECT * FROM users WHERE id = ${id}`)

// NoSQL injection prevention
import mongoSanitize from 'express-mongo-sanitize';
app.use(mongoSanitize());  // Removes $ and . from req.body/query/params

// Password hashing (bcrypt with cost 12+)
import bcrypt from 'bcryptjs';
const hash = await bcrypt.hash(password, 12);
const match = await bcrypt.compare(inputPassword, hash);

// JWT best practices
// - Short expiry (15m for access tokens)
// - Refresh token rotation
// - Store refresh tokens in httpOnly cookies
// - Verify signature and expiry on every request
// - Use strong secrets (32+ random bytes)
```

```javascript
// Dependency scanning — run regularly
// package.json scripts:
{
  "scripts": {
    "audit": "npm audit --audit-level=high",
    "audit:fix": "npm audit fix",
    "snyk:test": "snyk test",
    "snyk:monitor": "snyk monitor"
  }
}
```

**Explanation:** `helmet` sets 11 security headers. CSP prevents XSS by restricting resource sources. `hpp` prevents parameter pollution. `express-mongo-sanitize` removes MongoDB operators from user input. Parameterised queries prevent SQL injection. bcrypt with cost 12 is computationally expensive for attackers.

**Quiz:**
1. What is broken access control and how do you prevent it?
2. How does CSP prevent XSS?
3. What is SQL injection and how do parameterised queries stop it?
4. Why is NoSQL injection a risk with MongoDB?
5. How often should you run dependency audits?

**Task:** Apply all security middleware to your API. Run OWASP ZAP against your API and fix all findings. Run `npm audit` and fix vulnerabilities. Write a security checklist for your project. Test SQL/NoSQL injection attempts.

**AI Tool Spotlight:** Use **OWASP ZAP** (free) for automated security scanning. Use **Snyk** (free tier) for dependency vulnerability scanning. Use **Helmet** documentation for security header configuration.


## Module 22: Final Capstone Project (Days 58–60)

### Day 58 — Capstone Planning and Architecture

**Learning Objectives:** Plan a production-ready full-stack application with AI features.

**Core Content:**

The capstone integrates everything: frontend (React), backend (Node/Express), database (MySQL + MongoDB), authentication (JWT + RBAC), testing, AI features, deployment, and security.

**Capstone Options:**
- **AI-Powered Learning Platform** — courses, lessons, AI tutor, progress tracking
- **Smart E-Commerce** — products, cart, Stripe payments, AI recommendations
- **DevOps Dashboard** — project monitoring, logs, AI anomaly detection
- **Health Tracking App** — meals, workouts, AI meal suggestions
- **Content Management System** — posts, media, AI summarisation, RBAC

**Architecture Planning Template:**

```
project/
├── frontend/          (React + Vite)
│   ├── src/
│   │   ├── components/    (reusable UI)
│   │   ├── pages/         (route pages)
│   │   ├── hooks/         (custom hooks)
│   │   ├── context/       (state management)
│   │   ├── services/      (API calls)
│   │   └── utils/         (helpers)
│   └── tests/
├── backend/           (Node + Express)
│   ├── src/
│   │   ├── config/        (env, db)
│   │   ├── controllers/   (HTTP handlers)
│   │   ├── middleware/    (auth, validation, errors)
│   │   ├── models/        (Mongoose + MySQL)
│   │   ├── repositories/  (data access)
│   │   ├── routes/        (API routes)
│   │   ├── services/      (business logic)
│   │   ├── validators/    (input validation)
│   │   └── utils/         (helpers)
│   └── tests/
├── docker/            (Dockerfiles)
├── .github/workflows/ (CI/CD)
└── docs/              (API docs, architecture)
```

**Quiz:**
1. How do you decide between SQL and NoSQL for different features?
2. How do you structure a monorepo vs separate repos?
3. What is the deployment strategy for frontend and backend?
4. How do you handle environment configuration across services?
5. What testing strategy covers the full stack?

**Task:** Choose your capstone project. Write a complete architecture document: feature list, database schema (SQL and NoSQL), API endpoints, frontend routes, AI features, deployment plan, and testing strategy. Create the project structure.

**AI Tool Spotlight:** Use **AI** to review your architecture: `opencode ask "Review this system architecture for scalability and security issues"`

---

### Day 59 — Capstone Implementation: Core Features

**Learning Objectives:** Implement the core features of your capstone project.

**Core Content:**

Implementation phases: (1) database setup and models, (2) authentication and RBAC, (3) core CRUD APIs, (4) frontend components and pages, (5) AI feature integration, (6) testing.

**Code Walkthrough: Feature Implementation Checklist**

```markdown
## Backend Implementation Checklist

### Database Layer
- [ ] MySQL: user accounts, transactions, structured data
- [ ] MongoDB: content, logs, flexible documents
- [ ] Migrations and seed data
- [ ] Indexes for common queries

### Authentication
- [ ] Register with email/password (bcrypt)
- [ ] Login with JWT (access + refresh)
- [ ] Logout (clear refresh cookie)
- [ ] Password reset (email token)
- [ ] OAuth (Google/GitHub)

### RBAC
- [ ] Roles: admin, moderator, user
- [ ] Permissions: resource:action
- [ ] Middleware: requireRole, requirePermission, requireOwnership

### Core APIs
- [ ] CRUD for primary resource
- [ ] Pagination, filtering, sorting
- [ ] Input validation (express-validator/zod)
- [ ] Error handling with proper status codes

### AI Features
- [ ] Summarisation endpoint
- [ ] Recommendation engine
- [ ] Chatbot/tutor
- [ ] Rate limiting for AI calls

### Testing
- [ ] Unit tests for services
- [ ] Integration tests for API endpoints
- [ ] Auth flow tests
- [ ] RBAC tests
- [ ] AI service mocking

### Security
- [ ] Helmet headers
- [ ] Rate limiting
- [ ] CORS restrictions
- [ ] Input sanitisation
- [ ] Dependency audit
```

**Task:** Implement the backend fully. Start with database models, then auth, then core APIs, then AI features. Write tests as you go — don't leave testing for the end.

**AI Tool Spotlight:** Use **Cline** or **OpenCode** to generate boilerplate for each layer. Review and adapt generated code.

---

### Day 60 — Capstone Completion, Documentation, and Presentation

**Learning Objectives:** Complete, document, and present your capstone project.

**Core Content:**

Final steps: (1) complete frontend implementation, (2) write comprehensive tests, (3) deploy to production, (4) write documentation (README, API docs, architecture), (5) prepare presentation/demo.

**Code Walkthrough: Deployment Checklist**

```markdown
## Deployment Checklist

### Frontend (Vercel/Netlify)
- [ ] Environment variables set (API URL)
- [ ] Build passes locally (`npm run build`)
- [ ] Preview deployment tested
- [ ] Custom domain configured (optional)

### Backend (Render/Railway/Fly.io)
- [ ] Environment variables set (DB, JWT secrets, API keys)
- [ ] Docker build successful
- [ ] Health check endpoint responding
- [ ] Database migrations run
- [ ] Seed data loaded

### Database
- [ ] PostgreSQL: managed service (Supabase/PlanetScale)
- [ ] MongoDB: Atlas free tier (M0)
- [ ] Backups configured
- [ ] Connection pooling enabled

### Monitoring
- [ ] Sentry error tracking
- [ ] UptimeRobot monitoring
- [ ] Log aggregation

### Security
- [ ] HTTPS enabled
- [ ] CORS restricted to frontend domain
- [ ] Rate limiting active
- [ ] Security headers present
- [ ] npm audit clean
```

**Deliverables:**
1. **GitHub repository** with clear README, architecture diagram, and setup instructions
2. **Live demo** — frontend URL and API URL
3. **API documentation** — Swagger/OpenAPI or Postman collection
4. **Test coverage** report (80%+ on critical paths)
5. **Presentation** — 10-minute demo covering architecture, features, AI integration, and lessons learned

**Quiz:**
1. What makes a good README for a portfolio project?
2. How do you demo a full-stack app effectively?
3. What metrics should you highlight in your presentation?
4. How do you handle environment variables across deployments?
5. What would you do differently if starting over?

**Task:** Complete and deploy your capstone. Record a 5-minute demo video. Write a blog post about the architecture and lessons learned. Add the project to your portfolio.

**AI Tool Spotlight:** Use **Loom** (free) for demo recording. Use **Carbon** or **Ray.so** for code screenshots. Use AI to polish your README and presentation notes.


## Course Completion Summary

You have completed the **ETH-AIFS-60** Advanced Full Stack + AI Developer Internship. You now possess:

- **Frontend mastery:** HTML5, CSS3, responsive design, UI/UX principles, React (hooks, context, router, performance, testing)
- **Backend proficiency:** Node.js, Express, REST APIs, authentication, RBAC, security
- **Database skills:** MySQL (relational design, advanced queries, indexing, transactions) and MongoDB (documents, aggregation, Mongoose)
- **AI integration:** AI coding assistants, AI-powered features, prompt engineering, AI-assisted development workflows
- **Production readiness:** Docker, CI/CD, cloud deployment, monitoring, security hardening
- **Professional practices:** Git/GitHub collaboration, testing (Jest, RTL, Postman), debugging, documentation

**Free AI Tools Summary:**

| Tool | Type | Best For |
|---|---|---|
| **OpenCode** | Terminal/IDE | Model-agnostic coding, privacy-first |
| **Cline** | VS Code extension | BYO key, autonomous tasks |
| **Continue.dev** | VS Code/JetBrains | Open-source, customisable |
| **Free.ai Coder** | Terminal | Free tier, 50K tokens/day |
| **Tabby** | Self-hosted | On-premises, privacy |
| **Supermaven Free** | Autocomplete | 300K token context |
| **v0.dev** | Web | React/Next.js generation |
| **Qodo Gen** | VS Code | Test generation, review |
| **Google AI Studio** | Web/API | Gemini models, free tier |

**Next Steps:**
1. Deploy your capstone and share the live URL
2. Contribute to open-source projects using your full-stack + AI skills
3. Build a portfolio site showcasing your projects
4. Continue learning: GraphQL, WebSockets, microservices, advanced AI/ML
5. Apply for full-stack developer roles with your comprehensive skill set