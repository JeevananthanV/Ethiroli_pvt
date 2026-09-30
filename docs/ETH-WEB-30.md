# ETHIROLI LMS — 30-DAY PROGRAM COMPLETE CONTENT PACK

# 🟢 `ETH-WEB-30` — Web Development Foundation Internship

**Level:** Beginner → Job-Ready Frontend Developer
**Duration:** 30 Days (1 Day = 3 hrs theory + 4 hrs lab = 7 hrs/day)
**Outcome:** Build and deploy a responsive, API-connected React frontend project

---

## PROGRAM MAP

| Week | Days | Focus | Deliverable |
|---|---|---|---|
| 1 | 1–7 | Foundation: SDLC, HTML, CSS, Responsive, Git | Static responsive website on GitHub |
| 2 | 8–14 | JavaScript Core → Advanced | Interactive JS application |
| 3 | 15–21 | UI/UX + React.js | React SPA with routing & state |
| 4 | 22–30 | APIs, Backend Basics, Integration, Project | Full frontend + API project deployed |

## MODULE → DAY MAPPING

| Module Code | Module | Days |
|---|---|---|
| `PROG-FUND` | Programming Fundamentals (pre-req) | 0 |
| `WEB-FUND` | Web Development Fundamentals | 1 |
| `WEB-HTML` | HTML5 | 2–3 |
| `WEB-CSS` | CSS3 & Responsive Design | 4–6 |
| `DEV-GIT` | Git & GitHub | 7 |
| `JS-CORE` | JavaScript Fundamentals | 8–12 |
| `JS-ADV` | JavaScript Advanced | 13–14 |
| `DESIGN-UIUX` | UI/UX for Developers | 15 |
| `FE-REACT` | React.js | 16–21 |
| `BE-REST` | Backend & REST API Basics | 22, 24 |
| `FS-INTEGRATION` | Full Stack Integration | 23, 26 |
| `DB-MYSQL` | Database Basics | 25 |
| `QA-TEST` | Testing & Debugging | 27 |
| `ETH-WEB-30-PROJ` | Final Project | 28–30 |

---

# 📅 WEEK 1 — FOUNDATION

---

# DAY 1 — Web Development Fundamentals & SDLC

**Module:** `WEB-FUND` | **Duration:** 7 h | **Lesson Code:** `WF-D01`

### Learning Objectives
- Explain how the web works end-to-end (client, server, DNS, HTTP)
- Describe the full-stack development model
- Understand SDLC phases and Agile workflow
- Set up a professional dev environment

### 1.1 How the Web Works

```
You type: https://ethiroli.com
      ↓
1. DNS resolves domain → IP address (142.250.x.x)
      ↓
2. Browser opens TCP connection (port 443, HTTPS)
      ↓
3. Browser sends HTTP request
      ↓
4. Server processes & returns HTTP response
      ↓
5. Browser parses HTML → builds DOM → renders pixels
```

**Client vs Server**

| Client (Frontend) | Server (Backend) |
|---|---|
| Runs in the browser | Runs on a machine somewhere |
| HTML, CSS, JavaScript, React | Node.js, Express, Python |
| Handles UI and interaction | Handles logic, auth, database |
| User can see & modify it | Hidden from the user |
| **Never trust it** | **Source of truth** |

**HTTP request anatomy**

```http
GET /api/products?page=1 HTTP/1.1
Host: ethiroli.com
Authorization: Bearer eyJhbGc...
Accept: application/json
```

**HTTP response anatomy**

```http
HTTP/1.1 200 OK
Content-Type: application/json

{ "page": 1, "data": [ ... ] }
```

**Common status codes**

| Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 301/302 | Redirect |
| 400 | Bad Request (your fault) |
| 401 | Unauthorized (not logged in) |
| 403 | Forbidden (logged in, no permission) |
| 404 | Not Found |
| 500 | Server Error (their fault) |

### 1.2 Full-Stack Development Model

```
   FRONTEND                BACKEND               DATABASE
   React / HTML            Node + Express         MySQL / MongoDB
   CSS / Tailwind          REST API               Tables / Collections
   JavaScript              Auth / Logic           Persistent storage
        │                       │                       │
        └─────── HTTP/JSON ─────┴─────── SQL/Driver ────┘
```

A **full-stack developer** can build and connect all three layers.

### 1.3 SDLC — Software Development Life Cycle

| Phase | Activity | Output |
|---|---|---|
| 1. Requirement | Gather what the client wants | SRS document |
| 2. Design | Architecture, UI mockups, DB schema | Wireframes, ER diagram |
| 3. Development | Write the code | Working features |
| 4. Testing | Verify correctness | Test report |
| 5. Deployment | Ship to production | Live URL |
| 6. Maintenance | Fix bugs, add features | Updates |

**Waterfall vs Agile**

| Waterfall | Agile |
|---|---|
| Sequential phases | Iterative sprints |
| Requirements frozen upfront | Requirements evolve |
| Delivered at the end | Delivered every sprint |
| Good for fixed-scope contracts | Good for products & startups |

**Agile / Scrum basics**

```
Product Backlog
   ↓ (sprint planning)
Sprint Backlog (2-week sprint)
   ↓ (daily standup — 15 min, 3 questions)
Sprint Increment
   ↓ (sprint review + retrospective)
```

*Daily standup questions:* What did I do yesterday? What will I do today? Any blockers?

**Ticket workflow**

```
Backlog → To Do → In Progress → Code Review → Testing → Done
```

### 1.4 Dev Environment Setup

**Required tools**

| Tool | Purpose |
|---|---|
| VS Code | Code editor |
| Node.js (LTS) | Run JS outside browser |
| Git | Version control |
| Google Chrome + DevTools | Testing & debugging |
| Postman | API testing |
| Figma (free) | Design reference |

**VS Code extensions**

- Prettier — auto-format
- ESLint — catch errors
- Live Server — instant HTML preview
- GitLens — Git history
- ES7+ React snippets
- Tailwind CSS IntelliSense
- Thunder Client — API testing inside VS Code

**Verify installation**

```bash
node -v      # v20.x.x
npm -v       # 10.x.x
git --version
```

**Your first file**

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ethiroli — Day 1</title>
</head>
<body>
  <h1>Hello, Ethiroli!</h1>
  <script>
    console.log("JS is running");
    document.body.innerHTML += "<p>Rendered by JavaScript</p>";
  </script>
</body>
</html>
```

### 1.5 Folder Convention

```
project/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── assets/
│   └── images/
└── README.md
```

---

### 🧪 DAY 1 TASK — `D01-T1`

**Deliverable:** A folder `ethiroli-day01/` containing:

1. `index.html` that displays:
   - Your name and internship track
   - Today's date
   - A list of the 6 SDLC phases
   - A list of the 7 HTTP status codes with meanings
2. `about.txt` with 150 words on: *"What happens between typing a URL and seeing the page?"*
3. A screenshot of your browser rendering the page
4. A screenshot of DevTools → Network tab showing the request

**Bonus:** Add a `<table>` of Client vs Server differences.

---

### ❓ DAY 1 QUIZ — `D01-Q` (5 Questions)

| # | Question | Options | Answer |
|---|---|---|---|
| 1 | DNS is responsible for | A) Rendering HTML B) Converting domain names to IP addresses C) Storing cookies D) Encrypting data | **B** |
| 2 | Which layer should never be trusted for security? | A) Database B) Server C) Client (frontend) D) Network | **C** |
| 3 | HTTP 401 means | A) Not found B) Server error C) Not authenticated D) Forbidden | **C** |
| 4 | Which is NOT an SDLC phase? | A) Requirement B) Design C) Compilation D) Maintenance | **C** |
| 5 | In Agile, a "sprint" typically lasts | A) 1 day B) 2 weeks C) 6 months D) 1 year | **B** |

---

# DAY 2 — HTML5 Part 1: Structure & Semantics

**Module:** `WEB-HTML` | **Duration:** 7 h | **Lesson Code:** `WF-D02`

### Learning Objectives
- Write valid, standards-compliant HTML5 documents
- Use semantic elements correctly
- Structure content with headings, lists, links, and images
- Understand the DOM tree

### 2.1 Document Structure

```html
<!DOCTYPE html>            <!-- HTML5 doctype — always first -->
<html lang="en">           <!-- root element, lang for a11y/SEO -->
<head>
  <meta charset="UTF-8" />                        <!-- character encoding -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Ethiroli internship portfolio" />
  <title>Portfolio — Asha</title>
  <link rel="stylesheet" href="css/style.css" />
  <link rel="icon" href="assets/favicon.ico" />
</head>
<body>
  <!-- visible content goes here -->
  <script src="js/app.js"></script>
</body>
</html>
```

**Why each line matters**

| Element | Purpose |
|---|---|
| `<!DOCTYPE html>` | Tells browser: standards mode, not quirks mode |
| `lang="en"` | Screen readers, translation, SEO |
| `charset="UTF-8"` | Supports ₹, é, தமிழ், emoji |
| `viewport` | Makes mobile rendering correct |
| `description` | Google search snippet |

### 2.2 Semantic HTML

Semantic = the tag **describes its meaning**, not its appearance.

```html
<body>
  <header>
    <nav>
      <a href="#home">Home</a>
      <a href="#about">About</a>
      <a href="#contact">Contact</a>
    </nav>
  </header>

  <main>
    <section id="home">
      <h1>Ethiroli Internship</h1>
      <p>Building job-ready developers.</p>
    </section>

    <section id="about">
      <h2>About</h2>
      <article>
        <h3>Our Mission</h3>
        <p>Practical, project-based learning.</p>
      </article>
    </section>

    <aside>
      <h3>Quick Links</h3>
      <ul>
        <li><a href="#courses">Courses</a></li>
      </ul>
    </aside>
  </main>

  <footer>
    <p>&copy; 2026 Ethiroli. All rights reserved.</p>
  </footer>
</body>
```

**Semantic vs non-semantic**

| ❌ Generic | ✅ Semantic | Meaning |
|---|---|---|
| `<div id="header">` | `<header>` | Page/section header |
| `<div id="nav">` | `<nav>` | Navigation block |
| `<div id="main">` | `<main>` | Primary content (only one per page) |
| `<div class="post">` | `<article>` | Self-contained composition |
| `<div class="section">` | `<section>` | Thematic grouping |
| `<div class="sidebar">` | `<aside>` | Tangential content |
| `<div id="footer">` | `<footer>` | Page/section footer |

**Benefits:** SEO, accessibility, maintainability, readability.

### 2.3 Text Content

```html
<h1>Main Heading</h1>        <!-- only ONE h1 per page -->
<h2>Section Heading</h2>
<h3>Sub-section</h3>
<!-- ... h4, h5, h6 — never skip levels -->

<p>A paragraph of text.</p>

<strong>Important (semantic bold)</strong>
<em>Emphasised (semantic italic)</em>
<mark>Highlighted</mark>
<small>Fine print</small>
<del>Deleted</del> <ins>Inserted</ins>
<abbr title="Application Programming Interface">API</abbr>
<code>console.log()</code>
<pre>Preserved   spacing</pre>
<blockquote cite="https://ethiroli.com">Quote text</blockquote>
<br />   <!-- line break — use sparingly -->
<hr />   <!-- thematic break -->
```

> **Rule:** use `<strong>`/`<em>` for meaning; use CSS for visual styling only.

### 2.4 Lists

```html
<!-- Unordered -->
<ul>
  <li>HTML</li>
  <li>CSS</li>
</ul>

<!-- Ordered -->
<ol type="1" start="1">
  <li>Learn</li>
  <li>Build</li>
  <li>Deploy</li>
</ol>

<!-- Description -->
<dl>
  <dt>HTML</dt>
  <dd>Structure of a web page</dd>
  <dt>CSS</dt>
  <dd>Presentation of a web page</dd>
</dl>

<!-- Nested -->
<ul>
  <li>Frontend
    <ul>
      <li>HTML</li>
      <li>CSS</li>
    </ul>
  </li>
</ul>
```

### 2.5 Links

```html
<!-- External -->
<a href="https://ethiroli.com" target="_blank" rel="noopener noreferrer">
  Ethiroli
</a>

<!-- Internal page -->
<a href="about.html">About Us</a>

<!-- Same-page anchor -->
<a href="#contact">Go to Contact</a>
...
<section id="contact">...</section>

<!-- Email / phone -->
<a href="mailto:hr@ethiroli.com">Email HR</a>
<a href="tel:+919876543210">Call us</a>

<!-- Download -->
<a href="resume.pdf" download>Download Resume</a>

<!-- Image link -->
<a href="/home"><img src="logo.png" alt="Ethiroli home" /></a>
```

> `rel="noopener noreferrer"` is required with `target="_blank"` for security.

### 2.6 Images

```html
<!-- Basic -->
<img src="assets/team.jpg" alt="Ethiroli team at work" />

<!-- Responsive -->
<img src="photo.jpg" alt="..." width="600" height="400" loading="lazy" />

<!-- Modern responsive with srcset -->
<img
  src="small.jpg"
  srcset="small.jpg 480w, medium.jpg 800w, large.jpg 1200w"
  sizes="(max-width: 600px) 480px, 800px"
  alt="Dashboard screenshot"
  loading="lazy"
/>

<!-- Figure with caption -->
<figure>
  <img src="chart.png" alt="Monthly revenue chart" />
  <figcaption>Fig 1: Revenue growth 2025–2026</figcaption>
</figure>
```

**Alt text rules**

| Situation | Alt text |
|---|---|
| Informative image | Describe the content: `"Bar chart showing 40% growth"` |
| Decorative image | `alt=""` (empty, but present) |
| Functional (link/button) | Describe the action: `"Search"` |
| Complex chart | Short alt + longer description nearby |

❌ Never write `alt="image"` or `alt="photo.jpg"`.

### 2.7 The DOM Tree

```html
<body>
  <h1>Title</h1>
  <p>Hello</p>
</body>
```

Becomes:

```
document
 └── html
      ├── head
      └── body
           ├── h1  → text: "Title"
           └── p   → text: "Hello"
```

Every HTML element becomes a JavaScript object you can read and modify.

### 2.8 Validation

Always validate: **https://validator.w3.org/**

Common errors:
- Unclosed tags
- Nested `<p>` inside `<p>`
- Missing `alt`
- Duplicate `id`
- Multiple `<h1>` used carelessly

---

### 🧪 DAY 2 TASK — `D02-T1`

**Deliverable:** `about-me.html` — a semantic personal profile page.

**Requirements:**
1. Valid HTML5 doctype and full document structure
2. `<header>` with `<nav>` containing 4 anchor links
3. `<main>` with three `<section>`s: About, Skills, Education
4. Skills as a nested `<ul>` (Frontend / Backend sub-lists)
5. Education as `<ol>`
6. Profile `<img>` with proper `alt` and `<figcaption>`
7. At least 3 `<a>` links: one external (with `target="_blank"` + `rel`), one email, one same-page anchor
8. `<footer>` with copyright
9. **Zero W3C validator errors** — attach the screenshot

**Bonus:** Add `<abbr>`, `<mark>`, `<blockquote>`, and a `<dl>`.

---

### ❓ DAY 2 QUIZ — `D02-Q` (5 Questions)

| # | Question | Options | Answer |
|---|---|---|---|
| 1 | Which tag represents self-contained content? | A) `<section>` B) `<article>` C) `<div>` D) `<aside>` | **B** |
| 2 | How many `<h1>` should a page have? | A) Unlimited B) Exactly one (ideally) C) Zero D) Two | **B** |
| 3 | Correct empty alt for a decorative image | A) `alt="decorative"` B) `alt=""` C) omit alt D) `alt="image"` | **B** |
| 4 | `<nav>` is used for | A) Sidebar B) Navigation links C) Footer D) Images | **B** |
| 5 | `rel="noopener noreferrer"` should accompany | A) `href="#top"` B) `target="_blank"` C) `download` D) `mailto:` | **B** |

---

# DAY 3 — HTML5 Part 2: Forms, Tables, Media, Accessibility

**Module:** `WEB-HTML` | **Duration:** 7 h | **Lesson Code:** `WF-D03`

### Learning Objectives
- Build accessible, validated HTML forms
- Structure tabular data correctly
- Embed audio, video, and iframes
- Apply accessibility (a11y) best practices

### 3.1 Forms

```html
<form action="/api/register" method="POST" novalidate>
  <fieldset>
    <legend>Personal Details</legend>

    <label for="fullname">Full Name *</label>
    <input type="text" id="fullname" name="fullname"
           placeholder="Asha Ramesh" required minlength="2" maxlength="50" />

    <label for="email">Email *</label>
    <input type="email" id="email" name="email"
           placeholder="asha@example.com" required />

    <label for="phone">Phone</label>
    <input type="tel" id="phone" name="phone"
           pattern="[0-9]{10}" title="10-digit number" />

    <label for="dob">Date of Birth</label>
    <input type="date" id="dob" name="dob" max="2010-01-01" />

    <label for="age">Age</label>
    <input type="number" id="age" name="age" min="16" max="60" step="1" />

    <label for="portfolio">Portfolio URL</label>
    <input type="url" id="portfolio" name="portfolio" />

    <label for="password">Password *</label>
    <input type="password" id="password" name="password"
           required minlength="8" />

    <label for="resume">Upload Resume</label>
    <input type="file" id="resume" name="resume"
           accept=".pdf,.docx" />
  </fieldset>

  <fieldset>
    <legend>Preferences</legend>

    <p>Track:</p>
    <label><input type="radio" name="track" value="web" checked /> Web Dev</label>
    <label><input type="radio" name="track" value="fullstack" /> Full Stack</label>
    <label><input type="radio" name="track" value="ai" /> AI Full Stack</label>

    <p>Skills:</p>
    <label><input type="checkbox" name="skills" value="html" /> HTML</label>
    <label><input type="checkbox" name="skills" value="css" /> CSS</label>
    <label><input type="checkbox" name="skills" value="js" /> JavaScript</label>

    <label for="city">City</label>
    <select id="city" name="city">
      <option value="">-- Select --</option>
      <optgroup label="Tamil Nadu">
        <option value="chennai">Chennai</option>
        <option value="coimbatore">Coimbatore</option>
      </optgroup>
      <optgroup label="Karnataka">
        <option value="bengaluru">Bengaluru</option>
      </optgroup>
    </select>

    <label for="bio">Short Bio</label>
    <textarea id="bio" name="bio" rows="4" maxlength="300"
              placeholder="Tell us about yourself..."></textarea>
  </fieldset>

  <button type="submit">Submit Application</button>
  <button type="reset">Clear</button>
</form>
```

**Input types reference**

| Type | Purpose | Mobile keyboard |
|---|---|---|
| `text` | Generic | Alphabetic |
| `email` | Email + validation | @ keyboard |
| `password` | Masked | Alphabetic |
| `number` | Numeric with min/max/step | Numeric |
| `tel` | Phone | Numeric pad |
| `url` | URL + validation | / keyboard |
| `date` / `time` / `datetime-local` | Pickers | Date picker |
| `color` | Colour picker | — |
| `range` | Slider | — |
| `file` | Upload | File browser |
| `search` | Search field | Search key |
| `hidden` | Non-visible data | — |

**Built-in validation attributes**

| Attribute | Effect |
|---|---|
| `required` | Must not be empty |
| `minlength` / `maxlength` | String length limits |
| `min` / `max` | Numeric/date limits |
| `pattern` | Regex match |
| `type="email"` | Email format |
| `step` | Numeric increments |

**CRITICAL:** client-side validation is UX only. **Always re-validate on the server.**

**Label association — non-negotiable**

```html
<!-- ✅ explicit (preferred) -->
<label for="email">Email</label>
<input id="email" type="email" />

<!-- ✅ implicit -->
<label>Email <input type="email" /></label>

<!-- ❌ placeholder is NOT a label -->
<input type="email" placeholder="Email" />
```

### 3.2 Tables

```html
<table>
  <caption>Internship Performance — Batch 12</caption>
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Name</th>
      <th scope="col">Track</th>
      <th scope="col">Score</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>Asha</td>
      <td>Full Stack</td>
      <td>92</td>
    </tr>
    <tr>
      <td>2</td>
      <td>Ravi</td>
      <td>Web Dev</td>
      <td>78</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="3">Average</td>
      <td>85</td>
    </tr>
  </tfoot>
</table>
```

**Rules**

- Use tables **only** for tabular data — never for layout.
- `<caption>` describes the table.
- `<th scope="col">` / `scope="row"` for screen readers.
- `colspan` merges columns; `rowspan` merges rows.

### 3.3 Media

```html
<!-- Video -->
<video controls width="640" poster="thumb.jpg" preload="metadata">
  <source src="demo.mp4" type="video/mp4" />
  <source src="demo.webm" type="video/webm" />
  <track src="captions.vtt" kind="captions" srclang="en" label="English" />
  Your browser does not support video.
</video>

<!-- Audio -->
<audio controls>
  <source src="podcast.mp3" type="audio/mpeg" />
</audio>

<!-- YouTube embed -->
<iframe
  width="560" height="315"
  src="https://www.youtube.com/embed/VIDEO_ID"
  title="Ethiroli internship overview"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media"
  allowfullscreen
  loading="lazy"
></iframe>
```

**Embedding best practices**

- Always set `title` on iframes (a11y requirement)
- Use `loading="lazy"` for below-the-fold media
- Provide `controls` — never autoplay with sound
- Provide captions for video

### 3.4 Accessibility (a11y) Essentials

**Four principles — POUR**

| Principle | Meaning |
|---|---|
| **P**erceivable | Content available to all senses (alt text, captions) |
| **O**perable | Usable via keyboard alone |
| **U**nderstandable | Clear language, predictable behaviour |
| **R**obust | Works with assistive tech & future browsers |

**Practical checklist**

```html
<!-- ✅ Semantic landmarks -->
<header>, <nav>, <main>, <aside>, <footer>

<!-- ✅ Descriptive link text -->
<a href="/courses">View Full Stack Course</a>
<!-- ❌ <a href="/courses">Click here</a> -->

<!-- ✅ Proper heading order -->
<h1> → <h2> → <h3>   (never skip)

<!-- ✅ ARIA only when needed -->
<button aria-label="Close dialog">✕</button>
<div role="alert">Form submitted successfully</div>

<!-- ✅ Form errors linked to inputs -->
<input id="email" aria-describedby="email-error" aria-invalid="true" />
<p id="email-error" role="alert">Please enter a valid email</p>

<!-- ✅ Keyboard focus visible -->
<style>
  :focus-visible { outline: 3px solid #2563eb; outline-offset: 2px; }
</style>
```

**ARIA rule:** *No ARIA is better than bad ARIA.* Prefer native HTML semantics first.

**Tab order:** logical DOM order = keyboard order. Don't use `tabindex="1+"` — it breaks natural flow.

### 3.5 SEO-Friendly HTML

```html
<head>
  <title>Full Stack Internship in Chennai | Ethiroli — 45 Days</title>
  <meta name="description"
        content="Join Ethiroli's 45-day full stack internship. Build real projects with React, Node, and MySQL. Certificate included." />
  <link rel="canonical" href="https://ethiroli.com/internship/fullstack" />

  <!-- Open Graph (social sharing) -->
  <meta property="og:title" content="Ethiroli Full Stack Internship" />
  <meta property="og:description" content="45 days. Real project. Certificate." />
  <meta property="og:image" content="https://ethiroli.com/og.png" />
  <meta property="og:type" content="website" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
</head>

<body>
  <!-- Structured data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "45-Day Full Stack Development Internship",
    "provider": { "@type": "Organization", "name": "Ethiroli" }
  }
  </script>
</body>
```

**On-page SEO rules**

| Rule | Do |
|---|---|
| One `<h1>` per page with the primary keyword | ✅ |
| Descriptive `<title>` (50–60 chars) | ✅ |
| Meta description (150–160 chars) | ✅ |
| Semantic structure | ✅ |
| Descriptive alt text | ✅ |
| Internal links | ✅ |
| Fast loading | ✅ |
| Mobile-friendly | ✅ |

### 3.6 HTML5 APIs (Overview)

| API | Use | Example |
|---|---|---|
| Geolocation | Get user location | `navigator.geolocation.getCurrentPosition()` |
| Local Storage | Persist key-value data | `localStorage.setItem("theme","dark")` |
| Session Storage | Per-session storage | `sessionStorage.setItem(...)` |
| Drag & Drop | Native DnD | `draggable="true"` |
| Canvas | 2D drawing | `<canvas id="c"></canvas>` |
| Web Workers | Background threads | `new Worker("worker.js")` |
| History | Navigation control | `history.pushState()` |
| Intersection Observer | Lazy loading / scroll effects | `new IntersectionObserver(cb)` |

```javascript
// Local Storage example
localStorage.setItem("theme", "dark");
console.log(localStorage.getItem("theme"));   // "dark"
localStorage.removeItem("theme");
localStorage.clear();
```

---

### 🧪 DAY 3 TASK — `D03-T1`

**Deliverable:** `application-form.html` — a complete internship application page.

**Requirements:**
1. Semantic page structure (`header`, `nav`, `main`, `footer`)
2. One `<form>` with **two `<fieldset>`s** (Personal, Preferences)
3. Inputs covering: text, email, tel, date, number, url, password, file, radio, checkbox, select (with `<optgroup>`), textarea, range
4. Every input has a proper `<label>` with matching `for`/`id`
5. Use `required`, `minlength`, `maxlength`, `pattern`, `min`, `max`
6. A `<table>` showing 5 internship tracks with columns: Code, Name, Days, Level, Outcome
7. One embedded `<video>` with `controls` + `poster`, one `<iframe>` YouTube embed with `title`
8. `:focus-visible` CSS styling
9. `aria-describedby` linking one input to its error message
10. Full `<head>` SEO block: title, description, canonical, Open Graph
11. W3C validator: **zero errors**

**Bonus:** Add JSON-LD structured data and a `<figure>` with caption.

---

### ❓ DAY 3 QUIZ — `D03-Q` (5 Questions)

| # | Question | Options | Answer |
|---|---|---|---|
| 1 | Which element correctly labels an input? | A) `placeholder` B) `<label for="x">` C) `<span>` D) `title` | **B** |
| 2 | `pattern="[0-9]{10}"` validates | A) Decimal B) Exactly 10 digits C) 10 chars D) Phone with spaces | **B** |
| 3 | Which attribute makes a video player visible? | A) `autoplay` B) `controls` C) `loop` D) `muted` | **B** |
| 4 | Tables should be used for | A) Page layout B) Tabular data only C) Navigation D) Forms | **B** |
| 5 | Client-side validation is | A) Sufficient security B) UX only — server must re-validate C) Useless D) A backend feature | **B** |

---

# DAY 4 — CSS3 Part 1: Fundamentals, Selectors & Box Model

**Module:** `WEB-CSS` | **Duration:** 7 h | **Lesson Code:** `WF-D04`

### Learning Objectives
- Apply CSS via all three methods and choose correctly
- Master selectors, specificity, and the cascade
- Understand and control the box model
- Apply colours, typography, and units professionally

### 4.1 Three Ways to Apply CSS

```html
<!-- 1. Inline (avoid — not reusable) -->
<p style="color: red;">Text</p>

<!-- 2. Internal (fine for single-page demos) -->
<style>
  p { color: red; }
</style>

<!-- 3. External (ALWAYS preferred) -->
<link rel="stylesheet" href="css/style.css" />
```

### 4.2 CSS Syntax

```css
selector {
  property: value;     /* declaration */
  property: value;
}

/* Example */
.card {
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
```

### 4.3 Selectors

```css
/* Universal */
* { box-sizing: border-box; }

/* Element */
p { line-height: 1.6; }

/* Class */
.btn { padding: 0.5rem 1rem; }

/* ID (high specificity — use sparingly) */
#hero { min-height: 80vh; }

/* Descendant */
nav a { text-decoration: none; }

/* Direct child */
ul > li { list-style: none; }

/* Adjacent sibling */
h2 + p { margin-top: 0; }

/* General sibling */
h2 ~ p { color: #555; }

/* Attribute */
input[type="email"] { border-color: #2563eb; }
a[href^="https"] { color: green; }   /* starts with */
a[href$=".pdf"] { color: red; }      /* ends with */
a[href*="ethiroli"] { font-weight: 700; }  /* contains */

/* Pseudo-classes */
a:hover { text-decoration: underline; }
input:focus { outline: 2px solid #2563eb; }
li:first-child { font-weight: 700; }
li:last-child { border-bottom: none; }
li:nth-child(odd) { background: #f9fafb; }
li:nth-child(3n) { color: #6b7280; }
p:not(.intro) { color: #374151; }
input:required { border-left: 3px solid #ef4444; }
input:valid { border-left: 3px solid #22c55e; }
:root { --brand: #2563eb; }         /* custom properties live here */

/* Pseudo-elements */
p::first-line { font-weight: 600; }
p::first-letter { font-size: 2rem; float: left; }
.required::after { content: " *"; color: red; }
.tooltip::before { content: "ℹ️ "; }
::selection { background: #fde68a; }

/* Grouping */
h1, h2, h3 { font-family: "Inter", sans-serif; }
```

### 4.4 Specificity & the Cascade

**Specificity weights**

| Type | Weight | Example |
|---|---|---|
| Inline style | 1000 | `style="..."` |
| ID | 100 | `#hero` |
| Class / attribute / pseudo-class | 10 | `.btn`, `[type]`, `:hover` |
| Element / pseudo-element | 1 | `p`, `::before` |
| Universal | 0 | `*` |

```css
p { color: black; }              /* 0,0,1 */
.text { color: blue; }           /* 0,1,0  ← wins */
#main .text { color: green; }    /* 1,1,0  ← wins over above */
```

**Cascade order (what wins)**

```
1. !important          (avoid — last resort)
2. Inline styles
3. Specificity
4. Source order        (later wins)
```

**Inheritance** — some properties inherit (`color`, `font-family`, `line-height`), others don't (`margin`, `padding`, `border`).

```css
body { font-family: "Inter", sans-serif; color: #111827; }
/* all children inherit these unless overridden */

a { color: inherit; }   /* force inheritance */
```

### 4.5 The Box Model — Most Important Concept

```
┌─────────────────────────────────────────┐
│              MARGIN (outside)            │
│  ┌───────────────────────────────────┐  │
│  │           BORDER                   │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │        PADDING              │  │  │
│  │  │  ┌───────────────────────┐  │  │  │
│  │  │  │      CONTENT          │  │  │  │
│  │  │  └───────────────────────┘  │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

```css
.box {
  width: 300px;
  padding: 20px;
  border: 5px solid #2563eb;
  margin: 16px;
}
/* content-box (default): rendered width = 300 + 40 + 10 = 350px */
```

**Fix with `box-sizing`**

```css
*, *::before, *::after {
  box-sizing: border-box;
}
/* now rendered width = exactly 300px */
```

> **Always add the border-box reset.** This is the single most common beginner bug.

**Shorthand vs longhand**

```css
/* Longhand */
margin-top: 10px;
margin-right: 20px;
margin-bottom: 10px;
margin-left: 20px;

/* Shorthand — TRBL order (Top Right Bottom Left) */
margin: 10px 20px 10px 20px;

/* Clockwise: all / vertical horizontal / top horizontal bottom / TRBL */
margin: 10px;              /* all sides */
margin: 10px 20px;         /* vertical | horizontal */
margin: 10px 20px 30px;    /* top | horizontal | bottom */
margin: 10px 20px 30px 40px; /* TRBL */
```

**Margin collapse** — vertical margins between adjacent blocks collapse to the larger value.

```css
.a { margin-bottom: 30px; }
.b { margin-top: 20px; }
/* gap between them = 30px, NOT 50px */
```

### 4.6 Units

| Unit | Type | Use |
|---|---|---|
| `px` | Absolute | Borders, fine details |
| `rem` | Relative to root font-size | **Default for sizing** |
| `em` | Relative to parent font-size | Component-relative padding |
| `%` | Relative to parent | Widths, fluid layouts |
| `vw` / `vh` | Viewport width/height | Hero sections |
| `ch` | Character width | Text measure (`max-width: 65ch`) |
| `fr` | Grid fraction | Grid layouts |

```css
html { font-size: 16px; }
.card {
  font-size: 1rem;      /* 16px */
  padding: 1.5rem;      /* 24px */
  max-width: 65ch;      /* readable line length */
}
.hero { min-height: 100vh; }
```

> **Rule:** use `rem` for most sizing; `px` for borders and hairlines; `%`/`fr`/`vw` for layout.

### 4.7 Colours

```css
:root {
  --blue-50:  #eff6ff;
  --blue-500: #3b82f6;
  --blue-700: #1d4ed8;
  --gray-900: #111827;
}

.element {
  color: #1d4ed8;                    /* hex */
  color: rgb(29, 78, 216);           /* rgb */
  color: rgba(29, 78, 216, 0.8);     /* rgb + alpha */
  color: hsl(224, 76%, 48%);         /* hue sat lightness */
  color: hsl(224 76% 48% / 0.8);     /* modern hsl + alpha */
  color: var(--blue-700);            /* custom property */
}

/* Gradients */
.hero {
  background: linear-gradient(135deg, #2563eb, #7c3aed);
}
.overlay {
  background: radial-gradient(circle, transparent, rgba(0,0,0,0.6));
}
```

**Colour usage rules**

- Body text on white: contrast ratio ≥ **4.5:1**
- Large text (18pt+ / 24px+): ≥ **3:1**
- Check with WebAIM Contrast Checker
- Never rely on colour alone to convey meaning

### 4.8 Typography

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');

body {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 1rem;          /* 16px base */
  font-weight: 400;
  line-height: 1.6;         /* unitless — best practice */
  color: #111827;
  letter-spacing: 0.01em;
  -webkit-font-smoothing: antialiased;
}

h1 {
  font-size: clamp(2rem, 5vw, 3.5rem);   /* fluid typography */
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin-bottom: 0.5em;
}

h2 { font-size: 2rem; line-height: 1.25; }
h3 { font-size: 1.5rem; line-height: 1.3; }

p { margin-bottom: 1em; max-width: 65ch; }

.text-muted   { color: #6b7280; }
.text-center  { text-align: center; }
.text-uppercase { text-transform: uppercase; letter-spacing: 0.05em; }
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

**Typographic scale**

| Level | Size (rem) | Weight |
|---|---|---|
| Display | 3.5 | 800 |
| H1 | 2.5 | 700 |
| H2 | 2 | 700 |
| H3 | 1.5 | 600 |
| Body | 1 | 400 |
| Small | 0.875 | 400 |
| Caption | 0.75 | 500 |

### 4.9 Display & Visibility

```css
.block   { display: block; }         /* div, p, h1 — full width */
.inline  { display: inline; }        /* span, a — no width/height */
.inline-block { display: inline-block; } /* inline flow, respects sizing */
.none    { display: none; }          /* removed from layout entirely */
.flex    { display: flex; }          /* flex container */
.grid    { display: grid; }          /* grid container */

/* Visibility */
.hidden     { visibility: hidden; }  /* invisible but keeps space */
.opacity-0  { opacity: 0; }          /* invisible, still clickable */
.removed    { display: none; }       /* gone from layout */
```

**`display: none` vs `visibility: hidden`**

| | Takes space? | Accessible? | Clickable? |
|---|---|---|---|
| `display: none` | ❌ | ❌ | ❌ |
| `visibility: hidden` | ✅ | ❌ | ❌ |
| `opacity: 0` | ✅ | ✅ | ✅ |

### 4.10 CSS Variables

```css
:root {
  /* Colours */
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-text: #111827;
  --color-muted: #6b7280;
  --color-border: #e5e7eb;
  --color-bg: #ffffff;
  --color-bg-alt: #f9fafb;

  /* Spacing scale */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;

  /* Radius & shadow */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-full: 9999px;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
  --shadow-lg: 0 10px 25px rgba(0,0,0,0.1);

  /* Motion */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
}

/* Dark theme */
[data-theme="dark"] {
  --color-text: #f9fafb;
  --color-bg: #111827;
  --color-bg-alt: #1f2937;
  --color-border: #374151;
}

.card {
  background: var(--color-bg);
  color: var(--color-text);
  padding: var(--space-6);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: box-shadow var(--transition-base);
}
.card:hover { box-shadow: var(--shadow-lg); }
```

---

### 🧪 DAY 4 TASK — `D04-T1`

**Deliverable:** `card-component.html` + `css/style.css` — a reusable card component.

**Requirements:**
1. External stylesheet linked (no inline styles)
2. `*, *::before, *::after { box-sizing: border-box; }` reset at the top
3. `:root` block with **at least 20 CSS custom properties** (colours, spacing, radius, shadows, transitions)
4. One `.card` component containing: image, badge, heading, paragraph, tag list, price, CTA button, secondary button
5. Demonstrate **all of these selectors at least once**: element, class, descendant, direct child, adjacent sibling, attribute, `:hover`, `:focus-visible`, `:nth-child()`, `::before`, `::after`, `:not()`
6. Use `rem` for all sizing — no `px` except borders
7. Typography: Google Font loaded, `line-height` 1.6, `max-width: 65ch` on paragraphs
8. `clamp()` used for at least one font-size
9. A `.hidden` class demonstrating `display: none` and a `.visually-hidden` accessibility class
10. Working dark mode via `[data-theme="dark"]` — toggled with a button

**Bonus:** Add a `.truncate` utility and a gradient hero banner.

---

### ❓ DAY 4 QUIZ — `D04-Q` (5 Questions)

| # | Question | Options | Answer |
|---|---|---|---|
| 1 | Specificity of `#nav .link` | A) 0,1,0 B) 1,1,0 C) 1,0,1 D) 0,0,2 | **B** |
| 2 | `box-sizing: border-box` makes width include | A) Margin only B) Padding + border C) Only content D) Nothing | **B** |
| 3 | `margin: 10px 20px 30px;` sets | A) All 30px B) T=10, LR=20, B=30 C) T=30, LR=20, B=10 D) Error | **B** |
| 4 | Which unit is relative to root font-size? | A) `em` B) `rem` C) `px` D) `vh` | **B** |
| 5 | `visibility: hidden` vs `display: none` | A) Identical B) `visibility` keeps layout space C) `display` keeps space D) Both remove space | **B** |

---

# DAY 5 — CSS3 Part 2: Layout (Flexbox, Grid, Positioning)

**Module:** `WEB-CSS` | **Duration:** 7 h | **Lesson Code:** `WF-D05`

### Learning Objectives
- Build any layout using Flexbox
- Build 2D layouts using CSS Grid
- Control stacking with positioning and z-index
- Combine Flex + Grid in real page layouts

### 5.1 Flexbox — 1D Layout

```css
.container {
  display: flex;              /* activates flexbox */
  flex-direction: row;        /* row | row-reverse | column | column-reverse */
  justify-content: center;    /* MAIN axis alignment */
  align-items: center;        /* CROSS axis alignment */
  flex-wrap: wrap;            /* nowrap | wrap | wrap-reverse */
  gap: 1rem;                  /* space between items */
  min-height: 100vh;
}
```

**Main axis vs cross axis**

```
flex-direction: row
main axis →→→→→→→
┌───────────────────────────┐
│ [A]  [B]  [C]             │  ↕ cross axis
└───────────────────────────┘

flex-direction: column
┌───────────┐
│   [A]     │  main axis ↓
│   [B]     │
│   [C]     │  cross axis →
└───────────┘
```

**`justify-content` values**

| Value | Effect |
|---|---|
| `flex-start` | Pack at start (default) |
| `flex-end` | Pack at end |
| `center` | Centre |
| `space-between` | First & last at edges |
| `space-around` | Equal space around each |
| `space-evenly` | Perfectly equal gaps |

**`align-items` values**

| Value | Effect |
|---|---|
| `stretch` | Fill cross axis (default) |
| `flex-start` / `flex-end` | Align to cross start/end |
| `center` | Centre on cross axis |
| `baseline` | Align text baselines |

**Flex item properties**

```css
.item {
  flex-grow: 1;        /* how much extra space to absorb */
  flex-shrink: 1;      /* how much to shrink when tight */
  flex-basis: 200px;   /* starting size */

  flex: 1;             /* shorthand: 1 1 0%  — equal widths */
  flex: 1 1 200px;     /* grow shrink basis */
  flex: none;          /* 0 0 auto — fixed size */

  align-self: flex-end; /* override container alignment */

  order: 2;            /* reorder without changing HTML */
}
```

**Real patterns**

```css
/* Navbar: logo left, links right */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

/* Perfect centering */
.center-all {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

/* Equal-width cards that wrap */
.card-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}
.card-row > .card {
  flex: 1 1 280px;   /* min 280px, grows to fill */
}

/* Sticky footer layout */
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.page main { flex: 1; }

/* Media object: avatar + text */
.media {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}
.media img { flex-shrink: 0; }
```

### 5.2 CSS Grid — 2D Layout

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);   /* 3 equal columns */
  grid-template-rows: auto;
  gap: 1.5rem;
}
```

**`grid-template-columns` patterns**

```css
/* Fixed */
grid-template-columns: 200px 200px 200px;

/* Fractional */
grid-template-columns: 1fr 2fr 1fr;

/* Repeat */
grid-template-columns: repeat(4, 1fr);

/* Auto-fit — responsive without media queries */
grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));

/* Auto-fill — keeps empty tracks */
grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));

/* Named lines */
grid-template-columns: [start] 1fr [middle] 1fr [end];

/* Mixed */
grid-template-columns: 250px 1fr;   /* sidebar + content */
```

**Placing items**

```css
.layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "sidebar header"
    "sidebar main"
    "sidebar footer";
  min-height: 100vh;
  gap: 1rem;
}

.sidebar { grid-area: sidebar; }
.header  { grid-area: header; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
```

**Spanning**

```css
.item {
  grid-column: 1 / 3;        /* spans columns 1–2 */
  grid-column: span 2;       /* spans 2 columns */
  grid-row: 1 / 4;           /* spans rows 1–3 */
  grid-column: 1 / -1;       /* full width */
}
```

**Alignment in grid**

```css
.grid {
  justify-items: center;    /* inline axis for items */
  align-items: center;      /* block axis for items */
  place-items: center;      /* both */
  justify-content: space-between; /* tracks in container */
  align-content: center;
  place-content: center;
}
```

**Real patterns**

```css
/* Holy grail layout */
.holy-grail {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header header"
    "nav    main   aside"
    "footer footer footer";
  min-height: 100vh;
  gap: 1rem;
}

/* Responsive product grid */
.products {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

/* Bento dashboard */
.dashboard {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 140px;
  gap: 1rem;
}
.stat-wide { grid-column: span 2; }
.stat-tall { grid-row: span 2; }
```

### 5.3 Flexbox vs Grid — When to Use Which

| Use Flexbox | Use Grid |
|---|---|
| 1D layout (row **or** column) | 2D layout (rows **and** columns) |
| Navbar, toolbar, button group | Page layout, dashboard, gallery |
| Content-driven sizing | Layout-driven sizing |
| Alignment of items in a line | Precise placement in a matrix |

> **Rule of thumb:** Grid for the *page skeleton*, Flexbox for the *components inside it*.

### 5.4 Positioning

```css
.box { position: static; }    /* default — normal flow */
.box { position: relative; }  /* offset from itself; creates containing block */
.box { position: absolute; }  /* removed from flow; positioned to nearest positioned ancestor */
.box { position: fixed; }     /* pinned to viewport; doesn't scroll */
.box { position: sticky; }    /* relative until scroll threshold, then fixed */
```

**Offsets**

```css
.element {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  /* or shorthand */
  inset: 0;
  z-index: 10;
}
```

**Classic patterns**

```css
/* Sticky header */
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
  box-shadow: var(--shadow-sm);
}

/* Badge on a card */
.card { position: relative; }
.badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ef4444;
  color: white;
  border-radius: 9999px;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}

/* Overlay on an image */
.thumb { position: relative; overflow: hidden; }
.thumb::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(transparent 50%, rgba(0,0,0,0.7));
}
.thumb-caption {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  color: white;
  z-index: 2;
}

/* Modal backdrop */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* Centering with absolute */
.centered {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

**z-index rules**

- Only works on positioned elements (or flex/grid children with `z-index`).
- Higher number = closer to the viewer.
- Creates a **stacking context** — children can't escape their parent's layer.
- Keep a documented scale:

```css
:root {
  --z-base: 1;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal: 1000;
  --z-toast: 1100;
  --z-tooltip: 1200;
}
```

### 5.5 Overflow

```css
.container {
  overflow: hidden;      /* clip */
  overflow: visible;     /* default — spills out */
  overflow: auto;        /* scrollbar only if needed */
  overflow: scroll;      /* always scrollbars */
  overflow-x: hidden;    /* hide horizontal only */
  overflow-y: auto;      /* vertical scroll */

  /* Modern clip with padding support */
  overflow: clip;
  overflow-clip-margin: 1rem;
}
```

**Common use:** prevent horizontal scroll on mobile

```css
html, body {
  overflow-x: hidden;
  max-width: 100%;
}
```

### 5.6 Transitions & Animations (Intro)

```css
/* Transition */
.btn {
  background: #2563eb;
  transition: background 200ms ease, transform 200ms ease;
}
.btn:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
}

/* Keyframe animation */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.card {
  animation: fadeUp 500ms ease-out both;
}
.card:nth-child(2) { animation-delay: 100ms; }
.card:nth-child(3) { animation-delay: 200ms; }

/* Respect user preference */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 5.7 Stacking Context & Containing Block

An element becomes the containing block for `absolute` children when it has:
- `position: relative | absolute | fixed | sticky`
- `transform` ≠ `none`
- `filter` ≠ `none`
- `will-change`
- `contain: layout|paint`

> **Gotcha:** if you set `transform` on a parent, `position: fixed` children become relative to that parent, not the viewport.

---

### 🧪 DAY 5 TASK — `D05-T1`

**Deliverable:** `dashboard-layout.html` + `css/layout.css`

**Requirements:**

1. **Page skeleton with CSS Grid** using `grid-template-areas`:
   ```
   ┌─────────────────────────────────┐
   │          HEADER (sticky)         │
   ├──────────┬──────────────────────┤
   │          │                      │
   │ SIDEBAR  │        MAIN          │
   │ (fixed)  │                      │
   │          │                      │
   ├──────────┴──────────────────────┤
   │            FOOTER                │
   └─────────────────────────────────┘
   ```
2. **Sticky header** with `position: sticky; top: 0` and `z-index`
3. **Navbar inside header** built with Flexbox: logo left, nav centre, user avatar right
4. **Sidebar** with vertical flex nav list
5. **Main area** contains a **responsive stat-card grid** using `repeat(auto-fit, minmax(220px, 1fr))`
6. **Bento section**: one card spanning 2 columns, one spanning 2 rows
7. **Badge** positioned absolutely on a card (`top: -8px; right: -8px`)
8. **Image thumbnail** with gradient overlay + caption using `position: absolute`
9. **Modal** using `position: fixed; inset: 0` with `display: flex` centering — toggled by a button
10. **Hover transitions** on buttons and cards
11. **`prefers-reduced-motion`** media query
12. **Documented z-index scale** in `:root`

**Bonus:** Add a `fadeUp` keyframe animation with staggered delays.

---

### ❓ DAY 5 QUIZ — `D05-Q` (5 Questions)

| # | Question | Options | Answer |
|---|---|---|---|
| 1 | `justify-content` aligns along | A) Cross axis B) Main axis C) Z axis D) Neither | **B** |
| 2 | `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))` creates | A) 3 fixed columns B) Responsive auto-wrapping columns C) One column D) Error | **B** |
| 3 | `position: fixed` positions relative to | A) Parent B) Viewport C) Body D) Nearest positioned ancestor | **B** |
| 4 | `flex: 1` is shorthand for | A) `1 0 auto` B) `1 1 0%` C) `0 1 auto` D) `1 1 auto` | **B** |
| 5 | `position: absolute` positions relative to | A) Viewport B) Nearest **positioned** ancestor C) Always body D) Itself | **B** |

---

# DAY 6 — Responsive Design & Tailwind CSS

**Module:** `WEB-CSS` | **Duration:** 7 h | **Lesson Code:** `WF-D06`

### Learning Objectives
- Apply mobile-first responsive design
- Use media queries, container queries, and fluid units
- Build a responsive navigation
- Build a full responsive page with Tailwind CSS

### 6.1 Responsive Design Principles

**Mobile-first** — design for the smallest screen first, then add complexity upward.

```css
/* Mobile-first (✅ recommended) */
.card { padding: 1rem; }

@media (min-width: 768px) {
  .card { padding: 2rem; }
}

/* Desktop-first (❌ avoid) */
.card { padding: 2rem; }

@media (max-width: 767px) {
  .card { padding: 1rem; }
}
```

**Common breakpoints**

| Name | Min-width | Target |
|---|---|---|
| `sm` | 640px | Large phones (landscape) |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large monitors |

### 6.2 The Viewport Meta Tag

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

Without it, mobile browsers render at ~980px and zoom out. **This is mandatory.**

### 6.3 Media Queries

```css
/* Basic */
@media (min-width: 768px) { /* tablet and up */ }

/* Range */
@media (min-width: 768px) and (max-width: 1023px) { /* tablet only */ }

/* Orientation */
@media (orientation: landscape) { }

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #111827;
    --color-text: #f9fafb;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) { }

/* High-DPI screens */
@media (min-resolution: 2dppx) { }

/* Print */
@media print {
  .no-print, nav, footer { display: none; }
  body { font-size: 12pt; color: black; }
}

/* Hover-capable devices only */
@media (hover: hover) {
  .card:hover { transform: translateY(-4px); }
}
```

### 6.4 Fluid Layout Techniques

**1. Percentage widths + max-width**

```css
.container {
  width: 100%;
  max-width: 1200px;
  margin-inline: auto;
  padding-inline: 1rem;
}
```

**2. Fluid typography with `clamp()`**

```css
h1 { font-size: clamp(1.75rem, 4vw + 1rem, 3.5rem); }
p  { font-size: clamp(1rem, 0.95rem + 0.25vw, 1.125rem); }
```

**3. Fluid spacing**

```css
section {
  padding-block: clamp(2rem, 5vw, 5rem);
}
```

**4. Responsive images**

```css
img {
  max-width: 100%;
  height: auto;
  display: block;
}
```

```html
<img
  src="small.jpg"
  srcset="small.jpg 480w, medium.jpg 1024w, large.jpg 1600w"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  alt="Product"
  loading="lazy"
  decoding="async"
/>
```

**5. Auto-responsive grid (no media queries!)**

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}
```

**6. Container queries (modern)**

```css
.card-wrapper {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card { display: flex; gap: 1rem; }
}
```

### 6.5 Responsive Navigation

**Approach 1 — CSS-only hamburger (checkbox hack)**

```html
<header class="nav">
  <a href="/" class="nav__logo">Ethiroli</a>

  <input type="checkbox" id="nav-toggle" class="nav__toggle" />
  <label for="nav-toggle" class="nav__burger" aria-label="Toggle menu">
    <span></span><span></span><span></span>
  </label>

  <nav class="nav__menu">
    <a href="#home">Home</a>
    <a href="#courses">Courses</a>
    <a href="#about">About</a>
    <a href="#contact">Contact</a>
  </nav>
</header>
```

```css
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: white;
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
}

.nav__logo { font-weight: 700; font-size: 1.25rem; text-decoration: none; }

.nav__toggle { display: none; }

.nav__burger {
  display: flex;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
  padding: 0.5rem;
}
.nav__burger span {
  width: 24px;
  height: 2px;
  background: #111827;
  transition: 250ms ease;
}

.nav__menu {
  display: none;
  flex-direction: column;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  padding: 1rem;
  gap: 0.75rem;
  border-top: 1px solid #e5e7eb;
  box-shadow: var(--shadow-md);
}
.nav__menu a {
  text-decoration: none;
  color: #374151;
  padding: 0.5rem;
  border-radius: 8px;
}

.nav__toggle:checked ~ .nav__menu { display: flex; }
.nav__toggle:checked ~ .nav__burger span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.nav__toggle:checked ~ .nav__burger span:nth-child(2) { opacity: 0; }
.nav__toggle:checked ~ .nav__burger span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* Desktop */
@media (min-width: 768px) {
  .nav__burger { display: none; }
  .nav__menu {
    display: flex;
    flex-direction: row;
    position: static;
    box-shadow: none;
    border: none;
    padding: 0;
    gap: 1.5rem;
  }
}
```

**Approach 2 — Off-canvas drawer**

```css
.drawer {
  position: fixed;
  inset: 0 0 0 auto;
  width: min(320px, 85vw);
  background: white;
  transform: translateX(100%);
  transition: transform 300ms ease;
  z-index: var(--z-modal);
}
.drawer.is-open { transform: translateX(0); }
```

### 6.6 Mobile UX Rules

| Rule | Reason |
|---|---|
| Tap targets ≥ 44×44px | Apple/Google guideline |
| Font size ≥ 16px on inputs | Prevents iOS auto-zoom |
| Spacing between tap targets ≥ 8px | Reduces mis-taps |
| No hover-only interactions | Touch has no hover |
| Thumb-zone: primary actions bottom-centre | Reachability |
| Avoid fixed widths | Breaks on small screens |
| Use `dvh` not `vh` for full-height | Mobile browser chrome |

```css
.hero {
  min-height: 100dvh;   /* dynamic viewport height — mobile-safe */
}
```

### 6.7 Tailwind CSS

**Why Tailwind:** utility-first, no context switching, consistent design tokens, tiny production CSS.

**Setup (CDN — for learning)**

```html
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          brand: { 500: '#2563eb', 600: '#1d4ed8', 700: '#1e40af' },
        },
        fontFamily: { sans: ['Inter', 'sans-serif'] },
      },
    },
  };
</script>
```

**Setup (proper — Vite)**

```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

```javascript
// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: { brand: { 500: "#2563eb", 600: "#1d4ed8" } },
    },
  },
  plugins: [],
};
```

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Essential utility classes**

| Category | Classes |
|---|---|
| Layout | `flex` `grid` `block` `hidden` `inline-flex` |
| Flex | `flex-row` `flex-col` `justify-center` `justify-between` `items-center` `gap-4` |
| Grid | `grid-cols-3` `grid-cols-12` `col-span-2` `grid-rows-2` |
| Spacing | `p-4` `px-6` `py-2` `m-4` `mx-auto` `mt-8` `space-y-4` |
| Sizing | `w-full` `w-1/2` `max-w-md` `max-w-7xl` `h-screen` `min-h-screen` |
| Typography | `text-sm` `text-lg` `text-2xl` `font-bold` `text-center` `leading-relaxed` `tracking-tight` |
| Colour | `text-gray-700` `bg-blue-600` `border-gray-200` `hover:bg-blue-700` |
| Border | `border` `border-2` `rounded` `rounded-lg` `rounded-full` `divide-y` |
| Shadow | `shadow-sm` `shadow-md` `shadow-lg` `shadow-xl` |
| Position | `relative` `absolute` `fixed` `sticky` `top-0` `inset-0` `z-10` |
| Display | `hidden` `md:block` `lg:flex` |
| Effects | `opacity-75` `transition` `duration-300` `hover:scale-105` |

**Responsive prefixes**

```html
<!-- Mobile-first: base = mobile, prefix = breakpoint and up -->
<div class="
  grid grid-cols-1
  sm:grid-cols-2
  lg:grid-cols-3
  xl:grid-cols-4
  gap-4
">
```

**State prefixes**

```html
<button class="
  bg-blue-600 text-white px-4 py-2 rounded-lg
  hover:bg-blue-700
  focus:outline-none focus:ring-2 focus:ring-blue-400
  active:scale-95
  disabled:opacity-50 disabled:cursor-not-allowed
  transition
">
  Submit
</button>
```

**Dark mode**

```html
<html class="dark">
...
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
```

**Example: Tailwind card**

```html
<article class="
  max-w-sm rounded-2xl overflow-hidden shadow-lg
  bg-white hover:shadow-xl transition-shadow duration-300
">
  <img class="w-full h-48 object-cover" src="course.jpg" alt="Full Stack Course" />
  <div class="p-6">
    <span class="inline-block px-3 py-1 text-xs font-semibold
                 bg-blue-100 text-blue-700 rounded-full">
      45 Days
    </span>
    <h2 class="mt-3 text-xl font-bold text-gray-900">
      Full Stack Development
    </h2>
    <p class="mt-2 text-gray-600 leading-relaxed">
      Build a complete application with React, Node, Express & MySQL.
    </p>
    <button class="mt-4 w-full py-2.5 bg-blue-600 text-white rounded-lg
                   font-medium hover:bg-blue-700 transition">
      Enroll Now
    </button>
  </div>
</article>
```

**Tailwind + `@apply` for components**

```css
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-600 text-white rounded-lg
           font-medium hover:bg-blue-700 transition
           focus:outline-none focus:ring-2 focus:ring-blue-400
           disabled:opacity-50;
  }
  .card {
    @apply bg-white rounded-xl shadow-md p-6
           hover:shadow-lg transition-shadow;
  }
}
```

---

### 🧪 DAY 6 TASK — `D06-T1`

**Deliverable:** A fully responsive landing page — **two versions**.

**Version A: `landing-css.html`** (hand-written CSS)
**Version B: `landing-tailwind.html`** (Tailwind CDN)

Both must have:

1. Viewport meta tag
2. Sticky responsive navbar with working hamburger menu (mobile)
3. Hero section with `min-height: 100dvh` / `min-h-screen`, gradient background, headline using `clamp()` / responsive text classes, and two CTAs
4. Features section: responsive grid
   - CSS: `repeat(auto-fit, minmax(260px, 1fr))`
   - Tailwind: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
5. Course cards section with `<img srcset sizes loading="lazy">`
6. Testimonials section
7. Pricing table (3 tiers) — responsive: stacked on mobile, side-by-side desktop
8. Footer with 4 columns → 1 column on mobile
9. `prefers-color-scheme: dark` support
10. `prefers-reduced-motion` support
11. Tap targets ≥ 44px
12. No horizontal scroll on 320px width

**Test at:** 320px, 375px, 768px, 1024px, 1440px — attach screenshots of each.

**Bonus:** Add a container query for the course card.

---

### ❓ DAY 6 QUIZ — `D06-Q` (5 Questions)

| # | Question | Options | Answer |
|---|---|---|---|
| 1 | Mobile-first means | A) Design desktop then shrink B) Design mobile then scale up C) No breakpoints D) Only mobile | **B** |
| 2 | `clamp(1rem, 2vw + 1rem, 3rem)` does what? | A) Fixed size B) Fluid between min and max C) Random D) Error | **B** |
| 3 | Which meta tag is mandatory for responsive? | A) `charset` B) `viewport` C) `description` D) `author` | **B** |
| 4 | Minimum recommended tap target | A) 20px B) 32px C) 44px D) 60px | **C** |
| 5 | `md:grid-cols-3` applies at | A) Below 768px B) 768px and above C) Only 768px D) Always | **B** |

---

# DAY 7 — Git & GitHub

**Module:** `DEV-GIT` | **Duration:** 7 h | **Lesson Code:** `WF-D07`

### Learning Objectives
- Explain version control and why it matters
- Perform the full Git workflow: init → add → commit → push → pull
- Branch, merge, and resolve conflicts
- Collaborate via GitHub PRs, issues, and code review
- Follow a professional commit & branching convention

### 7.1 Why Version Control

| Without Git | With Git |
|---|---|
| `final_v3_REAL_final.zip` | Clean history |
| No idea who changed what | Blame & history |
| Can't undo safely | Revert any commit |
| Can't work in parallel | Branches |
| No backup | Remote on GitHub |

### 7.2 Git Configuration

```bash
git config --global user.name "Asha Ramesh"
git config --global user.email "asha@example.com"
git config --global init.defaultBranch main
git config --global core.autocrlf input    # mac/linux
git config --global pull.rebase false

git config --list
```

**SSH key setup (recommended)**

```bash
ssh-keygen -t ed25519 -C "asha@example.com"
# press Enter for default path
cat ~/.ssh/id_ed25519.pub
# copy output → GitHub → Settings → SSH and GPG keys → New SSH key
ssh -T git@github.com
```

### 7.3 Core Workflow

```bash
# 1. Create a repo locally
mkdir ethiroli-project && cd ethiroli-project
git init

# 2. Check state
git status

# 3. Stage changes
git add index.html            # specific file
git add css/                  # folder
git add .                     # everything (respects .gitignore)

# 4. Commit
git commit -m "feat: add responsive navbar"

# 5. Connect to GitHub
git remote add origin git@github.com:asha/ethiroli-project.git
git branch -M main
git push -u origin main

# Subsequent pushes
git push
```

**Clone an existing repo**

```bash
git clone git@github.com:ethiroli/starter.git
cd starter
```

### 7.4 The Three Areas

```
WORKING DIRECTORY          STAGING AREA           REPOSITORY
(your files)               (git index)            (.git commits)
      │                          │                       │
      │      git add             │      git commit       │
      ├─────────────────────────►├──────────────────────►│
      │                          │                       │
      │◄─────────────────────────┴───────────────────────┤
      │              git checkout / git restore          │
```

```bash
git add .                     # working → staging
git commit -m "message"       # staging → repo
git restore file.js           # discard working changes
git restore --staged file.js  # unstage
git reset --soft HEAD~1       # undo last commit, keep changes staged
git reset --hard HEAD~1       # undo last commit, DISCARD changes ⚠️
```

### 7.5 Viewing History

```bash
git log                              # full log
git log --oneline                    # compact
git log --oneline --graph --all      # visual branch graph
git log -p file.js                   # changes per commit
git log --author="Asha"              # filter by author
git log --since="2 weeks ago"
git show a1b2c3d                     # inspect a commit
git diff                             # unstaged changes
git diff --staged                    # staged changes
git blame index.html                 # who wrote each line
```

### 7.6 Branching

```bash
git branch                          # list local branches
git branch -a                       # include remote
git branch feature/login            # create
git checkout feature/login          # switch
git switch feature/login            # modern switch
git checkout -b feature/login       # create + switch
git switch -c feature/login         # modern create + switch

# Work, commit...
git add .
git commit -m "feat: add login form"

# Push the branch
git push -u origin feature/login
```

**Merging**

```bash
git switch main
git pull                            # get latest
git merge feature/login             # merge into main
git push
git branch -d feature/login         # delete local branch
git push origin --delete feature/login
```

**Merge types**

| Type | Command | History |
|---|---|---|
| Fast-forward | `git merge feature` | Linear, no merge commit |
| 3-way merge | `git merge feature` | Creates merge commit |
| Squash | `git merge --squash feature` | One clean commit |
| Rebase | `git rebase main` | Linear, rewritten history |

### 7.7 Merge Conflicts

```bash
git merge feature/login
# CONFLICT (content): Merge conflict in src/App.jsx
```

```javascript
<<<<<<< HEAD
const API_URL = "https://api.prod.ethiroli.com";
=======
const API_URL = "https://api.staging.ethiroli.com";
>>>>>>> feature/login
```

**Resolution steps**

```bash
# 1. Open the file and choose the correct version
#    (or write a merged version), remove all markers

# 2. Stage the resolved file
git add src/App.jsx

# 3. Complete the merge
git commit            # for merge
# or
git rebase --continue # for rebase

# Abort if needed
git merge --abort
git rebase --abort
```

**Use a merge tool**

```bash
git mergetool        # opens VS Code if configured
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'
```

### 7.8 Remotes & Syncing

```bash
git remote -v                       # list remotes
git remote add origin <url>
git remote set-url origin <new-url>
git remote remove origin

git fetch origin                    # download, don't merge
git pull                            # fetch + merge
git pull --rebase                   # fetch + rebase
git push origin main
git push -u origin main             # set upstream
git push --force-with-lease         # safer force push ⚠️
```

**`fetch` vs `pull`**

| | `fetch` | `pull` |
|---|---|---|
| Downloads | ✅ | ✅ |
| Merges into working branch | ❌ | ✅ |
| Safe to run anytime | ✅ | ⚠️ may conflict |

### 7.9 `.gitignore`

```gitignore
# Dependencies
node_modules/
vendor/

# Build output
dist/
build/
.next/

# Environment
.env
.env.local
*.env

# Logs
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/*
!.vscode/extensions.json
.idea/

# Coverage
coverage/
```

> **Golden rule:** never commit `node_modules/`, `.env`, secrets, or build artifacts.

**If you accidentally committed a secret:**

```bash
# 1. Immediately rotate the secret (assume it's compromised)
# 2. Remove from history
git rm --cached .env
echo ".env" >> .gitignore
git commit -m "chore: remove .env from tracking"
# 3. For deep history removal, use git-filter-repo or BFG
```

### 7.10 GitHub Collaboration

**Pull Request workflow**

```
1. Fork or branch
2. Create feature branch:  git switch -c feat/user-profile
3. Commit with clear messages
4. Push branch:             git push -u origin feat/user-profile
5. Open PR on GitHub → compare → create
6. Fill PR template: description, screenshots, testing notes, linked issue
7. Request reviewers
8. Address review comments (push more commits)
9. CI checks must pass
10. Squash & merge
11. Delete branch
```

**PR template** (`.github/pull_request_template.md`)

```markdown
## What does this PR do?
Adds user profile page with edit capability.

## Related issue
Closes #42

## Type of change
- [x] New feature
- [ ] Bug fix
- [ ] Breaking change

## How to test
1. Login as a user
2. Navigate to /profile
3. Click Edit, change name, Save
4. Verify the change persists on reload

## Screenshots
| Before | After |
|---|---|
| ... | ... |

## Checklist
- [x] Code follows project style
- [x] Self-reviewed
- [x] Tests added/updated
- [x] Docs updated
- [x] No console errors
```

**Issues**

```markdown
## Bug: Login button unresponsive on mobile

**Steps to reproduce**
1. Open site on iPhone Safari
2. Tap "Login"

**Expected:** Login modal opens
**Actual:** Nothing happens

**Environment:** iOS 17, Safari, 375px viewport
**Severity:** High
**Screenshot:** [attached]
```

**Labels:** `bug`, `feature`, `enhancement`, `documentation`, `good first issue`, `priority: high`

### 7.11 Commit Message Convention (Conventional Commits)

```
<type>(<scope>): <subject>

<body>

<footer>
```

| Type | Meaning |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no logic change |
| `refactor` | Restructure, no behaviour change |
| `perf` | Performance improvement |
| `test` | Add/update tests |
| `chore` | Build/tooling/config |
| `ci` | CI configuration |

**Good examples**

```
feat(auth): add JWT refresh token rotation
fix(navbar): correct hamburger icon on iOS Safari
docs(readme): add local setup instructions
refactor(api): extract validation into middleware
test(cart): add checkout edge cases
```

**Bad examples**

```
❌ update
❌ fixes
❌ asdf
❌ final changes
❌ WIP
```

### 7.12 Branching Strategies

**GitHub Flow** (recommended for internships)

```
main ──●────────●────────────●──── (always deployable)
        \      /              /
         ●───● feature/a    /
              \            /
               ●───● feature/b
```

Rules:
- `main` is always deployable
- Every change goes through a branch + PR
- Short-lived branches (< 3 days)
- Deploy from `main`

**Git Flow** (heavier, for release cycles)

```
main     ──●──────────────●──────────
            \            /
release      ●───●───●──●
            /            \
develop ──●───●───●───●───●───●───
           \     /     \     /
feature     ●───●       ●───●
```

Branches: `main`, `develop`, `release/*`, `feature/*`, `hotfix/*`

### 7.13 Useful Recovery Commands

```bash
# Find a lost commit
git reflog
git checkout <lost-sha>

# Undo a pushed commit (safe — creates a new commit)
git revert <sha>
git push

# Recover a deleted branch
git reflog
git branch recovered <sha>

# Stash work temporarily
git stash
git stash list
git stash pop
git stash apply stash@{2}

# Cherry-pick one commit onto another branch
git cherry-pick <sha>

# Interactive rebase — squash/reword/reorder
git rebase -i HEAD~3
```

---

### 🧪 DAY 7 TASK — `D07-T1`

**Deliverable:** A GitHub repository — `ethiroli-portfolio`

**Requirements:**

1. Create a repo locally with `git init`, push to GitHub
2. Add a `.gitignore` for Node projects
3. Add a `README.md` containing:
   - Project title and description
   - Screenshot/GIF
   - Tech stack
   - Setup instructions
   - Folder structure
   - Author section with links
4. Make **at least 10 commits** with **conventional commit messages** covering at least 4 different types (`feat`, `fix`, `docs`, `style`)
5. Create **at least 3 branches**:
   - `feat/hero-section`
   - `feat/contact-form`
   - `fix/mobile-nav`
6. Merge each branch into `main` via a **Pull Request** (not directly)
7. **Deliberately create a merge conflict** (edit the same line in two branches), resolve it, and document the resolution in a `CONFLICT_NOTES.md`
8. Create **2 issues** with proper labels and a descriptive body
9. One PR must reference an issue using `Closes #1`
10. Add a `pull_request_template.md` in `.github/`
11. Verify `git log --oneline --graph --all` shows a clean branch history — screenshot it

**Bonus:**
- Set up a GitHub Pages deployment from `main`
- Add a GitHub Action that runs HTML validation on push
- Add a `CONTRIBUTING.md`

---

### ❓ DAY 7 QUIZ — `D07-Q` (5 Questions)

| # | Question | Options | Answer |
|---|---|---|---|
| 1 | `git add .` moves changes to | A) Remote B) Staging area C) Working dir D) Trash | **B** |
| 2 | Which creates a new branch and switches to it? | A) `git branch x` B) `git switch -c x` C) `git checkout x` D) `git merge x` | **B** |
| 3 | `git fetch` vs `git pull` | A) Identical B) `pull` also merges C) `fetch` merges D) `pull` only downloads | **B** |
| 4 | Conventional commit for a bug fix | A) `feat:` B) `fix:` C) `chore:` D) `docs:` | **B** |
| 5 | Merge conflict markers include | A) `<<<` `===` `>>>` B) `[[[` `]]]` C) `###` D) `---` | **A** |

---

# 📅 WEEK 2 — JAVASCRIPT

---

# DAY 8 — JavaScript Fundamentals 1: Variables, Types, Operators

**Module:** `JS-CORE` | **Duration:** 7 h | **Lesson Code:** `JS-D08`

### Learning Objectives
- Run JavaScript in the browser and Node
- Declare variables with `let`, `const`, `var` correctly
- Identify and convert all primitive types
- Use arithmetic, comparison, logical, and nullish operators

### 8.1 What is JavaScript

- The **only** language that runs natively in browsers
- Single-threaded, event-driven, non-blocking
- Dynamically typed, interpreted (JIT-compiled)
- Runs on the server via **Node.js**

**Where JS runs**

| Environment | Global object | Access to DOM? | Access to FS? |
|---|---|---|---|
| Browser | `window` | ✅ | ❌ |
| Node.js | `global` | ❌ | ✅ |

**Adding JS to HTML**

```html
<!-- External (preferred) -->
<script src="js/app.js" defer></script>

<!-- Inline -->
<script>console.log("hi");</script>

<!-- Module -->
<script type="module" src="js/main.js"></script>
```

`defer` → download in parallel, execute after HTML parse, in order.
`async` → download in parallel, execute as soon as ready (order not guaranteed).

### 8.2 Output & Debugging

```javascript
console.log("Hello");            // basic
console.log("x =", x);           // multiple values
console.warn("Warning");
console.error("Error");
console.info("Info");
console.table([{a:1,b:2},{a:3,b:4}]);
console.group("User");
console.log("name: Asha");
console.groupEnd();
console.time("loop");
for (let i=0;i<1e6;i++){}
console.timeEnd("loop");
console.count("click");
console.assert(1 === 2, "This fails");
console.trace("Where am I?");

// Browser-only
alert("Hello");
const name = prompt("Your name?");
const ok = confirm("Are you sure?");
```

### 8.3 Variables

```javascript
const PI = 3.14159;      // cannot reassign — DEFAULT
let count = 0;           // reassignable
var legacy = "old";      // function-scoped, avoid
```

| | `var` | `let` | `const` |
|---|---|---|---|
| Scope | Function | Block | Block |
| Reassign | ✅ | ✅ | ❌ |
| Redeclare in same scope | ✅ | ❌ | ❌ |
| Hoisted as | `undefined` | TDZ | TDZ |
| Must initialize | ❌ | ❌ | ✅ |
| Use today | ❌ | When needed | **Default** |

**Hoisting & TDZ**

```javascript
console.log(a);   // undefined (hoisted)
var a = 1;

console.log(b);   // ❌ ReferenceError: Cannot access 'b' before initialization
let b = 1;
```

**Naming**

```javascript
// ✅
const userName = "Asha";
const MAX_RETRY_COUNT = 3;
let isLoading = false;
let _private = 1;
let $el = document.querySelector("div");

// ❌
const 1name = "x";        // starts with digit
const my-name = "x";      // hyphen
const class = "x";        // reserved
const data = "x";         // too vague
```

### 8.4 Data Types

**Primitives (7)**

```javascript
typeof "text"        // "string"
typeof 42            // "number"
typeof 42n           // "bigint"
typeof true          // "boolean"
typeof undefined     // "undefined"
typeof null          // "object"  ⚠️ historical bug
typeof Symbol()      // "symbol"
```

**Non-primitive**

```javascript
typeof {}            // "object"
typeof []            // "object"
typeof function(){}  // "function"
Array.isArray([])    // ✅ true
```

**Strings**

```javascript
const s = "Hello, World";
s.length;                  // 12
s.toUpperCase();           // "HELLO, WORLD"
s.toLowerCase();           // "hello, world"
s.includes("World");       // true
s.startsWith("Hello");     // true
s.endsWith("!");           // false
s.indexOf("o");            // 4
s.lastIndexOf("o");        // 8
s.slice(0, 5);             // "Hello"
s.substring(7);            // "World"
s.replace("World","JS");   // "Hello, JS"
s.replaceAll("l","L");     // "HeLLo, WorLd"
s.split(", ");             // ["Hello","World"]
s.trim();                  // removes whitespace
s.padStart(15, "*");       // "***Hello, World"
s.repeat(2);               // doubled
s.charAt(0);               // "H"
s[0];                      // "H"
"  spaced  ".trim();

// Template literals
const name = "Asha";
const msg = `Hello, ${name}! You have ${2 + 3} messages.`;
```

**Numbers**

```javascript
10 / 3;                  // 3.3333333333333335
0.1 + 0.2;               // 0.30000000000000004 ⚠️
Number.isInteger(5);     // true
Number.isFinite(Infinity); // false
Number.isNaN(NaN);       // true
Number("42");            // 42
Number("42px");          // NaN
parseInt("42px", 10);    // 42
parseFloat("3.14kg");    // 3.14
(3.14159).toFixed(2);    // "3.14"
(42).toString(2);        // "101010"
Math.round(4.6);         // 5
Math.floor(4.9);         // 4
Math.ceil(4.1);          // 5
Math.abs(-5);            // 5
Math.max(1,5,3);         // 5
Math.min(1,5,3);         // 1
Math.pow(2,10);          // 1024
Math.sqrt(16);           // 4
Math.random();           // 0–0.999...
Math.floor(Math.random() * 10) + 1;  // 1–10
Number.MAX_SAFE_INTEGER; // 9007199254740991
```

**Booleans & truthiness**

```javascript
// Falsy (only 8):
false, 0, -0, 0n, "", null, undefined, NaN

// Everything else is truthy:
Boolean([])   // true  ⚠️
Boolean({})   // true
Boolean("0")  // true
Boolean(" ")  // true
```

**null vs undefined**

```javascript
let a;                  // undefined — engine default
let b = null;           // null — intentional emptiness

typeof undefined        // "undefined"
typeof null             // "object" ⚠️

null == undefined       // true
null === undefined      // false

// Nullish coalescing
0 ?? "fallback"         // 0    ✅
0 || "fallback"         // "fallback" ⚠️
undefined ?? "fallback" // "fallback"
null ?? "fallback"      // "fallback"
```

### 8.5 Operators

**Arithmetic**

```javascript
5 + 2    // 7
5 - 2    // 3
5 * 2    // 10
5 / 2    // 2.5
5 % 2    // 1
5 ** 2   // 25
-5       // unary minus
+"42"    // 42 (unary plus converts)
```

**Assignment**

```javascript
let x = 10;
x += 5;   // 15
x -= 3;   // 12
x *= 2;   // 24
x /= 4;   // 6
x %= 4;   // 2
x **= 3;  // 8
x ??= 99; // assigns only if x is null/undefined
x ||= 1;  // assigns only if x is falsy
x &&= 2;  // assigns only if x is truthy
```

**Increment / Decrement**

```javascript
let i = 5;
i++;   // returns 5, i becomes 6
++i;   // i becomes 7, returns 7
i--;   // returns 7, i becomes 6
--i;   // i becomes 5, returns 5
```

**Comparison**

```javascript
5 == "5"      // true  ⚠️ coerces
5 === "5"     // false ✅
0 == false    // true  ⚠️
0 === false   // false ✅
null == undefined  // true
NaN === NaN        // false ← use Number.isNaN()

"a" < "b"     // true (lexicographic)
"10" < "9"    // true ⚠️ string comparison
10 < 9        // false
```

> **Always use `===` and `!==`.**

**Logical**

```javascript
true && false   // false
true || false   // true
!true           // false

// Short-circuit
const name = input || "Guest";
const user = isLoggedIn && getUser();

// Falsy fallback issue
const limit = 0 || 10;    // 10 ⚠️ wrong if 0 is valid
const limit2 = 0 ?? 10;   // 0  ✅
```

**Optional chaining**

```javascript
const user = { profile: { name: "Asha" } };
user.profile.name;         // "Asha"
user.address.city;         // ❌ TypeError
user.address?.city;        // undefined ✅
user.profile?.name?.length;// 4
user.getName?.();          // undefined if method missing
arr?.[0];                  // safe index access
```

**Ternary**

```javascript
const status = marks >= 40 ? "Pass" : "Fail";
const label = count > 0 ? `${count} items` : "Empty";
```

**Comma & void**

```javascript
const x = (1, 2, 3);   // 3 — evaluates all, returns last (rare)
void 0;                // undefined
```

**Precedence**

```
1.  ()  []  .  ?.
2.  !  ~  +unary  -unary  typeof  void
3.  **
4.  *  /  %
5.  +  -
6.  <  <=  >  >=
7.  ==  !=  ===  !==
8.  &&
9.  ||
10. ??
11. ? :
12. =  +=  -=  ...
13. ,
```

```javascript
2 + 3 * 4      // 14
(2 + 3) * 4    // 20
true || false && false   // true  (&& before ||)
```

### 8.6 Type Conversion

```javascript
// Explicit (preferred)
Number("42")         // 42
Number("")           // 0
Number("abc")        // NaN
Number(true)         // 1
String(42)           // "42"
String(null)         // "null"
Boolean(0)           // false
parseInt("42px", 10) // 42
parseFloat("3.9kg")  // 3.9

// Implicit (avoid relying on it)
"5" + 2     // "52"
"5" - 2     // 3
"5" * "2"   // 10
true + 1    // 2
[] + []     // ""
[] + {}     // "[object Object]"
[1,2] + [3] // "1,23"
```

> **Rule:** convert explicitly with `Number()`, `String()`, `Boolean()`.

---

### 🧪 DAY 8 TASK — `D08-T1`

**Deliverable:** `day08/` folder with 5 `.js` files + one `index.html`

**File 1: `types.js`**
Print the `typeof` for 12 different values (including `null`, `[]`, `{}`, a function, `NaN`). Add a comment on each line explaining the result.

**File 2: `conversion.js`**
Given `const inputs = ["42", "3.14", "abc", "", "  7  ", "0x1F", null, undefined, true, [], {}]`, print for each: original value, `typeof`, `Number()` result, `parseInt()` result, `Boolean()` result, `String()` result — as a `console.table`.

**File 3: `operators.js`**
Write and print the result of 15 expressions covering: arithmetic, `**`, `%`, pre/post increment, `===` vs `==`, `??` vs `||`, `?.`, ternary, short-circuit, spread. Comment each with the *reason* for the output.

**File 4: `string-toolkit.js`**
Implement functions (no libraries, no regex):
- `capitalize(str)` → `"hello"` → `"Hello"`
- `reverse(str)` → `"abc"` → `"cba"`
- `countWords(str)`
- `isPalindrome(str)` (case & space insensitive)
- `maskEmail(str)` → `"asha@ethiroli.com"` → `"a***@ethiroli.com"`
- `truncate(str, n)` → adds `…` if longer
- `slugify(str)` → `"Hello World!"` → `"hello-world"`

**File 5: `number-utils.js`**
Implement:
- `randomInt(min, max)` inclusive
- `roundTo(n, decimals)`
- `formatCurrency(n)` → `₹1,23,456.00` (Indian format)
- `isPrime(n)`
- `gcd(a, b)` (Euclidean algorithm)
- `toRoman(n)` for 1–3999

**`index.html`** loads all 5 with `<script type="module">` and prints a summary table.

**Bonus:** Add `clamp(n, min, max)` and a unit-converter object (km↔miles, °C↔°F).

---

### ❓ DAY 8 QUIZ — `D08-Q` (5 Questions)

| # | Question | Options | Answer |
|---|---|---|---|
| 1 | `typeof null` returns | A) "null" B) "object" C) "undefined" D) "boolean" | **B** |
| 2 | Which is NOT falsy? | A) `0` B) `""` C) `[]` D) `NaN` | **C** |
| 3 | `0 ?? 10` returns | A) 10 B) 0 C) undefined D) NaN | **B** |
| 4 | `"5" + 2` evaluates to | A) 7 B) "52" C) NaN D) "7" | **B** |
| 5 | `5 === "5"` returns | A) true B) false C) NaN D) Error | **B** |

---

# DAY 9 — JavaScript Fundamentals 2: Conditions & Loops

**Module:** `JS-CORE` | **Duration:** 7 h | **Lesson Code:** `JS-D09`

### Learning Objectives
- Control flow with `if`, `else if`, `switch`, ternary
- Iterate with `for`, `while`, `do…while`, `for…of`, `for…in`
- Use `break`, `continue`, and labels correctly
- Recognise and avoid infinite loops and off-by-one errors

### 9.1 Conditionals

```javascript
// if / else if / else
const marks = 78;

if (marks >= 90) {
  console.log("Grade A+");
} else if (marks >= 75) {
  console.log("Grade A");
} else if (marks >= 60) {
  console.log("Grade B");
} else if (marks >= 40) {
  console.log("Grade C");
} else {
  console.log("Fail");
}
```

**Conditions are evaluated top-down — the first `true` wins.** Order matters.

**Guard clauses (early return) — preferred style**

```javascript
// ❌ nested
function getDiscount(user) {
  if (user) {
    if (user.isActive) {
      if (user.orders > 10) return 0.2;
      else return 0.1;
    } else return 0;
  } else return 0;
}

// ✅ flat
function getDiscount(user) {
  if (!user) return 0;
  if (!user.isActive) return 0;
  if (user.orders > 10) return 0.2;
  return 0.1;
}
```

**switch**

```javascript
switch (day) {
  case 1:
  case 2:
  case 3:
  case 4:
  case 5:
    console.log("Weekday");
    break;
  case 6:
  case 7:
    console.log("Weekend");
    break;
  default:
    console.log("Invalid day");
}
```

**Switch with expressions**

```javascript
switch (true) {
  case score >= 90: grade = "A"; break;
  case score >= 75: grade = "B"; break;
  case score >= 40: grade = "C"; break;
  default:          grade = "F";
}
```

⚠️ Forgetting `break` causes **fall-through** — often a bug, occasionally intentional.

**Ternary**

```javascript
const label = count === 1 ? "item" : "items";
const cls = isActive ? "badge--active" : "badge--inactive";

// Nested (readable only if simple)
const level = score > 90 ? "expert" : score > 60 ? "intermediate" : "beginner";

// ❌ Hard to read — use if/else instead
const x = a ? b ? c ? 1 : 2 : 3 : 4;
```

**Logical assignment (modern)**

```javascript
user.name ??= "Guest";     // set only if null/undefined
config.debug ||= false;    // set only if falsy
cache.data &&= transform(cache.data);  // set only if truthy
```

### 9.2 Loops

**`for` — when you know the count**

```javascript
for (let i = 0; i < 5; i++) {
  console.log(i);          // 0 1 2 3 4
}

// Countdown
for (let i = 5; i > 0; i--) console.log(i);

// Step
for (let i = 0; i <= 100; i += 10) console.log(i);
```

**`while` — when the count is unknown**

```javascript
let balance = 5000;
while (balance > 0) {
  balance -= 1200;
  console.log(balance);    // 3800 2600 1400 200 -1000
}
```

**`do…while` — runs at least once**

```javascript
let input;
do {
  input = prompt("Enter 'yes' to continue");
} while (input !== "yes");
```

**`for…of` — values (arrays, strings, Map, Set)**

```javascript
const fruits = ["apple", "banana", "mango"];
for (const fruit of fruits) console.log(fruit);

for (const ch of "Ethiroli") console.log(ch);

// With index
for (const [i, fruit] of fruits.entries()) console.log(i, fruit);

const map = new Map([["a",1],["b",2]]);
for (const [k, v] of map) console.log(k, v);
```

**`for…in` — keys (objects)**

```javascript
const user = { name: "Asha", age: 25, city: "Chennai" };
for (const key in user) console.log(key, user[key]);

// ⚠️ Avoid for…in on arrays — order not guaranteed
```

**`forEach` — array method**

```javascript
fruits.forEach((fruit, i, arr) => console.log(i, fruit));

// ⚠️ forEach cannot be broken — use for…of if you need `break`
```

**`break` / `continue`**

```javascript
for (let i = 1; i <= 10; i++) {
  if (i === 5) continue;     // skip 5
  if (i === 8) break;        // stop at 8
  console.log(i);            // 1 2 3 4 6 7
}
```

**Labeled break (nested loops)**

```javascript
outer:
for (let i = 1; i <= 3; i++) {
  for (let j = 1; j <= 3; j++) {
    if (i * j === 6) break outer;
    console.log(i, j);
  }
}
```

### 9.3 Loop Patterns

**Accumulator**

```javascript
let total = 0;
for (const price of [120, 340, 90, 55]) total += price;
console.log(total);   // 605
```

**Counter**

```javascript
let evens = 0;
for (let i = 1; i <= 100; i++) if (i % 2 === 0) evens++;
```

**Search**

```javascript
function findUser(users, id) {
  for (const u of users) {
    if (u.id === id) return u;
  }
  return null;
}
```

**Build a string / array**

```javascript
let stars = "";
for (let i = 1; i <= 5; i++) stars += "*";
// "*****"

const doubled = [];
for (const n of [1,2,3]) doubled.push(n * 2);
```

**Min / max**

```javascript
let max = -Infinity;
for (const n of [3, 9, 2, 7]) if (n > max) max = n;
```

**Reverse iteration**

```javascript
for (let i = arr.length - 1; i >= 0; i--) console.log(arr[i]);
```

**Nested loops — multiplication table**

```javascript
for (let i = 1; i <= 5; i++) {
  let row = "";
  for (let j = 1; j <= 5; j++) row += String(i * j).padStart(4);
  console.log(row);
}
```

### 9.4 Common Loop Bugs

| Bug | Example | Fix |
|---|---|---|
| Infinite loop | `while (i > 0) { }` with no `i--` | Update the condition variable |
| Off-by-one | `i <= arr.length` | `i < arr.length` |
| Skipped last | `i < arr.length - 1` | Remove `-1` |
| Skipped first | `i = 1` when array is 0-indexed | `i = 0` |
| Mutating while iterating | `splice` inside `for…of` | Loop backwards or use `filter` |
| `var` in loop + closure | `for (var i…) setTimeout(…)` | Use `let` |
| `break` only exits inner loop | Nested loops | Use a label or a flag |

**The classic `var` bug**

```javascript
// ❌ prints 3 3 3
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 0);

// ✅ prints 0 1 2
for (let i = 0; i < 3; i++) setTimeout(() => console.log(i), 0);
```

### 9.5 Validation with Loops

```javascript
function validateMarks(marks) {
  const errors = [];
  for (let i = 0; i < marks.length; i++) {
    const m = marks[i];
    if (typeof m !== "number") errors.push(`Index ${i}: not a number`);
    else if (m < 0 || m > 100) errors.push(`Index ${i}: ${m} out of range`);
  }
  return { isValid: errors.length === 0, errors };
}
```

---

### 🧪 DAY 9 TASK — `D09-T1`

**Deliverable:** `day09/` with 6 standalone `.js` files.

**1. `fizzbuzz.js`**
Print 1–100. Multiples of 3 → `Fizz`, of 5 → `Buzz`, of both → `FizzBuzz`. Also print the count of each category at the end.

**2. `patterns.js`**
Print using loops (no string repetition shortcuts):
- Right triangle of `*` (5 rows)
- Inverted triangle
- Pyramid (centred)
- Diamond
- Floyd's triangle (1 / 2 3 / 4 5 6 …)
- Pascal's triangle (8 rows)
- Multiplication table 1–10 formatted in columns

**3. `number-analysis.js`**
Given a number `n`, using loops only (no `Math` helpers except `sqrt`):
- Sum of digits
- Reverse the number
- Count digits
- Check palindrome
- Check Armstrong number
- Check perfect number
- Print all factors
- Print prime factors

**4. `fibonacci.js`**
Print the first 20 Fibonacci numbers. Also print the sum of the first 20. Also determine the largest Fibonacci number below 1,000,000.

**5. `game-guess.js`**
Number guessing game (Node, using `readline`):
- System picks a random 1–100
- User guesses; system says "higher" / "lower"
- Track attempts
- Limit to 7 attempts
- Show a performance rating at the end

**6. `validate-loop.js`**
Implement `validatePassword(password)` that loops through characters and returns an object:
```javascript
{
  isValid: boolean,
  errors: string[],   // each missing rule
  strength: "weak" | "medium" | "strong"
}
```
Rules: ≥ 8 chars, ≥ 1 uppercase, ≥ 1 lowercase, ≥ 1 digit, ≥ 1 special char (`!@#$%^&*`), no spaces, no 3 consecutive identical chars.

**Bonus:** `pascal.js` renders Pascal's triangle with proper centring and binomial coefficients.

---

### ❓ DAY 9 QUIZ — `D09-Q` (5 Questions)

| # | Question | Options | Answer |
|---|---|---|---|
| 1 | Which loop always runs at least once? | A) `for` B) `while` C) `do…while` D) `for…of` | **C** |
| 2 | Missing `break` in `switch` causes | A) Syntax error B) Fall-through C) Exit D) Infinite loop | **B** |
| 3 | `for (const x of arr)` iterates | A) Keys B) Values C) Indices D) Pairs | **B** |
| 4 | `continue` does what? | A) Exits the loop B) Skips to the next iteration C) Restarts D) Nothing | **B** |
| 5 | The `var`-in-loop closure bug is fixed by using | A) `const` on the array B) `let` for the loop variable C) `forEach` D) `while` | **B** |

---

# DAY 10 — JavaScript Fundamentals 3: Functions & Scope

**Module:** `JS-CORE` | **Duration:** 7 h | **Lesson Code:** `JS-D10`

### Learning Objectives
- Write function declarations, expressions, and arrow functions
- Understand parameters, arguments, defaults, rest, and spread
- Explain scope, hoisting, closures, and `this`
- Apply pure functions and single-responsibility design

### 10.1 Function Forms

**Declaration**

```javascript
function add(a, b) {
  return a + b;
}
```

**Expression**

```javascript
const add = function (a, b) {
  return a + b;
};
```

**Named function expression (better stack traces)**

```javascript
const add = function addFn(a, b) {
  return a + b;
};
```

**Arrow**

```javascript
const add = (a, b) => a + b;
const square = n => n * n;
const log = msg => { console.log(msg); };
const makeObj = () => ({ ok: true });   // parentheses needed for object literal
```

**Immediately Invoked Function Expression (IIFE)**

```javascript
(function () {
  const secret = "private";
  console.log("runs immediately");
})();
```

**Async function**

```javascript
async function fetchUser(id) {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
}
```

### 10.2 Parameters & Arguments

```javascript
function greet(name) {          // name = parameter
  return `Hi, ${name}`;
}
greet("Asha");                   // "Asha" = argument
```

**Missing / extra arguments**

```javascript
function add(a, b) { return a + b; }
add(1);          // NaN  (b is undefined)
add(1, 2, 3);    // 3    (extra ignored)

// Always guard:
function add(a = 0, b = 0) { return a + b; }
```

**Default parameters**

```javascript
function createUser(name, role = "intern", active = true) {
  return { name, role, active };
}
createUser("Asha");                     // role: "intern", active: true
createUser("Ravi", "mentor");           // role: "mentor"
createUser("Meena", undefined, false);  // role: "intern", active: false
```

⚠️ Defaults only apply for `undefined`, **not** `null`.

**Rest parameters**

```javascript
function sum(...nums) {
  return nums.reduce((t, n) => t + n, 0);
}
sum(1, 2, 3, 4);   // 10
sum();             // 0

function log(level, ...messages) {
  console.log(`[${level}]`, ...messages);
}
log("INFO", "server", "started");   // [INFO] server started
```

> Rest must be the **last** parameter.

**Arguments object (legacy — avoid)**

```javascript
function old() {
  console.log(arguments);  // array-like, not a real array
  console.log([...arguments]);  // convert to array
}
```

### 10.3 Return Values

```javascript
function divide(a, b) {
  if (b === 0) return null;     // early return
  return a / b;
}

function noReturn() {}
noReturn();   // undefined

// Return multiple values via object/array
function minMax(arr) {
  return { min: Math.min(...arr), max: Math.max(...arr) };
}
const { min, max } = minMax([3, 8, 1, 9]);

// Return a function
function multiplier(factor) {
  return (n) => n * factor;
}
const double = multiplier(2);
double(5);    // 10
```

**Early return improves readability**

```javascript
function processOrder(order) {
  if (!order) return { error: "No order" };
  if (!order.items?.length) return { error: "Empty order" };
  if (!order.customer) return { error: "No customer" };

  const total = order.items.reduce((t, i) => t + i.price * i.qty, 0);
  return { total, ok: true };
}
```

### 10.4 Arrow Functions vs Regular Functions

| Feature | Regular | Arrow |
|---|---|---|
| `this` binding | Dynamic | Lexical (inherits from enclosing scope) |
| `arguments` object | ✅ | ❌ |
| Can be constructor (`new`) | ✅ | ❌ |
| `prototype` property | ✅ | ❌ |
| Hoisting | Declarations hoist | Not hoisted |
| Implicit return | ❌ | ✅ (single expression) |
| Best for | Methods, constructors | Callbacks, short functions |

```javascript
const timer = {
  seconds: 0,
  start() {
    setInterval(() => {
      this.seconds++;       // ✅ arrow inherits `this` from start()
    }, 1000);
  },
};

const timer2 = {
  seconds: 0,
  start() {
    setInterval(function () {
      this.seconds++;       // ❌ `this` is window/undefined
    }, 1000);
  },
};
```

### 10.5 Scope

**Types**

```
Global Scope
  └── Function Scope (var)
        └── Block Scope (let, const inside { })
```

```javascript
const globalVar = "global";         // global scope

function outer() {
  const outerVar = "outer";         // function scope

  if (true) {
    const blockVar = "block";       // block scope
    var functionScoped = "var";     // function scope (leaks out of the block)
    console.log(globalVar, outerVar, blockVar);  // ✅ all accessible
  }

  console.log(functionScoped);      // ✅ "var" — var is function-scoped
  // console.log(blockVar);         // ❌ ReferenceError
}

// console.log(outerVar);            // ❌ ReferenceError
```

**Scope chain**

```javascript
const a = 1;
function f1() {
  const b = 2;
  function f2() {
    const c = 3;
    console.log(a, b, c);   // 1 2 3 — walks up the chain
  }
  f2();
}
f1();
```

**Shadowing**

```javascript
const name = "global";
function demo() {
  const name = "local";    // shadows the global
  console.log(name);       // "local"
}
demo();
console.log(name);         // "global"
```

### 10.6 Closures

A **closure** is a function that remembers variables from the scope where it was created, even after that scope has returned.

```javascript
function counter() {
  let count = 0;
  return {
    increment: () => ++count,
    decrement: () => --count,
    value: () => count,
  };
}

const c = counter();
c.increment();   // 1
c.increment();   // 2
c.decrement();   // 1
c.value();       // 1
// `count` is private — cannot be accessed externally
```

**Practical closures**

```javascript
// Once
function once(fn) {
  let called = false;
  let result;
  return (...args) => {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  };
}
const init = once(() => console.log("init once"));
init(); init(); init();   // logs once

// Debounce
function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
const onSearch = debounce((q) => console.log("search:", q), 400);

// Memoize
function memoize(fn) {
  const cache = new Map();
  return (n) => {
    if (!cache.has(n)) cache.set(n, fn(n));
    return cache.get(n);
  };
}
const slowSquare = memoize((n) => { 
  for (let i=0;i<1e7;i++){} 
  return n*n; 
});
```

### 10.7 Hoisting

```javascript
// Function declarations are fully hoisted
sayHi();                       // ✅ works
function sayHi() { console.log("hi"); }

// Function expressions are not
sayBye();                      // ❌ TypeError: sayBye is not a function
var sayBye = function () {};

// Arrow functions are not
sayHello();                    // ❌ ReferenceError (TDZ)
const sayHello = () => {};

// var is hoisted as undefined
console.log(x);                // undefined
var x = 5;

// let/const are in TDZ
console.log(y);                // ❌ ReferenceError
let y = 5;
```

### 10.8 Pure Functions

A **pure** function:
1. Given the same input, always returns the same output.
2. Has no side effects (no mutation of external state, no I/O, no `Math.random()`).

```javascript
// ✅ Pure
function addTax(amount, rate = 0.18) {
  return amount * (1 + rate);
}

// ❌ Impure — mutates external state
let total = 0;
function addToTotal(n) { total += n; }

// ❌ Impure — random
function randomId() { return Math.random(); }

// ✅ Refactor impure → pure
function addItem(cart, item) {
  return [...cart, item];   // returns a new array
}
```

**Why pure matters:** easier to test, reason about, parallelize, and memoize.

### 10.9 Higher-Order Functions

A function that takes and/or returns a function.

```javascript
// Takes a function
function repeat(n, action) {
  for (let i = 0; i < n; i++) action(i);
}
repeat(3, i => console.log("step", i));

// Returns a function
const withLogging = (fn) => (...args) => {
  console.log("calling with", args);
  const result = fn(...args);
  console.log("returned", result);
  return result;
};
const loggedAdd = withLogging(add);
loggedAdd(2, 3);

// Composition
const compose = (...fns) => (x) => fns.reduceRight((acc, fn) => fn(acc), x);
const pipe    = (...fns) => (x) => fns.reduce((acc, fn) => fn(acc), x);

const process = pipe(
  (s) => s.trim(),
  (s) => s.toLowerCase(),
  (s) => s.replaceAll(" ", "-"),
);
process("  Hello World  ");   // "hello-world"
```

### 10.10 Currying & Partial Application

```javascript
// Curried
const add = (a) => (b) => (c) => a + b + c;
add(1)(2)(3);   // 6

// Practical
const log = (level) => (module) => (msg) =>
  console.log(`[${level}][${module}] ${msg}`);

const errorIn = log("ERROR");
const errorInAuth = errorIn("AUTH");
errorInAuth("Invalid token");

// Partial application
const multiply = (a, b) => a * b;
const double = multiply.bind(null, 2);
double(5);   // 10
```

### 10.11 Recursion

```javascript
function factorial(n) {
  if (n <= 1) return 1;             // base case — REQUIRED
  return n * factorial(n - 1);
}
factorial(5);   // 120

function fib(n, memo = {}) {
  if (n < 2) return n;
  if (memo[n]) return memo[n];
  return (memo[n] = fib(n - 1, memo) + fib(n - 2, memo));
}

function flatten(arr) {
  return arr.reduce(
    (flat, item) => flat.concat(Array.isArray(item) ? flatten(item) : item),
    []
  );
}
flatten([1, [2, [3, [4]]]]);   // [1,2,3,4]
```

⚠️ Every recursion needs a **base case** or you get a stack overflow.

### 10.12 Function Design Rules

| Rule | Why |
|---|---|
| One job per function | Testable, reusable |
| ≤ 20 lines | Readable at a glance |
| ≤ 3 parameters (or use an options object) | Call sites stay clear |
| Descriptive verb names | `calculateTotal`, not `calc` |
| Return early, avoid nesting | Reduces cognitive load |
| Prefer pure functions | Predictable |
| No hidden side effects | Debuggable |
| JSDoc for public functions | Documentation |

```javascript
/**
 * Calculates the total price of cart items including tax.
 * @param {Array<{price:number, qty:number}>} items - Cart items.
 * @param {number} [taxRate=0.18] - Tax rate as a decimal.
 * @returns {number} Total price rounded to 2 decimals.
 * @throws {TypeError} If items is not an array.
 */
function calculateTotal(items, taxRate = 0.18) {
  if (!Array.isArray(items)) throw new TypeError("items must be an array");
  const subtotal = items.reduce((t, i) => t + i.price * i.qty, 0);
  return Number((subtotal * (1 + taxRate)).toFixed(2));
}
```

---

### 🧪 DAY 10 TASK — `D10-T1`

**Deliverable:** `day10/` with 5 files.

**1. `function-forms.js`**
Implement the same `calculateArea(shape, ...dims)` in 4 forms (declaration, expression, arrow, IIFE-wrapped). Print results from all 4.

**2. `closures-lab.js`**
Implement and demo:
- `counter()` — increment/decrement/value
- `once(fn)`
- `debounce(fn, delay)`
- `throttle(fn, limit)`
- `memoize(fn)`
- `createIdGenerator(prefix)` — returns `next()` producing `USR-0001`
- `createBankAccount(initial)` — with `deposit`, `withdraw`, `balance` and overdraft protection

**3. `higher-order.js`**
Implement without using built-in array methods:
- `myMap(arr, fn)`
- `myFilter(arr, fn)`
- `myReduce(arr, fn, initial)`
- `pipe(...fns)` and `compose(...fns)`
- `curry(fn)` — converts `f(a,b,c)` to `f(a)(b)(c)`
- `partial(fn, ...preset)`

Then verify `myMap([1,2,3], n => n*2)` matches `[1,2,3].map(n => n*2)`.

**4. `recursion.js`**
Implement recursively (no loops):
- `factorial(n)`
- `fibonacci(n)` with memoization
- `sumArray(arr)`
- `flatten(arr)`
- `deepClone(obj)`
- `reverseString(str)`
- `binarySearch(arr, target, low, high)`
- `power(base, exp)` (fast exponentiation)
- `gcd(a, b)`
- `permutations(str)`

**5. `pure-refactor.js`**
You are given 8 impure functions (mutating globals, using `Math.random`, logging inside). Rewrite each as a pure function. Add a `TEST_NOTES.md` explaining what made each impure and how you fixed it.

**Bonus:** Write a `compose` pipeline that turns a raw user object into a formatted display string in 5 steps.

---

### ❓ DAY 10 QUIZ — `D10-Q` (5 Questions)

| # | Question | Options | Answer |
|---|---|---|---|
| 1 | A function without `return` gives | A) null B) 0 C) undefined D) NaN | **C** |
| 2 | Arrow functions differ from regular in | A) Speed B) `this` binding C) Return type D) Syntax only | **B** |
| 3 | Closures allow | A) Faster code B) A function to remember its lexical scope C) Global variables D) Async code | **B** |
| 4 | `...nums` in a function parameter list is | A) Spread B) Rest C) Destructuring D) Default | **B** |
| 5 | A pure function | A) Mutates globals B) Same input → same output, no side effects C) Is always async D) Uses `this` | **B** |

---

# DAY 11 — JavaScript Fundamentals 4: Arrays & Array Methods

**Module:** `JS-CORE` | **Duration:** 7 h | **Lesson Code:** `JS-D11`

### Learning Objectives
- Create, access, and mutate arrays confidently
- Master `map`, `filter`, `reduce`, `find`, `some`, `every`, `sort`
- Chain array methods for real data transformation
- Know which methods mutate and which return new arrays

### 11.1 Creating Arrays

```javascript
const nums = [1, 2, 3, 4, 5];
const empty = [];
const mixed = [1, "two", true, null, { a: 1 }, [1, 2]];

// From
Array.from("abc");                        // ["a","b","c"]
Array.from({ length: 5 }, (_, i) => i + 1); // [1,2,3,4,5]
Array.from(new Set([1,1,2,3]));           // [1,2,3]

// Of
Array.of(7);        // [7]
Array.of(1, 2, 3);  // [1,2,3]

// Fill
new Array(5).fill(0);        // [0,0,0,0,0]
[1,2,3,4].fill(0, 1, 3);     // [1,0,0,4]

// Spread
const copy = [...nums];
const merged = [...nums, ...[6, 7]];
const chars = [..."hello"];   // ["h","e","l","l","o"]
```

### 11.2 Access & Update

```javascript
const arr = [10, 20, 30, 40, 50];

arr[0];              // 10
arr[arr.length - 1]; // 50
arr.at(-1);          // 50  (modern)
arr.at(-2);          // 40
arr.length;          // 5
arr[10];             // undefined (no error)
arr[0] = 99;         // mutate

// Destructuring
const [first, second, ...rest] = arr;
// first=10, second=20, rest=[30,40,50]

const [, , third] = arr;   // third = 30
const [a = 1, b = 2] = []; // defaults
```

### 11.3 Mutating Methods

```javascript
const a = [1, 2, 3];

// push — add to end, returns new length
a.push(4);            // a = [1,2,3,4], returns 4

// pop — remove from end, returns removed
a.pop();              // a = [1,2,3], returns 4

// unshift — add to start, returns new length
a.unshift(0);         // a = [0,1,2,3], returns 4

// shift — remove from start, returns removed
a.shift();            // a = [1,2,3], returns 0

// splice(start, deleteCount, ...items)
const b = [1,2,3,4,5];
b.splice(1, 2);           // removes index 1,2 → b = [1,4,5]
b.splice(1, 0, 2, 3);     // inserts at 1 → [1,2,3,4,5]
b.splice(-1, 1, 99);      // replace last → [1,2,3,4,99]

// reverse
[1,2,3].reverse();        // [3,2,1] (mutates)

// sort
["b","a","c"].sort();     // ["a","b","c"]
[40,100,5,25].sort();     // [100,25,40,5] ⚠️ string sort
[40,100,5,25].sort((a,b) => a - b);  // [5,25,40,100]

// fill
[1,2,3,4].fill(0, 1, 3);  // [1,0,0,4]

// copyWithin
[1,2,3,4,5].copyWithin(0, 3);  // [4,5,3,4,5]
```

### 11.4 Non-Mutating Methods

```javascript
const arr = [1, 2, 3, 4, 5];

// slice(start, end) — end exclusive
arr.slice(1, 3);      // [2,3]
arr.slice(-2);        // [4,5]
arr.slice();          // shallow copy

// concat
[1,2].concat([3,4]);  // [1,2,3,4]

// join
["a","b","c"].join("-");   // "a-b-c"
[1,2,3].join("");          // "123"

// includes
arr.includes(3);           // true
arr.includes(6);           // false

// indexOf / lastIndexOf
arr.indexOf(3);            // 2
arr.lastIndexOf(3);        // 2

// flat / flatMap
[1,[2,[3,[4]]]].flat();       // [1,2,[3,[4]]]
[1,[2,[3,[4]]]].flat(2);      // [1,2,3,[4]]
[1,[2,[3,[4]]]].flat(Infinity);// [1,2,3,4]
[1,2,3].flatMap(n => [n, n*2]); // [1,2,2,4,3,6]

// toSorted, toReversed, toSpliced (ES2023)
arr.toSorted((a,b) => b - a); // non-mutating sort
arr.toReversed();             // non-mutating reverse

// Array.isArray
Array.isArray([]);            // true
```

### 11.5 The Big Five

**`map` — transform (same length)**

```javascript
[1,2,3].map(n => n * 2);                // [2,4,6]
users.map(u => u.name);                 // ["Asha","Ravi"]
users.map((u, i) => ({ ...u, rank: i+1 }));
```

**`filter` — keep matching (shorter or equal)**

```javascript
[1,2,3,4,5].filter(n => n % 2 === 0);   // [2,4]
users.filter(u => u.age >= 18);
users.filter(u => u.role === "admin" && u.active);
```

**`reduce` — collapse to one value**

```javascript
[1,2,3,4].reduce((sum, n) => sum + n, 0);   // 10

// Count occurrences
["a","b","a","c","a"].reduce((acc, x) => {
  acc[x] = (acc[x] || 0) + 1;
  return acc;
}, {});   // { a:3, b:1, c:1 }

// Group by
users.reduce((acc, u) => {
  (acc[u.dept] ??= []).push(u.name);
  return acc;
}, {});

// Max
[3,9,2,7].reduce((max, n) => (n > max ? n : max));

// Flatten
[[1,2],[3,4]].reduce((flat, arr) => [...flat, ...arr], []);

// Unique
[...new Set([1,2,2,3,3,3])];   // [1,2,3]

// Sum of object property
items.reduce((t, i) => t + i.price * i.qty, 0);
```

**`find` — first match (or `undefined`)**

```javascript
users.find(u => u.id === 3);
users.find(u => u.email === "x@y.com");
```

**`findIndex`, `findLast`, `findLastIndex`**

```javascript
[1,2,3,4].findIndex(n => n > 2);       // 2
[1,2,3,4].findLast(n => n < 4);        // 3
[1,2,3,4].findLastIndex(n => n < 4);   // 2
```

**`some` / `every`**

```javascript
[1,2,3].some(n => n > 2);    // true  — at least one
[1,2,3].every(n => n > 0);   // true  — all
[].every(n => n > 0);        // true  (vacuous truth)
[].some(n => n > 0);         // false
```

### 11.6 Iteration

```javascript
const arr = ["a", "b", "c"];

// for…of (supports break/continue)
for (const item of arr) console.log(item);
for (const [i, item] of arr.entries()) console.log(i, item);
for (const i of arr.keys()) console.log(i);
for (const v of arr.values()) console.log(v);

// forEach (no break)
arr.forEach((item, i, arr) => console.log(item, i));

// Classic for (fastest, full control)
for (let i = 0; i < arr.length; i++) {}
```

### 11.7 Sorting in Depth

```javascript
// Numbers ascending / descending
nums.sort((a, b) => a - b);
nums.sort((a, b) => b - a);

// Strings
names.sort((a, b) => a.localeCompare(b));

// Objects by a property
users.sort((a, b) => a.age - b.age);
users.sort((a, b) => a.name.localeCompare(b.name));

// Multiple keys
users.sort((a, b) =>
  a.dept.localeCompare(b.dept) || b.salary - a.salary
);

// Stable sort (ES2019+ guarantees stability)
// Non-mutating
const sorted = [...users].sort((a, b) => a.age - b.age);
const sorted2 = users.toSorted((a, b) => a.age - b.age);
```

### 11.8 Method Chaining

```javascript
const orders = [
  { id: 1, customer: "Asha",  items: 3, total: 1500, status: "paid" },
  { id: 2, customer: "Ravi",  items: 1, total:  400, status: "pending" },
  { id: 3, customer: "Meena", items: 5, total: 3200, status: "paid" },
  { id: 4, customer: "Karan", items: 2, total:  900, status: "cancelled" },
  { id: 5, customer: "Divya", items: 4, total: 2100, status: "paid" },
];

const report = orders
  .filter(o => o.status === "paid")                   // 3 orders
  .map(o => ({ ...o, avg: o.total / o.items }))       // add avg
  .sort((a, b) => b.total - a.total)                  // biggest first
  .slice(0, 2)                                        // top 2
  .map(o => `${o.customer}: ₹${o.total}`);            // format

// ["Meena: ₹3200", "Divya: ₹2100"]

const summary = {
  totalRevenue: orders
    .filter(o => o.status === "paid")
    .reduce((t, o) => t + o.total, 0),
  orderCount: orders.length,
  paidCount: orders.filter(o => o.status === "paid").length,
  avgOrderValue:
    orders.reduce((t, o) => t + o.total, 0) / orders.length,
  topCustomer:
    orders.reduce((a, b) => (b.total > a.total ? b : a)).customer,
  hasCancelled: orders.some(o => o.status === "cancelled"),
  allPaid: orders.every(o => o.status === "paid"),
};
```

### 11.9 Arrays of Objects — Real Patterns

```javascript
const employees = [
  { id: 1, name: "Asha",  dept: "Dev", salary: 60000, skills: ["JS","React"] },
  { id: 2, name: "Ravi",  dept: "QA",  salary: 45000, skills: ["Jest"] },
  { id: 3, name: "Meena", dept: "Dev", salary: 75000, skills: ["JS","Node"] },
  { id: 4, name: "Karan", dept: "HR",  salary: 40000, skills: [] },
];

// Search across fields
const search = (q) =>
  employees.filter(e =>
    e.name.toLowerCase().includes(q.toLowerCase()) ||
    e.dept.toLowerCase().includes(q.toLowerCase())
  );

// Group by department with aggregates
const byDept = employees.reduce((acc, e) => {
  const g = (acc[e.dept] ??= { count: 0, total: 0, members: [] });
  g.count++;
  g.total += e.salary;
  g.members.push(e.name);
  return acc;
}, {});

// Add computed fields
const enriched = employees.map(e => ({
  ...e,
  monthly: (e.salary / 12).toFixed(2),
  senior: e.salary > 60000,
}));

// Update one item immutably
const updated = employees.map(e =>
  e.id === 3 ? { ...e, salary: 80000 } : e
);

// Remove one item immutably
const removed = employees.filter(e => e.id !== 2);

// Sort by multiple criteria
const ranked = [...employees].sort((a, b) =>
  b.salary - a.salary || a.name.localeCompare(b.name)
);

// Unique values
const depts = [...new Set(employees.map(e => e.dept))];

// Flat map skills
const allSkills = [...new Set(employees.flatMap(e => e.skills))];

// Pivot: dept → { avg, max, min }
const stats = employees.reduce((acc, e) => {
  const s = (acc[e.dept] ??= { salaries: [] });
  s.salaries.push(e.salary);
  return acc;
}, {});
Object.entries(stats).forEach(([dept, { salaries }]) => {
  stats[dept] = {
    avg: salaries.reduce((t,n) => t+n, 0) / salaries.length,
    max: Math.max(...salaries),
    min: Math.min(...salaries),
    count: salaries.length,
  };
});
```

### 11.10 Performance Notes

| Operation | Complexity |
|---|---|
| `arr[i]` access | O(1) |
| `push` / `pop` | O(1) |
| `shift` / `unshift` | O(n) |
| `includes` / `indexOf` | O(n) |
| `find` / `filter` / `map` | O(n) |
| `sort` | O(n log n) |
| `Set.has()` lookup | O(1) |

**Tip:** for frequent membership checks on a large array, convert to a `Set`.

```javascript
// ❌ O(n) per lookup
const has = bigArray.includes(id);

// ✅ O(1) per lookup
const idSet = new Set(bigArray);
const has2 = idSet.has(id);
```

---

### 🧪 DAY 11 TASK — `D11-T1`

**Deliverable:** `day11/` with 4 files using the provided dataset.

**Dataset**

```javascript
const products = [
  { id: 1,  name: "Laptop",     category: "Electronics", price: 55000, qty: 12, rating: 4.5, tags: ["work","premium"] },
  { id: 2,  name: "Mouse",      category: "Electronics", price: 700,   qty: 120, rating: 4.2, tags: ["work"] },
  { id: 3,  name: "Keyboard",   category: "Electronics", price: 2500,  qty: 45, rating: 4.0, tags: ["work"] },
  { id: 4,  name: "Notebook",   category: "Stationery",  price: 60,    qty: 500, rating: 3.8, tags: ["study"] },
  { id: 5,  name: "Pen Pack",   category: "Stationery",  price: 150,   qty: 300, rating: 4.1, tags: ["study"] },
  { id: 6,  name: "Monitor",    category: "Electronics", price: 18000, qty: 8,  rating: 4.6, tags: ["premium","work"] },
  { id: 7,  name: "Desk Lamp",  category: "Furniture",   price: 1200,  qty: 30, rating: 4.3, tags: ["study"] },
  { id: 8,  name: "Chair",      category: "Furniture",   price: 8500,  qty: 15, rating: 4.7, tags: ["premium","work"] },
  { id: 9,  name: "Backpack",   category: "Accessories", price: 2200,  qty: 60, rating: 4.4, tags: ["travel"] },
  { id: 10, name: "Water Bottle",category:"Accessories", price: 450,   qty: 200,rating: 4.0, tags: ["travel"] },
];
```

**1. `basics.js`**
Demonstrate every non-mutating method: `slice`, `concat`, `join`, `includes`, `indexOf`, `flat`, `flatMap`, `at`, `toSorted`, `toReversed`. Print before/after arrays to prove the original is unchanged.

**2. `big-five.js`**
Using only `map` / `filter` / `reduce` / `find` / `some` / `every`:
- Names of all Electronics
- Total inventory value (`price × qty` for all)
- Products under ₹1000
- The highest-rated product
- Average price per category
- Product count per category
- Unique categories
- Unique tags
- Products with rating ≥ 4.5 AND qty < 20
- Most expensive item in each category
- Are all products rated ≥ 3.5?
- Is any product out of stock (`qty === 0`)?

**3. `report.js`**
Generate a full inventory report:
```javascript
{
  totalProducts, totalValue, averagePrice, averageRating,
  byCategory: {
    Electronics: { count, totalValue, avgPrice, avgRating, topProduct },
    ...
  },
  topFiveByValue: [ ... ],
  lowStock: [ ... ],       // qty < 20
  premiumItems: [ ... ],   // tags include "premium"
  priceBands: { "<500": n, "500-5000": n, ">5000": n },
  tagFrequency: { work: 5, study: 3, ... }
}
```

**4. `mini-library.js`**
Implement a `ProductStore` object with closure-based state:
- `getAll()`, `getById(id)`, `search(q)`, `filterBy({category, minPrice, maxPrice, minRating, tags})`
- `sortBy(field, order)`
- `add(product)`, `update(id, changes)`, `remove(id)`
- `stats()` — returns the report object
- All update methods must be **immutable** (return new state)

**Bonus:** Implement `paginate(array, page, perPage)` returning `{ data, page, totalPages, hasNext, hasPrev }`.

---

### ❓ DAY 11 QUIZ — `D11-Q` (5 Questions)

| # | Question | Options | Answer |
|---|---|---|---|
| 1 | Which method mutates the original array? | A) `map` B) `filter` C) `push` D) `slice` | **C** |
| 2 | `[1,2,3].map(n => n * 2)` returns | A) [1,2,3] B) [2,4,6] C) 12 D) [1,4,9] | **B** |
| 3 | `[1,2,3,4].filter(n => n % 2)` returns | A) [2,4] B) [1,3] C) [1,2,3,4] D) 4 | **B** |
| 4 | `[1,2,3].reduce((t,n) => t+n, 0)` returns | A) "123" B) 6 C) 3 D) [6] | **B** |
| 5 | `[40,100,5].sort()` default result is | A) [5,40,100] B) [100,40,5] C) [40,5,100] D) [100,5,40] | **B** |

---

# DAY 12 — JavaScript Fundamentals 5: Objects, JSON & Destructuring

**Module:** `JS-CORE` | **Duration:** 7 h | **Lesson Code:** `JS-D12`

### Learning Objectives
- Create and manipulate objects with all patterns
- Use destructuring, spread, and computed properties
- Master `Object` static methods
- Serialise and parse JSON safely
- Understand reference vs value semantics

### 12.1 Creating Objects

```javascript
// Literal (preferred)
const user = {
  id: 1,
  name: "Asha",
  email: "asha@ethiroli.com",
  address: { city: "Chennai", pincode: "600001" },
  hobbies: ["reading", "coding"],
  isActive: true,
  greet() { return `Hi, I'm ${this.name}`; },
};

// new Object()
const o1 = new Object();

// Constructor function
function User(name, email) {
  this.name = name;
  this.email = email;
}
const u = new User("Ravi", "ravi@x.com");

// Object.create
const proto = { greet() { return "hi"; } };
const child = Object.create(proto);
child.name = "Meena";

// Class (modern)
class Employee {
  constructor(name, salary) {
    this.name = name;
    this.salary = salary;
  }
  raise(pct) { this.salary *= 1 + pct / 100; return this.salary; }
  get monthly() { return this.salary / 12; }
  static create(...args) { return new Employee(...args); }
}
```

### 12.2 Accessing Properties

```javascript
user.name;                 // dot notation
user["email"];             // bracket notation
const key = "isActive";
user[key];                 // dynamic access

user.address.city;         // nested
user.hobbies[0];           // array inside object
user.greet();              // method call

user.phone;                // undefined (no error)
user.address?.zip;         // undefined (safe)
user.getName?.();          // undefined (safe call)
```

### 12.3 Adding / Updating / Deleting

```javascript
user.phone = "9876543210";      // add
user.name = "Asha R";           // update
delete user.isActive;           // delete

"email" in user;                // true
user.hasOwnProperty("email");   // true
Object.hasOwn(user, "email");   // true (modern)
```

### 12.4 Object Methods & `this`

```javascript
const account = {
  owner: "Asha",
  balance: 1000,

  deposit(amount) {
    this.balance += amount;
    return this.balance;
  },

  withdraw(amount) {
    if (amount > this.balance) throw new Error("Insufficient funds");
    this.balance -= amount;
    return this.balance;
  },

  get summary() {              // getter
    return `${this.owner}: ₹${this.balance}`;
  },

  set ownerName(name) {        // setter
    if (!name) throw new Error("Name required");
    this.owner = name;
  },
};

account.deposit(500);      // 1500
account.summary;           // "Asha: ₹1500"
account.ownerName = "Ravi";
```

**`this` rules**

| Call style | `this` |
|---|---|
| `obj.method()` | `obj` |
| `fn()` (non-strict) | `global` / `window` |
| `fn()` (strict / module) | `undefined` |
| `new Fn()` | the new instance |
| `fn.call(x)` | `x` |
| `fn.apply(x, args)` | `x` |
| `fn.bind(x)()` | `x` (permanently) |
| Arrow function | inherited lexically |

```javascript
function whoAmI() { console.log(this?.name ?? "no name"); }

const a = { name: "A", whoAmI };
const b = { name: "B", whoAmI };

a.whoAmI();            // "A"
b.whoAmI();            // "B"
whoAmI();              // "no name" (undefined in module)
whoAmI.call({ name: "C" });   // "C"
const bound = whoAmI.bind({ name: "D" });
bound();               // "D"
```

> **`bind` cannot be overridden** — once bound, always bound.

### 12.5 Destructuring

**Object destructuring**

```javascript
const { name, email } = user;
const { name: userName } = user;                    // rename
const { name = "Guest" } = {};                      // default
const { address: { city } } = user;                 // nested
const { address: { city: town = "Unknown" } = {} } = user;

// In function params
function print({ name, email, role = "intern" }) {
  console.log(name, email, role);
}
print(user);

// In loops
for (const { name, salary } of employees) console.log(name, salary);

// Swapping
let x = 1, y = 2;
[x, y] = [y, x];
```

**Array destructuring**

```javascript
const [a, b, ...rest] = [1, 2, 3, 4, 5];
const [, , third] = arr;
const [first = 0] = [];
```

### 12.6 Spread & Rest with Objects

```javascript
const defaults = { theme: "light", lang: "en", notifications: true };
const userPrefs = { theme: "dark" };

const settings = { ...defaults, ...userPrefs };
// { theme:"dark", lang:"en", notifications:true }

// Shallow clone
const clone = { ...user };

// Add / override while cloning
const updated = { ...user, name: "New Name", updatedAt: Date.now() };

// Remove a key (immutably)
const { isActive, ...rest } = user;   // rest has everything except isActive

// Merge nested (manual — spread is shallow)
const merged = {
  ...user,
  address: { ...user.address, pincode: "600002" },
};

// Rest in function params
function log({ level, ...meta }) {
  console.log(level, meta);
}
```

⚠️ **Spread is shallow** — nested objects/arrays are shared by reference.

```javascript
const a = { nested: { x: 1 } };
const b = { ...a };
b.nested.x = 99;
console.log(a.nested.x);   // 99 ⚠️

// Deep clone options
const deep1 = structuredClone(a);           // modern, preferred
const deep2 = JSON.parse(JSON.stringify(a)); // loses Date, Map, Set, undefined
```

### 12.7 Computed Properties & Shortcuts

```javascript
const key = "role";
const value = "admin";

const obj = {
  [key]: value,              // computed → { role: "admin" }
  [`${key}_id`]: 1,          // { role_id: 1 }
};

// Property shorthand
const name = "Asha", age = 25;
const person = { name, age };   // { name: "Asha", age: 25 }

// Method shorthand
const tools = {
  log(msg) { console.log(msg); },   // instead of log: function() {}
};
```

### 12.8 Object Static Methods

```javascript
const obj = { a: 1, b: 2, c: 3 };

Object.keys(obj);         // ["a","b","c"]
Object.values(obj);       // [1,2,3]
Object.entries(obj);      // [["a",1],["b",2],["c",3]]
Object.fromEntries([["a",1],["b",2]]);   // { a:1, b:2 }

Object.assign({}, obj, { d: 4 });        // merge (mutates target)
Object.freeze(obj);                      // immutable (shallow)
Object.isFrozen(obj);                    // true
Object.seal(obj);                        // no add/delete, can update
Object.isSealed(obj);

Object.hasOwn(obj, "a");                 // true
Object.getPrototypeOf(obj);
Object.create(proto);

// Iterate
for (const [k, v] of Object.entries(obj)) console.log(k, v);

// Group (ES2024)
Object.groupBy(users, u => u.dept);

// Convert to Map
const map = new Map(Object.entries(obj));
```

### 12.9 JSON

**Stringify**

```javascript
const user = {
  id: 1,
  name: "Asha",
  joined: new Date("2024-06-15"),
  greet() { return "hi"; },     // functions are dropped
  temp: undefined,              // dropped
};

JSON.stringify(user);
// '{"id":1,"name":"Asha","joined":"2024-06-15T00:00:00.000Z"}'

// Pretty print
JSON.stringify(user, null, 2);

// Filter keys
JSON.stringify(user, ["id", "name"]);

// Custom replacer
JSON.stringify(user, (key, value) =>
  typeof value === "number" ? value * 2 : value
);

// Handle circular references
const seen = new WeakSet();
JSON.stringify(obj, (k, v) => {
  if (typeof v === "object" && v !== null) {
    if (seen.has(v)) return "[Circular]";
    seen.add(v);
  }
  return v;
});
```

**Parse**

```javascript
const json = '{"id":1,"name":"Asha","roles":["admin","user"]}';
const data = JSON.parse(json);

// With reviver — restore Date objects
const withDates = JSON.parse(json, (k, v) =>
  k === "joined" ? new Date(v) : v
);

// Safe parse
function safeParse(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}
```

**JSON rules**

| Allowed | Not allowed |
|---|---|
| Strings (double quotes) | Single quotes |
| Numbers (no `NaN`/`Infinity`) | `NaN`, `Infinity` |
| `true` / `false` / `null` | `undefined` |
| Arrays | Trailing commas |
| Objects | Comments |
| — | Functions, Symbols, BigInt |

**LocalStorage with JSON**

```javascript
// Save
localStorage.setItem("user", JSON.stringify(user));

// Load
const saved = safeParse(localStorage.getItem("user"), null);

// Remove
localStorage.removeItem("user");
```

### 12.10 Reference vs Value

```javascript
// Primitives — copied by value
let a = 5;
let b = a;
b = 10;
console.log(a);   // 5 ✅

// Objects/arrays — copied by reference
let o1 = { x: 1 };
let o2 = o1;
o2.x = 99;
console.log(o1.x);  // 99 ⚠️

// Equality
{ a: 1 } === { a: 1 };         // false ⚠️ different references
[1,2] === [1,2];               // false
const shared = { a: 1 };
shared === shared;             // true

// Deep equality (manual, simple)
function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== "object" || typeof b !== "object" || !a || !b) return false;
  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every(k => deepEqual(a[k], b[k]));
}
```

### 12.11 Classes (Intro)

```javascript
class Person {
  #ssn;                              // private field

  constructor(name, age, ssn) {
    this.name = name;
    this.age = age;
    this.#ssn = ssn;
  }

  greet() { return `Hi, ${this.name}`; }
  get isAdult() { return this.age >= 18; }
  static from(obj) { return new Person(obj.name, obj.age, obj.ssn); }
}

class Employee extends Person {
  constructor(name, age, ssn, salary) {
    super(name, age, ssn);
    this.salary = salary;
  }
  greet() { return `${super.greet()} — employee`; }
  get monthly() { return this.salary / 12; }
}

const e = new Employee("Asha", 25, "123", 60000);
e.greet();        // "Hi, Asha — employee"
e.isAdult;        // true
e.monthly;        // 5000
e instanceof Person;   // true
```

---

### 🧪 DAY 12 TASK — `D12-T1`

**Deliverable:** `day12/` with 5 files.

**1. `object-basics.js`**
Create a `student` object with nested `address`, `marks` object, `hobbies` array, and 3 methods. Demonstrate: dot/bracket/dynamic access, `in`, `delete`, `Object.keys/values/entries`, `Object.hasOwn`, getters/setters, and `this` binding with `call` / `apply` / `bind`.

**2. `destructuring-drill.js`**
Given:
```javascript
const apiResponse = {
  status: 200,
  data: {
    user: { id: 1, name: "Asha", roles: ["admin", "mentor"] },
    posts: [
      { id: 101, title: "Intro", tags: ["js"] },
      { id: 102, title: "React", tags: ["react","js"] },
    ],
  },
  meta: { page: 1, total: 2 },
};
```
Extract using destructuring (in **one statement each**):
- `status` and `page`
- `name` and `id` from `data.user` (renamed `userId`)
- The first post's title
- The second post's first tag
- All post titles as an array via `map` + destructuring
- The `roles` array with `firstRole` and `restRoles`
- Every key of `meta` via `Object.entries`
- Swap two variables without a temp

**3. `json-toolkit.js`**
Implement:
- `safeStringify(obj)` — handles circular refs and functions
- `safeParse(str, fallback)`
- `flattenObject(obj, prefix)` → `{ "a.b.c": 1 }`
- `unflattenObject(flat)` → nested
- `pick(obj, keys)` and `omit(obj, keys)`
- `deepMerge(a, b)`
- `deepEqual(a, b)`
- `deepClone(obj)` (without `structuredClone`)

**4. `reference-lab.js`**
Write a script that **demonstrates** (with console output) the difference between:
- Value vs reference assignment
- Shallow vs deep clone (mutate nested and observe both)
- Object equality vs deep equality
- Frozen vs sealed vs normal objects (attempt all operations and show what fails silently / throws in strict mode)

**5. `mini-crm.js`**
Build a closure-based `createCRM()` with:
- `addContact({name, email, company, tags})`
- `getContact(id)`, `getAll()`
- `updateContact(id, changes)` — immutable
- `deleteContact(id)` — soft delete
- `search(q)`
- `filterBy({company, tags, hasEmail})`
- `groupByCompany()` → `{ "Ethiroli": [contacts] }`
- `exportJSON()` and `importJSON(str)`
- `stats()` → count, companies, most common tag

**Bonus:** Add `exportCSV()` that outputs valid CSV with header row and escaped quotes.

---

### ❓ DAY 12 QUIZ — `D12-Q` (5 Questions)

| # | Question | Options | Answer |
|---|---|---|---|
| 1 | `{...obj}` creates | A) Deep copy B) Shallow copy C) Reference D) JSON string | **B** |
| 2 | `Object.keys({x:1,y:2})` returns | A) [1,2] B) ["x","y"] C) {x,y} D) 2 | **B** |
| 3 | `JSON.stringify` drops | A) Strings B) Numbers C) Functions and `undefined` D) Booleans | **C** |
| 4 | `{a:1} === {a:1}` is | A) true B) false C) Error D) NaN | **B** |
| 5 | `structuredClone(obj)` performs | A) Shallow copy B) Deep copy C) Serialisation D) Freeze | **B** |

---

# DAY 13 — JavaScript Advanced: DOM, Events, Async, Fetch

**Module:** `JS-ADV` | **Duration:** 7 h | **Lesson Code:** `JS-D13`

### Learning Objectives
- Select and manipulate DOM elements
- Handle events with delegation and cleanup
- Explain the event loop and async patterns
- Use Promises, `async`/`await`, and `fetch`
- Persist data with `localStorage`

### 13.1 DOM Selection

```javascript
// Single element
document.getElementById("app");
document.querySelector(".card");           // first match
document.querySelector("#list > li");

// Multiple
document.querySelectorAll(".card");        // NodeList (static)
document.getElementsByClassName("card");   // HTMLCollection (live)
document.getElementsByTagName("div");

// Convert NodeList to array
const cards = [...document.querySelectorAll(".card")];

// Traversal
el.parentElement;
el.children;                 // element children
el.childNodes;               // all nodes (incl. text)
el.firstElementChild;
el.lastElementChild;
el.nextElementSibling;
el.previousElementSibling;
el.closest(".container");    // nearest ancestor matching
el.matches(".active");       // boolean test
```

### 13.2 DOM Manipulation

```javascript
// Content
el.textContent = "Plain text";              // safe, fast
el.innerHTML = "<strong>Bold</strong>";     // parses HTML ⚠️ XSS risk
el.innerText = "Visible text";              // respects CSS

// Attributes
el.getAttribute("href");
el.setAttribute("href", "/courses");
el.removeAttribute("disabled");
el.hasAttribute("required");
el.dataset.userId;                          // data-user-id
el.dataset.userId = 42;

// Classes
el.classList.add("active");
el.classList.remove("hidden");
el.classList.toggle("open");
el.classList.contains("active");
el.classList.replace("old", "new");

// Styles
el.style.color = "red";
el.style.setProperty("--brand", "#2563eb");
el.style.cssText = "color:red; padding:1rem";

// Create & insert
const div = document.createElement("div");
div.textContent = "New";
div.classList.add("card");

parent.append(div);            // end
parent.prepend(div);           // start
sibling.before(div);
sibling.after(div);
parent.insertBefore(div, ref);

// Replace & remove
old.replaceWith(newEl);
el.remove();

// Clone
const copy = el.cloneNode(true);   // deep

// Measure
el.offsetWidth; el.offsetHeight;
el.clientWidth; el.clientHeight;
el.getBoundingClientRect();   // { top, left, width, height, ... }
```

### 13.3 Safe DOM Creation

```javascript
// ❌ XSS risk
el.innerHTML = `<p>${userInput}</p>`;

// ✅ Safe
const p = document.createElement("p");
p.textContent = userInput;
el.append(p);

// ✅ Safe templating with cloning
const template = document.getElementById("card-template");
const clone = template.content.cloneNode(true);
clone.querySelector(".card__title").textContent = data.title;
container.append(clone);
```

### 13.4 Events

```javascript
const btn = document.querySelector("#submit");

// addEventListener (preferred)
function handleClick(e) {
  e.preventDefault();
  console.log(e.target, e.currentTarget);
}
btn.addEventListener("click", handleClick);

// Remove — must pass the SAME function reference
btn.removeEventListener("click", handleClick);

// Options
btn.addEventListener("click", handler, {
  once: true,       // auto-remove after first fire
  capture: true,    // capture phase
  passive: true,    // don't call preventDefault (scroll perf)
});

// Inline (avoid)
// <button onclick="doThing()">Click</button>
```

**Common events**

| Category | Events |
|---|---|
| Mouse | `click`, `dblclick`, `mousedown`, `mouseup`, `mouseenter`, `mouseleave`, `mousemove`, `contextmenu` |
| Keyboard | `keydown`, `keyup`, `keypress` |
| Form | `submit`, `reset`, `change`, `input`, `focus`, `blur`, `invalid` |
| Document | `DOMContentLoaded`, `load`, `beforeunload` |
| Window | `resize`, `scroll`, `online`, `offline` |
| Touch | `touchstart`, `touchmove`, `touchend` |
| Drag | `dragstart`, `dragover`, `drop` |
| Media | `play`, `pause`, `ended`, `timeupdate` |

**Event object**

```javascript
function handler(e) {
  e.preventDefault();          // stop default action
  e.stopPropagation();         // stop bubbling
  e.target;                    // element that triggered
  e.currentTarget;             // element with the listener
  e.type;                      // "click"
  e.key;                       // for keyboard events
  e.clientX, e.clientY;        // coordinates
  e.timeStamp;
}
```

**Event phases**

```
Capture (window → target)  →  Target  →  Bubbling (target → window)
```

**Event delegation — the professional pattern**

```javascript
// ❌ 100 listeners for 100 items
document.querySelectorAll(".item").forEach(item =>
  item.addEventListener("click", handleClick)
);

// ✅ 1 listener handles all current AND future items
document.querySelector("#list").addEventListener("click", (e) => {
  const item = e.target.closest(".item");
  if (!item) return;
  console.log("clicked:", item.dataset.id);
});
```

### 13.5 Forms in JS

```javascript
const form = document.querySelector("#signup");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(form));
  // { name: "Asha", email: "a@b.com", track: "web" }

  // Multi-value (checkboxes)
  const skills = [...form.querySelectorAll('input[name="skills"]:checked')]
    .map(cb => cb.value);

  // Validate
  const errors = validate({ ...data, skills });
  if (errors.length) {
    showErrors(errors);
    return;
  }

  submitToAPI({ ...data, skills });
});

// Live validation
form.email.addEventListener("input", (e) => {
  e.target.setCustomValidity(
    e.target.validity.typeMismatch ? "Enter a valid email" : ""
  );
});
```

### 13.6 The Event Loop

```javascript
console.log("1");

setTimeout(() => console.log("2"), 0);

Promise.resolve().then(() => console.log("3"));

console.log("4");

// Output: 1, 4, 3, 2
```

**Why?** Call stack → microtask queue (Promises) → macrotask queue (setTimeout, I/O).

```
┌──────────────┐
│  Call Stack  │  ← runs sync code
└──────┬───────┘
       │ empty?
       ▼
┌──────────────────┐
│ Microtask Queue  │  ← Promises, queueMicrotask, MutationObserver
└──────┬───────────┘
       │ empty?
       ▼
┌──────────────────┐
│  Macrotask Queue │  ← setTimeout, setInterval, I/O, UI events
└──────────────────┘
```

**JavaScript is single-threaded but non-blocking** — long tasks block the UI.

```javascript
// ❌ Blocks for ~1s
for (let i = 0; i < 1e9; i++) {}

// ✅ Yields to the event loop
function chunkWork(items, fn, chunkSize = 1000) {
  let i = 0;
  function process() {
    const end = Math.min(i + chunkSize, items.length);
    for (; i < end; i++) fn(items[i]);
    if (i < items.length) setTimeout(process, 0);
  }
  process();
}
```

### 13.7 Callbacks → Promises → Async/Await

**Callback (legacy)**

```javascript
function getUser(id, cb) {
  setTimeout(() => cb(null, { id, name: "Asha" }), 500);
}
getUser(1, (err, user) => {
  if (err) return console.error(err);
  console.log(user);
});
// Callback hell when nested
```

**Promise**

```javascript
function getUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) resolve({ id, name: "Asha" });
      else reject(new Error("Invalid ID"));
    }, 500);
  });
}

getUser(1)
  .then(user => console.log(user))
  .catch(err => console.error(err))
  .finally(() => console.log("done"));

// Combinators
Promise.all([getUser(1), getUser(2)]);       // all resolve, or rejects fast
Promise.allSettled([getUser(1), getUser(-1)]); // never rejects
Promise.race([getUser(1), timeout(2000)]);   // first to settle
Promise.any([getUser(-1), getUser(2)]);      // first to resolve
```

**Async / Await**

```javascript
async function loadDashboard(userId) {
  try {
    const user = await getUser(userId);
    const [orders, notifications] = await Promise.all([
      fetchOrders(user.id),
      fetchNotifications(user.id),
    ]);
    return { user, orders, notifications };
  } catch (err) {
    console.error("Dashboard failed:", err.message);
    throw err;
  } finally {
    hideLoader();
  }
}

// Top-level await (ES modules)
const data = await fetch("/api/data").then(r => r.json());
```

**Sequential vs parallel**

```javascript
// ❌ Slow — sequential
const a = await fetchA();
const b = await fetchB();
const c = await fetchC();   // 3× latency

// ✅ Fast — parallel
const [a2, b2, c2] = await Promise.all([fetchA(), fetchB(), fetchC()]);
```

### 13.8 Fetch API

```javascript
// GET
async function getUsers() {
  const res = await fetch("https://api.example.com/users");
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
}

// POST
async function createUser(payload) {
  const res = await fetch("https://api.example.com/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// PUT / PATCH / DELETE
await fetch(url, { method: "PUT", headers, body });
await fetch(url, { method: "PATCH", headers, body });
await fetch(url, { method: "DELETE", headers });

// Query params
const params = new URLSearchParams({ page: 1, limit: 20, q: "react" });
fetch(`/api/products?${params}`);

// With timeout
async function fetchWithTimeout(url, ms = 5000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { signal: controller.signal });
    return res.json();
  } finally {
    clearTimeout(timer);
  }
}

// File upload
const formData = new FormData();
formData.append("file", fileInput.files[0]);
formData.append("name", "resume.pdf");
await fetch("/api/upload", { method: "POST", body: formData });
// Note: do NOT set Content-Type — the browser sets the boundary
```

**Response handling**

```javascript
res.ok;          // true if status 200–299
res.status;      // 200
res.statusText;  // "OK"
res.headers.get("content-type");
await res.json();
await res.text();
await res.blob();
await res.formData();
```

### 13.9 Error Handling in Async Code

```javascript
// Global handlers
window.addEventListener("unhandledrejection", (e) => {
  console.error("Unhandled promise:", e.reason);
});
window.addEventListener("error", (e) => {
  console.error("Runtime error:", e.error);
});

// Retry with exponential backoff
async function retry(fn, attempts = 3, baseDelay = 300) {
  let lastError;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      await new Promise(r => setTimeout(r, baseDelay * 2 ** i));
    }
  }
  throw lastError;
}
```

### 13.10 LocalStorage

```javascript
// Store
localStorage.setItem("theme", "dark");
localStorage.setItem("user", JSON.stringify({ id: 1, name: "Asha" }));

// Read
const theme = localStorage.getItem("theme");
const user = JSON.parse(localStorage.getItem("user") ?? "null");

// Remove
localStorage.removeItem("theme");
localStorage.clear();

// Storage wrapper with namespacing
const store = {
  prefix: "ethiroli:",
  set(key, value) {
    localStorage.setItem(this.prefix + key, JSON.stringify(value));
  },
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(this.prefix + key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  remove(key) { localStorage.removeItem(this.prefix + key); },
  clear() {
    Object.keys(localStorage)
      .filter(k => k.startsWith(this.prefix))
      .forEach(k => localStorage.removeItem(k));
  },
};

store.set("user", { id: 1 });
store.get("user");   // { id: 1 }
```

| | `localStorage` | `sessionStorage` | Cookies |
|---|---|---|---|
| Persists after close | ✅ | ❌ | ✅ |
| Size limit | ~5 MB | ~5 MB | ~4 KB |
| Sent to server | ❌ | ❌ | ✅ |
| Accessible from JS | ✅ | ✅ | ✅ (non-HttpOnly) |

> ⚠️ Never store JWTs in `localStorage` in production — prefer HttpOnly cookies.

### 13.11 Modern JS Features

```javascript
// Optional chaining & nullish
user?.address?.city ?? "Unknown";

// Logical assignment
config.timeout ??= 5000;

// Array/Object spread
const merged = { ...a, ...b };

// Top-level await
const config = await fetch("/config.json").then(r => r.json());

// Private class fields
class Counter { #count = 0; inc() { return ++this.#count; } }

// Numeric separators
const billion = 1_000_000_000;

// Array methods
arr.at(-1);
arr.flat(Infinity);
arr.findLast(x => x > 5);
arr.toSorted();

// Object.groupBy
Object.groupBy(items, i => i.category);

// String.replaceAll
"a-b-c".replaceAll("-", "_");
```

---

### 🧪 DAY 13 TASK — `D13-T1`

**Deliverable:** `day13/` — a working **Task Manager** web app.

**Files:** `index.html`, `css/style.css`, `js/app.js`, `js/api.js`, `js/store.js`

**Core features**

1. **Add task** — title (required, min 3 chars), priority (low/medium/high), due date, category
2. **Render list** — DOM built with `createElement` (never `innerHTML` with user input)
3. **Toggle complete** — click checkbox
4. **Edit task** — inline edit with save/cancel
5. **Delete task** — with confirmation
6. **Filter** — All / Active / Completed / Overdue / High priority
7. **Search** — live search across title and category
8. **Sort** — by created, due date, priority, title
9. **Stats bar** — total, completed, pending, overdue, completion %
10. **Persist** to `localStorage` — restore on reload
11. **Empty state** — friendly message when no tasks match

**Technical requirements**

- **Event delegation**: one listener on the list container handles all item actions
- **No `innerHTML`** with user data (use `textContent` / `createElement`)
- Use `data-*` attributes for IDs
- Debounce the search input (300 ms)
- Keyboard accessible: Enter to add, Escape to cancel edit, Tab order correct
- All errors caught and shown to the user (toast or inline)
- Zero console errors

**API module (`api.js`)**

Simulate a backend with a `fakeApi` object using Promises + `setTimeout`:

```javascript
export const fakeApi = {
  getTasks: () => delay(400).then(() => loadFromLS()),
  createTask: (t) => delay(500).then(() => { /* ... */ }),
  updateTask: (id, c) => delay(400).then(() => { /* ... */ }),
  deleteTask: (id) => delay(300).then(() => { /* ... */ }),
};
```

Add a **10% random failure** to prove your error handling works. Show a retry button on failure.

**Bonus**
- Drag-and-drop reordering
- Undo last delete (5-second toast with Undo button)
- Import/export tasks as JSON
- Dark mode toggle persisted in `localStorage`
- Keyboard shortcut: `N` for new task, `/` to focus search

---

### ❓ DAY 13 QUIZ — `D13-Q` (5 Questions)

| # | Question | Options | Answer |
|---|---|---|---|
| 1 | Which is safer for user input? | A) `innerHTML` B) `textContent` C) `outerHTML` D) `document.write` | **B** |
| 2 | Output order of `console.log(1); setTimeout(()=>console.log(2),0); Promise.resolve().then(()=>console.log(3)); console.log(4);` | A) 1,2,3,4 B) 1,4,3,2 C) 1,4,2,3 D) 1,3,4,2 | **B** |
| 3 | `Promise.all` rejects when | A) All resolve B) Any one rejects C) Never D) All reject | **B** |
| 4 | Event delegation uses | A) Many listeners B) One listener on a parent + `e.target.closest()` C) Inline handlers D) `stopPropagation` | **B** |
| 5 | `res.ok` is true for status | A) 100–199 B) 200–299 C) 300–399 D) 400+ | **B** |

---

# DAY 14 — JavaScript Project Day

**Module:** `JS-ADV` | **Duration:** 7 h | **Lesson Code:** `JS-D14`

### Objective
Consolidate Days 8–13 by building a complete, polished vanilla-JS application with **no frameworks**.

### Project Options (choose ONE)

| Option | App | Key Skills |
|---|---|---|
| A | **Expense Tracker** | CRUD, filters, charts, localStorage, currency |
| B | **Quiz App** | Timer, scoring, progress, shuffle, results |
| C | **Weather Dashboard** | Fetch API, async, error states, geolocation |
| D | **Movie Search** | Fetch, debounce, pagination, favourites |
| E | **Kanban Board** | Drag & drop, state, persistence |
| F | **Notes App** | Markdown preview, search, tags, autosave |

### Mandatory Technical Requirements (all options)

1. **Modular structure** — ES modules (`import` / `export`)
   ```
   src/
   ├── index.html
   ├── css/
   │   ├── reset.css
   │   ├── variables.css
   │   └── style.css
   └── js/
       ├── main.js         # entry
       ├── state.js        # single source of truth
       ├── store.js        # localStorage persistence
       ├── api.js          # data fetching (or fake API)
       ├── ui.js           # pure render functions
       ├── events.js       # event wiring
       └── utils.js        # helpers
   ```
2. **State management** — one `state` object, one `render()` function, unidirectional flow
3. **Event delegation** for all list interactions
4. **No `innerHTML`** with user data
5. **Error handling** — try/catch around all async + a visible error UI
6. **Loading states** — skeleton or spinner
7. **Empty states** — friendly message with a CTA
8. **Input validation** with inline error messages
9. **Debounced** search/filter (300 ms)
10. **Keyboard accessible** — full tab order, Enter/Escape, focus rings
11. **Responsive** — works at 320px and 1440px
12. **Persistent** — survives reload
13. **Zero console errors/warnings**
14. **`README.md`** — features, setup, tech decisions, screenshots

### Reference Architecture

```javascript
// state.js
export const state = {
  items: [],
  filter: "all",
  search: "",
  sort: "created",
  loading: false,
  error: null,
  editingId: null,
};

export function setState(patch) {
  Object.assign(state, patch);
  render();
}

// main.js
import { state, setState } from "./state.js";
import { loadFromStorage } from "./store.js";
import { render } from "./ui.js";
import { bindEvents } from "./events.js";

async function init() {
  setState({ loading: true, error: null });
  try {
    const items = await loadFromStorage();
    setState({ items, loading: false });
  } catch (err) {
    setState({ loading: false, error: err.message });
  }
  bindEvents();
}

init();
```

### UI States to Handle

| State | UI |
|---|---|
| Loading | Skeleton placeholders / spinner |
| Error | Error banner + Retry button |
| Empty (no data) | Illustration + "Add your first item" CTA |
| Empty (filtered) | "No results for 'xyz'" + Clear filters |
| Success | Data rendered |
| Partial failure | Toast + degraded view |

### Deliverable Checklist

- [ ] All source files in the modular structure
- [ ] `README.md` with setup + feature list + screenshots
- [ ] Works offline (localStorage/fake API)
- [ ] Tested at 320 / 768 / 1440 px
- [ ] Lighthouse Performance ≥ 90, Accessibility ≥ 95
- [ ] W3C HTML validator: 0 errors
- [ ] No console errors
- [ ] Git repo with ≥ 8 conventional commits
- [ ] Pushed to GitHub with a live demo (GitHub Pages / Netlify)

### Grading Rubric (100)

| Criterion | Marks |
|---|---|
| All required features working | 30 |
| Code architecture & modularity | 15 |
| State management (single source of truth) | 10 |
| Error / loading / empty states | 10 |
| Accessibility (keyboard, ARIA, contrast) | 10 |
| Responsive design | 8 |
| Input validation | 7 |
| README quality | 5 |
| Git hygiene (commits, branches) | 5 |

---

### ❓ DAY 14 QUIZ — `D14-Q` (5 Questions)

| # | Question | Options | Answer |
|---|---|---|---|
| 1 | Single source of truth means | A) Many state copies B) One state object driving the UI C) Global variables D) No state | **B** |
| 2 | Which is a UI state you must handle? | A) Only success B) Loading, error, empty, success C) Only error D) None | **B** |
| 3 | Debouncing search prevents | A) Crashes B) A request per keystroke C) XSS D) Memory leaks | **B** |
| 4 | ES modules use | A) `require` B) `import` / `export` C) `include` D) `#include` | **B** |
| 5 | `addEventListener` with the same function reference allows | A) Faster code B) `removeEventListener` C) Delegation D) Nothing | **B** |

---

# 📅 WEEK 3 — UI/UX & REACT

---

# DAY 15 — UI/UX for Developers

**Module:** `DESIGN-UIUX` | **Duration:** 7 h | **Lesson Code:** `UX-D15`

### Learning Objectives
- Distinguish UI from UX
- Apply the design thinking process
- Build wireframes and a small design system
- Understand accessibility and usability heuristics
- Hand off designs to code accurately

### 15.1 UI vs UX

| UI (User Interface) | UX (User Experience) |
|---|---|
| Visual & interactive layer | Entire journey & feeling |
| Colours, type, spacing, buttons | Research, flows, information architecture |
| "Does it look good?" | "Does it work well for the user?" |
| Figma, design systems | Personas, journey maps, testing |

**Great product = good UX + good UI.** A beautiful app that's confusing fails; a clear app that's ugly also fails.

### 15.2 Design Thinking — 5 Stages

```
1. EMPATHISE   → understand the user (interviews, observation)
2. DEFINE      → state the real problem
3. IDEATE      → generate many solutions
4. PROTOTYPE   → build a rough version
5. TEST        → observe real users, iterate
```

### 15.3 User Research Basics

**Methods**

| Method | When | Output |
|---|---|---|
| User interviews | Early discovery | Pain points, goals |
| Surveys | Validate at scale | Quantitative data |
| Usability testing | After prototype | Friction points |
| Analytics review | Live product | Drop-off points |
| Competitor analysis | Early | Feature gaps |

**Persona template**

```
Name:       Asha, 22
Role:       Final-year CS student
Goal:       Get a job-ready portfolio in 45 days
Frustration: Tutorials that never build real projects
Tech level: Beginner–Intermediate
Device:     Android phone, occasional laptop
Quote:      "I want to build something real, not another to-do app."
```

**User journey map**

| Stage | Action | Thought | Emotion | Pain point | Opportunity |
|---|---|---|---|---|---|
| Discover | Sees Instagram ad | "Is this legit?" | Curious | No reviews visible | Add testimonials |
| Sign up | Fills form | "Too many fields" | Annoyed | 12 required fields | Reduce to 4 |
| Day 1 | Opens LMS | "Where do I start?" | Confused | No onboarding | Add guided tour |
| Project | Builds app | "This is working!" | Excited | None | Showcase on profile |
| Complete | Gets certificate | "Worth it" | Proud | Hard to share | One-click LinkedIn share |

### 15.4 Information Architecture

```
Ethiroli LMS
├── Dashboard
├── My Program
│   ├── Phase 1 — Foundation
│   ├── Phase 2 — Frontend
│   └── Phase 3 — Backend
├── Assignments
├── Projects
├── Attendance
├── Resources
├── Profile
└── Settings
```

**Rules**
- Max 3 levels deep
- Group by user mental model, not org chart
- Every screen answers: "Where am I? Where can I go? How do I get back?"

### 15.5 Wireframes

**Fidelity levels**

| Level | Detail | Tool | Time |
|---|---|---|---|
| Sketch | Pen & paper | Paper | Minutes |
| Low-fi | Boxes & labels | Figma, Balsamiq | Hours |
| Mid-fi | Real content, greyscale | Figma | Days |
| Hi-fi | Real colours, type, images | Figma | Days–weeks |

**Start low-fi. Never polish a layout you haven't validated.**

### 15.6 Layout Principles

**Visual hierarchy** — guide the eye in order of importance.

| Tool | How |
|---|---|
| Size | Bigger = more important |
| Weight | Bold draws attention |
| Colour | High contrast pops |
| Space | Isolation creates emphasis |
| Position | Top-left (LTR) is read first |
| Repetition | Consistency signals structure |

**The 8-point grid** — all spacing values are multiples of 8 (4, 8, 16, 24, 32, 48, 64).

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
}
```

**Proximity** — related items are closer together. Group with spacing, not boxes.

**Alignment** — everything aligns to a grid. Nothing floats arbitrarily.

**Contrast** — 4.5:1 minimum for body text, 3:1 for large text & UI components.

**Repetition & consistency** — same button, same card, same header everywhere.

**White space** — the fastest way to make a design look professional. Don't fear empty space.

### 15.7 Typography System

```
Display  / 48px / 800 / 1.1  → hero headline
H1       / 32px / 700 / 1.2  → page title
H2       / 24px / 700 / 1.3  → section title
H3       / 20px / 600 / 1.4  → card title
Body L   / 18px / 400 / 1.6  → lead paragraph
Body     / 16px / 400 / 1.6  → default
Body S   / 14px / 400 / 1.5  → secondary
Caption  / 12px / 500 / 1.4  → labels, meta
```

**Rules**
- Max **2 font families** (1 is often enough)
- Body line length 45–75 characters (`max-width: 65ch`)
- Line height 1.4–1.6 for body, 1.1–1.3 for headings
- Use font weight, not more fonts, for emphasis

### 15.8 Colour System

```
Primary    #2563EB   → main actions, links
Primary Hover #1D4ED8
Secondary  #7C3AED   → accents
Success    #16A34A   → confirmations
Warning    #F59E0B   → cautions
Danger     #DC2626   → destructive actions, errors
Info       #0EA5E9   → neutral notices

Neutrals
Gray 900   #111827   → primary text
Gray 700   #374151   → secondary text
Gray 500   #6B7280   → muted text
Gray 300   #D1D5DB   → borders
Gray 100   #F3F4F6   → subtle backgrounds
Gray 50    #F9FAFB   → page background
White      #FFFFFF   → cards
```

**Rules**
- 60% neutral, 30% secondary, 10% accent
- Never use colour alone to convey meaning (add icon/text)
- Test in greyscale to verify hierarchy holds

### 15.9 Component Design

**Button hierarchy**

| Type | Use | Style |
|---|---|---|
| Primary | One per screen, main action | Solid brand colour |
| Secondary | Alternative action | Outline or subtle fill |
| Tertiary / Ghost | Low emphasis | Text only |
| Destructive | Delete, remove | Red solid or outline |
| Icon | Compact actions | Square, icon only |

**Button states** — every interactive element needs: default, hover, focus-visible, active, disabled, loading.

```css
.btn {
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-weight: 500;
  transition: background 150ms ease, transform 150ms ease;
  min-height: 44px;              /* tap target */
  cursor: pointer;
}
.btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
.btn:hover  { transform: translateY(-1px); }
.btn:active { transform: translateY(0); }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
```

**Form design rules**
- Labels above inputs (faster to scan than left-aligned)
- One column — never multi-column forms
- Inline validation on blur, not on every keystroke
- Error text below the field, red, with an icon
- Required fields marked with `*` AND `aria-required`
- Placeholders are hints, never labels

### 15.10 Design System

A design system = **tokens + components + guidelines**.

```
Design System
├── Tokens
│   ├── Colour palette
│   ├── Spacing scale (8pt)
│   ├── Typography scale
│   ├── Radius scale
│   ├── Shadow scale
│   └── Motion durations
├── Components
│   ├── Button (5 variants × 6 states)
│   ├── Input / Select / Textarea
│   ├── Card
│   ├── Badge / Tag
│   ├── Modal
│   ├── Toast
│   ├── Table
│   ├── Tabs
│   ├── Accordion
│   └── Avatar
├── Patterns
│   ├── Empty state
│   ├── Loading skeleton
│   ├── Error state
│   └── Pagination
└── Guidelines
    ├── Do / Don't examples
    ├── Accessibility rules
    └── Content voice & tone
```

### 15.11 Usability Heuristics (Nielsen's 10)

| # | Heuristic | Example failure |
|---|---|---|
| 1 | Visibility of system status | No loading spinner |
| 2 | Match real world | "Error 0x8004" instead of "Wrong password" |
| 3 | User control & freedom | No undo, no cancel |
| 4 | Consistency & standards | "Submit" on one form, "Send" on another |
| 5 | Error prevention | Deleting without confirmation |
| 6 | Recognition over recall | User must remember a code from a previous page |
| 7 | Flexibility & efficiency | No keyboard shortcuts for power users |
| 8 | Aesthetic & minimalist | Cluttered dashboard |
| 9 | Help users recover from errors | Vague error, no fix suggestion |
| 10 | Help & documentation | No FAQ, no tooltips |

### 15.12 Accessibility in Design

- **Contrast:** 4.5:1 body, 3:1 large text/UI
- **Focus visible:** never remove outlines without a replacement
- **Tap targets:** ≥ 44×44 px
- **Don't rely on colour alone:** add icons, patterns, text
- **Motion:** respect `prefers-reduced-motion`
- **Text scaling:** design must survive 200% zoom
- **Alt text:** plan it during design, not after

### 15.13 Figma Workflow (Developer Handoff)

```
1. FRAME      → 375px (mobile) + 1440px (desktop)
2. GRID       → 8pt layout grid, 12-column desktop, 4-column mobile
3. TOKENS     → local styles for colour, text, effects
4. COMPONENTS → build with variants (size, state, icon)
5. AUTO LAYOUT→ for responsive components
6. PROTOTYPE  → link frames, add interactions
7. HANDOFF    → Dev Mode: inspect spacing, colours, export assets
```

**What to export for developers**
- Exact spacing values (use Auto Layout so spacing is readable)
- Colour hex/HSL + token names
- Text styles with size, weight, line-height
- Component states (default/hover/focus/disabled/error)
- Assets as SVG where possible
- Responsive behaviour notes (what stacks, what hides)

**Handoff checklist**

```
☐ All states designed (loading, empty, error, success)
☐ Mobile + tablet + desktop frames
☐ Contrast checked
☐ Focus states shown
☐ Interactive elements have hover/active states
☐ Copy is final, not lorem ipsum
☐ Icons exported as SVG
☐ Spacing documented via Auto Layout
```

---

### 🧪 DAY 15 TASK — `D15-T1`

**Deliverable:** A complete design package for a **Student Dashboard** — in Figma (or Figma-equivalent free tool).

**Part A — Research (submit as PDF/MD)**
1. **Persona** for an Ethiroli intern (name, age, goal, frustration, device, quote)
2. **User journey map** — 6 stages with action / thought / emotion / pain point / opportunity
3. **3 competitor screenshots** with annotations of what works and what doesn't
4. **Problem statement** in one sentence: *"[Persona] needs a way to [goal] because [insight]."*

**Part B — Information Architecture**
- Sitemap for the dashboard with ≤ 3 levels
- A simple flow diagram: Login → Dashboard → Course → Lesson → Quiz → Result

**Part C — Wireframes (low-fi, greyscale)**
- 3 mobile frames: 375 × 812
- 3 desktop frames: 1440 × 900
- Screens: Dashboard, Course Detail, Assignment Submission

**Part D — Design System (in Figma)**
1. **Colour tokens** — primary, secondary, success, warning, danger, 6 greys; each with a documented hex + usage
2. **Type scale** — 8 levels with size/weight/line-height
3. **Spacing scale** — 8 values on the 8pt grid
4. **Radius & shadow tokens** — 3 each
5. **Components with variants**:
   - Button (5 variants × 6 states = 30 variants)
   - Input (default, focus, error, disabled, filled)
   - Card (default, hover, loading, empty)
   - Badge (4 colours)
   - Avatar (3 sizes)
   - Progress bar (3 states)
   - Stat card
6. **Patterns**: empty state, loading skeleton, error state, confirmation modal

**Part E — Hi-Fi Screens**
- 3 mobile + 3 desktop screens using the design system
- Light **and** dark mode variants for at least one screen

**Part F — Accessibility Audit**
- Table of every colour pair used, with contrast ratio (use a checker)
- Screenshot of focus states
- Note on how you handle `prefers-reduced-motion`

**Part G — Handoff Document**
- `HANDOFF.md` mapping every component to its CSS token values
- Exported SVG icons
- Responsive behaviour notes

### Grading Rubric (100)

| Criterion | Marks |
|---|---|
| Research depth (persona, journey, problem) | 15 |
| IA clarity | 10 |
| Wireframe quality & coverage | 15 |
| Design system completeness (tokens + components + variants) | 25 |
| Hi-fi visual quality & consistency | 15 |
| Accessibility (contrast, focus, tap targets) | 12 |
| Handoff documentation | 8 |

---

### ❓ DAY 15 QUIZ — `D15-Q` (5 Questions)

| # | Question | Options | Answer |
|---|---|---|---|
| 1 | UX primarily concerns | A) Colours B) The entire user journey C) Fonts D) Icons | **B** |
| 2 | Minimum contrast for body text | A) 2:1 B) 3:1 C) 4.5:1 D) 7:1 | **C** |
| 3 | The 8-point grid means | A) 8 columns B) Spacing in multiples of 8 C) 8 fonts D) 8 colours | **B** |
| 4 | Which heuristic covers "no undo"? | A) Consistency B) User control & freedom C) Recognition D) Minimalism | **B** |
| 5 | Minimum tap target size | A) 24px B) 32px C) 44px D) 64px | **C** |

---

# DAY 16 — React.js 1: Setup, JSX & Components

**Module:** `FE-REACT` | **Duration:** 7 h | **Lesson Code:** `RX-D16`

### Learning Objectives
- Explain what React is and why it exists
- Scaffold a project with Vite
- Write JSX correctly
- Build and compose functional components

### 16.1 What is React

A **JavaScript library for building user interfaces** from reusable, composable components.

| Problem (vanilla JS) | React solution |
|---|---|
| Manual DOM manipulation | Declarative rendering |
| State spread everywhere | Component-local state |
| Hard to reuse UI | Components + props |
| Re-render everything | Virtual DOM diffing |
| No structure at scale | Component tree |

**Declarative vs imperative**

```javascript
// Imperative (vanilla)
const btn = document.createElement("button");
btn.textContent = `Count: ${count}`;
btn.onclick = () => { count++; btn.textContent = `Count: ${count}`; };
document.body.append(btn);

// Declarative (React) — you describe WHAT, React handles HOW
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
```

### 16.2 Setup with Vite

```bash
npm create vite@latest ethiroli-react -- --template react
cd ethiroli-react
npm install
npm run dev          # http://localhost:5173
```

**Optional — JavaScript vs TypeScript**

```bash
npm create vite@latest my-app -- --template react-ts
```

**Project structure**

```
ethiroli-react/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx           # entry point
    ├── App.jsx            # root component
    ├── index.css          # global styles
    ├── components/        # reusable components
    │   ├── Button.jsx
    │   ├── Card.jsx
    │   └── Navbar.jsx
    ├── pages/             # route-level components
    │   ├── Home.jsx
    │   └── About.jsx
    ├── hooks/             # custom hooks
    │   └── useLocalStorage.js
    ├── utils/             # helpers
    │   └── format.js
    └── assets/            # images, fonts
```

**`main.jsx`**

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

> `StrictMode` double-invokes effects in development to surface bugs. It does not affect production.

**Available scripts**

```bash
npm run dev       # dev server with HMR
npm run build     # production build → dist/
npm run preview   # preview the production build
npm run lint      # ESLint
```

### 16.3 JSX

JSX = JavaScript XML. It looks like HTML but compiles to `React.createElement()`.

```jsx
const element = <h1 className="title">Hello, Ethiroli</h1>;

// Compiles to:
const element = React.createElement("h1", { className: "title" }, "Hello, Ethiroli");
```

**JSX rules**

| Rule | ✅ | ❌ |
|---|---|---|
| Return one root element | `<><A/><B/></>` or `<div>…</div>` | `<A/><B/>` |
| Close all tags | `<img />` `<br />` | `<img>` |
| `className` not `class` | `<div className="x">` | `<div class="x">` |
| `htmlFor` not `for` | `<label htmlFor="x">` | `<label for="x">` |
| camelCase attributes | `onClick`, `tabIndex`, `maxLength` | `onclick`, `tabindex` |
| Inline styles are objects | `style={{ color: "red" }}` | `style="color:red"` |
| Expressions in `{}` | `{2 + 2}` | `"2 + 2"` |
| Comments | `{/* comment */}` | `<!-- comment -->` |

**Embedding expressions**

```jsx
const name = "Asha";
const user = { role: "intern", level: 2 };
const skills = ["JS", "React", "Node"];

function Profile() {
  return (
    <div>
      <h1>Hello, {name}</h1>
      <p>Role: {user.role.toUpperCase()}</p>
      <p>Level: {user.level * 10}</p>
      <p>Skills: {skills.join(", ")}</p>
      <p>Total: {skills.length} skills</p>
      <p>Status: {user.level > 1 ? "Advanced" : "Beginner"}</p>
      <p>Today: {new Date().toLocaleDateString()}</p>
      {/* This is a comment */}
    </div>
  );
}
```

**Fragments**

```jsx
// ❌ Extra div pollutes the DOM
return (
  <div>
    <Header />
    <Main />
  </div>
);

// ✅ Fragment — no extra DOM node
return (
  <>
    <Header />
    <Main />
  </>
);

// With key (needed in lists)
<React.Fragment key={id}>...</React.Fragment>
```

**Conditional rendering**

```jsx
// Ternary
{isLoggedIn ? <Dashboard /> : <Login />}

// Logical AND
{error && <ErrorBanner message={error} />}
{items.length > 0 && <List items={items} />}
{items.length === 0 && <EmptyState />}

// Early return
function UserProfile({ user }) {
  if (!user) return <p>No user found</p>;
  if (!user.isActive) return <p>Account disabled</p>;
  return <div>{user.name}</div>;
}

// if/else assigned to a variable
let content;
if (loading) content = <Spinner />;
else if (error) content = <Error />;
else content = <Data />;
return <div>{content}</div>;
```

⚠️ **Gotcha:** `{count && <X />}` renders `0` when `count` is `0`. Use `{count > 0 && <X />}`.

**Lists & keys**

```jsx
const skills = [
  { id: 1, name: "JavaScript" },
  { id: 2, name: "React" },
  { id: 3, name: "Node.js" },
];

// ✅ Stable unique key
<ul>
  {skills.map(skill => (
    <li key={skill.id}>{skill.name}</li>
  ))}
</ul>

// ❌ Index keys break with reordering
{skills.map((s, i) => <li key={i}>{s.name}</li>)}

// ❌ No key — React warns
{skills.map(s => <li>{s.name}</li>)}
```

> **Keys must be:** unique among siblings, stable across renders, not the array index (unless the list never reorders).

### 16.4 Components

A component is a function that returns JSX.

```jsx
// Function declaration (preferred)
function Button({ children, onClick, variant = "primary" }) {
  return (
    <button className={`btn btn--${variant}`} onClick={onClick}>
      {children}
    </button>
  );
}

// Arrow function
const Button = ({ children, variant = "primary" }) => (
  <button className={`btn btn--${variant}`}>{children}</button>
);

// Named export (preferred for components)
export function Card({ title, children }) {
  return (
    <article className="card">
      <h3 className="card__title">{title}</h3>
      <div className="card__body">{children}</div>
    </article>
  );
}

export default Card;   // also OK — one default per file
```

**File naming convention**

| Convention | Example |
|---|---|
| PascalCase file = component | `UserCard.jsx` |
| One component per file | `Button.jsx` |
| Co-locate styles | `Button.css` or `Button.module.css` |
| Co-locate tests | `Button.test.jsx` |

**Composition over inheritance**

```jsx
function App() {
  return (
    <Layout>
      <Header />
      <main>
        <Hero />
        <FeatureGrid>
          <FeatureCard title="Fast" />
          <FeatureCard title="Simple" />
          <FeatureCard title="Powerful" />
        </FeatureGrid>
      </main>
      <Footer />
    </Layout>
  );
}
```

**`children` prop**

```jsx
function Panel({ title, footer, children }) {
  return (
    <section className="panel">
      <header>{title}</header>
      <div className="panel__body">{children}</div>
      <footer>{footer}</footer>
    </section>
  );
}

<Panel title="Profile" footer={<button>Edit</button>}>
  <p>Name: Asha</p>
  <p>Role: Intern</p>
</Panel>
```

### 16.5 Props

**Passing props**

```jsx
function UserCard({ name, role, skills, isActive, onSelect }) {
  return (
    <div className={`card ${isActive ? "card--active" : ""}`}>
      <h3>{name}</h3>
      <p>{role}</p>
      <ul>{skills.map(s => <li key={s}>{s}</li>)}</ul>
      <button onClick={() => onSelect(name)}>Select</button>
    </div>
  );
}

// Usage
<UserCard
  name="Asha"
  role="Frontend Intern"
  skills={["JS", "React"]}
  isActive={true}
  onSelect={(n) => console.log(n)}
/>
```

**Props rules**

| Rule | Reason |
|---|---|
| Props are **read-only** | Never mutate them |
| Destructure in the signature | Cleaner, self-documenting |
| Default values in the signature | Handles missing props |
| Pass functions for events | Parent controls state |
| Pass primitives when possible | Easier memoization |

```jsx
// ✅ Default props
function Badge({ label, colour = "gray", size = "md" }) { /* ... */ }

// ❌ Mutating props
function Bad({ user }) {
  user.name = "Changed";   // never do this
  return <p>{user.name}</p>;
}
```

**PropTypes (light runtime checking)**

```bash
npm i prop-types
```

```jsx
import PropTypes from "prop-types";

UserCard.propTypes = {
  name: PropTypes.string.isRequired,
  role: PropTypes.string,
  skills: PropTypes.arrayOf(PropTypes.string),
  isActive: PropTypes.bool,
  onSelect: PropTypes.func,
};

UserCard.defaultProps = {
  role: "Intern",
  skills: [],
  isActive: false,
};
```

### 16.6 Styling Approaches

**1. Plain CSS**

```jsx
import "./Button.css";
<button className="btn btn--primary">Go</button>
```

**2. CSS Modules (scoped, recommended)**

```css
/* Button.module.css */
.btn { padding: 0.5rem 1rem; }
.primary { background: #2563eb; color: white; }
```

```jsx
import styles from "./Button.module.css";
<button className={`${styles.btn} ${styles.primary}`}>Go</button>
```

**3. Inline styles**

```jsx
<div style={{ display: "flex", gap: "1rem", color: "red" }} />
// kebab-case → camelCase
```

**4. Tailwind**

```jsx
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
  Go
</button>
```

**5. CSS-in-JS (styled-components)** — popular but adds runtime cost; less common in new projects.

**Recommendation for Ethiroli:** Tailwind + CSS Modules for complex components.

### 16.7 Best Practices

| Practice | Why |
|---|---|
| Small components (< 100 lines) | Testable, reusable |
| One component = one responsibility | Clear purpose |
| PascalCase component names | React convention |
| Props destructured in signature | Readability |
| `key` on every list item | Correct reconciliation |
| No business logic in JSX | Extract to functions |
| Co-locate component + styles + tests | Maintainability |
| Extract repeated JSX into components | DRY |
| Use fragments to avoid wrapper divs | Clean DOM |

```jsx
// ❌ Too much in one component
function App() {
  return (
    <div>
      <header>...</header>
      <nav>...</nav>
      <main>... 200 lines ...</main>
      <footer>...</footer>
    </div>
  );
}

// ✅ Split
function App() {
  return (
    <Layout>
      <Header />
      <NavBar />
      <MainContent />
      <Footer />
    </Layout>
  );
}
```

---

### 🧪 DAY 16 TASK — `D16-T1`

**Deliverable:** `ethiroli-react/` — a React app with a full component library.

**Setup**
1. Scaffold with Vite (`react` template)
2. Clean out the default boilerplate
3. Set up Tailwind OR CSS Modules
4. Configure path alias `@/` → `src/` in `vite.config.js`
5. Add `prop-types`

**Components to build (in `src/components/`)**

| Component | Props | Notes |
|---|---|---|
| `Button` | `children`, `variant` (primary/secondary/ghost/danger), `size` (sm/md/lg), `disabled`, `loading`, `onClick`, `type` | All states styled |
| `Badge` | `label`, `colour`, `size` | 5 colour variants |
| `Avatar` | `src`, `name`, `size`, `status` | Fallback to initials |
| `Card` | `title`, `subtitle`, `image`, `footer`, `children` | Optional slots |
| `StatCard` | `label`, `value`, `delta`, `icon` | Shows +/- trend |
| `Alert` | `type` (info/success/warning/error), `title`, `children`, `onClose` | Dismissible |
| `Spinner` | `size`, `label` | Accessible (`role="status"`) |
| `EmptyState` | `icon`, `title`, `description`, `action` | Reusable |
| `ProgressBar` | `value`, `max`, `label` | Accessible (`role="progressbar"`) |
| `Tag` | `label`, `onRemove` | Removable |
| `Divider` | `orientation`, `label` | — |
| `Skeleton` | `width`, `height`, `variant` | Loading placeholder |
| `Tabs` | `tabs`, `activeTab`, `onChange` | Keyboard accessible |
| `Modal` | `isOpen`, `onClose`, `title`, `children`, `footer` | Focus trap, Escape to close |

**Also build**
- `Layout` — header + sidebar + main + footer using CSS Grid
- `Navbar` — responsive with mobile menu
- `PageHeader` — title, breadcrumb, actions slot

**Demo page (`App.jsx`)**
- A "Component Gallery" that renders every component in every variant and state, organised in sections with headings
- Include a live theme toggle (light/dark) using a `data-theme` attribute

**Requirements**
- Every component in its own file with matching CSS
- Every component has `propTypes`
- No inline styles except for dynamic values
- All interactive elements keyboard accessible with visible focus
- No `key` warnings, no console errors
- Split `App.jsx` into `< 80` lines by extracting sections

**Bonus**
- A `useToggle` custom hook used by the Modal
- Storybook-style navigation (a sidebar that switches which component is displayed)

---

### ❓ DAY 16 QUIZ — `D16-Q` (5 Questions)

| # | Question | Options | Answer |
|---|---|---|---|
| 1 | JSX attribute for CSS class is | A) `class` B) `className` C) `cssClass` D) `styleClass` | **B** |
| 2 | A component must return | A) A string B) One root element or fragment C) An array always D) Nothing | **B** |
| 3 | Why do list items need a `key`? | A) Styling B) React reconciliation C) Accessibility D) Performance only | **B** |
| 4 | Props are | A) Mutable B) Read-only C) Global D) Optional always | **B** |
| 5 | `{count && <X />}` when `count` is `0` renders | A) Nothing B) `0` C) `<X />` D) Error | **B** |

---

# DAY 17 — React 2: State, Events & Lists

**Module:** `FE-REACT` | **Duration:** 7 h | **Lesson Code:** `RX-D17`

### Learning Objectives
- Manage component state with `useState`
- Handle events and pass data upward
- Render dynamic lists and conditionals
- Lift state up and follow unidirectional data flow
- Update state immutably

### 17.1 `useState`

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

**Anatomy**

```jsx
const [value, setValue] = useState(initialValue);
//     ↑       ↑                    ↑
//   state   setter             initial (used only on first render)
```

**State types**

```jsx
const [count, setCount] = useState(0);
const [name, setName] = useState("");
const [isOpen, setIsOpen] = useState(false);
const [items, setItems] = useState([]);
const [user, setUser] = useState(null);
const [form, setForm] = useState({ email: "", password: "" });
```

**Functional updates — required when the new state depends on the old**

```jsx
// ❌ Can lose updates with batched/async calls
setCount(count + 1);
setCount(count + 1);   // still +1, not +2

// ✅ Always correct
setCount(prev => prev + 1);
setCount(prev => prev + 1);   // +2
```

**Lazy initialisation** — for expensive initial values

```jsx
// ❌ Runs on every render (result discarded after first)
const [data, setData] = useState(expensiveCompute());

// ✅ Runs only on first render
const [data, setData] = useState(() => expensiveCompute());

const [user, setUser] = useState(() => {
  const saved = localStorage.getItem("user");
  return saved ? JSON.parse(saved) : null;
});
```

**State update rules**

| Rule | Detail |
|---|---|
| Never mutate state directly | `items.push(x)` won't re-render |
| Always create new objects/arrays | Spread, `map`, `filter`, `concat` |
| Batch multiple setters | React 18 batches automatically |
| Setter is async | Read state after render, not immediately after setting |
| State is local to the component | Lift up to share |

### 17.2 Immutable State Updates

```jsx
const [items, setItems] = useState([1, 2, 3]);

// ❌ Mutations — no re-render
items.push(4);
items[0] = 99;
items.sort();

// ✅ Immutable
setItems([...items, 4]);                    // add to end
setItems([0, ...items]);                    // add to start
setItems(items.filter(n => n !== 2));       // remove
setItems(items.map(n => n === 1 ? 99 : n)); // update
setItems([...items].sort((a,b) => a-b));    // sort copy
setItems(items.slice(0, 2));                // truncate
setItems([...new Set([...items, 4])]);      // unique add
setItems([]);                               // clear

// Object state
const [user, setUser] = useState({ name: "Asha", age: 25 });

setUser({ ...user, age: 26 });              // update one field
setUser(prev => ({ ...prev, age: prev.age + 1 }));

// Nested object
const [profile, setProfile] = useState({
  name: "Asha",
  address: { city: "Chennai", zip: "600001" },
});

setProfile(prev => ({
  ...prev,
  address: { ...prev.address, city: "Coimbatore" },
}));
```

> ⚠️ **Nested state is a code smell.** Flatten or use `useReducer`.

### 17.3 Event Handling

```jsx
function Form() {
  const [email, setEmail] = useState("");

  // Named handler (preferred)
  function handleSubmit(e) {
    e.preventDefault();
    console.log("Submitted:", email);
  }

  function handleChange(e) {
    setEmail(e.target.value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={handleChange}
        placeholder="you@example.com"
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

**Inline vs named**

```jsx
// ✅ Named — reusable, easier to test
<button onClick={handleClick}>Go</button>

// ✅ Inline with args — fine for short logic
<button onClick={() => deleteItem(item.id)}>Delete</button>

// ❌ Called immediately at render
<button onClick={deleteItem(item.id)}>Delete</button>
```

**Common events**

```jsx
<button onClick={fn}>Click</button>
<input onChange={fn} onFocus={fn} onBlur={fn} onKeyDown={fn} />
<form onSubmit={fn} onReset={fn}>...</form>
<div onMouseEnter={fn} onMouseLeave={fn} />
<div onScroll={fn} />
<div onDrop={fn} onDragOver={fn} />
```

**Synthetic events** — React wraps native events for cross-browser consistency.

```jsx
function handle(e) {
  e.preventDefault();
  e.stopPropagation();
  e.target.value;
  e.currentTarget;
  e.key;         // "Enter"
  e.shiftKey;    // true/false
}
```

### 17.4 Passing Data Upward

```jsx
// Child calls a parent-provided callback
function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(query);            // ← report upward
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <button>Search</button>
    </form>
  );
}

function App() {
  const [results, setResults] = useState([]);

  async function search(q) {
    const res = await fetch(`/api/search?q=${q}`);
    setResults(await res.json());
  }

  return (
    <>
      <SearchBar onSearch={search} />
      <Results items={results} />
    </>
  );
}
```

**Data flow rules**

```
State lives in the closest common ancestor.
Props flow DOWN.  Callbacks flow UP.
```

### 17.5 Lifting State Up

```jsx
// ❌ Two siblings can't share state
function TemperatureInput() {
  const [temp, setTemp] = useState("");
  return <input value={temp} onChange={e => setTemp(e.target.value)} />;
}

// ✅ Lift to the parent
function Calculator() {
  const [celsius, setCelsius] = useState("");

  return (
    <>
      <TemperatureInput
        label="Celsius"
        value={celsius}
        onChange={setCelsius}
      />
      <TemperatureInput
        label="Fahrenheit"
        value={celsius === "" ? "" : (celsius * 9/5 + 32).toFixed(1)}
        onChange={v => setCelsius(((v - 32) * 5/9).toFixed(1))}
      />
    </>
  );
}

function TemperatureInput({ label, value, onChange }) {
  return (
    <label>
      {label}
      <input value={value} onChange={e => onChange(e.target.value)} />
    </label>
  );
}
```

**Controlled vs uncontrolled**

| | Controlled | Uncontrolled |
|---|---|---|
| Value from | React state | DOM |
| `value` prop | ✅ required | ❌ |
| `defaultValue` | ❌ | ✅ |
| Read value | From state | `ref.current.value` |
| Validation | Easy | Harder |
| Recommended | ✅ Yes | Only for file inputs |

```jsx
// Controlled
<input value={name} onChange={e => setName(e.target.value)} />

// Uncontrolled
const ref = useRef(null);
<input ref={ref} defaultValue="Asha" />;
// read: ref.current.value
```

### 17.6 Forms

**Single field**

```jsx
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.includes("@")) return setError("Invalid email");
    if (password.length < 8) return setError("Password too short");
    setError("");
    console.log({ email, password });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      {error && <p className="error">{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}
```

**Object state (multi-field)**

```jsx
const [form, setForm] = useState({
  name: "", email: "", role: "intern", newsletter: false, skills: [],
});

function handleChange(e) {
  const { name, value, type, checked } = e.target;
  setForm(prev => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
  }));
}

// Checkbox group
function handleSkills(e) {
  const { value, checked } = e.target;
  setForm(prev => ({
    ...prev,
    skills: checked
      ? [...prev.skills, value]
      : prev.skills.filter(s => s !== value),
  }));
}

// Select multiple
<select multiple value={form.skills} onChange={e => {
  const selected = [...e.target.selectedOptions].map(o => o.value);
  setForm(prev => ({ ...prev, skills: selected }));
}}>
```

**Validation pattern**

```jsx
function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Name is required";
  else if (form.name.length < 2) errors.name = "Min 2 characters";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "Invalid email";
  if (form.password.length < 8) errors.password = "Min 8 characters";
  return errors;
}

const [errors, setErrors] = useState({});
const [touched, setTouched] = useState({});

function handleBlur(e) {
  setTouched(t => ({ ...t, [e.target.name]: true }));
  setErrors(validate(form));
}

<input
  name="email"
  value={form.email}
  onChange={handleChange}
  onBlur={handleBlur}
  aria-invalid={!!errors.email && touched.email}
  aria-describedby={errors.email ? "email-error" : undefined}
/>
{touched.email && errors.email && (
  <p id="email-error" role="alert">{errors.email}</p>
)}
```

### 17.7 Rendering Lists

```jsx
const [todos, setTodos] = useState([
  { id: 1, text: "Learn React", done: false },
  { id: 2, text: "Build a project", done: true },
]);

// Render
<ul>
  {todos.map(todo => (
    <TodoItem
      key={todo.id}
      todo={todo}
      onToggle={toggleTodo}
      onDelete={deleteTodo}
    />
  ))}
</ul>
```

**Filter / search / sort**

```jsx
const [filter, setFilter] = useState("all");
const [query, setQuery] = useState("");

const visible = todos
  .filter(t => {
    if (filter === "active") return !t.done;
    if (filter === "done") return t.done;
    return true;
  })
  .filter(t => t.text.toLowerCase().includes(query.toLowerCase()))
  .sort((a, b) => a.text.localeCompare(b.text));

// ⚠️ Never mutate the original array
// ❌ todos.sort()  ← mutates state
```

**Key rules recap**

| Key choice | Verdict |
|---|---|
| `key={item.id}` | ✅ Best |
| `key={item.email}` | ✅ If unique & stable |
| `key={index}` | ⚠️ Only if list never reorders |
| No key | ❌ Warning + bugs |

### 17.8 Conditional Rendering Patterns

```jsx
// 1. Ternary
{isLoading ? <Spinner /> : <Data />}

// 2. Logical AND
{error && <Error message={error} />}

// 3. Early return
if (isLoading) return <Spinner />;
if (error) return <Error />;
return <Data />;

// 4. Lookup object
const views = {
  list: <ListView />,
  grid: <GridView />,
  board: <BoardView />,
};
return <div>{views[viewMode]}</div>;

// 5. Component variable
let content;
switch (status) {
  case "loading": content = <Spinner />; break;
  case "error":   content = <Error />; break;
  case "empty":   content = <Empty />; break;
  default:        content = <Data />;
}
return <main>{content}</main>;
```

### 17.9 State Anti-Patterns

| Anti-pattern | Problem | Fix |
|---|---|---|
| Derived state stored | Goes out of sync | Compute during render |
| Mutating state | No re-render | Immutable updates |
| Duplicate state | Two sources of truth | Single source |
| Deep nested state | Painful updates | Flatten or `useReducer` |
| State for static data | Unnecessary renders | Use `const` |
| Too many `useState` | Unmanageable | Object or `useReducer` |

```jsx
// ❌ Derived state
const [items, setItems] = useState([...]);
const [count, setCount] = useState(0);   // will desync

// ✅ Compute it
const count = items.length;

// ❌ Too many states
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [age, setAge] = useState("");

// ✅ One object
const [form, setForm] = useState({ name: "", email: "", age: "" });
```

---

### 🧪 DAY 17 TASK — `D17-T1`

**Deliverable:** A **Task Manager** React app.

**Components**

| File | Responsibility |
|---|---|
| `App.jsx` | Holds all state, renders layout |
| `TaskForm.jsx` | Add new task, validation |
| `TaskList.jsx` | Renders list, empty state |
| `TaskItem.jsx` | Single task: checkbox, text, edit, delete |
| `TaskFilters.jsx` | All / Active / Completed, sort dropdown |
| `TaskStats.jsx` | Total, done, pending, completion % |
| `SearchBar.jsx` | Debounced search |

**Task shape**

```javascript
{
  id: crypto.randomUUID(),
  title: string,
  priority: "low" | "medium" | "high",
  category: string,
  dueDate: string,       // YYYY-MM-DD
  done: boolean,
  createdAt: number,
}
```

**Features**
1. Add task with validation (title ≥ 3 chars, due date not in the past)
2. Toggle complete
3. Inline edit (double-click or Edit button) with Save/Cancel; Escape cancels, Enter saves
4. Delete with confirmation modal
5. Filter: All / Active / Completed / Overdue / High priority
6. Sort: Created / Due date / Priority / Title / Status
7. Search with 300 ms debounce
8. Stats bar
9. Bulk actions: Select all, Mark selected done, Delete selected
10. Clear completed
11. Persist to `localStorage` (custom `useLocalStorage` hook)
12. Empty states: no tasks vs no matching tasks
13. Undo delete via toast (5 s window)

**Technical requirements**
- All state in `App.jsx` (single source of truth) — no duplicate state
- All updates **immutable**
- Child components receive props + callbacks only (no internal data state except form inputs)
- Every list has a stable `key`
- `propTypes` on every component
- No `key` warnings, no console errors
- Keyboard: `N` new task, `/` focus search, `Esc` close modal, `Enter` submit

**Bonus**
- Drag-and-drop reorder
- Bulk import from JSON
- Export to CSV
- Priority colour coding
- Due-date countdown ("in 3 days", "overdue by 2 days")

---

### ❓ DAY 17 QUIZ — `D17-Q` (5 Questions)

| # | Question | Options | Answer |
|---|---|---|---|
| 1 | `setCount(count + 1)` twice in one handler results in | A) +2 B) +1 C) +0 D) Error | **B** |
| 2 | To add an item immutably you use | A) `items.push(x)` B) `setItems([...items, x])` C) `items[items.length] = x` D) `setItems(items + x)` | **B** |
| 3 | Controlled inputs get their value from | A) DOM B) React state C) Props only D) `defaultValue` | **B** |
| 4 | Lifting state up means | A) Moving to Redux B) Moving to the closest common ancestor C) Using `useEffect` D) Global variables | **B** |
| 5 | Which `key` is best for a reorderable list? | A) `index` B) `Math.random()` C) `item.id` D) No key | **C** |

---

# DAY 18 — React 3: `useEffect`, Refs & Side Effects

**Module:** `FE-REACT` | **Duration:** 7 h | **Lesson Code:** `RX-D18`

### Learning Objectives
- Perform side effects with `useEffect`
- Control effect timing with the dependency array
- Clean up subscriptions, timers, and listeners
- Use `useRef` for DOM access and mutable values
- Build custom hooks

### 18.1 What Are Side Effects

A side effect is anything outside the pure render: fetching data, timers, subscriptions, DOM mutation, logging.

**React renders must be pure.** Side effects go in `useEffect` or event handlers.

### 18.2 `useEffect` Basics

```jsx
import { useEffect, useState } from "react";

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);   // cleanup
  }, []);                              // run once on mount

  return <p>{seconds}s</p>;
}
```

**Anatomy**

```jsx
useEffect(() => {
  // setup — runs after render

  return () => {
    // cleanup — runs before next effect and on unmount
  };
}, [dependencies]);
```

### 18.3 Dependency Array Behaviour

| Dependency array | When the effect runs |
|---|---|
| Not provided | After **every** render |
| `[]` | Once on mount (+ cleanup on unmount) |
| `[a, b]` | On mount + whenever `a` or `b` changes |
| `[obj]` | Every render if `obj` is a new reference |
| `[obj.id]` | Only when that primitive changes |

```jsx
// Runs after every render — usually wrong
useEffect(() => { console.log("render"); });

// Mount only
useEffect(() => { console.log("mounted"); }, []);

// When userId changes
useEffect(() => {
  fetchUser(userId).then(setUser);
}, [userId]);

// Multiple deps
useEffect(() => {
  console.log(a, b);
}, [a, b]);
```

⚠️ **Object/array/function dependencies cause infinite loops** if recreated each render.

```jsx
// ❌ Infinite loop — options is a new object every render
const options = { limit: 10 };
useEffect(() => { fetchData(options); }, [options]);

// ✅ Depend on primitives
useEffect(() => { fetchData({ limit }); }, [limit]);

// ✅ Or memoize the object
const options = useMemo(() => ({ limit }), [limit]);
useEffect(() => { fetchData(options); }, [options]);
```

### 18.4 Fetching Data

```jsx
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/users", { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) setUsers(data);
      } catch (err) {
        if (err.name !== "AbortError" && !cancelled) setError(err.message);
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
  if (error) return <ErrorBanner message={error} onRetry={() => window.location.reload()} />;
  if (!users.length) return <EmptyState title="No users" />;
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

**Why the `cancelled` flag and `AbortController`?**

They prevent:
- Setting state on an unmounted component
- Race conditions when the dependency changes quickly (e.g. fast typing in a search box)

### 18.5 Cleanup Patterns

```jsx
// 1. Interval
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);
}, []);

// 2. Timeout
useEffect(() => {
  const id = setTimeout(() => setVisible(false), 3000);
  return () => clearTimeout(id);
}, []);

// 3. Event listener
useEffect(() => {
  function onResize() { setWidth(window.innerWidth); }
  window.addEventListener("resize", onResize);
  return () => window.removeEventListener("resize", onResize);
}, []);

// 4. Document listener
useEffect(() => {
  function onKey(e) {
    if (e.key === "Escape") onClose();
  }
  document.addEventListener("keydown", onKey);
  return () => document.removeEventListener("keydown", onKey);
}, [onClose]);

// 5. WebSocket
useEffect(() => {
  const ws = new WebSocket("wss://api.example.com");
  ws.onmessage = (e) => setMessages(m => [...m, JSON.parse(e.data)]);
  return () => ws.close();
}, []);

// 6. IntersectionObserver
useEffect(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) setVisible(true);
  });
  if (ref.current) observer.observe(ref.current);
  return () => observer.disconnect();
}, []);
```

### 18.6 Common `useEffect` Mistakes

| Mistake | Symptom | Fix |
|---|---|---|
| Missing dep | Stale value | Add the dep |
| Object/function dep | Infinite loop | Use primitives or `useMemo`/`useCallback` |
| No cleanup | Memory leak, "setState on unmounted" | Return a cleanup |
| Derived state in effect | Extra render, desync | Compute during render |
| Effect for event logic | Odd timing | Put it in the handler |
| `async` function directly | React warning | Wrap in an inner `async` fn |

```jsx
// ❌ useEffect callback cannot be async
useEffect(async () => {
  const data = await fetchData();
}, []);

// ✅ Wrap it
useEffect(() => {
  (async () => {
    const data = await fetchData();
    setData(data);
  })();
}, []);
```

### 18.7 `useRef`

**Two uses:** (1) hold a mutable value across renders, (2) reference a DOM node.

```jsx
import { useRef, useEffect } from "react";

// 1. DOM reference
function SearchInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <>
      <input ref={inputRef} placeholder="Search..." />
      <button onClick={() => inputRef.current.focus()}>Focus</button>
      <button onClick={() => inputRef.current.select()}>Select</button>
    </>
  );
}

// 2. Mutable value (does NOT trigger re-render)
function RenderCounter() {
  const renders = useRef(0);
  renders.current++;

  return <p>Renders: {renders.current}</p>;
}

// 3. Storing previous value
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => { ref.current = value; }, [value]);
  return ref.current;
}

// 4. Storing timer id
function useDebounce(callback, delay) {
  const timerRef = useRef();

  return (...args) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => callback(...args), delay);
  };
}
```

**`useState` vs `useRef`**

| | `useState` | `useRef` |
|---|---|---|
| Triggers re-render | ✅ | ❌ |
| Persists across renders | ✅ | ✅ |
| Read during render | ✅ | ⚠️ (value may be stale) |
| Use for | UI state | DOM refs, timers, counters |

### 18.8 `useMemo` & `useCallback`

```jsx
import { useMemo, useCallback, useState } from "react";

function ProductList({ products, query, onSelect }) {
  // Expensive derived value — recompute only when inputs change
  const filtered = useMemo(() => {
    return products
      .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => b.price - a.price);
  }, [products, query]);

  // Stable function reference — needed for memoized children
  const handleSelect = useCallback((id) => {
    onSelect(id);
  }, [onSelect]);

  return (
    <ul>
      {filtered.map(p => (
        <ProductRow key={p.id} product={p} onSelect={handleSelect} />
      ))}
    </ul>
  );
}
```

**When to use**

| Hook | Use when |
|---|---|
| `useMemo` | Expensive computation, or a stable reference is required |
| `useCallback` | Passing a function to a memoized child, or as an effect dep |

> **Don't prematurely optimize.** Add `useMemo`/`useCallback` only when you have a measured problem or a specific referential-equality requirement.

### 18.9 Custom Hooks

A custom hook is a function starting with `use` that calls other hooks.

```jsx
// useLocalStorage.js
import { useState, useEffect } from "react";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error("localStorage write failed:", err);
    }
  }, [key, value]);

  return [value, setValue];
}
```

```jsx
// useFetch.js
import { useState, useEffect } from "react";

export function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(url, { ...options, signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (err) {
        if (err.name !== "AbortError" && !cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; controller.abort(); };
  }, [url]);

  return { data, loading, error };
}
```

```jsx
// useDebounce.js
import { useState, useEffect } from "react";

export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
```

```jsx
// useToggle.js
import { useState, useCallback } from "react";

export function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = useCallback(() => setOn(v => !v), []);
  const setTrue = useCallback(() => setOn(true), []);
  const setFalse = useCallback(() => setOn(false), []);
  return { on, toggle, setTrue, setFalse };
}
```

```jsx
// useClickOutside.js
import { useEffect } from "react";

export function useClickOutside(ref, handler) {
  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) handler(e);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [ref, handler]);
}
```

```jsx
// useMediaQuery.js
import { useState, useEffect } from "react";

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
```

**Usage**

```jsx
function SearchPage() {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 400);
  const { data, loading, error } = useFetch(
    debounced ? `/api/search?q=${debounced}` : null
  );
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      {loading && <Spinner />}
      {error && <Error message={error.message} />}
      {data && <Results items={data} layout={isDesktop ? "grid" : "list"} />}
    </>
  );
}
```

### 18.10 Effect Timing Mental Model

```
1. Render phase (pure)
   └─ Component function runs, returns JSX

2. Commit phase
   └─ React updates the DOM

3. Effect phase
   ├─ Cleanup of previous effect (if deps changed)
   └─ Run new effect

4. Re-render triggered by setState in the effect
   └─ Back to step 1
```

**In StrictMode (development only):** mount → unmount → mount, so effects run twice. This is intentional — it exposes missing cleanups. Never "fix" it by removing StrictMode.

---

### 🧪 DAY 18 TASK — `D18-T1`

**Deliverable:** Two parts.

---

**Part A — Custom Hooks Library (`src/hooks/`)**

Build, document, and demo each hook:

| Hook | Signature | Behaviour |
|---|---|---|
| `useLocalStorage` | `(key, initial)` | Persists state to localStorage, handles parse errors |
| `useFetch` | `(url, options)` | Returns `{ data, loading, error, refetch }`; aborts on unmount/URL change |
| `useDebounce` | `(value, delay)` | Returns the debounced value |
| `useThrottle` | `(value, limit)` | Returns the throttled value |
| `useToggle` | `(initial)` | Returns `{ on, toggle, setTrue, setFalse }` |
| `usePrevious` | `(value)` | Returns the previous render's value |
| `useClickOutside` | `(ref, handler)` | Fires when clicking outside the ref |
| `useKeyPress` | `(key, handler)` | Fires on a specific key |
| `useMediaQuery` | `(query)` | Returns whether the media query matches |
| `useWindowSize` | `()` | Returns `{ width, height }`, updates on resize (throttled) |
| `useIntersection` | `(options)` | Returns `[ref, isIntersecting]` for lazy loading |
| `useOnlineStatus` | `()` | Returns whether the browser is online |
| `useInterval` | `(callback, delay)` | Declarative `setInterval` with cleanup |
| `useCopyToClipboard` | `()` | Returns `[copied, copy]` |
| `useForm` | `({ initial, validate })` | Returns `{ values, errors, touched, handleChange, handleBlur, handleSubmit, reset }` |

**Rules**
- Each hook in its own file with a JSDoc comment
- Every hook handles cleanup correctly
- No memory leaks, no "setState on unmounted" warnings
- A `HooksDemo.jsx` page demonstrating each with live output

---

**Part B — GitHub User Finder**

Build a React app using only **custom hooks** for logic.

**Features**
1. Search input with 400 ms debounce → triggers fetch
2. Show user profile: avatar, name, bio, followers, following, public repos, location, join date
3. Show that user's repositories as cards: name, description, language, stars, forks, updated
4. Sort repos by: stars / name / updated
5. Filter repos by language
6. **Loading state** — skeleton cards (not just a spinner)
7. **Error states** — network error, 404 user not found, rate limit exceeded — each with a distinct message and retry button
8. **Empty state** — "Search for a GitHub user to get started"
9. **Recent searches** — persisted in localStorage, clickable chips, clearable
10. **Dark mode** toggle persisted in localStorage
11. Fully responsive: 1 column mobile → 2 → 3
12. Abort in-flight requests when the query changes

**Required structure**
```
src/
├── hooks/               # Part A hooks
├── components/
│   ├── SearchBar.jsx
│   ├── UserProfile.jsx
│   ├── RepoCard.jsx
│   ├── RepoList.jsx
│   ├── Skeletons.jsx
│   ├── ErrorState.jsx
│   ├── EmptyState.jsx
│   └── RecentSearches.jsx
├── api/github.js        # fetch wrappers
└── App.jsx
```

**`api/github.js`**

```javascript
const BASE = "https://api.github.com";

export async function getUser(username, signal) {
  const res = await fetch(`${BASE}/users/${username}`, { signal });
  if (res.status === 404) throw new Error("USER_NOT_FOUND");
  if (res.status === 403) throw new Error("RATE_LIMIT");
  if (!res.ok) throw new Error("NETWORK");
  return res.json();
}

export async function getRepos(username, signal) {
  const res = await fetch(
    `${BASE}/users/${username}/repos?per_page=100&sort=updated`,
    { signal }
  );
  if (!res.ok) throw new Error("NETWORK");
  return res.json();
}
```

**Bonus**
- Compare two users side by side
- Language breakdown chart (pure CSS bars)
- Infinite scroll for repos using `useIntersection`
- Copy profile URL using `useCopyToClipboard`

---

### ❓ DAY 18 QUIZ — `D18-Q` (5 Questions)

| # | Question | Options | Answer |
|---|---|---|---|
| 1 | `useEffect(fn, [])` runs | A) Every render B) Once on mount C) Never D) Only on unmount | **B** |
| 2 | What should an effect return for cleanup? | A) A Promise B) A function C) Nothing D) An object | **B** |
| 3 | `useRef` updates cause | A) Re-render B) No re-render C) A warning D) An error | **B** |
| 4 | A custom hook must start with | A) `get` B) `use` C) `hook` D) `with` | **B** |
| 5 | `useMemo` is for | A) Side effects B) Caching a computed value C) DOM access D) Global state | **B** |

---

# DAY 19 — React 4: Routing, Context & Composition

**Module:** `FE-REACT` | **Duration:** 7 h | **Lesson Code:** `RX-D19`

### Learning Objectives
- Build multi-page SPAs with React Router
- Use nested routes, dynamic params, and layouts
- Share global state with Context
- Apply composition patterns (`children`, compound components)

### 19.1 Install React Router

```bash
npm i react-router-dom
```

### 19.2 Router Setup

```jsx
// main.jsx
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

```jsx
// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* Public layout */}
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="courses" element={<Courses />} />
        <Route path="courses/:slug" element={<CourseDetail />} />
        <Route path="login" element={<Login />} />
      </Route>

      {/* Protected area */}
      <Route element={<ProtectedRoute />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="dashboard/settings" element={<Settings />} />
      </Route>

      <Route path="old-home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
```

### 19.3 Layout with `<Outlet />`

```jsx
import { Outlet, NavLink } from "react-router-dom";

export default function Layout() {
  return (
    <div className="app">
      <header className="header">
        <NavLink to="/" className="logo">Ethiroli</NavLink>
        <nav>
          <NavLink
            to="/courses"
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            Courses
          </NavLink>
          <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
        </nav>
      </header>

      <main className="main">
        <Outlet />    {/* child routes render here */}
      </main>

      <footer className="footer">&copy; 2026 Ethiroli</footer>
    </div>
  );
}
```

**Nested routes**

```jsx
<Route path="dashboard" element={<DashboardLayout />}>
  <Route index element={<Overview />} />
  <Route path="courses" element={<MyCourses />} />
  <Route path="assignments" element={<Assignments />} />
  <Route path="settings" element={<Settings />} />
</Route>
```

### 19.4 Navigation

```jsx
import { Link, NavLink, useNavigate } from "react-router-dom";

// Declarative — preferred for links
<Link to="/courses">Courses</Link>
<NavLink to="/courses" className={({isActive}) => isActive ? "active" : ""}>
  Courses
</NavLink>

// Link with state
<Link to="/courses/react" state={{ from: "homepage" }}>React</Link>

// Programmatic
function LoginButton() {
  const navigate = useNavigate();

  async function handleLogin() {
    await login();
    navigate("/dashboard");        // push
    // navigate("/dashboard", { replace: true });   // no back entry
    // navigate(-1);                // go back
  }

  return <button onClick={handleLogin}>Login</button>;
}
```

### 19.5 URL Params & Query Strings

```jsx
import { useParams, useSearchParams } from "react-router-dom";

// Route: /courses/:slug
function CourseDetail() {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    fetch(`/api/courses/${slug}`).then(r => r.json()).then(setCourse);
  }, [slug]);

  if (!course) return <Spinner />;
  return <h1>{course.title}</h1>;
}

// Query params: /courses?level=beginner&page=2
function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const level = searchParams.get("level") ?? "all";
  const page = Number(searchParams.get("page") ?? 1);

  function setLevel(next) {
    setSearchParams({ level: next, page: 1 });
  }

  return (
    <>
      <select value={level} onChange={e => setLevel(e.target.value)}>
        <option value="all">All</option>
        <option value="beginner">Beginner</option>
        <option value="advanced">Advanced</option>
      </select>
      <Pagination page={page} onPageChange={p => setSearchParams({ level, page: p })} />
    </>
  );
}
```

> **Rule:** put shareable state (filters, pagination, search) in the URL.

### 19.6 Protected Routes

```jsx
// ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullPageSpinner />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
}
```

```jsx
// After login, return to where they came from
function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? "/dashboard";

  async function handleSubmit(e) {
    e.preventDefault();
    await login(credentials);
    navigate(from, { replace: true });
  }
  // ...
}
```

### 19.7 Context API

Context shares data with a subtree without prop drilling.

```jsx
// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (!res.ok) throw new Error("Invalid credentials");
      const data = await res.json();
      setUser(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data.user;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, logout, isAuthenticated: !!user }),
    [user, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
```

```jsx
// main.jsx
<BrowserRouter>
  <AuthProvider>
    <ThemeProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ThemeProvider>
  </AuthProvider>
</BrowserRouter>
```

```jsx
// Usage
function Header() {
  const { user, logout } = useAuth();
  return (
    <header>
      {user ? (
        <>
          <span>Hi, {user.name}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </header>
  );
}
```

### 19.8 When to Use Context

| Use Context | Don't use Context |
|---|---|
| Auth / current user | Frequently-changing form state |
| Theme (light/dark) | Data used by 1–2 components |
| Locale / i18n | Complex app-wide state (use Redux/Zustand) |
| Toast notifications | High-frequency updates (re-renders all consumers) |
| Feature flags | Server cache (use React Query) |

> ⚠️ **Context re-renders every consumer when the value changes.** Split contexts (e.g. `AuthStateContext` + `AuthActionsContext`) or memoize the value.

### 19.9 Theme Context Example

```jsx
// context/ThemeContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() =>
    localStorage.getItem("theme") ?? "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = () => setTheme(t => (t === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be inside ThemeProvider");
  return ctx;
};
```

### 19.10 Toast Context Example

```jsx
const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message, type = "info", duration = 4000) => {
    const id = crypto.randomUUID();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => {
      setToasts(t => t.filter(x => x.id !== id));
    }, duration);
  }, []);

  const remove = useCallback((id) => {
    setToasts(t => t.filter(x => x.id !== id));
  }, []);

  const value = useMemo(() => ({ push, remove }), [push, remove]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack" role="region" aria-live="polite">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast--${t.type}`} role="status">
            <span>{t.message}</span>
            <button onClick={() => remove(t.id)} aria-label="Dismiss">✕</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
```

### 19.11 Composition Patterns

**1. `children` slot**

```jsx
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>
```

**2. Compound components**

```jsx
function Tabs({ children, defaultTab }) {
  const [active, setActive] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}
Tabs.List = function TabsList({ children }) {
  return <div role="tablist" className="tabs__list">{children}</div>;
};
Tabs.Tab = function Tab({ id, children }) {
  const { active, setActive } = useContext(TabsContext);
  return (
    <button
      role="tab"
      aria-selected={active === id}
      className={active === id ? "tab tab--active" : "tab"}
      onClick={() => setActive(id)}
    >
      {children}
    </button>
  );
};
Tabs.Panel = function Panel({ id, children }) {
  const { active } = useContext(TabsContext);
  if (active !== id) return null;
  return <div role="tabpanel">{children}</div>;
};
```

**3. Render props** (less common now)

```jsx
<DataLoader
  url="/api/users"
  render={({ data, loading, error }) => (
    loading ? <Spinner /> : <UserList users={data} />
  )}
/>
```

**4. Higher-Order Component**

```jsx
function withAuth(Component) {
  return function Protected(props) {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    return <Component {...props} user={user} />;
  };
}
const ProtectedDashboard = withAuth(Dashboard);
```

**Prefer:** hooks + composition. Avoid HOCs and render props in new code.

### 19.12 Error Boundaries

```jsx
import { Component } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
    // send to logging service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-page">
          <h1>Something went wrong</h1>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

> Error boundaries catch render errors only — **not** event handler or async errors. Wrap the whole app and each major route.

### 19.13 Route Structure Summary

```
/                          Home (public)
/courses                   Course list
/courses/:slug             Course detail
/login                     Login
/dashboard                 Dashboard overview  (protected)
/dashboard/courses         My courses         (protected)
/dashboard/assignments     Assignments        (protected)
/dashboard/settings        Settings           (protected)
/admin/*                   Admin area         (protected, role: admin)
*                          404
```

---

### 🧪 DAY 19 TASK — `D19-T1`

**Deliverable:** A multi-page **LMS Student Portal**.

**Routes**

| Path | Page | Access |
|---|---|---|
| `/` | Landing page | Public |
| `/login` | Login form | Public |
| `/register` | Register form | Public |
| `/courses` | Course catalogue with filters | Public |
| `/courses/:slug` | Course detail with curriculum | Public |
| `/dashboard` | Overview: stats, progress, upcoming deadlines | Protected |
| `/dashboard/courses` | Enrolled courses with progress bars | Protected |
| `/dashboard/assignments` | Assignment list with submit action | Protected |
| `/dashboard/profile` | Profile edit form | Protected |
| `/admin` | Admin dashboard with user table | Protected (role: admin) |
| `*` | 404 page with a link home | Public |

**Contexts to build**

1. **`AuthContext`** — `user`, `loading`, `login()`, `logout()`, `register()`, `isAuthenticated`. Persists to localStorage. Mock API with `setTimeout`.
2. **`ThemeContext`** — `theme`, `toggle()`, persists, sets `data-theme` on `<html>`.
3. **`ToastContext`** — `push(message, type)`, auto-dismiss, stacked toasts, accessible (`aria-live`).

**Components**

| Component | Notes |
|---|---|
| `Layout` | Header + nav + `<Outlet />` + footer |
| `DashboardLayout` | Sidebar nav + breadcrumb + `<Outlet />` |
| `ProtectedRoute` | Redirects unauthenticated users, preserves intended destination |
| `Navbar` | Shows user menu when authed, login link otherwise; responsive |
| `Breadcrumbs` | Derived from the current route |
| `CourseCard` | Title, level, duration, progress, CTA |
| `AssignmentRow` | Title, due date, status badge, submit button |
| `ProgressBar` | Accessible `role="progressbar"` |
| `Tabs` | Compound component (Tabs.List, Tabs.Tab, Tabs.Panel) |
| `Modal` | Focus trap, Escape closes, restores focus |
| `ErrorBoundary` | Wraps each route |
| `NotFound` | 404 with a search box |

**Technical requirements**
- React Router v6 with nested routes and layouts
- URL state for filters & pagination (not component state)
- `useAuth` throws if used outside `AuthProvider`
- Context values memoized with `useMemo`
- Protected routes redirect with `state={{ from: location }}`
- Each route wrapped in its own `ErrorBoundary`
- 404 route for unmatched paths
- Keyboard-accessible navigation and tabs
- Responsive at 320 / 768 / 1440 px
- No console errors or warnings

**Bonus**
- Route-based code splitting with `React.lazy` + `Suspense`
- Scroll restoration on route change
- Route transition animations (respecting `prefers-reduced-motion`)
- `useDocumentTitle` hook that sets the page title per route

---

### ❓ DAY 19 QUIZ — `D19-Q` (5 Questions)

| # | Question | Options | Answer |
|---|---|---|---|
| 1 | Child routes render inside | A) `<Link>` B) `<Outlet />` C) `<Routes>` D) `<Fragment>` | **B** |
| 2 | `useParams` returns | A) Query string B) URL path parameters C) History D) Location | **B** |
| 3 | Context solves | A) Performance B) Prop drilling C) Routing D) Styling | **B** |
| 4 | `NavLink` differs from `Link` by | A) Speed B) Providing `isActive` C) Redirecting D) Nothing | **B** |
| 5 | To preserve the intended destination on login you use | A) `localStorage` B) `location.state.from` C) cookies D) Redux | **B** |

---

# DAY 20 — React 5: Advanced Patterns & Performance

**Module:** `FE-REACT` | **Duration:** 7 h | **Lesson Code:** `RX-D20`

### Learning Objectives
- Split code with `React.lazy` and `Suspense`
- Optimise rendering with `memo`, `useMemo`, `useCallback`
- Use `useReducer` for complex state
- Handle forms at scale with a custom `useForm`
- Apply accessibility and testing practices in React

### 20.1 Code Splitting

```jsx
import { lazy, Suspense } from "react";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Admin = lazy(() => import("./pages/Admin"));

function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Suspense>
  );
}
```

**Named export**

```jsx
const Chart = lazy(() =>
  import("./components/Chart").then(m => ({ default: m.Chart }))
);
```

**Route-level splitting + prefetch on hover**

```jsx
<Link
  to="/dashboard"
  onMouseEnter={() => import("./pages/Dashboard")}
>
  Dashboard
</Link>
```

### 20.2 `React.memo`

```jsx
import { memo } from "react";

// Re-renders only when props change (shallow comparison)
const RepoCard = memo(function RepoCard({ repo, onStar }) {
  return (
    <article className="card">
      <h3>{repo.name}</h3>
      <p>{repo.description}</p>
      <button onClick={() => onStar(repo.id)}>★ {repo.stars}</button>
    </article>
  );
});
```

⚠️ **`memo` is useless if props include new object/function references every render.** Pair it with `useMemo`/`useCallback` or move the state down.

```jsx
// ❌ memo never helps — new object every render
<RepoCard repo={{ ...repo }} onStar={() => star(id)} />

// ✅ Stable references
const handleStar = useCallback((id) => { /* ... */ }, []);
<RepoCard repo={repo} onStar={handleStar} />
```

**Custom comparison**

```jsx
const MemoCard = memo(RepoCard, (prev, next) => {
  return prev.repo.id === next.repo.id && prev.repo.stars === next.repo.stars;
});
```

### 20.3 Performance Checklist

| Technique | When |
|---|---|
| Move state down | State only affects a subtree |
| `React.memo` | A child re-renders with identical props |
| `useMemo` | Expensive computation or stable reference |
| `useCallback` | Function passed to a memoized child |
| Code splitting | Large route/component not needed initially |
| Virtualise long lists | 500+ rows visible |
| Debounce inputs | Search / filters triggering requests |
| Avoid inline objects in props | Breaks memoization |
| Keys must be stable | Avoid index for reorderable lists |
| `useTransition` | Non-urgent updates (filtering big lists) |
| `useDeferredValue` | Deferring expensive re-renders |

```jsx
import { useTransition, useDeferredValue } from "react";

function SearchList({ items }) {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const deferredQuery = useDeferredValue(query);

  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(deferredQuery.toLowerCase())
  );

  return (
    <>
      <input
        value={query}
        onChange={e => {
          setQuery(e.target.value);
          startTransition(() => { /* mark follow-up updates as non-urgent */ });
        }}
      />
      {isPending && <Spinner />}
      <List items={filtered} />
    </>
  );
}
```

**Profiling**

```jsx
import { Profiler } from "react";

<Profiler
  id="RepoList"
  onRender={(id, phase, actualDuration) => {
    console.log(`${id} ${phase}: ${actualDuration.toFixed(2)}ms`);
  }}
>
  <RepoList />
</Profiler>
```

Also use **React DevTools → Profiler tab** to record and find slow components.

### 20.4 `useReducer`

For complex state with multiple related updates.

```jsx
import { useReducer } from "react";

const initialState = {
  tasks: [],
  filter: "all",
  query: "",
  editingId: null,
  loading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "LOAD_START":
      return { ...state, loading: true, error: null };
    case "LOAD_SUCCESS":
      return { ...state, loading: false, tasks: action.payload };
    case "LOAD_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "ADD":
      return { ...state, tasks: [...state.tasks, action.payload] };
    case "UPDATE":
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload.id ? { ...t, ...action.payload.changes } : t
        ),
      };
    case "DELETE":
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };
    case "TOGGLE":
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload ? { ...t, done: !t.done } : t
        ),
      };
    case "SET_FILTER":
      return { ...state, filter: action.payload };
    case "SET_QUERY":
      return { ...state, query: action.payload };
    case "START_EDIT":
      return { ...state, editingId: action.payload };
    case "CANCEL_EDIT":
      return { ...state, editingId: null };
    case "CLEAR_COMPLETED":
      return { ...state, tasks: state.tasks.filter(t => !t.done) };
    default:
      return state;
  }
}

function TaskApp() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addTask = (task) => dispatch({ type: "ADD", payload: task });
  const toggleTask = (id) => dispatch({ type: "TOGGLE", payload: id });
  const deleteTask = (id) => dispatch({ type: "DELETE", payload: id });

  // derived
  const visible = state.tasks
    .filter(t =>
      state.filter === "active" ? !t.done :
      state.filter === "done"   ? t.done : true
    )
    .filter(t => t.title.toLowerCase().includes(state.query.toLowerCase()));

  return (/* ... */);
}
```

**`useState` vs `useReducer`**

| | `useState` | `useReducer` |
|---|---|---|
| Simple independent values | ✅ | Overkill |
| Related state updates | Painful | ✅ |
| Complex transitions | Hard to follow | ✅ Single reducer |
| Testability | Moderate | ✅ Pure function |
| Passing updates down | Setters | `dispatch` (stable) |

### 20.5 Custom `useForm` Hook

```jsx
import { useState, useCallback } from "react";

export function useForm({ initialValues, validate, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked, files } = e.target;
    const next =
      type === "checkbox" ? checked :
      type === "file"     ? files[0] :
      value;

    setValues(prev => {
      const updated = { ...prev, [name]: next };
      if (validate) setErrors(validate(updated));
      return updated;
    });
  }, [validate]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(t => ({ ...t, [name]: true }));
    if (validate) setErrors(validate(values));
  }, [validate, values]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const validationErrors = validate ? validate(values) : {};
    setErrors(validationErrors);
    setTouched(Object.keys(values).reduce((acc, k) => ({ ...acc, [k]: true }), {}));

    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  }, [values, validate, onSubmit]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const isValid = Object.keys(validate ? validate(values) : {}).length === 0;

  return {
    values, errors, touched, submitting, isValid,
    handleChange, handleBlur, handleSubmit, reset,
    setValues,
  };
}
```

```jsx
function RegisterForm() {
  const form = useForm({
    initialValues: { name: "", email: "", password: "", role: "intern" },
    validate: (v) => {
      const e = {};
      if (!v.name.trim()) e.name = "Name is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = "Invalid email";
      if (v.password.length < 8) e.password = "Min 8 characters";
      return e;
    },
    onSubmit: async (values) => {
      await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
    },
  });

  const showError = (field) => form.touched[field] && form.errors[field];

  return (
    <form onSubmit={form.handleSubmit} noValidate>
      <label htmlFor="name">Name</label>
      <input
        id="name" name="name"
        value={form.values.name}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        aria-invalid={!!showError("name")}
        aria-describedby={showError("name") ? "name-error" : undefined}
      />
      {showError("name") && <p id="name-error" role="alert">{form.errors.name}</p>}

      {/* email, password, role ... */}

      <button type="submit" disabled={form.submitting}>
        {form.submitting ? "Submitting…" : "Register"}
      </button>
    </form>
  );
}
```

### 20.6 Accessibility in React

```jsx
// 1. Labels
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// 2. Buttons for actions, links for navigation
<button onClick={save}>Save</button>          // ✅
<a href="/courses">Courses</a>                // ✅
<div onClick={save}>Save</div>                // ❌ not focusable

// 3. aria-live for dynamic content
<div aria-live="polite" role="status">{message}</div>

// 4. Loading state
<div role="status" aria-label="Loading">
  <Spinner />
</div>

// 5. Modal
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">Confirm delete</h2>
  {/* focus trap, Escape to close, restore focus */}
</div>

// 6. Tabs
<div role="tablist">
  <button role="tab" aria-selected={active === "a"} aria-controls="panel-a">A</button>
</div>
<div role="tabpanel" id="panel-a" hidden={active !== "a"}>…</div>

// 7. Skip link
<a href="#main" className="skip-link">Skip to content</a>
```

**Focus management**

```jsx
function Modal({ isOpen, onClose, children }) {
  const dialogRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    previouslyFocused.current = document.activeElement;
    dialogRef.current?.focus();

    function onKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        // basic focus trap
        const focusables = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previouslyFocused.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return (
    <div className="backdrop" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className="modal"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
```

### 20.7 Testing (Vitest + React Testing Library)

```bash
npm i -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    globals: true,
  },
});
```

```javascript
// src/test/setup.js
import "@testing-library/jest-dom";
```

```jsx
// Counter.test.jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import Counter from "./Counter";

describe("Counter", () => {
  it("renders the initial count", () => {
    render(<Counter initial={0} />);
    expect(screen.getByText(/count: 0/i)).toBeInTheDocument();
  });

  it("increments on click", async () => {
    const user = userEvent.setup();
    render(<Counter initial={0} />);
    await user.click(screen.getByRole("button", { name: /increment/i }));
    expect(screen.getByText(/count: 1/i)).toBeInTheDocument();
  });

  it("does not go below zero", async () => {
    const user = userEvent.setup();
    render(<Counter initial={0} />);
    await user.click(screen.getByRole("button", { name: /decrement/i }));
    expect(screen.getByText(/count: 0/i)).toBeInTheDocument();
  });
});
```

**Query priority (Testing Library)**

| Priority | Query | Use |
|---|---|---|
| 1 | `getByRole` | ✅ Preferred — mirrors how users + a11y find things |
| 2 | `getByLabelText` | Form fields |
| 3 | `getByPlaceholderText` | When no label |
| 4 | `getByText` | Non-interactive content |
| 5 | `getByTestId` | Last resort |

**Test the behaviour, not the implementation.** Avoid asserting on state variables or class names.

### 20.8 Project Structure at Scale

```
src/
├── app/
│   ├── App.jsx
│   ├── router.jsx
│   └── providers.jsx
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api.js
│   │   └── AuthContext.jsx
│   ├── courses/
│   └── dashboard/
├── components/          # shared UI primitives
│   ├── ui/
│   └── layout/
├── hooks/               # shared hooks
├── lib/                 # api client, utils
├── styles/
└── test/
```

**Feature-first beats type-first** as the app grows — everything related to a feature lives together.

### 20.9 Reusable Component Checklist

- [ ] Accepts `className` for extension
- [ ] Forwards `ref` when wrapping a DOM element (`forwardRef`)
- [ ] Spreads `...rest` onto the root element
- [ ] Has sensible defaults
- [ ] `propTypes` or TypeScript types
- [ ] Accessible: roles, labels, keyboard, focus
- [ ] Handles edge cases: empty, loading, error, disabled
- [ ] No business logic inside
- [ ] Documented with a usage example

```jsx
import { forwardRef } from "react";

const Input = forwardRef(function Input(
  { label, error, hint, className = "", id, ...rest },
  ref
) {
  const inputId = id ?? `input-${Math.random().toString(36).slice(2, 9)}`;
  const describedBy = [
    error ? `${inputId}-error` : null,
    hint ? `${inputId}-hint` : null,
  ].filter(Boolean).join(" ") || undefined;

  return (
    <div className={`field ${className}`}>
      {label && <label htmlFor={inputId}>{label}</label>}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        {...rest}
      />
      {hint && !error && <p id={`${inputId}-hint`} className="hint">{hint}</p>}
      {error && <p id={`${inputId}-error`} role="alert" className="error">{error}</p>}
    </div>
  );
});

export default Input;
```

---

### 🧪 DAY 20 TASK — `D20-T1`

**Deliverable:** Upgrade the Day 19 LMS portal with advanced patterns.

**Part A — State architecture**
1. Convert the task/dashboard state to `useReducer` with a documented action list
2. Write the reducer as a **pure function** and export it
3. Write 8 unit tests for the reducer covering every action

**Part B — Custom form hook**
4. Build `useForm({ initialValues, validate, onSubmit })` per the spec above
5. Use it in 3 forms: Login, Register, Profile Edit
6. Each form must show: inline field errors, a submitting state, disabled submit when invalid, success + error toasts

**Part C — Performance**
7. Lazy-load 4 routes with `React.lazy` + `Suspense` and a skeleton fallback
8. Wrap the list item component in `React.memo` and prove (with the Profiler) that it stops re-rendering unnecessarily
9. Use `useMemo` for an expensive derived list and `useCallback` for handlers passed to memoized children
10. Add `useTransition` or `useDeferredValue` to a large list filter
11. Record a Profiler screenshot **before** and **after** optimisation with render counts

**Part D — Accessibility**
12. Build an accessible `Modal` with focus trap, Escape, and focus restoration
13. Build an accessible compound `Tabs` component with `role="tablist"` / `role="tab"` / `aria-selected` and arrow-key navigation
14. Add a "Skip to main content" link
15. Add `aria-live` regions for all toasts and form success messages

**Part E — Testing**
16. Write tests for: `useForm`, `Modal`, `Tabs`, `Button`, and the reducer
17. Minimum 20 tests total
18. Achieve ≥ 70% coverage on the components you tested

**Part F — Documentation**
19. `ARCHITECTURE.md` explaining folder structure, state strategy, and data flow
20. `PERFORMANCE.md` with the Profiler evidence
21. `A11Y.md` documenting keyboard behaviour for every interactive component

**Bonus**
- Add `@tanstack/react-query` for server state and compare it with hand-rolled `useFetch`
- Add a virtualised list (react-window) and benchmark with 5,000 rows
- Add a Storybook-style "Kitchen Sink" route showing every component state

---

### ❓ DAY 20 QUIZ — `D20-Q` (5 Questions)

| # | Question | Options | Answer |
|---|---|---|---|
| 1 | `React.memo` prevents re-renders when | A) State changes B) Props are shallow-equal C) Context changes D) Never | **B** |
| 2 | `useReducer` is preferable when | A) One simple value B) Multiple related state transitions C) No state D) Only for forms | **B** |
| 3 | `React.lazy` is for | A) Lazy state B) Code splitting C) Effects D) Context | **B** |
| 4 | `useCallback` returns | A) A memoized value B) A memoized function C) A ref D) A promise | **B** |
| 5 | Preferred Testing Library query | A) `getByTestId` B) `getByRole` C) `container.querySelector` D) `getByClassName` | **B** |

---

# DAY 21 — React Project Day

**Module:** `FE-REACT` | **Duration:** 7 h | **Lesson Code:** `RX-D21`

### Objective
Build a complete, production-quality React SPA that consolidates Days 16–20.

### Project Options

| Option | App | Highlights |
|---|---|---|
| A | **Employee Management Dashboard** | Tables, CRUD, role-based UI, charts |
| B | **Course Marketplace** | Catalogue, search, filters, cart, checkout UI |
| C | **Project Tracker** | Kanban, drag & drop, comments, activity feed |
| D | **Expense Manager** | Categories, budgets, charts, recurring items |
| E | **Support Ticket System** | Queues, SLA timers, statuses, assignment |

### Mandatory Requirements

**Routing**
- Minimum 6 routes with nested layouts
- At least 2 protected routes with role checking
- URL-driven filters, search, and pagination
- 404 route

**State**
- All list state via `useReducer`
- Global state (auth, theme, toasts) via Context
- Server data via `useFetch` or React Query
- Zero duplicate state

**CRUD**
- Create with a validated form
- Read with search, filter, sort, pagination
- Update with inline edit or a modal
- Delete with confirmation + undo

**Custom Hooks (≥ 5)**
- `useLocalStorage`, `useFetch`, `useForm`, `useDebounce`, `useMediaQuery`, `useClickOutside`, `useToggle`

**Performance**
- Route-based code splitting
- `React.memo` on list items with `useCallback` handlers
- `useMemo` for derived lists
- Profiler screenshot before/after

**UX**
- Loading skeletons (not just spinners)
- Empty states (no data vs no match)
- Error states with retry
- Optimistic updates with rollback on failure
- Toasts for all mutations
- Confirmation modals for destructive actions

**Accessibility**
- All interactive elements keyboard reachable
- Focus visible everywhere
- Modal focus trap + restoration
- `aria-live` for dynamic updates
- Contrast ≥ 4.5:1
- Axe DevTools: 0 critical violations

**Code Quality**
- Feature-based folder structure
- No file > 200 lines
- No component > 120 lines
- `propTypes` on every component (or TypeScript)
- No `any` if using TS
- ESLint: 0 errors, 0 warnings
- Prettier formatted

**Deliverables**
1. GitHub repo with ≥ 20 conventional commits
2. `README.md` — features, screenshots, setup, architecture, tech decisions
3. `ARCHITECTURE.md`
4. Live demo (Vercel / Netlify)
5. Lighthouse report: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 90
6. Test suite with ≥ 25 tests

### Grading Rubric (100)

| Criterion | Marks |
|---|---|
| All required features working end-to-end | 25 |
| Architecture & state management | 15 |
| Custom hooks usage & quality | 10 |
| Performance optimisation (with evidence) | 10 |
| Accessibility | 10 |
| UX completeness (loading/empty/error/undo) | 10 |
| Code quality & consistency | 8 |
| Tests | 7 |
| Documentation & live demo | 5 |

---

### ❓ DAY 21 QUIZ — `D21-Q` (5 Questions)

| # | Question | Options | Answer |
|---|---|---|---|
| 1 | Optimistic update means | A) Waiting for the server B) Updating the UI before the server confirms, rolling back on failure C) Never updating D) Caching only | **B** |
| 2 | Feature-based folders group by | A) File type B) Feature/domain C) Alphabet D) Author | **B** |
| 3 | A skeleton screen is better than a spinner because | A) It's prettier B) It preserves layout and reduces perceived wait C) It's faster D) It needs no CSS | **B** |
| 4 | Route-based code splitting uses | A) `useMemo` B) `React.lazy` + `Suspense` C) `useReducer` D) Context | **B** |
| 5 | A 404 route is defined with | A) `path="/error"` B) `path="*"` C) `path="404"` D) `NotFound` prop | **B** |

---

# 📅 WEEK 4 — APIS, BACKEND BASICS & PROJECT

---

# DAY 22 — API Basics: HTTP, REST & Postman

**Module:** `BE-REST` | **Duration:** 7 h | **Lesson Code:** `BE-D22`

### Learning Objectives
- Explain HTTP request/response in detail
- Apply REST principles and resource naming
- Test APIs with Postman
- Read and write API documentation

### 22.1 HTTP Fundamentals

**An HTTP exchange**

```
REQUEST                                    RESPONSE
─────────────────────────────────────      ─────────────────────────────────────
POST /api/v1/users HTTP/1.1                HTTP/1.1 201 Created
Host: api.ethiroli.com                     Content-Type: application/json
Content-Type: application/json             Location: /api/v1/users/42
Authorization: Bearer eyJhbGci...          X-Request-Id: a1b2c3
Accept: application/json                   
                                            {
{                                            "id": 42,
  "name": "Asha",                            "name": "Asha",
  "email": "asha@ethiroli.com"               "email": "asha@ethiroli.com",
}                                            "createdAt": "2026-02-14T10:00:00Z"
                                            }
```

**Request parts**

| Part | Example | Notes |
|---|---|---|
| Method | `GET`, `POST` | The verb |
| Path | `/api/v1/users/42` | The resource |
| Query string | `?page=2&limit=20` | Filters, pagination |
| Headers | `Content-Type`, `Authorization` | Metadata |
| Body | JSON payload | For POST/PUT/PATCH |

**HTTP methods**

| Method | Purpose | Safe? | Idempotent? | Has body? |
|---|---|---|---|---|
| `GET` | Read | ✅ | ✅ | ❌ |
| `POST` | Create | ❌ | ❌ | ✅ |
| `PUT` | Replace | ❌ | ✅ | ✅ |
| `PATCH` | Partial update | ❌ | ❌ | ✅ |
| `DELETE` | Remove | ❌ | ✅ | ❌ (usually) |
| `HEAD` | GET without body | ✅ | ✅ | ❌ |
| `OPTIONS` | Capabilities / CORS preflight | ✅ | ✅ | ❌ |

> **Idempotent** = calling it N times has the same effect as calling it once.

**Status codes**

| Range | Meaning | Common |
|---|---|---|
| 1xx | Informational | 100 Continue |
| 2xx | Success | 200 OK, 201 Created, 204 No Content |
| 3xx | Redirection | 301 Moved Permanently, 304 Not Modified |
| 4xx | Client error | 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable, 429 Too Many Requests |
| 5xx | Server error | 500 Internal Server Error, 502 Bad Gateway, 503 Unavailable, 504 Timeout |

**Which code when**

| Situation | Code |
|---|---|
| Created a resource | 201 + `Location` header |
| Deleted successfully, nothing to return | 204 |
| Validation failed | 400 or 422 |
| Missing/invalid token | 401 |
| Valid token, insufficient permission | 403 |
| Resource doesn't exist | 404 |
| Duplicate email | 409 |
| Rate limit exceeded | 429 |
| Unexpected server crash | 500 |

**Important headers**

| Header | Direction | Purpose |
|---|---|---|
| `Content-Type` | Both | Media type of the body |
| `Accept` | Request | What the client wants back |
| `Authorization` | Request | Credentials (`Bearer <token>`) |
| `Location` | Response | URL of the created resource |
| `Cache-Control` | Both | Caching rules |
| `ETag` / `If-None-Match` | Both | Conditional requests |
| `Access-Control-Allow-Origin` | Response | CORS |
| `X-RateLimit-Remaining` | Response | Rate limit info |
| `Set-Cookie` | Response | Set a cookie |

### 22.2 REST Principles

1. **Client–server separation** — UI and data are independent.
2. **Statelessness** — every request carries all the info needed; the server keeps no session state.
3. **Cacheability** — responses declare whether they can be cached.
4. **Uniform interface** — consistent resource naming and verbs.
5. **Layered system** — clients don't know if they're talking to the origin or a proxy.
6. **Code on demand** (optional) — the server can send executable code.

**Resource naming rules**

| ✅ Good | ❌ Bad | Why |
|---|---|---|
| `GET /users` | `GET /getAllUsers` | Verb belongs in the method, not the URL |
| `GET /users/42` | `GET /user?id=42` | Path identifies the resource |
| `POST /users` | `POST /createUser` | `POST` already means create |
| `GET /users/42/orders` | `GET /orders?userId=42` | Nested resources are clearer |
| `GET /orders?status=paid` | `GET /getPaidOrders` | Filters go in the query string |
| `DELETE /users/42` | `POST /users/42/delete` | Use the DELETE method |

**Rules**
- Nouns, plural, lowercase, kebab-case: `/course-modules`
- No file extensions: `/users` not `/users.json`
- No verbs in paths (except controller-style actions like `/users/42/activate`)
- Version the API: `/api/v1/...`
- Max 2 levels of nesting; beyond that, use query params

**Full resource example**

```
GET    /api/v1/courses                 # list (paginated)
POST   /api/v1/courses                 # create
GET    /api/v1/courses/:id             # read one
PUT    /api/v1/courses/:id             # replace
PATCH  /api/v1/courses/:id             # partial update
DELETE /api/v1/courses/:id             # delete

GET    /api/v1/courses/:id/modules     # sub-resource
POST   /api/v1/courses/:id/modules     # add sub-resource

GET    /api/v1/courses?level=beginner&page=2&limit=20&sort=-createdAt
```

### 22.3 Pagination, Filtering, Sorting

```
# Offset pagination
GET /courses?page=2&limit=20

# Cursor pagination (better for large/real-time data)
GET /courses?cursor=eyJpZCI6NDJ9&limit=20

# Filtering
GET /courses?level=beginner&category=web&isActive=true

# Multi-value
GET /courses?level=beginner,intermediate

# Range
GET /courses?price[gte]=1000&price[lte]=5000

# Sorting (prefix - for descending)
GET /courses?sort=-createdAt
GET /courses?sort=level,-rating

# Field selection (sparse fieldsets)
GET /courses?fields=id,title,price

# Search
GET /courses?q=react

# Combined
GET /api/v1/courses?q=react&level=beginner&sort=-rating&page=1&limit=12
```

**Paginated response envelope**

```json
{
  "data": [
    { "id": 1, "title": "Full Stack Development", "level": "intermediate" }
  ],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 84,
    "totalPages": 7,
    "hasNext": true,
    "hasPrev": false
  },
  "links": {
    "self": "/api/v1/courses?page=1&limit=12",
    "next": "/api/v1/courses?page=2&limit=12",
    "last": "/api/v1/courses?page=7&limit=12"
  }
}
```

### 22.4 JSON Conventions

```json
{
  "id": 42,
  "firstName": "Asha",
  "email": "asha@ethiroli.com",
  "role": "intern",
  "isActive": true,
  "skills": ["JavaScript", "React"],
  "address": {
    "city": "Chennai",
    "pincode": "600001"
  },
  "createdAt": "2026-02-14T10:00:00.000Z",
  "updatedAt": "2026-02-14T12:30:00.000Z",
  "deletedAt": null
}
```

**Rules**
- `camelCase` keys
- ISO 8601 UTC dates with milliseconds
- `null` for "no value", omit for "not applicable"
- Booleans prefixed with `is` / `has` / `can`
- Arrays are always arrays, never `null`
- Never return passwords, tokens, or internal IDs

### 22.5 Error Response Format

**Consistent envelope (RFC 7807 inspired)**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      { "field": "email", "message": "Must be a valid email address" },
      { "field": "password", "message": "Must be at least 8 characters" }
    ],
    "timestamp": "2026-02-14T10:00:00.000Z",
    "path": "/api/v1/users",
    "requestId": "a1b2c3d4"
  }
}
```

**Rules**
- One consistent shape for every error
- Machine-readable `code` + human-readable `message`
- Field-level `details` for validation errors
- **Never** leak stack traces or SQL in production

### 22.6 Authentication Basics (Overview)

```
1. Client sends credentials to /auth/login
2. Server verifies and returns a JWT
3. Client stores it (HttpOnly cookie preferred)
4. Client sends it on every request:  Authorization: Bearer <token>
5. Server verifies the signature and expiry on each request
```

**JWT structure**

```
header.payload.signature
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiI0MiIsInJvbGUiOiJpbnRlcm4iLCJleHAiOjE3NzEwNzIwMDB9.
dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk
```

```json
// Decoded payload
{
  "sub": "42",
  "role": "intern",
  "iat": 1770985600,
  "exp": 1771072000
}
```

> The payload is **base64-encoded, not encrypted**. Never put secrets in a JWT.

### 22.7 CORS

Browsers block cross-origin requests unless the server opts in.

```http
# Preflight
OPTIONS /api/users
Origin: http://localhost:5173
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, Authorization

# Server response
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
```

> `Access-Control-Allow-Origin: *` is incompatible with `Allow-Credentials: true`.

### 22.8 Postman

**Setup**
1. Create a **Collection** — `Ethiroli API v1`
2. Create **Environments** — `Local`, `Staging`, `Production` with variables
3. Use `{{baseUrl}}` in requests

**Environment variables**

```json
{
  "baseUrl": "http://localhost:5000/api/v1",
  "token": "",
  "userId": ""
}
```

**Save the token automatically after login**

```javascript
// Tests tab of POST /auth/login
const res = pm.response.json();
pm.environment.set("token", res.token);
pm.environment.set("userId", res.user.id);

pm.test("Login returns 200", () => pm.response.to.have.status(200));
pm.test("Response has a token", () => pm.expect(res.token).to.be.a("string"));
pm.test("Response time < 800ms", () => pm.expect(pm.response.responseTime).to.be.below(800));
```

**Use the token in other requests**

```
Authorization: Bearer {{token}}
```

**Common test snippets**

```javascript
// Status
pm.test("Status is 201", () => pm.response.to.have.status(201));

// Schema
const schema = {
  type: "object",
  required: ["id", "name", "email"],
  properties: {
    id: { type: "number" },
    name: { type: "string" },
    email: { type: "string" },
  },
};
pm.test("Schema is valid", () => pm.response.to.have.jsonSchema(schema));

// Body assertions
const json = pm.response.json();
pm.test("Has data array", () => pm.expect(json.data).to.be.an("array"));
pm.test("At least one item", () => pm.expect(json.data.length).to.be.above(0));

// Save from response
pm.collectionVariables.set("createdId", json.data.id);
```

**Collection-level pre-request script**

```javascript
pm.request.headers.add({
  key: "X-Client",
  value: "postman-ethiroli",
});
```

**Newman — run collections in CI**

```bash
npm i -g newman
newman run Ethiroli.postman_collection.json -e local.postman_environment.json --reporters cli,htmlextra
```

### 22.9 API Documentation

**OpenAPI 3.0 (YAML)**

```yaml
openapi: 3.0.3
info:
  title: Ethiroli LMS API
  version: 1.0.0
  description: REST API for the Ethiroli learning platform
servers:
  - url: http://localhost:5000/api/v1
    description: Local
  - url: https://api.ethiroli.com/api/v1
    description: Production

paths:
  /courses:
    get:
      summary: List courses
      tags: [Courses]
      parameters:
        - in: query
          name: page
          schema: { type: integer, default: 1 }
        - in: query
          name: limit
          schema: { type: integer, default: 12, maximum: 100 }
        - in: query
          name: level
          schema: { type: string, enum: [beginner, intermediate, advanced] }
        - in: query
          name: sort
          schema: { type: string, example: "-createdAt" }
      responses:
        "200":
          description: Paginated list of courses
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items: { $ref: "#/components/schemas/Course" }
                  meta: { $ref: "#/components/schemas/Pagination" }
        "400":
          $ref: "#/components/responses/BadRequest"

    post:
      summary: Create a course
      tags: [Courses]
      security: [{ bearerAuth: [] }]
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: "#/components/schemas/CourseInput" }
      responses:
        "201":
          description: Created
          content:
            application/json:
              schema: { $ref: "#/components/schemas/Course" }
        "401": { $ref: "#/components/responses/Unauthorized" }
        "422": { $ref: "#/components/responses/ValidationError" }

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    Course:
      type: object
      required: [id, title, level, durationDays]
      properties:
        id: { type: integer, example: 1 }
        title: { type: string, example: "45-Day Full Stack Internship" }
        level: { type: string, enum: [beginner, intermediate, advanced] }
        durationDays: { type: integer, example: 45 }
        price: { type: number, example: 14999 }
        createdAt: { type: string, format: date-time }
    CourseInput:
      type: object
      required: [title, level, durationDays]
      properties:
        title: { type: string, minLength: 3, maxLength: 120 }
        level: { type: string, enum: [beginner, intermediate, advanced] }
        durationDays: { type: integer, minimum: 1 }
    Pagination:
      type: object
      properties:
        page: { type: integer }
        limit: { type: integer }
        total: { type: integer }
        totalPages: { type: integer }

  responses:
    BadRequest:
      description: Bad request
      content:
        application/json:
          schema: { $ref: "#/components/schemas/Error" }
    Unauthorized:
      description: Missing or invalid token
    ValidationError:
      description: Validation failed
    Error:
      type: object
      properties:
        error:
          type: object
          properties:
            code: { type: string }
            message: { type: string }
```

**Serve Swagger UI**

```bash
npm i swagger-ui-express
```

```javascript
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const spec = YAML.load("./openapi.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));
```

### 22.10 API Client in JavaScript

```javascript
// lib/apiClient.js
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";

class ApiError extends Error {
  constructor(message, status, code, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

async function request(path, { method = "GET", body, headers = {}, signal } = {}) {
  const token = localStorage.getItem("token");
  const isFormData = body instanceof FormData;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    signal,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const err = data?.error ?? {};
    throw new ApiError(
      err.message ?? `Request failed with ${res.status}`,
      res.status,
      err.code,
      err.details
    );
  }

  return data;
}

export const api = {
  get:    (path, opts)       => request(path, { ...opts }),
  post:   (path, body, opts) => request(path, { ...opts, method: "POST",   body }),
  put:    (path, body, opts) => request(path, { ...opts, method: "PUT",    body }),
  patch:  (path, body, opts) => request(path, { ...opts, method: "PATCH",  body }),
  delete: (path, opts)       => request(path, { ...opts, method: "DELETE" }),
};
```

```javascript
// features/courses/api.js
import { api } from "@/lib/apiClient";

export const coursesApi = {
  list: (params = {}) => api.get(`/courses?${new URLSearchParams(params)}`),
  get: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post("/courses", data),
  update: (id, data) => api.patch(`/courses/${id}`, data),
  remove: (id) => api.delete(`/courses/${id}`),
};
```

---

### 🧪 DAY 22 TASK — `D22-T1`

**Deliverable:** A complete Postman collection + OpenAPI spec.

**Part A — Postman Collection (≥ 25 requests)**

Build `Ethiroli-API.postman_collection.json` with these folders:

| Folder | Requests |
|---|---|
| **Auth** | Register, Login, Refresh, Logout, Me, Forgot Password, Reset Password |
| **Users** | List (paginated), Get by ID, Create, Update, Patch, Delete, Search, Upload Avatar |
| **Courses** | List (filtered/sorted/paginated), Get by ID, Create, Update, Delete, Enrol, Get Enrolled |
| **Assignments** | List, Get, Create, Submit, Grade |
| **Health** | `/health`, `/version` |

**Requirements**

1. Two environments: `Local` and `Production` with variables: `baseUrl`, `token`, `refreshToken`, `userId`, `courseId`, `assignmentId`
2. Login request saves `token` and `userId` to the environment via a test script
3. **Every** request has at least 3 tests: status code, response schema, and one business assertion
4. A collection-level pre-request script adding an `X-Client-Id` header
5. A folder-level script that aborts the run if no token is present
6. Document the expected status codes in each request's description
7. Export as JSON and commit it

**Part B — OpenAPI 3.0 Spec (`openapi.yaml`)**

1. Document **all** endpoints used in Part A
2. Define reusable `components.schemas` for: `User`, `Course`, `Assignment`, `Submission`, `Error`, `Pagination`
3. Define `securitySchemes.bearerAuth`
4. Define reusable responses: `BadRequest`, `Unauthorized`, `Forbidden`, `NotFound`, `ValidationError`, `ServerError`
5. Include realistic `example` values everywhere
6. Add request/response examples for at least 5 endpoints
7. Validate at https://editor.swagger.io — must show **zero errors**

**Part C — Documentation (`API.md`)**

1. Overview, base URL, versioning strategy
2. Authentication flow with a diagram
3. Every endpoint with: method, path, auth required, query params, request body, response, status codes, curl example
4. Pagination, filtering, sorting conventions
5. Error code catalogue (every code the API can return)
6. Rate limiting policy
7. Changelog section

**Part D — Practical Exercises**

Write a `FINDINGS.md` answering:

1. What HTTP status should you return when a user tries to enrol in a course that's full? Why?
2. `PUT /users/42` vs `PATCH /users/42` — give a concrete example of each
3. Why is `GET /users/42/orders/99/items/7/reviews` a bad URL? Rewrite it
4. Design the endpoints for a "leave a comment on an assignment submission" feature
5. What's the difference between 401 and 403? Give a real scenario for each
6. Why should pagination use `limit` with a maximum value?
7. What's the risk of returning a stack trace to a client?

**Part E — Newman Run**

Run the collection with Newman and attach:
- A CLI screenshot showing pass/fail counts
- An HTML report (`htmlextra`)

**Bonus**
- Add a Postman **Mock Server** for `/courses` and point a request at it
- Write a Postman **Monitor** configuration for a daily health check
- Generate a TypeScript client from the OpenAPI spec with `openapi-typescript`

---

### ❓ DAY 22 QUIZ — `D22-Q` (5 Questions)

| # | Question | Options | Answer |
|---|---|---|---|
| 1 | Which method is idempotent? | A) POST B) PUT C) PATCH D) None | **B** |
| 2 | Status for "created successfully" | A) 200 B) 201 C) 204 D) 302 | **B** |
| 3 | Status for "authenticated but not allowed" | A) 401 B) 403 C) 404 D) 500 | **B** |
| 4 | Which URL follows REST conventions? | A) `GET /getUsers` B) `GET /users` C) `GET /users/getAll` D) `POST /users/list` | **B** |
| 5 | `DELETE` successfully with no body returns | A) 200 B) 201 C) 204 D) 404 | **C** |

---

# DAY 23 — API Integration in React

**Module:** `FS-INTEGRATION` | **Duration:** 7 h | **Lesson Code:** `FS-D23`

### Learning Objectives
- Connect a React app to a REST API
- Handle loading, error, empty, and success states
- Implement search, filter, sort, and pagination against a real API
- Perform CRUD with optimistic updates and rollback
- Cancel in-flight requests

### 23.1 The Data Fetching Lifecycle

```
Component mounts
      ↓
State: loading = true, error = null, data = null
      ↓
Fetch API
      ├── Success → data set, loading = false
      ├── Empty   → data = [], loading = false
      └── Error   → error set, loading = false
      ↓
Render the appropriate UI
```

**Four states you must always handle**

| State | UI |
|---|---|
| Loading | Skeleton / spinner |
| Error | Message + Retry button |
| Empty | Illustration + CTA |
| Success | Data rendered |

### 23.2 `fetch` vs `axios`

```javascript
// fetch — built in
const res = await fetch(url);
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const data = await res.json();

// axios — nicer ergonomics
import axios from "axios";
const { data } = await axios.get(url);   // throws on 4xx/5xx automatically
```

| Feature | fetch | axios |
|---|---|---|
| Built in | ✅ | ❌ (install) |
| Auto JSON parse | ❌ (manual) | ✅ |
| Throws on 4xx/5xx | ❌ | ✅ |
| Request/response interceptors | ❌ | ✅ |
| Upload progress | ❌ | ✅ |
| Timeout | Manual (`AbortController`) | Built in |
| Bundle size | 0 | ~13 KB |

**For Ethiroli projects: use `fetch` wrapped in a small client (Day 22's `apiClient.js`).**

### 23.3 Basic Integration

```jsx
import { useState, useEffect } from "react";
import { coursesApi } from "@/features/courses/api";

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await coursesApi.list({ signal: controller.signal });
        setCourses(data);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  if (loading) return <CourseListSkeleton />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!courses.length) return <EmptyState title="No courses yet" action={{ label: "Browse all", to: "/courses" }} />;

  return (
    <ul className="course-grid">
      {courses.map(c => <CourseCard key={c.id} course={c} />)}
    </ul>
  );
}
```

### 23.4 Reusable `useFetch` (from Day 18)

```jsx
export function useFetch(url, { immediate = true, initialData = null } = {}) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!immediate || !url) return;
    const controller = new AbortController();
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled && err.name !== "AbortError") setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; controller.abort(); };
  }, [url, immediate, reloadKey]);

  const refetch = useCallback(() => setReloadKey(k => k + 1), []);

  return { data, loading, error, refetch };
}
```

### 23.5 Search with Debounce

```jsx
function CourseSearch() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);

  const url = debouncedQuery
    ? `/api/v1/courses?q=${encodeURIComponent(debouncedQuery)}`
    : null;

  const { data, loading, error } = useFetch(url);

  return (
    <>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search courses…"
        aria-label="Search courses"
      />
      {loading && <InlineSpinner />}
      {data && <Results items={data.data} query={debouncedQuery} />}
    </>
  );
}
```

> **Why debounce?** Without it, typing "react" fires 5 requests. With it, 1 request after the user pauses.

### 23.6 URL-Driven Filters, Sort, Pagination

```jsx
import { useSearchParams } from "react-router-dom";

export default function CoursesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = {
    q: searchParams.get("q") ?? "",
    level: searchParams.get("level") ?? "all",
    sort: searchParams.get("sort") ?? "-createdAt",
    page: Number(searchParams.get("page") ?? 1),
    limit: Number(searchParams.get("limit") ?? 12),
  };

  // Build the API query string, skipping empty values
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== "" && v !== "all")
  ).toString();

  const { data, loading, error, refetch } = useFetch(`/api/v1/courses?${query}`);
  const courses = data?.data ?? [];
  const meta = data?.meta ?? { page: 1, totalPages: 1 };

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value === "" || value === "all" || value == null) next.delete(key);
    else next.set(key, value);
    if (key !== "page") next.set("page", "1");   // reset page on filter change
    setSearchParams(next);
  }

  return (
    <>
      <Filters
        value={params}
        onChange={updateParam}
        onReset={() => setSearchParams({})}
      />

      {loading && <CourseGridSkeleton count={6} />}
      {error && <ErrorState error={error} onRetry={refetch} />}
      {!loading && !error && courses.length === 0 && (
        <EmptyState
          title="No courses match your filters"
          description="Try widening your search."
          action={{ label: "Clear filters", onClick: () => setSearchParams({}) }}
        />
      )}
      {!loading && courses.length > 0 && (
        <>
          <CourseGrid courses={courses} />
          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            onPageChange={(p) => updateParam("page", String(p))}
          />
        </>
      )}
    </>
  );
}
```

**Pagination component**

```jsx
function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = getPageWindow(page, totalPages);   // e.g. [1, "…", 4, 5, 6, "…", 12]

  return (
    <nav aria-label="Pagination" className="pagination">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        Prev
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} aria-hidden="true">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={p === page ? "page page--active" : "page"}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  );
}
```

### 23.7 CRUD with Optimistic Updates

```jsx
function useCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { push } = useToast();

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await coursesApi.list();
      setCourses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // CREATE — optimistic
  const create = useCallback(async (payload) => {
    const tempId = `temp-${crypto.randomUUID()}`;
    const optimistic = { ...payload, id: tempId, createdAt: new Date().toISOString() };

    setCourses(prev => [optimistic, ...prev]);       // 1. show immediately

    try {
      const created = await coursesApi.create(payload);
      setCourses(prev => prev.map(c => c.id === tempId ? created : c));  // 2. replace
      push("Course created", "success");
      return created;
    } catch (err) {
      setCourses(prev => prev.filter(c => c.id !== tempId));             // 3. rollback
      push(err.message, "error");
      throw err;
    }
  }, [push]);

  // UPDATE — optimistic
  const update = useCallback(async (id, changes) => {
    const previous = courses.find(c => c.id === id);
    setCourses(prev => prev.map(c => c.id === id ? { ...c, ...changes } : c));

    try {
      const updated = await coursesApi.update(id, changes);
      setCourses(prev => prev.map(c => c.id === id ? updated : c));
      push("Course updated", "success");
    } catch (err) {
      setCourses(prev => prev.map(c => c.id === id ? previous : c));      // rollback
      push(err.message, "error");
    }
  }, [courses, push]);

  // DELETE — optimistic with undo
  const remove = useCallback(async (id) => {
    const snapshot = courses;
    setCourses(prev => prev.filter(c => c.id !== id));

    try {
      await coursesApi.remove(id);
      push("Course deleted", "success", {
        action: { label: "Undo", onClick: () => setCourses(snapshot) },
      });
    } catch (err) {
      setCourses(snapshot);
      push(err.message, "error");
    }
  }, [courses, push]);

  return { courses, loading, error, refetch: load, create, update, remove };
}
```

**Optimistic update rules**

1. Apply the change to local state immediately.
2. Fire the request.
3. On success, replace the optimistic entry with the server's version.
4. On failure, roll back to the snapshot and show an error.
5. Never optimistically update something the server is likely to reject (e.g. a unique email).

### 23.8 Race Condition Handling

```jsx
// ❌ The slower response can overwrite the faster one
useEffect(() => {
  fetch(`/api/search?q=${query}`).then(r => r.json()).then(setResults);
}, [query]);

// ✅ Abort the previous request
useEffect(() => {
  const controller = new AbortController();
  fetch(`/api/search?q=${query}`, { signal: controller.signal })
    .then(r => r.json())
    .then(setResults)
    .catch(err => { if (err.name !== "AbortError") console.error(err); });
  return () => controller.abort();
}, [query]);

// ✅ Or track a request id
const requestId = useRef(0);
useEffect(() => {
  const id = ++requestId.current;
  fetch(`/api/search?q=${query}`)
    .then(r => r.json())
    .then(data => { if (id === requestId.current) setResults(data); });
}, [query]);
```

### 23.9 File Upload

```jsx
function AvatarUpload({ userId, onUploaded }) {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      return alert("Max file size is 2 MB");
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      return alert("Only JPEG, PNG, and WebP are allowed");
    }

    const formData = new FormData();
    formData.append("avatar", file);

    setUploading(true);
    try {
      const res = await fetch(`/api/v1/users/${userId}/avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },   // no Content-Type!
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      onUploaded(url);
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        disabled={uploading}
        aria-label="Upload avatar"
      />
      {uploading && <ProgressBar value={progress} max={100} label="Uploading" />}
    </div>
  );
}
```

> **Never set `Content-Type` manually for `FormData`** — the browser adds the multipart boundary.

### 23.10 Environment Variables

```bash
# .env.local
VITE_API_URL=http://localhost:5000/api/v1
VITE_APP_NAME=Ethiroli LMS
```

```javascript
// Access
const API_URL = import.meta.env.VITE_API_URL;
const APP_NAME = import.meta.env.VITE_APP_NAME;
const IS_DEV = import.meta.env.DEV;
const IS_PROD = import.meta.env.PROD;
```

**Rules**
- Only `VITE_`-prefixed variables reach the client
- **Never** put secrets in frontend env vars — they are bundled into the JS
- Commit `.env.example`, never `.env.local`
- Set production values in the hosting dashboard (Vercel/Netlify)

### 23.11 Error Handling Patterns

```jsx
function ErrorState({ error, onRetry }) {
  const isNetwork = error?.name === "TypeError";
  const status = error?.status;

  const copy = {
    400: { title: "Invalid request", hint: "Check the form and try again." },
    401: { title: "Session expired", hint: "Please log in again." },
    403: { title: "Access denied", hint: "You don't have permission." },
    404: { title: "Not found", hint: "This item may have been removed." },
    429: { title: "Too many requests", hint: "Slow down and try again shortly." },
    500: { title: "Server error", hint: "We're working on it. Try again." },
  }[status] ?? (isNetwork
    ? { title: "Connection problem", hint: "Check your internet connection." }
    : { title: "Something went wrong", hint: error?.message ?? "Unknown error." });

  return (
    <div role="alert" className="error-state">
      <h3>{copy.title}</h3>
      <p>{copy.hint}</p>
      {onRetry && <button onClick={onRetry}>Try again</button>}
    </div>
  );
}
```

**A generic toast helper for API errors**

```javascript
export function apiErrorMessage(err) {
  if (err?.status === 401) return "Please log in again.";
  if (err?.status === 403) return "You don't have permission for this action.";
  if (err?.status === 422 && err.details?.length) return err.details[0].message;
  if (err?.status >= 500) return "The server had a problem. Try again shortly.";
  if (err?.name === "TypeError") return "Check your internet connection.";
  return err?.message ?? "Something went wrong.";
}
```

### 23.12 Loading UX: Skeletons

```jsx
function CourseCardSkeleton() {
  return (
    <div className="card skeleton" aria-hidden="true">
      <div className="skeleton__image" />
      <div className="skeleton__line skeleton__line--80" />
      <div className="skeleton__line skeleton__line--60" />
      <div className="skeleton__line skeleton__line--40" />
    </div>
  );
}

function CourseGridSkeleton({ count = 6 }) {
  return (
    <div className="course-grid" role="status" aria-label="Loading courses">
      {Array.from({ length: count }, (_, i) => <CourseCardSkeleton key={i} />)}
      <span className="visually-hidden">Loading…</span>
    </div>
  );
}
```

```css
.skeleton { background: #f3f4f6; border-radius: 12px; overflow: hidden; }
.skeleton__image { height: 160px; background: #e5e7eb; }
.skeleton__line {
  height: 12px;
  margin: 12px 16px;
  border-radius: 6px;
  background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 37%, #e5e7eb 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}
@keyframes shimmer {
  0%   { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}
@media (prefers-reduced-motion: reduce) {
  .skeleton__line { animation: none; }
}
```

---

### 🧪 DAY 23 TASK — `D23-T1`

**Deliverable:** A React app integrated with a real or mocked REST API.

**Setup**
- Use **JSONPlaceholder** (`https://jsonplaceholder.typicode.com`) or **DummyJSON** (`https://dummyjson.com`) as the backend
- Or run `json-server` locally against a `db.json` you author (recommended — lets you test POST/PUT/DELETE)

```bash
npm i -D json-server
npx json-server --watch db.json --port 5000
```

**`db.json` (author this)**

```json
{
  "courses": [
    { "id": 1, "title": "45-Day Full Stack", "level": "intermediate", "durationDays": 45, "price": 14999, "rating": 4.6, "category": "web", "createdAt": "2026-01-10T00:00:00.000Z" }
  ],
  "enrollments": [],
  "reviews": []
}
```

**Build a Course Management App**

**Features**
1. **List** courses with pagination, sort, and filter (level, category, price range, rating)
2. **Search** with 400 ms debounce
3. **Detail view** at `/courses/:id` with reviews
4. **Create** a course via a validated form
5. **Edit** a course via a modal
6. **Delete** with a confirmation modal + 5-second undo toast
7. **Enrol** a student (optimistic update with rollback)
8. **Review** submission with rating stars

**Technical requirements**

| Requirement | Detail |
|---|---|
| Data layer | Central `apiClient` with interceptors, typed errors, auth header |
| State | `useReducer` for the list; no duplicate state |
| URL state | All filters/sort/page in the URL |
| Loading | Skeleton cards, not a spinner |
| Errors | Distinct UI for 400 / 401 / 403 / 404 / 429 / 5xx / network |
| Empty | Separate "no data" vs "no match" states |
| Optimistic | Create, update, delete all optimistic with rollback |
| Cancellation | Every fetch aborts on unmount/dep change |
| Debounce | Search input |
| Toasts | Every mutation |
| Env | `VITE_API_URL` from `.env.local`, with `.env.example` committed |
| Upload | Course thumbnail upload (image validation: type + 2 MB limit) |
| Accessibility | `aria-live` for results count, `role="alert"` for errors |
| Tests | Reducer tests + at least 8 component tests with mocked fetch |

**Deliverables**
1. Source code in a `src/features/courses/` structure
2. `db.json` committed
3. `.env.example` committed, `.env.local` gitignored
4. `API_INTEGRATION.md` documenting: every endpoint used, request/response shapes, and how each UI state is handled
5. Screenshots of all 5 states (loading, error, empty-no-data, empty-no-match, success)
6. Test output screenshot

**Bonus**
- Add `@tanstack/react-query` and refactor the list to use `useQuery` + `useMutation` + `queryClient.invalidateQueries()`
- Add infinite scroll with `useInfiniteQuery`
- Add a retry-with-exponential-backoff wrapper and demo it against a flaky endpoint

---

### ❓ DAY 23 QUIZ — `D23-Q` (5 Questions)

| # | Question | Options | Answer |
|---|---|---|---|
| 1 | Optimistic update requires | A) No error handling B) Rollback on failure C) A spinner D) Redux | **B** |
| 2 | Debouncing search prevents | A) Crashes B) A request per keystroke C) XSS D) Slow CSS | **B** |
| 3 | Race conditions in search are fixed by | A) `useMemo` B) `AbortController` or a request-id guard C) `setTimeout` D) More state | **B** |
| 4 | For `FormData` uploads you should | A) Set `Content-Type: application/json` B) Not set `Content-Type` manually C) Set `multipart/form-data` manually D) Use GET | **B** |
| 5 | Which is a distinct UI state to handle? | A) Only success B) Loading, error, empty, success C) Only error D) None | **B** |

---

# DAY 24 — Backend Basics: Node.js & Express

**Module:** `BE-REST` | **Duration:** 7 h | **Lesson Code:** `BE-D24`

### Learning Objectives
- Run JavaScript on the server with Node.js
- Build a REST API with Express
- Structure routes, controllers, services, and middleware
- Validate input and handle errors consistently

### 24.1 Node.js Fundamentals

**What Node is:** a JavaScript runtime built on Chrome's V8, with a non-blocking I/O event loop.

**What Node is NOT:** a framework, a browser, or multi-threaded for user code.

```javascript
// hello.js
console.log("Node version:", process.version);
console.log("Platform:", process.platform);
console.log("Args:", process.argv.slice(2));
console.log("CWD:", process.cwd());

// Run: node hello.js Asha 25
```

**Globals**

| Browser | Node |
|---|---|
| `window` | `global` |
| `document` | ❌ |
| `localStorage` | ❌ |
| `fetch` | ✅ (Node 18+) |
| `console` | ✅ |
| `setTimeout` | ✅ |
| `process` | ✅ |
| `Buffer` | ✅ |
| `__dirname` / `__filename` | ✅ (CommonJS) |

**Modules**

```javascript
// CommonJS (legacy)
const fs = require("fs");
module.exports = { add };

// ES Modules (modern — set "type": "module" in package.json)
import fs from "node:fs";
export function add(a, b) { return a + b; }
```

```json
// package.json
{
  "name": "ethiroli-api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "node --watch src/server.js",
    "start": "node src/server.js"
  }
}
```

**File system**

```javascript
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";

// Sync (blocks)
const text = fs.readFileSync("data.json", "utf8");

// Async (preferred)
const text2 = await fsp.readFile("data.json", "utf8");
await fsp.writeFile("out.json", JSON.stringify(data, null, 2));

// Paths — always use path.join, never string concatenation
const filePath = path.join(process.cwd(), "data", "users.json");
const ext = path.extname("file.txt");        // ".txt"
const base = path.basename("/a/b/c.txt");    // "c.txt"
```

**Environment variables**

```bash
# .env
PORT=5000
NODE_ENV=development
JWT_SECRET=super-secret-change-me
DB_URL=mysql://root:pass@localhost:3306/ethiroli
```

```javascript
import "dotenv/config";
const PORT = process.env.PORT ?? 5000;
const isProd = process.env.NODE_ENV === "production";
```

> Commit `.env.example`; gitignore `.env`.

### 24.2 Project Setup

```bash
mkdir ethiroli-api && cd ethiroli-api
npm init -y
npm i express cors helmet morgan dotenv
npm i -D nodemon
```

```json
{
  "type": "module",
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js"
  }
}
```

**Recommended structure**

```
ethiroli-api/
├── src/
│   ├── server.js               # entry: starts the HTTP server
│   ├── app.js                  # express app + middleware + routes
│   ├── config/
│   │   └── env.js              # validated environment config
│   ├── routes/
│   │   ├── index.js            # mounts all routers
│   │   ├── course.routes.js
│   │   └── auth.routes.js
│   ├── controllers/
│   │   └── course.controller.js
│   ├── services/
│   │   └── course.service.js
│   ├── repositories/
│   │   └── course.repo.js      # data access (in-memory / DB)
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validate.js
│   │   ├── errorHandler.js
│   │   └── notFound.js
│   ├── validators/
│   │   └── course.schema.js
│   ├── utils/
│   │   ├── ApiError.js
│   │   ├── asyncHandler.js
│   │   └── pagination.js
│   └── data/
│       └── courses.js          # in-memory seed data
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

**Layering rule**

```
Route  →  Controller  →  Service  →  Repository  →  Data source
(URL)     (HTTP)         (logic)     (data access)
```

Each layer only knows about the one below it.

### 24.3 Express Basics

```javascript
// src/app.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";

const app = express();

// Security & logging
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL ?? "*" }));
app.use(morgan("dev"));

// Body parsing
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime(), timestamp: new Date() });
});

// API routes
app.use("/api/v1", routes);

// 404 + error handling (must be LAST)
app.use(notFound);
app.use(errorHandler);

export default app;
```

```javascript
// src/server.js
import app from "./app.js";
import "dotenv/config";

const PORT = process.env.PORT ?? 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 API running at http://localhost:${PORT}/api/v1`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, closing server…");
  server.close(() => process.exit(0));
});
```

### 24.4 Routing

```javascript
// src/routes/index.js
import { Router } from "express";
import courseRoutes from "./course.routes.js";
import authRoutes from "./auth.routes.js";

const router = Router();

router.use("/courses", courseRoutes);
router.use("/auth", authRoutes);

export default router;
```

```javascript
// src/routes/course.routes.js
import { Router } from "express";
import * as controller from "../controllers/course.controller.js";
import { validate } from "../middleware/validate.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { createCourseSchema, updateCourseSchema } from "../validators/course.schema.js";

const router = Router();

router
  .route("/")
  .get(controller.listCourses)
  .post(
    authenticate,
    authorize("admin", "mentor"),
    validate(createCourseSchema),
    controller.createCourse
  );

router
  .route("/:id")
  .get(controller.getCourse)
  .patch(authenticate, authorize("admin", "mentor"), validate(updateCourseSchema), controller.updateCourse)
  .delete(authenticate, authorize("admin"), controller.deleteCourse);

router.post("/:id/enroll", authenticate, controller.enrollCourse);

export default router;
```

**Route params, query, and body**

```javascript
router.get("/courses/:id", (req, res) => {
  req.params.id;        // "/courses/42"      → "42"
  req.query.page;       // "?page=2"          → "2"
  req.body;             // JSON body          → object
  req.headers;          // all headers
  req.user;             // set by auth middleware
});
```

### 24.5 Controllers, Services, Repositories

```javascript
// src/utils/ApiError.js
export class ApiError extends Error {
  constructor(status, code, message, details = undefined) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }

  static badRequest(msg, details) { return new ApiError(400, "BAD_REQUEST", msg, details); }
  static unauthorized(msg = "Authentication required") { return new ApiError(401, "UNAUTHORIZED", msg); }
  static forbidden(msg = "Insufficient permissions") { return new ApiError(403, "FORBIDDEN", msg); }
  static notFound(msg = "Resource not found") { return new ApiError(404, "NOT_FOUND", msg); }
  static conflict(msg) { return new ApiError(409, "CONFLICT", msg); }
  static validation(details) { return new ApiError(422, "VALIDATION_ERROR", "Validation failed", details); }
  static internal(msg = "Internal server error") { return new ApiError(500, "INTERNAL_ERROR", msg); }
}
```

```javascript
// src/utils/asyncHandler.js
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
```

```javascript
// src/repositories/course.repo.js
let courses = [
  { id: 1, title: "45-Day Full Stack", level: "intermediate", durationDays: 45, price: 14999, rating: 4.6, createdAt: new Date().toISOString() },
  { id: 2, title: "30-Day Web Development", level: "beginner", durationDays: 30, price: 9999, rating: 4.4, createdAt: new Date().toISOString() },
];
let nextId = 3;

export const courseRepo = {
  findAll: () => [...courses],
  findById: (id) => courses.find(c => c.id === Number(id)) ?? null,
  create: (data) => {
    const course = { id: nextId++, ...data, rating: 0, createdAt: new Date().toISOString() };
    courses.push(course);
    return course;
  },
  update: (id, changes) => {
    const idx = courses.findIndex(c => c.id === Number(id));
    if (idx === -1) return null;
    courses[idx] = { ...courses[idx], ...changes, updatedAt: new Date().toISOString() };
    return courses[idx];
  },
  remove: (id) => {
    const idx = courses.findIndex(c => c.id === Number(id));
    if (idx === -1) return false;
    courses.splice(idx, 1);
    return true;
  },
};
```

```javascript
// src/services/course.service.js
import { courseRepo } from "../repositories/course.repo.js";
import { ApiError } from "../utils/ApiError.js";

export const courseService = {
  list({ page = 1, limit = 12, q, level, sort = "-createdAt" }) {
    let items = courseRepo.findAll();

    if (q) {
      const needle = q.toLowerCase();
      items = items.filter(c => c.title.toLowerCase().includes(needle));
    }
    if (level) items = items.filter(c => c.level === level);

    const desc = sort.startsWith("-");
    const field = desc ? sort.slice(1) : sort;
    items.sort((a, b) => {
      const av = a[field], bv = b[field];
      const cmp = typeof av === "string" ? av.localeCompare(bv) : av - bv;
      return desc ? -cmp : cmp;
    });

    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const start = (safePage - 1) * limit;

    return {
      data: items.slice(start, start + limit),
      meta: { page: safePage, limit, total, totalPages, hasNext: safePage < totalPages, hasPrev: safePage > 1 },
    };
  },

  getById(id) {
    const course = courseRepo.findById(id);
    if (!course) throw ApiError.notFound(`Course ${id} not found`);
    return course;
  },

  create(payload) {
    if (courseRepo.findAll().some(c => c.title.toLowerCase() === payload.title.toLowerCase())) {
      throw ApiError.conflict("A course with this title already exists");
    }
    return courseRepo.create(payload);
  },

  update(id, changes) {
    const updated = courseRepo.update(id, changes);
    if (!updated) throw ApiError.notFound(`Course ${id} not found`);
    return updated;
  },

  remove(id) {
    const ok = courseRepo.remove(id);
    if (!ok) throw ApiError.notFound(`Course ${id} not found`);
  },
};
```

```javascript
// src/controllers/course.controller.js
import { courseService } from "../services/course.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listCourses = asyncHandler(async (req, res) => {
  const { page, limit, q, level, sort } = req.query;
  const result = courseService.list({
    page: Number(page) || 1,
    limit: Math.min(Number(limit) || 12, 100),
    q,
    level,
    sort: sort || "-createdAt",
  });
  res.json(result);
});

export const getCourse = asyncHandler(async (req, res) => {
  const course = courseService.getById(req.params.id);
  res.json({ data: course });
});

export const createCourse = asyncHandler(async (req, res) => {
  const course = courseService.create(req.body);
  res.status(201).location(`/api/v1/courses/${course.id}`).json({ data: course });
});

export const updateCourse = asyncHandler(async (req, res) => {
  const course = courseService.update(req.params.id, req.body);
  res.json({ data: course });
});

export const deleteCourse = asyncHandler(async (req, res) => {
  courseService.remove(req.params.id);
  res.status(204).send();
});

export const enrollCourse = asyncHandler(async (req, res) => {
  res.status(201).json({
    data: { courseId: Number(req.params.id), userId: req.user.id, enrolledAt: new Date().toISOString() },
  });
});
```

### 24.6 Middleware

```javascript
// src/middleware/notFound.js
import { ApiError } from "../utils/ApiError.js";

export function notFound(req, res, next) {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
}
```

```javascript
// src/middleware/errorHandler.js
export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  const status = err.status ?? 500;
  const isProd = process.env.NODE_ENV === "production";

  if (status >= 500) console.error("💥", err);

  res.status(status).json({
    error: {
      code: err.code ?? "INTERNAL_ERROR",
      message: status >= 500 && isProd ? "Internal server error" : err.message,
      ...(err.details ? { details: err.details } : {}),
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      ...(isProd ? {} : { stack: err.stack }),
    },
  });
}
```

```javascript
// src/middleware/auth.js
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

export function authenticate(req, res, next) {
  const header = req.headers.authorization ?? "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(ApiError.unauthorized("Missing or malformed Authorization header"));
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    next(err.name === "TokenExpiredError"
      ? ApiError.unauthorized("Token expired")
      : ApiError.unauthorized("Invalid token"));
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden(`Requires role: ${roles.join(" or ")}`));
    }
    next();
  };
}
```

### 24.7 Validation

```bash
npm i zod
```

```javascript
// src/validators/course.schema.js
import { z } from "zod";

export const createCourseSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3, "Title must be at least 3 characters").max(120),
    level: z.enum(["beginner", "intermediate", "advanced"]),
    durationDays: z.number().int().min(1).max(365),
    price: z.number().min(0).optional().default(0),
    description: z.string().max(2000).optional(),
  }),
});

export const updateCourseSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3).max(120).optional(),
    level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
    durationDays: z.number().int().min(1).max(365).optional(),
    price: z.number().min(0).optional(),
    description: z.string().max(2000).optional(),
  }).refine(obj => Object.keys(obj).length > 0, {
    message: "At least one field must be provided",
  }),
});
```

```javascript
// src/middleware/validate.js
import { ApiError } from "../utils/ApiError.js";

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({ body: req.body, query: req.query, params: req.params });

  if (!result.success) {
    const details = result.error.issues.map(issue => ({
      field: issue.path.slice(1).join("."),
      message: issue.message,
    }));
    return next(ApiError.validation(details));
  }

  // Use the parsed (coerced, defaulted) data
  if (result.data.body) req.body = result.data.body;
  next();
};
```

### 24.8 Testing the API

```bash
# Health
curl http://localhost:5000/health

# List
curl "http://localhost:5000/api/v1/courses?page=1&limit=5&sort=-rating"

# Create
curl -X POST http://localhost:5000/api/v1/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"60-Day AI Full Stack","level":"advanced","durationDays":60,"price":24999}'

# Update
curl -X PATCH http://localhost:5000/api/v1/courses/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"price": 17999}'

# Delete
curl -X DELETE http://localhost:5000/api/v1/courses/1 \
  -H "Authorization: Bearer $TOKEN" -i

# Trigger validation error
curl -X POST http://localhost:5000/api/v1/courses \
  -H "Content-Type: application/json" \
  -d '{"title":"x","level":"expert"}'
```

### 24.9 Security Checklist

| Concern | Mitigation |
|---|---|
| Security headers | `helmet()` |
| CORS | Restrict `origin` in production |
| Body size | `express.json({ limit: "1mb" })` |
| Rate limiting | `express-rate-limit` |
| Input validation | `zod` on every route |
| SQL injection | Parameterised queries (never string-concat SQL) |
| NoSQL injection | Validate + `express-mongo-sanitize` |
| Secrets | `.env`, never in code or git |
| Stack traces | Hidden in production |
| Passwords | `bcrypt` with cost ≥ 10 |
| HTTPS | Terminate at the proxy / hosting layer |
| Dependency risk | `npm audit` |

```javascript
// Rate limiting
import rateLimit from "express-rate-limit";

app.use("/api", rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: "RATE_LIMIT", message: "Too many requests, try again later." } },
}));
```

---

### 🧪 DAY 24 TASK — `D24-T1`

**Deliverable:** A working REST API — `ethiroli-api/`

**Resources to implement**

1. **`/api/v1/courses`** — full CRUD + enrol
2. **`/api/v1/students`** — full CRUD + enrollments list
3. **`/api/v1/assignments`** — full CRUD + submit + grade
4. **`/api/v1/auth`** — register, login, me
5. **`/health`** and **`/api/v1/version`**

**Requirements**

| Area | Requirement |
|---|---|
| Structure | Separate `routes/`, `controllers/`, `services/`, `repositories/`, `middleware/`, `validators/`, `utils/` |
| Async | Every controller wrapped in `asyncHandler` |
| Errors | `ApiError` class + central `errorHandler` producing the standard envelope |
| Validation | `zod` schemas on **every** write route; 422 with field-level details |
| Auth | JWT middleware + `authorize(...roles)` |
| Pagination | `page`, `limit` (max 100), `meta` block in the response |
| Filtering | At least 3 query filters per resource |
| Sorting | `sort=field` and `sort=-field` |
| Search | `q` searches relevant text fields |
| Status codes | Correct for every case (200/201/204/400/401/403/404/409/422/500) |
| Security | `helmet`, `cors`, `express.json({limit})`, rate limiting |
| Logging | `morgan` in dev; no secrets logged |
| Config | `.env` + `.env.example`, validated on boot |
| Health | `/health` returns status + uptime |
| 404 | Unmatched routes return the standard error envelope |
| Graceful shutdown | `SIGTERM` closes the server |
| Docs | `README.md` with every endpoint, request/response examples, curl commands |
| Tests | 15+ requests exercised in Postman with passing assertions |

**Bonus**
- Add `pino` for structured JSON logging with request IDs
- Add `/api/v1/courses/:id/reviews` nested resource
- Add soft delete (`deletedAt`) and exclude soft-deleted from lists
- Add an `ETag`/`If-None-Match` conditional GET
- Add OpenAPI generation from the zod schemas (`zod-to-openapi`)

---

### ❓ DAY 24 QUIZ — `D24-Q` (5 Questions)

| # | Question | Options | Answer |
|---|---|---|---|
| 1 | `asyncHandler` exists to | A) Speed up code B) Forward rejected promises to Express's error handler C) Validate input D) Parse JSON | **B** |
| 2 | Which middleware should be registered **last**? | A) `express.json()` B) `cors()` C) `errorHandler` D) `morgan()` | **C** |
| 3 | Validation failure should return | A) 400 or 422 B) 500 C) 200 D) 302 | **A** |
| 4 | In Express, route parameters are read from | A) `req.body` B) `req.query` C) `req.params` D) `req.headers` | **C** |
| 5 | Which layer should hold business logic? | A) Route B) Controller C) Service D) Middleware | **C** |

---

# DAY 25 — Database Basics: MySQL

**Module:** `DB-MYSQL` | **Duration:** 7 h | **Lesson Code:** `DB-D25`

### Learning Objectives
- Design a normalised relational schema
- Write SQL for CRUD, joins, aggregation, and subqueries
- Use keys, constraints, and indexes correctly
- Connect MySQL to a Node API with parameterised queries

### 25.1 Relational Concepts

| Term | Meaning |
|---|---|
| Table | A set of rows with the same columns |
| Row / Record | One entity instance |
| Column / Field | One attribute |
| Primary Key (PK) | Unique identifier for a row |
| Foreign Key (FK) | References a PK in another table |
| Index | Speeds up lookups (at the cost of write speed + storage) |
| Constraint | A rule the data must satisfy |
| Schema | The whole database design |

### 25.2 Data Types

| Category | Type | Use |
|---|---|---|
| Integer | `TINYINT`, `INT`, `BIGINT` | IDs, counts, ages |
| Decimal | `DECIMAL(10,2)` | **Money — never use FLOAT** |
| Float | `FLOAT`, `DOUBLE` | Scientific values |
| String | `CHAR(n)` | Fixed length (e.g. country code) |
| String | `VARCHAR(n)` | Variable length (names, emails) |
| Text | `TEXT`, `LONGTEXT` | Long descriptions |
| Date/Time | `DATE`, `TIME`, `DATETIME`, `TIMESTAMP` | Timestamps |
| Boolean | `TINYINT(1)` / `BOOLEAN` | True/false |
| Enum | `ENUM('a','b')` | Small fixed set |
| JSON | `JSON` | Flexible structure (use sparingly) |
| Binary | `BLOB` | Files (prefer object storage) |

> **Money rule:** use `DECIMAL(10,2)`, never `FLOAT`. `0.1 + 0.2 ≠ 0.3` in floating point.

### 25.3 Schema Design — Ethiroli LMS

```sql
CREATE DATABASE ethiroli_lms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ethiroli_lms;

-- Users
CREATE TABLE users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100)  NOT NULL,
  email         VARCHAR(150)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  role          ENUM('student','mentor','admin') NOT NULL DEFAULT 'student',
  is_active     BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_users_role (role),
  INDEX idx_users_active (is_active)
) ENGINE=InnoDB;

-- Courses
CREATE TABLE courses (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(150)  NOT NULL,
  slug          VARCHAR(160)  NOT NULL UNIQUE,
  description   TEXT,
  level         ENUM('beginner','intermediate','advanced') NOT NULL,
  duration_days SMALLINT UNSIGNED NOT NULL,
  price         DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  is_published  BOOLEAN       NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT chk_duration CHECK (duration_days BETWEEN 1 AND 365),
  INDEX idx_courses_level (level),
  INDEX idx_courses_published (is_published)
) ENGINE=InnoDB;

-- Modules within a course
CREATE TABLE modules (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  course_id  INT UNSIGNED NOT NULL,
  title      VARCHAR(150) NOT NULL,
  position   SMALLINT UNSIGNED NOT NULL DEFAULT 0,

  CONSTRAINT fk_modules_course
    FOREIGN KEY (course_id) REFERENCES courses(id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  UNIQUE KEY uq_module_position (course_id, position)
) ENGINE=InnoDB;

-- Enrollments (join table: users ↔ courses)
CREATE TABLE enrollments (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NOT NULL,
  course_id   INT UNSIGNED NOT NULL,
  status      ENUM('active','completed','dropped') NOT NULL DEFAULT 'active',
  progress    TINYINT UNSIGNED NOT NULL DEFAULT 0,
  enrolled_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,

  CONSTRAINT fk_enroll_user   FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE,
  CONSTRAINT fk_enroll_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,

  UNIQUE KEY uq_user_course (user_id, course_id),   -- prevents duplicate enrolment
  CONSTRAINT chk_progress CHECK (progress BETWEEN 0 AND 100),
  INDEX idx_enroll_status (status)
) ENGINE=InnoDB;

-- Assignments
CREATE TABLE assignments (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  module_id   INT UNSIGNED NOT NULL,
  title       VARCHAR(150) NOT NULL,
  max_marks   SMALLINT UNSIGNED NOT NULL DEFAULT 100,
  due_date    DATETIME NOT NULL,

  CONSTRAINT fk_assign_module FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
  INDEX idx_assign_due (due_date)
) ENGINE=InnoDB;

-- Submissions
CREATE TABLE submissions (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  assignment_id INT UNSIGNED NOT NULL,
  user_id       INT UNSIGNED NOT NULL,
  repo_url      VARCHAR(255),
  content       TEXT,
  marks         SMALLINT UNSIGNED NULL,
  feedback      TEXT,
  submitted_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  graded_at     TIMESTAMP NULL,

  CONSTRAINT fk_sub_assign FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
  CONSTRAINT fk_sub_user   FOREIGN KEY (user_id)       REFERENCES users(id)       ON DELETE CASCADE,
  UNIQUE KEY uq_submission (assignment_id, user_id),
  INDEX idx_sub_marks (marks)
) ENGINE=InnoDB;
```

**Entity relationships**

```
users ──< enrollments >── courses ──< modules ──< assignments ──< submissions >── users
```

### 25.4 Normalisation

| Form | Rule | Violation example |
|---|---|---|
| **1NF** | Atomic values, no repeating groups | `skills = "JS,React,Node"` in one column |
| **2NF** | 1NF + no partial dependency on part of a composite key | Storing `course_title` in `enrollments` |
| **3NF** | 2NF + no transitive dependency | `zip → city` stored in `users` |
| **BCNF** | Every determinant is a candidate key | Rare edge case |

**Fixing 1NF**

```sql
-- ❌ Not atomic
CREATE TABLE students_bad (id INT, name VARCHAR(50), skills VARCHAR(255));

-- ✅ Separate table
CREATE TABLE skills (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(50) UNIQUE);
CREATE TABLE student_skills (
  student_id INT, skill_id INT,
  PRIMARY KEY (student_id, skill_id),
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id)   REFERENCES skills(id) ON DELETE CASCADE
);
```

**When to denormalise:** for read-heavy reporting, cache aggregates (e.g. store `rating_avg` on `courses`). Denormalise deliberately, not accidentally.

### 25.5 CRUD

```sql
-- CREATE
INSERT INTO courses (title, slug, level, duration_days, price, is_published)
VALUES ('45-Day Full Stack', 'fullstack-45', 'intermediate', 45, 14999.00, TRUE);

-- Bulk insert
INSERT INTO courses (title, slug, level, duration_days, price) VALUES
  ('30-Day Web Dev',    'web-30',    'beginner',     30,  9999.00),
  ('60-Day AI FS',      'aifs-60',   'advanced',     60, 24999.00);

-- READ
SELECT id, title, price FROM courses WHERE is_published = TRUE;

-- UPDATE
UPDATE courses SET price = 17999.00 WHERE id = 1;

-- DELETE
DELETE FROM courses WHERE id = 99;
```

### 25.6 Querying

```sql
-- WHERE
SELECT * FROM courses WHERE level = 'beginner' AND price < 10000;
SELECT * FROM courses WHERE price BETWEEN 5000 AND 20000;
SELECT * FROM courses WHERE level IN ('beginner','intermediate');
SELECT * FROM courses WHERE title LIKE '%Full Stack%';
SELECT * FROM courses WHERE description IS NULL;

-- ORDER BY
SELECT * FROM courses ORDER BY price DESC;
SELECT * FROM courses ORDER BY level ASC, price DESC;

-- LIMIT / OFFSET (pagination)
SELECT * FROM courses ORDER BY id LIMIT 10 OFFSET 20;   -- page 3, size 10

-- DISTINCT
SELECT DISTINCT level FROM courses;

-- Aliases
SELECT c.title AS course_title, c.price AS course_price FROM courses AS c;
```

### 25.7 Aggregation

```sql
SELECT COUNT(*) AS total_courses FROM courses;

SELECT
  level,
  COUNT(*)          AS course_count,
  AVG(price)        AS avg_price,
  MIN(price)        AS min_price,
  MAX(price)        AS max_price,
  SUM(price)        AS total_value
FROM courses
GROUP BY level
HAVING COUNT(*) >= 2
ORDER BY course_count DESC;

-- Conditional aggregation
SELECT
  COUNT(*) AS total,
  SUM(status = 'active')    AS active_count,
  SUM(status = 'completed') AS completed_count,
  ROUND(100.0 * SUM(status = 'completed') / COUNT(*), 2) AS completion_pct
FROM enrollments;

-- Group by month
SELECT
  DATE_FORMAT(enrolled_at, '%Y-%m') AS month,
  COUNT(*) AS enrolments
FROM enrollments
GROUP BY month
ORDER BY month;
```

> **`WHERE` filters rows before grouping. `HAVING` filters groups after.**

### 25.8 Joins

```sql
-- INNER JOIN — only matching rows
SELECT u.name, c.title, e.status, e.progress
FROM enrollments e
INNER JOIN users   u ON u.id = e.user_id
INNER JOIN courses c ON c.id = e.course_id
WHERE e.status = 'active'
ORDER BY e.enrolled_at DESC;

-- LEFT JOIN — all users, even those with no enrolments
SELECT u.id, u.name, COUNT(e.id) AS course_count
FROM users u
LEFT JOIN enrollments e ON e.user_id = u.id
GROUP BY u.id, u.name
ORDER BY course_count DESC;

-- Find users with NO enrolments
SELECT u.id, u.name
FROM users u
LEFT JOIN enrollments e ON e.user_id = u.id
WHERE e.id IS NULL;

-- SELF JOIN — mentor → student
SELECT s.name AS student, m.name AS mentor
FROM users s
JOIN users m ON s.mentor_id = m.id;

-- Multiple joins with aggregation
SELECT
  c.title,
  COUNT(DISTINCT e.user_id) AS students,
  ROUND(AVG(s.marks), 2)    AS avg_marks
FROM courses c
LEFT JOIN enrollments e ON e.course_id = c.id
LEFT JOIN modules m     ON m.course_id = c.id
LEFT JOIN assignments a ON a.module_id = m.id
LEFT JOIN submissions s ON s.assignment_id = a.id
GROUP BY c.id, c.title;
```

**Join types**

| Join | Returns |
|---|---|
| `INNER JOIN` | Rows matching in both tables |
| `LEFT JOIN` | All rows from the left + matches from the right (NULL if none) |
| `RIGHT JOIN` | All rows from the right + matches from the left |
| `FULL OUTER JOIN` | All rows from both (MySQL: emulate with `UNION`) |
| `CROSS JOIN` | Cartesian product |

### 25.9 Subqueries

```sql
-- Scalar subquery
SELECT title, price
FROM courses
WHERE price > (SELECT AVG(price) FROM courses);

-- IN
SELECT name FROM users
WHERE id IN (SELECT user_id FROM enrollments WHERE course_id = 1);

-- EXISTS
SELECT c.title FROM courses c
WHERE EXISTS (
  SELECT 1 FROM enrollments e
  WHERE e.course_id = c.id AND e.status = 'active'
);

-- Correlated subquery
SELECT c.title,
  (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id) AS student_count
FROM courses c;

-- Derived table
SELECT level, ROUND(AVG(avg_price), 2) AS avg_of_avg
FROM (
  SELECT level, AVG(price) AS avg_price FROM courses GROUP BY level
) AS t
GROUP BY level;
```

### 25.10 Transactions

```sql
START TRANSACTION;

UPDATE accounts SET balance = balance - 5000 WHERE id = 1;
UPDATE accounts SET balance = balance + 5000 WHERE id = 2;

-- If both succeeded
COMMIT;

-- If anything failed
ROLLBACK;
```

**ACID**

| Property | Meaning |
|---|---|
| **A**tomicity | All or nothing |
| **C**onsistency | Valid state → valid state |
| **I**solation | Concurrent transactions don't interfere |
| **D**urability | Committed data survives a crash |

### 25.11 Indexes

```sql
-- Single column
CREATE INDEX idx_courses_level ON courses(level);

-- Composite (order matters — leftmost prefix rule)
CREATE INDEX idx_enroll_user_status ON enrollments(user_id, status);
-- Uses the index:  WHERE user_id = 1
-- Uses the index:  WHERE user_id = 1 AND status = 'active'
-- Does NOT use it: WHERE status = 'active'

-- Unique
CREATE UNIQUE INDEX uq_users_email ON users(email);

-- Full text
CREATE FULLTEXT INDEX ft_courses_title_desc ON courses(title, description);
SELECT * FROM courses WHERE MATCH(title, description) AGAINST('react' IN NATURAL LANGUAGE MODE);

-- Inspect
EXPLAIN SELECT * FROM courses WHERE level = 'beginner';
SHOW INDEX FROM courses;
```

**Index rules**

- Index columns used in `WHERE`, `JOIN`, and `ORDER BY`
- Don't index low-cardinality columns (e.g. `is_active` alone)
- Each index slows down INSERT/UPDATE/DELETE
- Composite index order matters
- Always check with `EXPLAIN` before adding

### 25.12 Connecting from Node

```bash
npm i mysql2
```

```javascript
// src/config/db.js
import mysql from "mysql2/promise";
import "dotenv/config";

export const pool = mysql.createPool({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: "Z",
  decimalNumbers: true,
  namedPlaceholders: true,
});

export async function query(sql, params = {}) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

export async function testConnection() {
  const conn = await pool.getConnection();
  try {
    await conn.ping();
    console.log("✅ MySQL connected");
  } finally {
    conn.release();
  }
}
```

> **`pool.execute` uses prepared statements — always use placeholders.** `pool.query` with string interpolation is a SQL injection waiting to happen.

```javascript
// src/repositories/course.repo.mysql.js
import { query } from "../config/db.js";

export const courseRepo = {
  async findAll({ q, level, sort = "-created_at", page = 1, limit = 12 }) {
    const where = ["is_published = 1"];
    const params = {};

    if (q) {
      where.push("(title LIKE :q OR description LIKE :q)");
      params.q = `%${q}%`;
    }
    if (level) {
      where.push("level = :level");
      params.level = level;
    }

    const allowedSort = ["created_at", "price", "title", "duration_days"];
    const desc = sort.startsWith("-");
    const field = sort.replace(/^-/, "");
    const orderBy = `${allowedSort.includes(field) ? field : "created_at"} ${desc ? "DESC" : "ASC"}`;

    const whereSql = `WHERE ${where.join(" AND ")}`;
    const offset = (page - 1) * limit;

    const rows = await query(
      `SELECT id, title, slug, level, duration_days, price, created_at
       FROM courses
       ${whereSql}
       ORDER BY ${orderBy}
       LIMIT :limit OFFSET :offset`,
      { ...params, limit, offset }
    );

    const [{ total }] = await query(
      `SELECT COUNT(*) AS total FROM courses ${whereSql}`,
      params
    );

    return { rows, total };
  },

  async findById(id) {
    const rows = await query(
      `SELECT * FROM courses WHERE id = :id LIMIT 1`,
      { id }
    );
    return rows[0] ?? null;
  },

  async create(data) {
    const result = await query(
      `INSERT INTO courses (title, slug, description, level, duration_days, price, is_published)
       VALUES (:title, :slug, :description, :level, :duration_days, :price, :is_published)`,
      data
    );
    return this.findById(result.insertId);
  },

  async update(id, changes) {
    const fields = Object.keys(changes)
      .filter(k => ["title", "level", "duration_days", "price", "description", "is_published"].includes(k));

    if (!fields.length) return this.findById(id);

    const setSql = fields.map(f => `${f} = :${f}`).join(", ");
    await query(`UPDATE courses SET ${setSql} WHERE id = :id`, { ...changes, id });
    return this.findById(id);
  },

  async remove(id) {
    const result = await query(`DELETE FROM courses WHERE id = :id`, { id });
    return result.affectedRows > 0;
  },
};
```

### 25.13 MySQL Injection — A Real Example

```javascript
// ❌ CATASTROPHIC — attacker sends email = "' OR '1'='1"
const sql = `SELECT * FROM users WHERE email = '${email}'`;
// Resulting query returns EVERY user.

// Even worse: email = "'; DROP TABLE users; --"

// ✅ Parameterised
const rows = await query(`SELECT * FROM users WHERE email = :email`, { email });
```

**Rule:** user input never becomes part of the SQL string. Ever.

### 25.14 Common MySQL Commands

```sql
SHOW DATABASES;
USE ethiroli_lms;
SHOW TABLES;
DESCRIBE courses;
SHOW CREATE TABLE courses\G
SHOW INDEX FROM courses;
EXPLAIN SELECT ...;

-- Backup / restore
-- mysqldump -u root -p ethiroli_lms > backup.sql
-- mysql -u root -p ethiroli_lms < backup.sql
```

---

### 🧪 DAY 25 TASK — `D25-T1`

**Deliverable:** A complete, working MySQL database + a Node data layer.

**Part A — Schema (`schema.sql`)**

Create these tables with all keys, constraints, and indexes:

| Table | Notes |
|---|---|
| `users` | role enum, unique email, soft-delete flag |
| `courses` | level enum, price `DECIMAL(10,2)`, published flag |
| `modules` | FK to courses, position with unique constraint |
| `lessons` | FK to modules, duration, position |
| `assignments` | FK to modules, max_marks, due_date |
| `submissions` | FK to assignments + users, unique pair, marks, feedback |
| `enrollments` | FK to users + courses, unique pair, status, progress |
| `reviews` | FK to users + courses, rating 1–5, unique pair |
| `skills` | name unique |
| `user_skills` | composite PK join table |

**Part B — Seed (`seed.sql`)**

- 20 users (5 mentors, 2 admins, 13 students)
- 8 courses across all levels
- 5 modules per course, 4 lessons per module
- 3 assignments per module
- ~80 enrollments with varied statuses and progress
- ~150 submissions, some ungraded
- ~60 reviews with ratings 1–5
- 15 skills with user assignments

**Part C — Queries (`queries.sql`)**

Write **25 queries**, each with a comment stating what it answers:

1. All published courses sorted by price descending
2. Top 5 highest-rated courses with their review counts
3. Students enrolled in more than 3 courses
4. Users with zero enrollments
5. Average progress per course
6. Completion rate per course
7. Number of enrolments per month for the last 6 months
8. Courses with no reviews
9. Average marks per assignment, with the assignment and module title
10. Students whose average marks are above the overall average
11. Mentors and how many students they've graded
12. The most popular skill among students
13. Revenue per level, assuming each enrollment = course price
14. Overdue assignments (due_date < now) with no submission
15. Students with an average above 80 who have submitted everything
16. Course-wise count of distinct active students
17. The course with the highest average student progress
18. Users who enrolled in a course but never submitted anything
19. Rank students within each course by average marks (`RANK()` window function)
20. Month-over-month enrolment growth as a percentage
21. Courses where the average rating is below the overall average
22. The top 3 courses by revenue per level (window function)
23. Students who have improved (later submissions scoring higher)
24. Skills that no student has
25. A summary row: total users, courses, enrolments, submissions, average rating

**Part D — Node Integration (`src/` in your API)**

1. Create `src/config/db.js` with a `mysql2/promise` pool and a `query()` helper using named placeholders
2. Create `src/repositories/course.repo.mysql.js` implementing `findAll`, `findById`, `create`, `update`, `remove`, `findWithModules`
3. Replace your in-memory repo with the MySQL repo
4. **Every** query must use parameterised placeholders — audit and prove it
5. Add `testConnection()` on boot; fail fast with a clear message if the DB is unreachable
6. Add a `db:setup` npm script that runs `schema.sql` then `seed.sql`
7. Add a `GET /api/v1/courses/:id/full` endpoint returning the course with its nested modules and lessons in **one** query using a `LEFT JOIN` + result-shaping in JS (do not N+1)

**Part E — Performance (`PERFORMANCE.md`)**

1. Run `EXPLAIN` on 5 of your queries and paste the output
2. Identify one query that performs a full table scan
3. Add an index that fixes it
4. Re-run `EXPLAIN` and show the improvement
5. Explain, in your own words, the leftmost-prefix rule with a concrete example

**Part F — `DATABASE.md`**

- ER diagram (use dbdiagram.io or draw it)
- Table-by-table data dictionary: column, type, nullable, default, notes
- Explanation of every FK and its `ON DELETE` behaviour
- Normalisation rationale (what you normalised and why)
- Index strategy: which indexes exist and which queries they serve
- Safety notes: parameterised queries, least-privilege DB user, backups

**Bonus**
- Add a `v_course_stats` VIEW for the dashboard
- Add a stored procedure `sp_enroll_student(user_id, course_id)` that validates capacity and inserts inside a transaction
- Add triggers to maintain `updated_at` and to prevent enrolling in unpublished courses
- Implement cursor-based pagination and benchmark it against `OFFSET`

---

### ❓ DAY 25 QUIZ — `D25-Q` (5 Questions)

| # | Question | Options | Answer |
|---|---|---|---|
| 1 | Which type should store money? | A) FLOAT B) DOUBLE C) DECIMAL(10,2) D) INT | **C** |
| 2 | `WHERE` vs `HAVING` | A) Identical B) `WHERE` filters rows before grouping; `HAVING` filters groups C) `HAVING` runs first D) `WHERE` only works with JOIN | **B** |
| 3 | `LEFT JOIN` returns | A) Only matching rows B) All left rows + matches (NULL when none) C) All right rows D) Cartesian product | **B** |
| 4 | Preventing SQL injection requires | A) Escaping quotes manually B) Prepared statements with placeholders C) Hiding errors D) `LIMIT` | **B** |
| 5 | A composite index `(a, b)` is used for | A) `WHERE b = ?` only B) `WHERE a = ?` and `WHERE a = ? AND b = ?` C) Neither D) Only `WHERE b = ? AND a = ?` | **B** |

---

# DAY 26 — Full Stack Integration

**Module:** `FS-INTEGRATION` | **Duration:** 7 h | **Lesson Code:** `FS-D26`

### Learning Objectives
- Connect a React frontend to your own Node + MySQL backend
- Implement JWT authentication end to end
- Manage role-based UI and protected API access
- Handle CORS, proxies, and environment configuration
- Structure a full-stack monorepo

### 26.1 Architecture

```
┌──────────────────────────────────────────────────────────┐
│  BROWSER                                                  │
│  React (Vite) — localhost:5173                            │
│    • Components, routing, forms                           │
│    • AuthContext holds the JWT                            │
│    • apiClient attaches Authorization header              │
└───────────────────────┬──────────────────────────────────┘
                        │  HTTP  /api/v1/*  (JSON)
                        │  Proxy in dev → :5000
                        ▼
┌──────────────────────────────────────────────────────────┐
│  SERVER                                                   │
│  Express — localhost:5000                                 │
│    • CORS, helmet, rate limit                             │
│    • Routes → Controllers → Services → Repositories       │
│    • JWT verify middleware → req.user                     │
│    • zod validation                                       │
│    • Central error handler                                │
└───────────────────────┬──────────────────────────────────┘
                        │  mysql2 pool (parameterised)
                        ▼
┌──────────────────────────────────────────────────────────┐
│  MySQL — localhost:3306                                   │
│    users, courses, modules, enrollments, submissions …    │
└──────────────────────────────────────────────────────────┘
```

### 26.2 Monorepo Structure

```
ethiroli-fullstack/
├── client/                     # React + Vite
│   ├── src/
│   │   ├── app/
│   │   ├── features/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/apiClient.js
│   │   └── main.jsx
│   ├── .env.local
│   ├── .env.example
│   ├── vite.config.js
│   └── package.json
├── server/                     # Express + MySQL
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── config/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── middleware/
│   │   ├── validators/
│   │   └── utils/
│   ├── db/
│   │   ├── schema.sql
│   │   └── seed.sql
│   ├── .env
│   ├── .env.example
│   └── package.json
├── package.json                # root scripts
├── .gitignore
└── README.md
```

**Root `package.json`**

```json
{
  "name": "ethiroli-fullstack",
  "private": true,
  "scripts": {
    "dev": "concurrently -n api,web -c blue,green \"npm:dev:server\" \"npm:dev:client\"",
    "dev:server": "cd server && npm run dev",
    "dev:client": "cd client && npm run dev",
    "install:all": "npm i && cd server && npm i && cd ../client && npm i",
    "db:setup": "cd server && npm run db:setup"
  },
  "devDependencies": { "concurrently": "^9.0.0" }
}
```

### 26.3 Dev Proxy (No CORS Hassle)

```javascript
// client/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
```

```javascript
// client/src/lib/apiClient.js
const BASE_URL = import.meta.env.VITE_API_URL ?? "/api/v1";
```

With the proxy, the browser sees same-origin requests in dev, so CORS never comes into play. In production you either serve the built client from Express or set a proper `CLIENT_URL` for CORS.

### 26.4 Auth: Backend

```javascript
// server/src/services/auth.service.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userRepo } from "../repositories/user.repo.js";
import { ApiError } from "../utils/ApiError.js";

const SALT_ROUNDS = 12;

function signAccess(user) {
  return jwt.sign(
    { sub: String(user.id), role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "15m", issuer: "ethiroli-api" }
  );
}

function signRefresh(user) {
  return jwt.sign(
    { sub: String(user.id), type: "refresh" },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d", issuer: "ethiroli-api" }
  );
}

export const authService = {
  async register({ name, email, password, role = "student" }) {
    if (await userRepo.findByEmail(email)) {
      throw ApiError.conflict("An account with this email already exists");
    }
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await userRepo.create({ name, email, password_hash, role });
    return {
      user: sanitize(user),
      accessToken: signAccess(user),
      refreshToken: signRefresh(user),
    };
  },

  async login({ email, password }) {
    const user = await userRepo.findByEmail(email);
    // Same error for both cases — don't leak which emails exist
    if (!user) throw ApiError.unauthorized("Invalid email or password");

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) throw ApiError.unauthorized("Invalid email or password");
    if (!user.is_active) throw ApiError.forbidden("Account is deactivated");

    return {
      user: sanitize(user),
      accessToken: signAccess(user),
      refreshToken: signRefresh(user),
    };
  },

  async refresh(refreshToken) {
    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch {
      throw ApiError.unauthorized("Invalid refresh token");
    }
    if (payload.type !== "refresh") throw ApiError.unauthorized("Invalid token type");

    const user = await userRepo.findById(payload.sub);
    if (!user || !user.is_active) throw ApiError.unauthorized("Account unavailable");

    return { accessToken: signAccess(user) };
  },
};

function sanitize(user) {
  const { password_hash, ...safe } = user;
  return safe;
}
```

```javascript
// server/src/controllers/auth.controller.js
import { authService } from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

export const register = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.register(req.body);
  res.cookie("refreshToken", refreshToken, COOKIE_OPTS);
  res.status(201).json({ data: { user, accessToken } });
});

export const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);
  res.cookie("refreshToken", refreshToken, COOKIE_OPTS);
  res.json({ data: { user, accessToken } });
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) throw ApiError.unauthorized("No refresh token");
  const { accessToken } = await authService.refresh(token);
  res.json({ data: { accessToken } });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken", { ...COOKIE_OPTS, maxAge: 0 });
  res.status(204).send();
});

export const me = asyncHandler(async (req, res) => {
  const user = await userRepo.findById(req.user.sub);
  res.json({ data: user });
});
```

```javascript
// server/src/routes/auth.routes.js
import { Router } from "express";
import * as c from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { authenticate } from "../middleware/auth.js";
import { registerSchema, loginSchema } from "../validators/auth.schema.js";
import rateLimit from "express-rate-limit";

const authLimiter = rateLimit({ windowMs: 15*60*1000, max: 10, message: { error: { code: "RATE_LIMIT", message: "Too many attempts" } } });

const router = Router();

router.post("/register", authLimiter, validate(registerSchema), c.register);
router.post("/login",    authLimiter, validate(loginSchema),    c.login);
router.post("/refresh",  c.refresh);
router.post("/logout",   c.logout);
router.get("/me", authenticate, c.me);

export default router;
```

```bash
npm i cookie-parser
```

```javascript
// in app.js
import cookieParser from "cookie-parser";
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL ?? "http://localhost:5173",
  credentials: true,
}));
```

### 26.5 Auth: Frontend

```jsx
// client/src/features/auth/api.js
import { api } from "@/lib/apiClient";

export const authApi = {
  register: (data) => api.post("/auth/register", data),
  login:    (data) => api.post("/auth/login", data),
  refresh:  ()     => api.post("/auth/refresh"),
  logout:   ()     => api.post("/auth/logout"),
  me:       ()     => api.get("/auth/me"),
};
```

```jsx
// client/src/features/auth/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from "react";
import { authApi } from "./api";
import { setAccessToken } from "@/lib/apiClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  // On boot: try to refresh the access token using the HttpOnly cookie
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await authApi.refresh();
        setAccessToken(res.data.accessToken);
        const me = await authApi.me();
        if (!cancelled) setUser(me.data);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setBooting(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async (credentials) => {
    const res = await authApi.login(credentials);
    setAccessToken(res.data.accessToken);
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const res = await authApi.register(payload);
    setAccessToken(res.data.accessToken);
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const logout = useCallback(async () => {
    try { await authApi.logout(); } finally {
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({ user, booting, login, register, logout, isAuthenticated: !!user, role: user?.role }),
    [user, booting, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
```

```javascript
// client/src/lib/apiClient.js
let accessToken = null;
let onUnauthorized = null;
let refreshPromise = null;

export const setAccessToken = (t) => { accessToken = t; };
export const setUnauthorizedHandler = (fn) => { onUnauthorized = fn; };

const BASE_URL = import.meta.env.VITE_API_URL ?? "/api/v1";

export class ApiError extends Error {
  constructor(message, status, code, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then(r => r.ok ? r.json() : Promise.reject(new Error("refresh failed")))
      .then(json => { setAccessToken(json.data.accessToken); return json.data.accessToken; })
      .finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
}

async function request(path, { method = "GET", body, headers = {}, signal, _retry = false } = {}) {
  const isForm = body instanceof FormData;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    signal,
    credentials: "include",     // send the refresh cookie
    headers: {
      ...(isForm ? {} : { "Content-Type": "application/json" }),
      Accept: "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    body: isForm ? body : body != null ? JSON.stringify(body) : undefined,
  });

  // 401 → try refreshing once, then replay the request
  if (res.status === 401 && !_retry && !path.startsWith("/auth/")) {
    try {
      await refreshAccessToken();
      return request(path, { method, body, headers, signal, _retry: true });
    } catch {
      setAccessToken(null);
      onUnauthorized?.();
      throw new ApiError("Session expired", 401, "SESSION_EXPIRED");
    }
  }

  if (res.status === 204) return null;

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const e = data?.error ?? {};
    if (res.status === 401) { setAccessToken(null); onUnauthorized?.(); }
    throw new ApiError(e.message ?? `Request failed (${res.status})`, res.status, e.code, e.details);
  }

  return data;
}

export const api = {
  get:    (p, o)       => request(p, o),
  post:   (p, b, o)    => request(p, { ...o, method: "POST",   body: b }),
  put:    (p, b, o)    => request(p, { ...o, method: "PUT",    body: b }),
  patch:  (p, b, o)    => request(p, { ...o, method: "PATCH",  body: b }),
  delete: (p, o)       => request(p, { ...o, method: "DELETE" }),
};
```

```jsx
// client/src/app/App.jsx
import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider, useAuth } from "@/features/auth/AuthContext";
import { setUnauthorizedHandler } from "@/lib/apiClient";
import { ToastProvider, useToast } from "@/features/toast/ToastContext";
import Router from "./router";

function UnauthorizedBridge() {
  const { logout } = useAuth();
  const { push } = useToast();

  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout();
      push("Your session expired. Please log in again.", "warning");
    });
  }, [logout, push]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <UnauthorizedBridge />
          <Router />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
```

### 26.6 Role-Based UI

```jsx
// components/Can.jsx
import { useAuth } from "@/features/auth/AuthContext";

export function Can({ roles, children, fallback = null }) {
  const { user } = useAuth();
  if (!user) return fallback;
  if (!roles.includes(user.role)) return fallback;
  return children;
}
```

```jsx
// Usage
<Can roles={["admin", "mentor"]}>
  <button onClick={openCreateCourse}>New Course</button>
</Can>

<Can roles={["admin"]} fallback={<p>Contact an admin to delete courses.</p>}>
  <button onClick={confirmDelete}>Delete Course</button>
</Can>
```

```jsx
// Route-level
<Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
  <Route path="/admin" element={<AdminDashboard />} />
</Route>
```

> **Client-side role checks are UX only.** The server must enforce the same rules — a determined user can call the API directly.

### 26.7 End-to-End Flow: Enrol in a Course

```
1. User clicks "Enrol" on /courses/42
      ↓
2. CourseDetail calls enroll(42) from useCourses()
      ↓
3. Optimistic UI: enrolment appears instantly, button → "Enrolled"
      ↓
4. api.post("/courses/42/enroll")
      ├─ apiClient attaches: Authorization: Bearer <accessToken>
      └─ credentials: "include" sends the refresh cookie
      ↓
5. Express route:
      authenticate  → verifies JWT → req.user = { sub: "7", role: "student" }
      authorize("student","admin") → passes
      validate(enrollSchema) → params.id is numeric
      controller.enrollCourse
      ↓
6. Service:
      • course exists?           → else 404
      • course is published?     → else 409
      • already enrolled?        → else 409 (caught by the UNIQUE key too)
      • insert enrollment in a transaction
      ↓
7. Repository: INSERT ... parameterised
      ↓
8. Controller returns 201 with the created enrollment
      ↓
9. Frontend replaces the optimistic entry with the server response
      ↓
10. Toast: "Enrolled successfully"
```

**Server-side service**

```javascript
async enroll(userId, courseId) {
  const course = await courseRepo.findById(courseId);
  if (!course) throw ApiError.notFound("Course not found");
  if (!course.is_published) throw ApiError.conflict("Course is not open for enrolment");

  const existing = await enrollmentRepo.findByUserAndCourse(userId, courseId);
  if (existing) throw ApiError.conflict("You are already enrolled in this course");

  return enrollmentRepo.create({ user_id: userId, course_id: courseId, status: "active", progress: 0 });
}
```

**Frontend hook**

```jsx
function useEnroll(courseId) {
  const { push } = useToast();
  const [enrolling, setEnrolling] = useState(false);

  const enroll = useCallback(async () => {
    setEnrolling(true);
    try {
      const res = await api.post(`/courses/${courseId}/enroll`);
      push("Enrolled successfully!", "success");
      return res.data;
    } catch (err) {
      if (err.status === 409) push(err.message, "warning");
      else if (err.status === 401) push("Please log in to enrol.", "warning");
      else push(apiErrorMessage(err), "error");
      throw err;
    } finally {
      setEnrolling(false);
    }
  }, [courseId, push]);

  return { enroll, enrolling };
}
```

### 26.8 Serving the Built Client from Express

```javascript
// server/src/app.js (production only)
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

if (process.env.NODE_ENV === "production") {
  const clientDist = path.join(__dirname, "../../client/dist");

  app.use(express.static(clientDist, { maxAge: "1y", immutable: true }));

  // SPA fallback — must come AFTER the API routes and BEFORE error handlers
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}
```

### 26.9 Environment Configuration

**`server/.env.example`**

```bash
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=3306
DB_USER=ethiroli_app
DB_PASSWORD=change-me
DB_NAME=ethiroli_lms

JWT_SECRET=replace-with-a-long-random-string
JWT_REFRESH_SECRET=replace-with-another-long-random-string
```

**`client/.env.example`**

```bash
VITE_API_URL=/api/v1
VITE_APP_NAME=Ethiroli LMS
```

**Fail-fast config validation**

```javascript
// server/src/config/env.js
const required = [
  "DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME",
  "JWT_SECRET", "JWT_REFRESH_SECRET",
];

const missing = required.filter(k => !process.env[k]);
if (missing.length) {
  console.error(`❌ Missing required env vars: ${missing.join(", ")}`);
  process.exit(1);
}

if (process.env.NODE_ENV === "production" && process.env.JWT_SECRET.length < 32) {
  console.error("❌ JWT_SECRET must be at least 32 characters in production");
  process.exit(1);
}
```

### 26.10 Full-Stack Debugging Checklist

| Symptom | Likely cause | Fix |
|---|---|---|
| CORS error in the browser | Origin not allowed / no `credentials` | Set `CLIENT_URL` and `credentials: true` on both sides |
| 401 on every request | Token not attached or expired | Check `accessToken` in the request headers |
| Cookie not sent | `sameSite`/`secure` mismatch | `lax` in dev, `none` + `secure` in prod (HTTPS) |
| 404 on refresh of a deep route | SPA fallback missing | Add the `app.get(/^(?!\/api).*/)` handler |
| Body is `undefined` | `express.json()` missing or body not JSON | Add the parser and set `Content-Type` |
| `req.user` undefined | Auth middleware not applied to the route | Add `authenticate` |
| Slow response | N+1 queries | Check the logs; batch with a JOIN |
| Duplicate rows in a JOIN | One-to-many fan-out | Use `DISTINCT` or aggregate in a subquery |
| Works in Postman, fails in the app | Proxy/base URL wrong | Log the resolved URL |

### 26.11 Full-Stack Testing

```javascript
// server/tests/courses.test.js
import request from "supertest";
import { describe, it, expect, beforeAll } from "vitest";
import app from "../src/app.js";

let token;

beforeAll(async () => {
  const res = await request(app)
    .post("/api/v1/auth/login")
    .send({ email: "admin@ethiroli.com", password: "Admin@12345" });
  token = res.body.data.accessToken;
});

describe("GET /api/v1/courses", () => {
  it("returns a paginated list", async () => {
    const res = await request(app).get("/api/v1/courses?page=1&limit=5");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.meta).toHaveProperty("totalPages");
  });

  it("filters by level", async () => {
    const res = await request(app).get("/api/v1/courses?level=beginner");
    expect(res.status).toBe(200);
    res.body.data.forEach(c => expect(c.level).toBe("beginner"));
  });
});

describe("POST /api/v1/courses", () => {
  it("rejects unauthenticated requests", async () => {
    const res = await request(app).post("/api/v1/courses").send({});
    expect(res.status).toBe(401);
  });

  it("rejects invalid payloads with 422 and field details", async () => {
    const res = await request(app)
      .post("/api/v1/courses")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "x", level: "expert" });
    expect(res.status).toBe(422);
    expect(res.body.error.details.length).toBeGreaterThan(0);
  });

  it("creates a course", async () => {
    const res = await request(app)
      .post("/api/v1/courses")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test Course", level: "beginner", durationDays: 30, price: 1000 });
    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty("id");
  });
});
```

---

### 🧪 DAY 26 TASK — `D26-T1`

**Deliverable:** A fully integrated full-stack application.

**Backend (from Day 24–25)**
- Express API with MySQL, zod validation, JWT auth, role-based authorization
- Endpoints: `/auth/*`, `/courses/*`, `/enrollments/*`, `/assignments/*`, `/submissions/*`
- Refresh-token cookie flow with 15-minute access tokens

**Frontend (from Days 16–23)**
- React + Vite, React Router, Context for auth/toast/theme
- `apiClient` with automatic 401 → refresh → replay
- Login, Register, Logout, Me
- Courses list, detail, enrol, my courses, profile

**Integration requirements**

| # | Requirement |
|---|---|
| 1 | Dev proxy configured — no CORS errors |
| 2 | `apiClient` attaches the access token on every request |
| 3 | 401 triggers a single refresh attempt, then replays the original request |
| 4 | Failed refresh logs the user out and shows a toast |
| 5 | Refresh token stored in an **HttpOnly** cookie, never in localStorage |
| 6 | Access token kept in memory only (not persisted) |
| 7 | Page reload restores the session via `/auth/refresh` + `/auth/me` |
| 8 | `ProtectedRoute` preserves the intended destination |
| 9 | Role-based rendering with `<Can roles={[...]}>` |
| 10 | Server enforces the same role rules (prove it with a curl test) |
| 11 | Optimistic enrol with rollback on 409 |
| 12 | Every mutation shows a toast |
| 13 | Loading skeletons, error states with retry, empty states |
| 14 | Search, filter, sort, pagination all round-trip to the API |
| 15 | `EXPLAIN` on the course list query; add an index if needed |
| 16 | No N+1 queries — verify by counting SQL statements per request |
| 17 | Server serves the built client in production |
| 18 | `.env.example` files for both client and server, `.env` gitignored |
| 19 | Root `npm run dev` starts both with `concurrently` |
| 20 | Integration tests: 15+ covering auth, CRUD, validation, and authorization |

**Deliverables**
1. `ethiroli-fullstack/` monorepo
2. `INTEGRATION.md` — the end-to-end enrol flow with a sequence diagram
3. `SECURITY.md` — how tokens are stored, what the server enforces, and what the client cannot be trusted for
4. Screenshots: logged out, logged in as student, logged in as admin, session-expired toast
5. Test output with all tests passing
6. `npm run db:setup && npm run dev` works from a clean clone

**Bonus**
- Add `POST /auth/logout-all` that invalidates all refresh tokens for the user (requires a token store)
- Add a request-ID header propagated to logs and error responses
- Add a `/api/v1/health/db` endpoint that pings MySQL
- Add Docker Compose with `mysql`, `api`, and `web` services

---

### ❓ DAY 26 QUIZ — `D26-Q` (5 Questions)

| # | Question | Options | Answer |
|---|---|---|---|
| 1 | A dev proxy avoids | A) HTTP B) CORS in development C) Auth D) Databases | **B** |
| 2 | The refresh token should live in | A) `localStorage` B) `sessionStorage` C) An HttpOnly cookie D) A JS variable | **C** |
| 3 | Client-side role checks are | A) Sufficient security B) UX only — the server must enforce too C) Useless D) Server-side only | **B** |
| 4 | On a 401 from an expired access token the client should | A) Log out immediately B) Try one refresh then replay the request C) Retry forever D) Ignore it | **B** |
| 5 | The SPA fallback route must be registered | A) First B) Before the API routes C) After the API routes D) Never | **C** |

---

# DAY 27 — Testing & Debugging

**Module:** `QA-TEST` | **Duration:** 7 h | **Lesson Code:** `QA-D27`

### Learning Objectives
- Explain the testing pyramid and where each type fits
- Write unit, integration, and component tests
- Test React components with Testing Library
- Test APIs with Supertest
- Debug systematically across the stack

### 27.1 Testing Fundamentals

**Why test**

| Reason | Benefit |
|---|---|
| Catch regressions | Confidence to refactor |
| Document behaviour | Tests are executable specs |
| Force better design | Testable code is decoupled code |
| Reduce manual QA | Faster releases |
| Enable CI/CD | Automated gates |

**The Testing Pyramid**

```
        ▲
       ╱ ╲          E2E (few, slow, brittle)
      ╱───╲         5–10%
     ╱     ╲
    ╱───────╲       Integration (some)
   ╱         ╲      20–30%
  ╱───────────╲
 ╱             ╲    Unit (many, fast, cheap)
╱───────────────╲   60–70%
```

| Level | Scope | Speed | Example |
|---|---|---|---|
| Unit | One function/module | ms | `calculateTotal()` |
| Integration | Multiple units + DB/API | 100s of ms | `POST /courses` |
| Component | One React component | ms | `<Button>` renders and fires `onClick` |
| E2E | Whole app in a browser | seconds | Login → enrol → see dashboard |
| Manual | Human exploration | minutes | Exploratory testing |

**Test types (by intent)**

| Type | Question it answers |
|---|---|
| Unit | Does this function work? |
| Integration | Do these parts work together? |
| Regression | Did we break what worked before? |
| Smoke | Does the app start? |
| Load | Does it survive 10,000 users? |
| Security | Can it be exploited? |
| Accessibility | Can everyone use it? |
| Visual | Did the UI change unexpectedly? |

### 27.2 AAA Pattern

```javascript
test("calculateTotal applies tax and rounds to 2 decimals", () => {
  // ARRANGE
  const items = [{ price: 100, qty: 2 }, { price: 50, qty: 1 }];
  const taxRate = 0.18;

  // ACT
  const result = calculateTotal(items, taxRate);

  // ASSERT
  expect(result).toBe(295.00);
});
```

### 27.3 Unit Testing with Vitest

```bash
npm i -D vitest
```

```javascript
// src/utils/cart.js
export function calculateTotal(items, taxRate = 0.18) {
  if (!Array.isArray(items)) throw new TypeError("items must be an array");
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  return Number((subtotal * (1 + taxRate)).toFixed(2));
}

export function applyDiscount(total, percent) {
  if (percent < 0 || percent > 100) throw new RangeError("percent must be 0–100");
  return Number((total * (1 - percent / 100)).toFixed(2));
}
```

```javascript
// src/utils/cart.test.js
import { describe, it, expect } from "vitest";
import { calculateTotal, applyDiscount } from "./cart";

describe("calculateTotal", () => {
  it("sums line totals and applies tax", () => {
    expect(calculateTotal([{ price: 100, qty: 2 }], 0.18)).toBe(236.00);
  });

  it("returns 0 for an empty cart", () => {
    expect(calculateTotal([])).toBe(0);
  });

  it("throws for non-array input", () => {
    expect(() => calculateTotal(null)).toThrow(TypeError);
  });

  it("rounds to 2 decimals", () => {
    expect(calculateTotal([{ price: 33.33, qty: 3 }], 0.18)).toBe(117.99);
  });

  it.each([
    [[{ price: 10, qty: 1 }], 11.80],
    [[{ price: 10, qty: 2 }], 23.60],
    [[{ price: 10, qty: 3 }], 35.40],
  ])("handles %o", (items, expected) => {
    expect(calculateTotal(items)).toBe(expected);
  });
});

describe("applyDiscount", () => {
  it("applies a percentage", () => {
    expect(applyDiscount(1000, 10)).toBe(900);
  });

  it.each([-1, 101, 200])("throws for invalid percent %i", (p) => {
    expect(() => applyDiscount(100, p)).toThrow(RangeError);
  });
});
```

**Essential matchers**

```javascript
expect(x).toBe(y);                    // Object.is — primitives
expect(x).toEqual(y);                 // deep equality
expect(x).toStrictEqual(y);           // deep + no undefined keys
expect(x).toBeTruthy() / toBeFalsy();
expect(x).toBeNull() / toBeUndefined() / toBeDefined();
expect(x).toBeGreaterThan(y) / toBeLessThanOrEqual(y);
expect(x).toBeCloseTo(0.3, 5);        // floats
expect(arr).toContain(item);
expect(arr).toHaveLength(3);
expect(str).toMatch(/pattern/);
expect(obj).toHaveProperty("a.b", 1);
expect(fn).toThrow(ErrorType);
expect(fn).toHaveBeenCalledWith(args);
expect(fn).toHaveBeenCalledTimes(2);
expect(x).toBeInstanceOf(Class);
expect(x).toMatchSnapshot();
```

**Setup, teardown, mocks**

```javascript
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

beforeEach(() => { /* runs before each test */ });
afterEach(() => { vi.restoreAllMocks(); });

// Mock a function
const fn = vi.fn();
fn("a");
expect(fn).toHaveBeenCalledWith("a");

// Mock a module
vi.mock("./api", () => ({
  fetchUser: vi.fn().mockResolvedValue({ id: 1, name: "Asha" }),
}));

// Mock a timer
vi.useFakeTimers();
setTimeout(callback, 1000);
vi.advanceTimersByTime(1000);
expect(callback).toHaveBeenCalled();
vi.useRealTimers();

// Spy on a method (keep the original implementation)
const spy = vi.spyOn(console, "error").mockImplementation(() => {});
```

### 27.4 Component Testing

```bash
npm i -D @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      thresholds: { lines: 70, functions: 70, branches: 60 },
      exclude: ["**/*.test.*", "**/test/**", "**/*.config.*"],
    },
  },
});
```

```jsx
// components/LoginForm.test.jsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LoginForm from "./LoginForm";

describe("<LoginForm />", () => {
  let onSubmit;

  beforeEach(() => {
    onSubmit = vi.fn().mockResolvedValue(undefined);
  });

  it("renders email and password fields with labels", () => {
    render(<LoginForm onSubmit={onSubmit} />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  it("shows an error for an invalid email", async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/email/i), "not-an-email");
    await user.tab();   // trigger blur

    expect(await screen.findByRole("alert")).toHaveTextContent(/valid email/i);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("disables the submit button while submitting", async () => {
    const user = userEvent.setup();
    let resolve;
    onSubmit.mockReturnValue(new Promise(r => { resolve = r; }));

    render(<LoginForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/email/i), "a@b.com");
    await user.type(screen.getByLabelText(/password/i), "Password1!");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(screen.getByRole("button", { name: /logging in/i })).toBeDisabled();
    resolve();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /log in/i })).toBeEnabled()
    );
  });

  it("submits valid credentials", async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/email/i), "asha@ethiroli.com");
    await user.type(screen.getByLabelText(/password/i), "Password1!");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: "asha@ethiroli.com",
        password: "Password1!",
      });
    });
  });

  it("is keyboard accessible", async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={onSubmit} />);

    await user.tab();
    expect(screen.getByLabelText(/email/i)).toHaveFocus();
    await user.tab();
    expect(screen.getByLabelText(/password/i)).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: /log in/i })).toHaveFocus();
  });
});
```

**Query priority**

| Priority | Query | When |
|---|---|---|
| 1 | `getByRole` | ✅ Always try first |
| 2 | `getByLabelText` | Form fields |
| 3 | `getByPlaceholderText` | Only if no label |
| 4 | `getByText` | Non-interactive content |
| 5 | `getByDisplayValue` | Filled inputs |
| 6 | `getByAltText` | Images |
| 7 | `getByTitle` | Tooltips |
| 8 | `getByTestId` | Last resort |

**Async variants:** `findBy*` (waits, returns a Promise), `queryBy*` (returns `null` instead of throwing — use for absence assertions).

```jsx
// Element should NOT be present
expect(screen.queryByText(/error/i)).not.toBeInTheDocument();

// Element will appear
expect(await screen.findByText(/welcome/i)).toBeInTheDocument();
```

**Testing a component that fetches**

```jsx
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  http.get("/api/v1/courses", () =>
    HttpResponse.json({
      data: [{ id: 1, title: "Full Stack" }],
      meta: { page: 1, totalPages: 1 },
    })
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it("renders courses from the API", async () => {
  render(<CourseList />);
  expect(screen.getByRole("status")).toBeInTheDocument();       // loading
  expect(await screen.findByText("Full Stack")).toBeInTheDocument();
});

it("shows an error state on failure", async () => {
  server.use(
    http.get("/api/v1/courses", () => HttpResponse.json({ error: { message: "Boom" } }, { status: 500 }))
  );
  render(<CourseList />);
  expect(await screen.findByRole("alert")).toHaveTextContent(/try again/i);
});
```

### 27.5 API Testing with Supertest

```bash
npm i -D supertest
```

```javascript
// server/tests/auth.test.js
import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import app from "../src/app.js";
import { pool } from "../src/config/db.js";

beforeAll(async () => { /* seed a test user */ });
afterAll(async () => { await pool.end(); });

describe("POST /api/v1/auth/register", () => {
  it("creates a user and returns an access token", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ name: "Test User", email: `t${Date.now()}@x.com`, password: "Password1!" });

    expect(res.status).toBe(201);
    expect(res.body.data.user).toHaveProperty("id");
    expect(res.body.data.user).not.toHaveProperty("password_hash");
    expect(res.body.data.accessToken).toEqual(expect.any(String));
    expect(res.headers["set-cookie"].join()).toMatch(/refreshToken=/);
  });

  it("rejects a duplicate email with 409", async () => {
    const email = `dup${Date.now()}@x.com`;
    await request(app).post("/api/v1/auth/register").send({ name: "A", email, password: "Password1!" });
    const res = await request(app).post("/api/v1/auth/register").send({ name: "B", email, password: "Password1!" });
    expect(res.status).toBe(409);
  });

  it("rejects a weak password with 422 and field details", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ name: "A", email: `w${Date.now()}@x.com`, password: "123" });
    expect(res.status).toBe(422);
    expect(res.body.error.details.some(d => d.field === "password")).toBe(true);
  });
});

describe("POST /api/v1/auth/login", () => {
  it("returns 401 for a wrong password", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "asha@ethiroli.com", password: "wrong" });
    expect(res.status).toBe(401);
    // Must not reveal which field was wrong
    expect(res.body.error.message).toMatch(/invalid email or password/i);
  });
});
```

### 27.6 Debugging Across the Stack

**The scientific method**

```
1. REPRODUCE  — make it fail the same way every time
2. ISOLATE    — narrow to the smallest failing case
3. HYPOTHESISE— what do you think is wrong?
4. TEST       — one change at a time
5. FIX        — address the root cause
6. VERIFY     — confirm the fix and add a regression test
```

**Binary-search debugging**

Comment out half the code. If the bug persists, it's in the other half. Repeat. You find it in `log₂(n)` steps.

**Frontend debugging toolkit**

| Tool | Use |
|---|---|
| React DevTools → Components | Inspect props, state, hooks |
| React DevTools → Profiler | Find slow renders |
| Chrome DevTools → Sources | Breakpoints, step through, watch |
| Chrome DevTools → Network | Inspect requests, payloads, timings |
| Chrome DevTools → Application | localStorage, cookies, cache |
| `console.table` | Arrays of objects |
| `console.time` / `timeEnd` | Measure duration |
| Redux/React Query DevTools | Inspect state/cache |

**Backend debugging toolkit**

| Tool | Use |
|---|---|
| `node --inspect` + Chrome | Step through server code |
| `console.time` | Measure handler duration |
| SQL logging | See the actual queries |
| `EXPLAIN` | Diagnose slow queries |
| Request IDs | Correlate logs across services |
| `curl -v` | See raw headers and status |
| Postman Console | Inspect every request/response |

**Full-stack trace: "Enrol button does nothing"**

| Step | Check | How |
|---|---|---|
| 1 | Did the click handler run? | `console.log` in the handler |
| 2 | Was the request sent? | Network tab |
| 3 | What URL/method/body? | Network → Headers, Payload |
| 4 | What status came back? | Network → Response |
| 5 | Did the auth header exist? | Network → Request Headers |
| 6 | Did the route match? | Server access log |
| 7 | Did the middleware pass? | Log inside `authenticate` |
| 8 | Did validation reject it? | Log the zod result |
| 9 | Did the service throw? | Log in the error handler |
| 10 | Did the query run? | SQL log |
| 11 | Did the frontend handle the response? | Log in the `catch` |
| 12 | Did the UI re-render? | React DevTools → Components |

**Common bugs**

| Symptom | Cause | Fix |
|---|---|---|
| UI doesn't update | Mutated state | Immutable update |
| Stale value in a callback | Missing effect dep | Add the dep |
| Infinite fetch loop | Object/array dep | Depend on a primitive |
| "Cannot read properties of undefined" | Missing optional chaining | `a?.b?.c` |
| 401 everywhere | Token not attached | Check `apiClient` |
| CORS error | Origin/credentials mismatch | Configure both sides |
| Duplicate rows | One-to-many JOIN fan-out | `DISTINCT` or subquery |
| Slow list | N+1 queries | Batch with a JOIN |
| Memory leak warning | Missing cleanup | Return a cleanup function |
| Works locally, fails in prod | Env var or path difference | Compare configs |

### 27.7 Test Coverage

```bash
npx vitest run --coverage
```

| Metric | Target |
|---|---|
| Lines | ≥ 70% |
| Functions | ≥ 70% |
| Branches | ≥ 60% |
| Statements | ≥ 70% |

> **Coverage is a diagnostic, not a goal.** 100% coverage with meaningless assertions is worse than 70% with good ones. Focus on critical paths: auth, payment, data mutation.

### 27.8 What to Test

| Always test | Skip |
|---|---|
| Auth (login, register, refresh, roles) | Trivial getters/setters |
| CRUD mutations | Third-party library internals |
| Validation rules | Pure presentational markup |
| Money/date calculations | One-off scripts |
| Permission boundaries | Framework boilerplate |
| Error paths | Console logs |
| Edge cases (empty, null, huge) | — |

### 27.9 CI Integration

```yaml
# .github/workflows/test.yml
name: Test

on:
  push: { branches: [main] }
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      mysql:
        image: mysql:8
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: ethiroli_test
        ports: ["3306:3306"]
        options: >-
          --health-cmd="mysqladmin ping" --health-interval=10s
          --health-timeout=5s --health-retries=5

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }

      - run: npm ci
      - run: npm ci --prefix server
      - run: npm ci --prefix client

      - name: Lint
        run: npm run lint --prefix client

      - name: Server tests
        run: npm test --prefix server
        env:
          DB_HOST: 127.0.0.1
          DB_USER: root
          DB_PASSWORD: root
          DB_NAME: ethiroli_test
          JWT_SECRET: test-secret-at-least-32-characters-long
          JWT_REFRESH_SECRET: test-refresh-secret-32-characters-min

      - name: Client tests + coverage
        run: npm test --prefix client -- --coverage

      - name: Upload coverage
        uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: client/coverage
```

---

### 🧪 DAY 27 TASK — `D27-T1`

**Deliverable:** A complete test suite for your full-stack app.

**Part A — Unit tests (client)**
Target ≥ 80% coverage on all pure utilities:
- `cart.js` — `calculateTotal`, `applyDiscount`, `formatCurrency`
- `validators.js` — every validation rule
- `formatters.js` — date, currency, truncation, slugify
- `arrayUtils.js` — `groupBy`, `sortBy`, `uniqueBy`, `paginate`
- A `reducer.js` — every action, plus unknown actions

Each function needs: happy path, boundary values, invalid input, and edge cases (empty, null, very large). Use `it.each` for table-driven cases.

**Part B — Custom hook tests**

Test with `renderHook`:
- `useDebounce` — value updates only after the delay (fake timers)
- `useLocalStorage` — reads, writes, handles corrupt JSON
- `useToggle` — toggles and exposes `setTrue`/`setFalse`
- `useFetch` — loading → success, loading → error, aborts on unmount
- `useForm` — validation on blur, submit blocked when invalid, submit runs when valid

**Part C — Component tests**

For each component, test: rendering, user interaction, accessibility, and edge cases.

| Component | Tests to write |
|---|---|
| `Button` | Renders children; fires `onClick`; disabled blocks clicks; loading shows a spinner and disables; keyboard activation with Enter/Space |
| `Input` | Label associated; error shown with `role="alert"`; `aria-invalid` and `aria-describedby` set; hint hidden when an error is present |
| `Modal` | Opens; Escape closes; backdrop click closes; focus moves in on open and returns on close; Tab cycles inside |
| `Tabs` | Renders tabs; click switches panel; `aria-selected` updates; ArrowRight/ArrowLeft navigate; only the active panel is visible |
| `Pagination` | Renders page buttons; current page has `aria-current="page"`; Prev disabled on page 1; Next disabled on the last page |
| `Toast` | Appears on push; auto-dismisses after the duration; manual dismiss works; `aria-live` present |
| `CourseList` | Shows a skeleton while loading; renders items on success; shows an error with a retry button on failure; shows an empty state when there's no data; shows a different empty state when filters match nothing |

Mock all network calls with **MSW** — no real HTTP.

**Part D — API integration tests (server)**

Minimum **25 tests** with Supertest:

| Area | Tests |
|---|---|
| Auth | Register success; duplicate email 409; weak password 422; login success; wrong password 401; unknown email 401 (same message); `/me` without a token 401; `/me` with a valid token 200 |
| Courses | List paginated; filter by level; search by `q`; sort ascending/descending; get by id 200; get by id 404; create 201 with an admin token; create 401 without a token; create 403 with a student token; create 422 invalid payload; patch 200; patch 404; delete 204; delete 404 |
| Authorization | A student cannot delete a course (403); a mentor can create but not delete (403); an admin can do both |
| Enrolments | Enrol 201; duplicate enrol 409; enrol in an unpublished course 409; enrol in a non-existent course 404 |
| Errors | Unmatched route returns the standard envelope with 404; a 500 does not leak a stack trace in production mode |
| Data integrity | Passwords never appear in any response; `password_hash` is never selected |

Assert on: status code, response shape, `error.code`, presence/absence of sensitive fields, and headers (`set-cookie`, `Location`).

**Part E — E2E smoke test (Playwright)**

```bash
npm i -D @playwright/test
npx playwright install
```

Write 3 E2E flows:
1. Register → land on dashboard → see the welcome message
2. Login → browse courses → enrol → see it in "My Courses"
3. Login as admin → create a course → see it in the list → delete it

```javascript
// e2e/enrol.spec.js
import { test, expect } from "@playwright/test";

test("student can enrol in a course", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel(/email/i).fill("student@ethiroli.com");
  await page.getByLabel(/password/i).fill("Password1!");
  await page.getByRole("button", { name: /log in/i }).click();

  await expect(page.getByRole("heading", { name: /dashboard/i })).toBeVisible();

  await page.getByRole("link", { name: /courses/i }).click();
  await page.getByRole("link", { name: /full stack/i }).first().click();
  await page.getByRole("button", { name: /enrol/i }).click();

  await expect(page.getByText(/enrolled successfully/i)).toBeVisible();

  await page.getByRole("link", { name: /my courses/i }).click();
  await expect(page.getByText(/full stack/i)).toBeVisible();
});
```

**Part F — `TESTING.md`**

1. Testing strategy and the pyramid
2. Every command (`test`, `test:watch`, `test:coverage`, `test:e2e`)
3. Coverage report and what's deliberately not covered
4. A list of known gaps with a plan
5. How to write a new test (conventions, file naming, structure)
6. What NOT to test and why
7. Screenshot of the coverage report

**Part G — `BUGLOG.md`**

Document **10 bugs** you found and fixed. For each:

| Field | Content |
|---|---|
| Symptom | What the user saw |
| Reproduction | Exact steps |
| Investigation | How you narrowed it down |
| Root cause | The actual defect |
| Fix | The change, with a code snippet |
| Test added | The regression test |
| Lesson | What you'll do differently |

Include at least 3 bugs per layer (client, server, database).

**Bonus**
- Add `npm run test:changed` running only tests for changed files
- Add a coverage badge to the README
- Add an axe accessibility check to the component tests
- Add a visual regression test with Playwright screenshots

---

### ❓ DAY 27 QUIZ — `D27-Q` (5 Questions)

| # | Question | Options | Answer |
|---|---|---|---|
| 1 | The testing pyramid recommends the most tests at | A) E2E B) Unit C) Manual D) Integration | **B** |
| 2 | `getByRole` is preferred because | A) It's faster B) It mirrors how users and assistive tech find elements C) It's shorter D) It works without a DOM | **B** |
| 3 | `queryByText` differs from `getByText` by | A) Being async B) Returning `null` instead of throwing C) Matching partial text D) Searching attributes | **B** |
| 4 | Coverage is best treated as | A) The goal B) A diagnostic, not a goal C) Irrelevant D) A replacement for tests | **B** |
| 5 | E2E tests are | A) Fast and cheap B) Slow and brittle — keep them few C) Unit tests D) Mocked | **B** |

---

# DAY 28 — Project Development Day 1

**Module:** `ETH-WEB-30-PROJ` | **Duration:** 7 h | **Lesson Code:** `PR-D28`

### Objective
Begin the capstone project. Today: plan, design, scaffold, and build the data layer.

---

### 28.1 Project Brief

**Build: Employee Task Management System**

A full-stack application where an organisation can manage employees and assign tasks.

**User roles**

| Role | Capabilities |
|---|---|
| **Admin** | Full access — manage employees, manage tasks, view all reports |
| **Manager** | Create/assign tasks to their team, view team reports |
| **Employee** | View own tasks, update task status, log time |

**Core features**

1. **Authentication** — register (admin only), login, logout, session persistence, role-based routing
2. **Employees** — CRUD, search, filter by department/role/status, pagination
3. **Tasks** — CRUD, assign to an employee, set priority/due date/status, filter and sort
4. **Dashboard** — stats (total employees, tasks by status, overdue tasks), charts, recent activity
5. **Profile** — view/edit own profile, change password, upload avatar
6. **Reports** — task completion rate per employee, overdue report, workload distribution
7. **Notifications** — in-app toast/inbox for assignments and due-date reminders
8. **Audit log** — who changed what and when

### 28.2 Requirements Specification

**Functional requirements (sample)**

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | Users can register with name, email, password | Must |
| FR-02 | Users can log in and receive a session | Must |
| FR-03 | Admins can create, edit, and deactivate employees | Must |
| FR-04 | Users can create tasks with title, description, priority, due date, assignee | Must |
| FR-05 | Employees can change their own task status | Must |
| FR-06 | Tasks can be filtered by status, priority, assignee, and due date | Must |
| FR-07 | The dashboard shows counts and overdue tasks | Should |
| FR-08 | Users receive an in-app notification on task assignment | Should |
| FR-09 | An audit log records all mutations | Could |
| FR-10 | Tasks support file attachments | Won't (this iteration) |

**Non-functional requirements**

| ID | Requirement |
|---|---|
| NFR-01 | Page load < 2 s on 4G |
| NFR-02 | API responses < 500 ms at p95 for lists ≤ 100 rows |
| NFR-03 | WCAG 2.1 AA compliance |
| NFR-04 | Works on 320 px to 1920 px |
| NFR-05 | Passwords hashed with bcrypt (cost ≥ 12) |
| NFR-06 | All endpoints authenticated except register/login |
| NFR-07 | Zero console errors in production |
| NFR-08 | 70% test coverage on business logic |

### 28.3 Data Model

```sql
-- users
id, name, email (unique), password_hash, role ENUM('admin','manager','employee'),
department, position, phone, avatar_url, is_active, created_at, updated_at

-- tasks
id, title, description, status ENUM('todo','in_progress','review','done','blocked'),
priority ENUM('low','medium','high','urgent'),
assignee_id FK→users, created_by FK→users,
due_date DATETIME, completed_at DATETIME NULL,
estimated_hours DECIMAL(6,2), actual_hours DECIMAL(6,2),
created_at, updated_at

-- comments
id, task_id FK→tasks, user_id FK→users, body TEXT, created_at

-- notifications
id, user_id FK→users, type, title, body, link, is_read, created_at

-- audit_log
id, user_id FK→users, action, entity, entity_id, changes JSON, ip, created_at
```

**Indexes**
```sql
CREATE INDEX idx_tasks_assignee_status ON tasks(assignee_id, status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
```

### 28.4 API Contract

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
GET    /api/v1/auth/me

GET    /api/v1/users?role=&department=&q=&page=&limit=&sort=
POST   /api/v1/users
GET    /api/v1/users/:id
PATCH  /api/v1/users/:id
DELETE /api/v1/users/:id
POST   /api/v1/users/:id/avatar
PATCH  /api/v1/users/me/password

GET    /api/v1/tasks?status=&priority=&assigneeId=&dueBefore=&q=&page=&limit=&sort=
POST   /api/v1/tasks
GET    /api/v1/tasks/:id
PATCH  /api/v1/tasks/:id
DELETE /api/v1/tasks/:id
PATCH  /api/v1/tasks/:id/status
POST   /api/v1/tasks/:id/comments
GET    /api/v1/tasks/:id/comments

GET    /api/v1/dashboard/stats
GET    /api/v1/dashboard/overdue
GET    /api/v1/reports/completion?from=&to=
GET    /api/v1/reports/workload

GET    /api/v1/notifications?unreadOnly=
PATCH  /api/v1/notifications/:id/read
PATCH  /api/v1/notifications/read-all
```

### 28.5 Day 1 Plan

| Time | Activity | Output |
|---|---|---|
| 0:00–0:45 | Write the requirements doc | `REQUIREMENTS.md` |
| 0:45–1:30 | Design the database schema | `schema.sql` + ER diagram |
| 1:30–2:15 | Write the API contract | `openapi.yaml` |
| 2:15–2:45 | Wireframes for the 6 key screens | Figma frames |
| 2:45–3:30 | Scaffold both apps | `client/` + `server/` |
| 3:30–4:30 | Build the schema + seed data | Running DB |
| 4:30–6:00 | Build the repositories + services for users and tasks | Working data layer |
| 6:00–7:00 | Smoke-test with curl/Postman | `SMOKE.md` with evidence |

### 28.6 Scaffolding Commands

```bash
mkdir ethiroli-task-manager && cd ethiroli-task-manager
npm init -y
npm i -D concurrently

# Server
mkdir server && cd server
npm init -y
npm i express cors helmet morgan cookie-parser dotenv mysql2 bcrypt jsonwebtoken zod express-rate-limit
npm i -D nodemon vitest supertest
mkdir -p src/{config,routes,controllers,services,repositories,middleware,validators,utils} db
cd ..

# Client
npm create vite@latest client -- --template react
cd client
npm i react-router-dom
npm i -D tailwindcss postcss autoprefixer @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest jsdom msw
npx tailwindcss init -p
cd ..
```

### 28.7 Repository Layer

```javascript
// server/src/repositories/user.repo.js
import { query } from "../config/db.js";

const PUBLIC_COLUMNS = `
  id, name, email, role, department, position, phone,
  avatar_url, is_active, created_at, updated_at
`;

export const userRepo = {
  async findAll({ role, department, q, page = 1, limit = 20, sort = "-created_at", includeInactive = false }) {
    const where = [];
    const params = {};

    if (!includeInactive) where.push("is_active = 1");
    if (role)       { where.push("role = :role");             params.role = role; }
    if (department) { where.push("department = :department"); params.department = department; }
    if (q) {
      where.push("(name LIKE :q OR email LIKE :q OR position LIKE :q)");
      params.q = `%${q}%`;
    }

    const allowed = ["created_at", "name", "email", "department"];
    const desc = sort.startsWith("-");
    const field = sort.replace(/^-/, "");
    const orderBy = `${allowed.includes(field) ? field : "created_at"} ${desc ? "DESC" : "ASC"}`;

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const offset = (page - 1) * limit;

    const rows = await query(
      `SELECT ${PUBLIC_COLUMNS} FROM users ${whereSql}
       ORDER BY ${orderBy} LIMIT :limit OFFSET :offset`,
      { ...params, limit, offset }
    );

    const [{ total }] = await query(
      `SELECT COUNT(*) AS total FROM users ${whereSql}`, params
    );

    return { rows, total };
  },

  async findById(id) {
    const rows = await query(
      `SELECT ${PUBLIC_COLUMNS} FROM users WHERE id = :id LIMIT 1`, { id }
    );
    return rows[0] ?? null;
  },

  async findByEmail(email, { withHash = false } = {}) {
    const cols = withHash ? "*, password_hash" : PUBLIC_COLUMNS;
    const rows = await query(
      `SELECT ${cols} FROM users WHERE email = :email LIMIT 1`, { email }
    );
    return rows[0] ?? null;
  },

  async create({ name, email, password_hash, role = "employee", department, position, phone }) {
    const result = await query(
      `INSERT INTO users (name, email, password_hash, role, department, position, phone)
       VALUES (:name, :email, :password_hash, :role, :department, :position, :phone)`,
      { name, email, password_hash, role, department, position, phone }
    );
    return this.findById(result.insertId);
  },

  async update(id, changes) {
    const allowed = ["name", "department", "position", "phone", "avatar_url", "is_active", "role"];
    const fields = Object.keys(changes).filter(k => allowed.includes(k));
    if (!fields.length) return this.findById(id);

    const setSql = fields.map(f => `${f} = :${f}`).join(", ");
    await query(`UPDATE users SET ${setSql} WHERE id = :id`, { ...changes, id });
    return this.findById(id);
  },

  async updatePassword(id, password_hash) {
    await query(`UPDATE users SET password_hash = :password_hash WHERE id = :id`, { id, password_hash });
  },

  async remove(id) {
    const result = await query(`UPDATE users SET is_active = 0 WHERE id = :id`, { id });
    return result.affectedRows > 0;
  },
};
```

```javascript
// server/src/repositories/task.repo.js
import { query } from "../config/db.js";

const SELECT_TASK = `
  SELECT
    t.id, t.title, t.description, t.status, t.priority,
    t.due_date, t.completed_at, t.estimated_hours, t.actual_hours,
    t.created_at, t.updated_at,
    t.assignee_id,
    a.name AS assignee_name, a.avatar_url AS assignee_avatar,
    t.created_by,
    c.name AS creator_name
  FROM tasks t
  JOIN users a ON a.id = t.assignee_id
  JOIN users c ON c.id = t.created_by
`;

export const taskRepo = {
  async findAll({ status, priority, assigneeId, dueBefore, q, page = 1, limit = 20, sort = "-created_at" }) {
    const where = [];
    const params = {};

    if (status)     { where.push("t.status = :status");           params.status = status; }
    if (priority)   { where.push("t.priority = :priority");       params.priority = priority; }
    if (assigneeId) { where.push("t.assignee_id = :assigneeId");  params.assigneeId = assigneeId; }
    if (dueBefore)  { where.push("t.due_date < :dueBefore");      params.dueBefore = dueBefore; }
    if (q) {
      where.push("(t.title LIKE :q OR t.description LIKE :q)");
      params.q = `%${q}%`;
    }

    const allowed = ["created_at", "due_date", "priority", "status", "title"];
    const desc = sort.startsWith("-");
    const field = sort.replace(/^-/, "");
    const orderBy = `${allowed.includes(field) ? "t." + field : "t.created_at"} ${desc ? "DESC" : "ASC"}`;

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const offset = (page - 1) * limit;

    const rows = await query(
      `${SELECT_TASK} ${whereSql} ORDER BY ${orderBy} LIMIT :limit OFFSET :offset`,
      { ...params, limit, offset }
    );

    const [{ total }] = await query(
      `SELECT COUNT(*) AS total FROM tasks t ${whereSql}`, params
    );

    return { rows, total };
  },

  async findById(id) {
    const rows = await query(`${SELECT_TASK} WHERE t.id = :id LIMIT 1`, { id });
    return rows[0] ?? null;
  },

  async create(data) {
    const result = await query(
      `INSERT INTO tasks
        (title, description, status, priority, assignee_id, created_by, due_date, estimated_hours)
       VALUES
        (:title, :description, :status, :priority, :assignee_id, :created_by, :due_date, :estimated_hours)`,
      data
    );
    return this.findById(result.insertId);
  },

  async update(id, changes) {
    const allowed = ["title", "description", "status", "priority", "assignee_id", "due_date", "estimated_hours", "actual_hours", "completed_at"];
    const fields = Object.keys(changes).filter(k => allowed.includes(k));
    if (!fields.length) return this.findById(id);

    const setSql = fields.map(f => `${f} = :${f}`).join(", ");
    await query(`UPDATE tasks SET ${setSql} WHERE id = :id`, { ...changes, id });
    return this.findById(id);
  },

  async remove(id) {
    const result = await query(`DELETE FROM tasks WHERE id = :id`, { id });
    return result.affectedRows > 0;
  },

  async stats() {
    const [row] = await query(`
      SELECT
        COUNT(*) AS total,
        SUM(status = 'todo')        AS todo,
        SUM(status = 'in_progress') AS in_progress,
        SUM(status = 'review')      AS review,
        SUM(status = 'done')        AS done,
        SUM(status = 'blocked')     AS blocked,
        SUM(due_date < NOW() AND status NOT IN ('done')) AS overdue,
        SUM(priority = 'urgent' AND status NOT IN ('done')) AS urgent_open
      FROM tasks
    `);
    return row;
  },
};
```

### 28.8 Day 1 Deliverables Checklist

- [ ] `REQUIREMENTS.md` — functional + non-functional requirements with priorities
- [ ] `schema.sql` — all tables, keys, constraints, indexes
- [ ] `seed.sql` — 10 users (2 admins, 2 managers, 6 employees), 40 tasks across all statuses, 30 comments, 20 notifications
- [ ] ER diagram image committed
- [ ] `openapi.yaml` — every endpoint documented, validates with 0 errors
- [ ] Wireframes for: Login, Dashboard, Employee List, Task Board, Task Detail, Profile
- [ ] `client/` and `server/` scaffolded and both run
- [ ] `npm run db:setup` creates and seeds the database
- [ ] `userRepo` and `taskRepo` implemented with parameterised queries
- [ ] `GET /api/v1/users` and `GET /api/v1/tasks` return paginated results
- [ ] `GET /api/v1/tasks?status=todo&priority=urgent` filters correctly
- [ ] `SMOKE.md` with curl output for 10 working endpoints
- [ ] Git repo with ≥ 8 conventional commits
- [ ] `EXPLAIN` output for the task list query showing index usage

---

### ❓ DAY 28 QUIZ — `D28-Q` (5 Questions)

| # | Question | Options | Answer |
|---|---|---|---|
| 1 | An API contract should be written | A) After coding B) Before coding C) Never D) Only for the frontend | **B** |
| 2 | Soft delete uses | A) `DELETE FROM` B) An `is_active` flag or `deleted_at` timestamp C) Dropping the table D) Archiving to CSV | **B** |
| 3 | A composite index on `(assignee_id, status)` speeds up | A) `WHERE status = ?` B) `WHERE assignee_id = ?` and `WHERE assignee_id = ? AND status = ?` C) Neither D) Only full scans | **B** |
| 4 | `LIMIT :limit OFFSET :offset` with named placeholders requires | A) String concatenation B) Passing `limit` and `offset` in the params object C) `mysql.escape` D) No params | **B** |
| 5 | Non-functional requirements cover | A) Features B) Performance, security, accessibility, and scale C) UI colours D) Team size | **B** |

---

# DAY 29 — Project Development Day 2

**Module:** `ETH-WEB-30-PROJ` | **Duration:** 7 h | **Lesson Code:** `PR-D29`

### Objective
Build the application layer: services, controllers, routes, and the complete frontend.

---

### 29.1 Day 2 Plan

| Time | Activity | Output |
|---|---|---|
| 0:00–0:30 | Standup: review Day 1, list blockers | Updated task board |
| 0:30–2:00 | Services + controllers for users and tasks | Working CRUD endpoints |
| 2:00–2:45 | Auth service, controller, middleware, routes | Login/register working |
| 2:45–3:30 | Dashboard stats + reports endpoints | `/dashboard/stats` returns data |
| 3:30–4:00 | Validate every endpoint with Postman | `SMOKE.md` updated |
| 4:00–5:30 | Frontend: auth flow + protected routing | Login → dashboard works |
| 5:30–6:30 | Frontend: employee list + task board with filters | Data flows end to end |
| 6:30–7:00 | Frontend: task detail + create/edit modal | Full CRUD in the UI |

---

### 29.2 Services

```javascript
// server/src/services/user.service.js
import bcrypt from "bcrypt";
import { userRepo } from "../repositories/user.repo.js";
import { ApiError } from "../utils/ApiError.js";

export const userService = {
  async list(query) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));

    const { rows, total } = await userRepo.findAll({ ...query, page, limit });
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      data: rows,
      meta: { page, limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
    };
  },

  async getById(id) {
    const user = await userRepo.findById(id);
    if (!user) throw ApiError.notFound("User not found");
    return user;
  },

  async create(payload) {
    if (await userRepo.findByEmail(payload.email)) {
      throw ApiError.conflict("A user with this email already exists");
    }
    const password_hash = await bcrypt.hash(payload.password, 12);
    return userRepo.create({ ...payload, password_hash });
  },

  async update(id, changes, requester) {
    const target = await this.getById(id);

    // Only admins can change roles or deactivate accounts
    if ((changes.role || changes.is_active !== undefined) && requester.role !== "admin") {
      throw ApiError.forbidden("Only admins can change roles or account status");
    }
    // Non-admins may only edit themselves
    if (requester.role !== "admin" && requester.sub !== String(id)) {
      throw ApiError.forbidden("You can only edit your own profile");
    }

    return userRepo.update(id, changes);
  },

  async remove(id, requester) {
    if (requester.sub === String(id)) {
      throw ApiError.badRequest("You cannot deactivate your own account");
    }
    const ok = await userRepo.remove(id);
    if (!ok) throw ApiError.notFound("User not found");
  },

  async changePassword(id, { currentPassword, newPassword }, requester) {
    if (requester.sub !== String(id) && requester.role !== "admin") {
      throw ApiError.forbidden("You can only change your own password");
    }

    const user = await userRepo.findByEmail((await this.getById(id)).email, { withHash: true });
    const ok = await bcrypt.compare(currentPassword, user.password_hash);
    if (!ok) throw ApiError.badRequest("Current password is incorrect");

    const password_hash = await bcrypt.hash(newPassword, 12);
    await userRepo.updatePassword(id, password_hash);
  },
};
```

```javascript
// server/src/services/task.service.js
import { taskRepo } from "../repositories/task.repo.js";
import { userRepo } from "../repositories/user.repo.js";
import { notificationService } from "./notification.service.js";
import { ApiError } from "../utils/ApiError.js";

const TRANSITIONS = {
  todo:        ["in_progress", "blocked"],
  in_progress: ["review", "blocked", "todo"],
  review:      ["done", "in_progress"],
  blocked:     ["todo", "in_progress"],
  done:        [],
};

export const taskService = {
  async list(query) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const { rows, total } = await taskRepo.findAll({ ...query, page, limit });
    const totalPages = Math.max(1, Math.ceil(total / limit));
    return {
      data: rows,
      meta: { page, limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
    };
  },

  async getById(id) {
    const task = await taskRepo.findById(id);
    if (!task) throw ApiError.notFound("Task not found");
    return task;
  },

  async create(payload, requester) {
    const assignee = await userRepo.findById(payload.assignee_id);
    if (!assignee) throw ApiError.badRequest("Assignee does not exist");
    if (!assignee.is_active) throw ApiError.badRequest("Cannot assign to an inactive user");

    if (payload.due_date && new Date(payload.due_date) < new Date()) {
      throw ApiError.badRequest("Due date cannot be in the past");
    }

    const task = await taskRepo.create({
      ...payload,
      status: payload.status ?? "todo",
      created_by: requester.sub,
    });

    await notificationService.notify(payload.assignee_id, {
      type: "task_assigned",
      title: "New task assigned",
      body: `You have been assigned "${task.title}"`,
      link: `/tasks/${task.id}`,
    });

    return task;
  },

  async update(id, changes, requester) {
    const task = await this.getById(id);

    if (changes.status && changes.status !== task.status) {
      const allowed = TRANSITIONS[task.status] ?? [];
      if (!allowed.includes(changes.status)) {
        throw ApiError.badRequest(
          `Cannot move a task from "${task.status}" to "${changes.status}"`
        );
      }
      if (changes.status === "done") changes.completed_at = new Date();
    }

    // Employees may only update their own tasks, and only status/hours
    if (requester.role === "employee") {
      if (String(task.assignee_id) !== requester.sub) {
        throw ApiError.forbidden("You can only update your own tasks");
      }
      const allowedFields = ["status", "actual_hours", "completed_at"];
      const disallowed = Object.keys(changes).filter(k => !allowedFields.includes(k));
      if (disallowed.length) {
        throw ApiError.forbidden(`Employees cannot change: ${disallowed.join(", ")}`);
      }
    }

    return taskRepo.update(id, changes);
  },

  async remove(id, requester) {
    if (!["admin", "manager"].includes(requester.role)) {
      throw ApiError.forbidden("Only admins and managers can delete tasks");
    }
    const ok = await taskRepo.remove(id);
    if (!ok) throw ApiError.notFound("Task not found");
  },

  async changeStatus(id, status, requester) {
    return this.update(id, { status }, requester);
  },
};
```

```javascript
// server/src/services/dashboard.service.js
import { taskRepo } from "../repositories/task.repo.js";
import { query } from "../config/db.js";

export const dashboardService = {
  async stats() {
    const taskStats = await taskRepo.stats();

    const [userStats] = await query(`
      SELECT
        COUNT(*) AS total_users,
        SUM(role = 'admin')    AS admins,
        SUM(role = 'manager')  AS managers,
        SUM(role = 'employee') AS employees,
        SUM(is_active = 1)     AS active_users
      FROM users
    `);

    const byPriority = await query(`
      SELECT priority, COUNT(*) AS count
      FROM tasks WHERE status NOT IN ('done')
      GROUP BY priority
    `);

    const byDepartment = await query(`
      SELECT u.department, COUNT(t.id) AS open_tasks
      FROM users u
      LEFT JOIN tasks t ON t.assignee_id = u.id AND t.status NOT IN ('done')
      WHERE u.department IS NOT NULL
      GROUP BY u.department
      ORDER BY open_tasks DESC
    `);

    return {
      tasks: taskStats,
      users: userStats,
      byPriority,
      byDepartment,
    };
  },

  async overdue(limit = 10) {
    return query(`
      SELECT t.id, t.title, t.priority, t.due_date,
             u.name AS assignee_name,
             DATEDIFF(NOW(), t.due_date) AS days_overdue
      FROM tasks t
      JOIN users u ON u.id = t.assignee_id
      WHERE t.due_date < NOW() AND t.status NOT IN ('done')
      ORDER BY t.due_date ASC
      LIMIT :limit
    `, { limit });
  },

  async completionReport({ from, to }) {
    return query(`
      SELECT
        u.id AS user_id, u.name,
        COUNT(t.id) AS total_tasks,
        SUM(t.status = 'done') AS completed,
        ROUND(100.0 * SUM(t.status = 'done') / NULLIF(COUNT(t.id), 0), 2) AS completion_rate,
        ROUND(AVG(t.actual_hours), 2) AS avg_actual_hours,
        ROUND(AVG(t.estimated_hours), 2) AS avg_estimated_hours
      FROM users u
      LEFT JOIN tasks t ON t.assignee_id = u.id
        AND (:from IS NULL OR t.created_at >= :from)
        AND (:to   IS NULL OR t.created_at <= :to)
      WHERE u.role = 'employee'
      GROUP BY u.id, u.name
      ORDER BY completion_rate DESC
    `, { from: from ?? null, to: to ?? null });
  },
};
```

### 29.3 Controllers & Routes

```javascript
// server/src/controllers/task.controller.js
import { taskService } from "../services/task.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const list   = asyncHandler(async (req, res) => res.json(await taskService.list(req.query)));
export const getOne = asyncHandler(async (req, res) => res.json({ data: await taskService.getById(req.params.id) }));

export const create = asyncHandler(async (req, res) => {
  const task = await taskService.create(req.body, req.user);
  res.status(201).location(`/api/v1/tasks/${task.id}`).json({ data: task });
});

export const update = asyncHandler(async (req, res) => {
  const task = await taskService.update(req.params.id, req.body, req.user);
  res.json({ data: task });
});

export const changeStatus = asyncHandler(async (req, res) => {
  const task = await taskService.changeStatus(req.params.id, req.body.status, req.user);
  res.json({ data: task });
});

export const remove = asyncHandler(async (req, res) => {
  await taskService.remove(req.params.id, req.user);
  res.status(204).send();
});
```

```javascript
// server/src/routes/task.routes.js
import { Router } from "express";
import * as c from "../controllers/task.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  createTaskSchema, updateTaskSchema, statusSchema, listTaskSchema,
} from "../validators/task.schema.js";

const router = Router();
router.use(authenticate);   // everything below requires a token

router
  .route("/")
  .get(validate(listTaskSchema), c.list)
  .post(authorize("admin", "manager"), validate(createTaskSchema), c.create);

router
  .route("/:id")
  .get(c.getOne)
  .patch(validate(updateTaskSchema), c.update)
  .delete(authorize("admin", "manager"), c.remove);

router.patch("/:id/status", validate(statusSchema), c.changeStatus);

export default router;
```

```javascript
// server/src/validators/task.schema.js
import { z } from "zod";

const STATUS = ["todo", "in_progress", "review", "done", "blocked"];
const PRIORITY = ["low", "medium", "high", "urgent"];

export const listTaskSchema = z.object({
  query: z.object({
    status: z.enum(STATUS).optional(),
    priority: z.enum(PRIORITY).optional(),
    assigneeId: z.coerce.number().int().positive().optional(),
    dueBefore: z.string().datetime().optional(),
    q: z.string().max(100).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    sort: z.string().regex(/^-?[a-z_]+$/).default("-created_at"),
  }),
});

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3, "Title must be at least 3 characters").max(150),
    description: z.string().max(5000).optional(),
    priority: z.enum(PRIORITY).default("medium"),
    assignee_id: z.coerce.number().int().positive(),
    due_date: z.string().datetime().optional(),
    estimated_hours: z.coerce.number().min(0).max(1000).optional(),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3).max(150).optional(),
    description: z.string().max(5000).optional(),
    priority: z.enum(PRIORITY).optional(),
    assignee_id: z.coerce.number().int().positive().optional(),
    due_date: z.string().datetime().optional(),
    estimated_hours: z.coerce.number().min(0).max(1000).optional(),
    actual_hours: z.coerce.number().min(0).max(1000).optional(),
    status: z.enum(STATUS).optional(),
  }).refine(o => Object.keys(o).length > 0, { message: "At least one field is required" }),
});

export const statusSchema = z.object({
  body: z.object({ status: z.enum(STATUS) }),
});
```

### 29.4 Frontend Structure

```
client/src/
├── app/
│   ├── App.jsx
│   ├── router.jsx
│   └── providers.jsx
├── components/
│   ├── ui/           Button, Input, Select, Modal, Badge, Card, Skeleton, EmptyState, ErrorState, Pagination, Tabs, Toast
│   └── layout/       AppLayout, Sidebar, Topbar, Breadcrumbs, ProtectedRoute
├── features/
│   ├── auth/         AuthContext, api, LoginPage, RegisterPage, ProfilePage
│   ├── users/        api, useUsers, UserList, UserCard, UserForm, UserDetail
│   ├── tasks/        api, useTasks, TaskBoard, TaskCard, TaskForm, TaskDetail, StatusSelect
│   ├── dashboard/    api, DashboardPage, StatCard, PriorityChart, OverdueList
│   └── notifications/NotificationBell, NotificationList, useNotifications
├── hooks/            useDebounce, useLocalStorage, useFetch, useForm, useMediaQuery, useToggle, useClickOutside
├── lib/              apiClient.js, format.js, validate.js, cn.js
├── styles/           index.css, tokens.css
└── main.jsx
```

### 29.5 Frontend — Task Board

```jsx
// features/tasks/useTasks.js
import { useReducer, useCallback, useEffect } from "react";
import { api } from "@/lib/apiClient";

const initialState = {
  items: [],
  meta: { page: 1, totalPages: 1, total: 0 },
  filters: { status: "", priority: "", assigneeId: "", q: "", page: 1, limit: 20, sort: "-created_at" },
  loading: true,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "LOADING":       return { ...state, loading: true, error: null };
    case "SUCCESS":       return { ...state, loading: false, items: action.payload.data, meta: action.payload.meta };
    case "ERROR":         return { ...state, loading: false, error: action.payload };
    case "SET_FILTERS":   return { ...state, filters: { ...state.filters, ...action.payload, page: action.payload.page ?? 1 } };
    case "OPTIMISTIC_ADD":return { ...state, items: [action.payload, ...state.items] };
    case "REPLACE":       return { ...state, items: state.items.map(i => i.id === action.payload.tempId ? action.payload.real : i) };
    case "ROLLBACK":      return { ...state, items: action.payload };
    case "PATCH_ITEM":    return { ...state, items: state.items.map(i => i.id === action.payload.id ? { ...i, ...action.payload.changes } : i) };
    case "REMOVE_ITEM":   return { ...state, items: state.items.filter(i => i.id !== action.payload) };
    default:              return state;
  }
}

export function useTasks() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const load = useCallback(async (signal) => {
    dispatch({ type: "LOADING" });
    try {
      const params = new URLSearchParams(
        Object.entries(state.filters).filter(([, v]) => v !== "" && v != null)
      ).toString();
      const res = await api.get(`/tasks?${params}`, { signal });
      dispatch({ type: "SUCCESS", payload: res });
    } catch (err) {
      if (err.name !== "AbortError") dispatch({ type: "ERROR", payload: err });
    }
  }, [state.filters]);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const setFilters = useCallback((patch) => dispatch({ type: "SET_FILTERS", payload: patch }), []);

  const create = useCallback(async (payload) => {
    const tempId = `temp-${crypto.randomUUID()}`;
    const optimistic = { ...payload, id: tempId, status: payload.status ?? "todo", created_at: new Date().toISOString() };
    dispatch({ type: "OPTIMISTIC_ADD", payload: optimistic });

    try {
      const res = await api.post("/tasks", payload);
      dispatch({ type: "REPLACE", payload: { tempId, real: res.data } });
      return res.data;
    } catch (err) {
      dispatch({ type: "ROLLBACK", payload: state.items });
      throw err;
    }
  }, [state.items]);

  const update = useCallback(async (id, changes) => {
    const snapshot = state.items;
    dispatch({ type: "PATCH_ITEM", payload: { id, changes } });
    try {
      const res = await api.patch(`/tasks/${id}`, changes);
      dispatch({ type: "PATCH_ITEM", payload: { id, changes: res.data } });
      return res.data;
    } catch (err) {
      dispatch({ type: "ROLLBACK", payload: snapshot });
      throw err;
    }
  }, [state.items]);

  const remove = useCallback(async (id) => {
    const snapshot = state.items;
    dispatch({ type: "REMOVE_ITEM", payload: id });
    try {
      await api.delete(`/tasks/${id}`);
    } catch (err) {
      dispatch({ type: "ROLLBACK", payload: snapshot });
      throw err;
    }
  }, [state.items]);

  return { ...state, setFilters, create, update, remove, refetch: () => load() };
}
```

```jsx
// features/tasks/TaskBoard.jsx
import { useTasks } from "./useTasks";
import { useToast } from "@/features/toast/ToastContext";
import TaskCard from "./TaskCard";
import TaskFilters from "./TaskFilters";
import TaskForm from "./TaskForm";
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

const COLUMNS = [
  { key: "todo",        label: "To Do" },
  { key: "in_progress", label: "In Progress" },
  { key: "review",      label: "Review" },
  { key: "done",        label: "Done" },
];

export default function TaskBoard() {
  const { items, loading, error, filters, setFilters, create, update, remove, refetch } = useTasks();
  const { push } = useToast();
  const [creating, setCreating] = useState(false);
  const [query, setQuery] = useState(filters.q ?? "");
  const debounced = useDebounce(query, 350);

  useEffect(() => { setFilters({ q: debounced }); }, [debounced, setFilters]);

  async function handleCreate(payload) {
    try {
      await create(payload);
      push("Task created", "success");
      setCreating(false);
    } catch (err) {
      push(err.message, "error");
    }
  }

  async function handleStatusChange(id, status) {
    try {
      await update(id, { status });
      push(`Moved to ${status.replace("_", " ")}`, "success");
    } catch (err) {
      push(err.message, "error");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this task?")) return;
    try {
      await remove(id);
      push("Task deleted", "success");
    } catch (err) {
      push(err.message, "error");
    }
  }

  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Button onClick={() => setCreating(true)}>New Task</Button>
      </header>

      <TaskFilters
        value={filters}
        query={query}
        onQueryChange={setQuery}
        onChange={setFilters}
        onReset={() => { setQuery(""); setFilters({ status: "", priority: "", assigneeId: "", q: "", page: 1 }); }}
      />

      {loading ? (
        <TaskBoardSkeleton columns={4} />
      ) : items.length === 0 ? (
        <EmptyState
          title={filters.q ? "No tasks match your search" : "No tasks yet"}
          description={filters.q ? "Try a different search term." : "Create your first task to get started."}
          action={filters.q
            ? { label: "Clear search", onClick: () => { setQuery(""); setFilters({ q: "" }); } }
            : { label: "New Task", onClick: () => setCreating(true) }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {COLUMNS.map(col => {
            const colTasks = items.filter(t => t.status === col.key);
            return (
              <section key={col.key} aria-labelledby={`col-${col.key}`} className="space-y-3">
                <h2 id={`col-${col.key}`} className="font-semibold flex items-center gap-2">
                  {col.label}
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                    {colTasks.length}
                  </span>
                </h2>
                {colTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                  />
                ))}
                {colTasks.length === 0 && (
                  <p className="text-sm text-gray-400 italic">Nothing here</p>
                )}
              </section>
            );
          })}
        </div>
      )}

      <Modal isOpen={creating} onClose={() => setCreating(false)} title="New Task">
        <TaskForm onSubmit={handleCreate} onCancel={() => setCreating(false)} />
      </Modal>
    </div>
  );
}
```

### 29.6 Day 2 Deliverables Checklist

**Backend**
- [ ] `userService`, `taskService`, `authService`, `notificationService`, `dashboardService` implemented
- [ ] All controllers wrapped in `asyncHandler`
- [ ] All routes registered under `/api/v1`
- [ ] Auth middleware protecting every non-public route
- [ ] Role-based authorization on all write endpoints
- [ ] Status-transition rules enforced in `taskService.update`
- [ ] Notification created on task assignment
- [ ] `/dashboard/stats` returns task + user aggregates
- [ ] `/reports/completion` returns per-employee completion rates
- [ ] Validation on every write route; 422 with field details
- [ ] Rate limiting on `/auth/*`
- [ ] All 25+ endpoints verified in Postman

**Frontend**
- [ ] `AuthContext` with login, register, logout, refresh-on-boot
- [ ] `apiClient` with 401 → refresh → replay
- [ ] `ProtectedRoute` with role support
- [ ] `AppLayout` with sidebar navigation, active states, and a mobile drawer
- [ ] Login + Register pages with `useForm` and inline validation
- [ ] Dashboard with stat cards, priority chart, overdue list
- [ ] Employee list with search, filters, pagination
- [ ] Employee create/edit modal
- [ ] Task board with 4 columns and status transitions
- [ ] Task create/edit modal
- [ ] Task detail with comments
- [ ] Profile page with avatar upload and password change
- [ ] Toast notifications on every mutation
- [ ] Skeletons, empty states, error states everywhere
- [ ] All filters reflected in the URL
- [ ] Dark mode toggle persisted

**Quality**
- [ ] No console errors or warnings
- [ ] ESLint: 0 errors
- [ ] Responsive at 320 / 768 / 1440 px
- [ ] Keyboard navigable throughout
- [ ] ≥ 15 conventional commits

---

### ❓ DAY 29 QUIZ — `D29-Q` (5 Questions)

| # | Question | Options | Answer |
|---|---|---|---|
| 1 | Status-transition rules belong in | A) The route B) The service layer C) The controller D) The repository | **B** |
| 2 | Authorization (who can do what) should be enforced | A) Client only B) Server only C) Both, but the server is authoritative D) Neither | **C** |
| 3 | Optimistic update rollback requires | A) No snapshot B) A snapshot of the previous state C) A full page reload D) A database transaction | **B** |
| 4 | A race condition in search is prevented by | A) `useMemo` B) `AbortController` or a request-id guard C) `setTimeout` D) More state | **B** |
| 5 | Refresh-on-boot restores the session using | A) localStorage access token B) The HttpOnly refresh cookie + `/auth/refresh` C) A query param D) Session storage | **B** |

---

# DAY 30 — Final Evaluation & Presentation

**Module:** `ETH-WEB-30-PROJ` | **Duration:** 7 h | **Lesson Code:** `PR-D30`

### Objective
Finalise the project, present it, and complete the evaluation.

---

### 30.1 Day 30 Plan

| Time | Activity | Output |
|---|---|---|
| 0:00–1:00 | Final polish + bug triage | Zero critical bugs |
| 1:00–2:00 | Documentation pass | Complete README + docs |
| 2:00–3:00 | Deploy to production | Live URL |
| 3:00–3:45 | Lighthouse + accessibility audit | Reports ≥ targets |
| 3:45–4:30 | Record a 5-minute demo video | Uploaded link |
| 4:30–5:30 | Prepare the presentation | 10-slide deck |
| 5:30–6:30 | Present to mentors + peers | Feedback captured |
| 6:30–7:00 | Self-assessment + certificate eligibility | `SELF_ASSESSMENT.md` |

---

### 30.2 Pre-Submission Checklist

**Functionality**
- [ ] Every feature in the requirements doc works end to end
- [ ] No critical or high-severity bugs remain
- [ ] All forms validate and show clear errors
- [ ] All destructive actions have confirmation
- [ ] Session handling works: login, refresh, logout, expiry

**Code quality**
- [ ] ESLint: 0 errors, 0 warnings
- [ ] Prettier formatted
- [ ] No `console.log` in production code
- [ ] No commented-out code blocks
- [ ] No unused files, imports, or dependencies
- [ ] No `any` types (if TypeScript)
- [ ] No hardcoded secrets or URLs

**Performance**
- [ ] Lighthouse Performance ≥ 90
- [ ] Initial JS bundle < 300 KB gzipped
- [ ] Images optimised (WebP, correct dimensions, lazy-loaded)
- [ ] Routes code-split
- [ ] Lists > 100 rows virtualised or paginated
- [ ] No N+1 API calls

**Accessibility**
- [ ] Lighthouse Accessibility ≥ 95
- [ ] axe DevTools: 0 critical violations
- [ ] Full keyboard navigation
- [ ] Visible focus everywhere
- [ ] Contrast ≥ 4.5:1 for body text
- [ ] All images have meaningful alt text
- [ ] All form fields have labels
- [ ] `aria-live` for dynamic content

**Security**
- [ ] All inputs validated server-side
- [ ] Parameterised SQL everywhere
- [ ] Passwords hashed with bcrypt cost ≥ 12
- [ ] No sensitive data in responses
- [ ] Stack traces hidden in production
- [ ] Rate limiting on auth endpoints
- [ ] CORS restricted to the client origin
- [ ] `npm audit`: no high or critical vulnerabilities

**Documentation**
- [ ] `README.md` — description, screenshots, setup, env vars, scripts, architecture, tech decisions
- [ ] `ARCHITECTURE.md` — layers, data flow, directory structure
- [ ] `API.md` or `openapi.yaml`
- [ ] `DATABASE.md` — schema, ER diagram, indexes
- [ ] `TESTING.md` — strategy, commands, coverage
- [ ] `DEPLOYMENT.md` — how to deploy
- [ ] `.env.example` for client and server
- [ ] Inline JSDoc on non-obvious functions

**Testing**
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Component tests passing
- [ ] Coverage ≥ 70% on business logic
- [ ] E2E smoke tests passing
- [ ] CI green

**Git**
- [ ] ≥ 25 conventional commits
- [ ] Feature branches merged via PRs
- [ ] No secrets in history
- [ ] Meaningful commit messages
- [ ] `.gitignore` correct
- [ ] `main` branch builds and runs

**Deployment**
- [ ] Live frontend URL works
- [ ] Live API URL works
- [ ] Database provisioned and migrated
- [ ] Environment variables set in the host
- [ ] HTTPS enabled
- [ ] Health check endpoint responding
- [ ] README links to the live demo

---

### 30.3 Deployment

**Option A — Vercel (frontend) + Render (API) + PlanetScale/Railway (MySQL)**

```bash
# Frontend → Vercel
cd client
npm i -g vercel
vercel --prod
# Set VITE_API_URL=https://your-api.onrender.com/api/v1

# API → Render
# Connect the GitHub repo, set:
#   Build command: npm install
#   Start command: npm start
#   Env vars: DB_*, JWT_SECRET, JWT_REFRESH_SECRET, CLIENT_URL, NODE_ENV=production
```

**Option B — Single server**

Build the client and serve it from Express:

```bash
cd client && npm run build
cd ../server && NODE_ENV=production npm start
# Express serves client/dist as static files with an SPA fallback
```

**Production environment checklist**

```bash
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-app.vercel.app
DB_HOST=...
DB_USER=...
DB_PASSWORD=...
DB_NAME=...
JWT_SECRET=<64-char random>
JWT_REFRESH_SECRET=<64-char random>
```

```bash
# Generate a strong secret
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

**Database migration**

```bash
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < server/db/schema.sql
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < server/db/seed.sql
```

---

### 30.4 Presentation Deck (10 slides)

| # | Slide | Content |
|---|---|---|
| 1 | **Title** | Project name, your name, track, date |
| 2 | **Problem** | The problem you set out to solve and for whom |
| 3 | **Solution** | One-sentence description + a hero screenshot |
| 4 | **Demo** | Live walkthrough of the 3 most important flows |
| 5 | **Architecture** | Diagram: client → API → database, with the tech at each layer |
| 6 | **Database** | ER diagram, key design decisions, indexing |
| 7 | **Challenges** | 2–3 real problems and how you solved them |
| 8 | **Testing & Quality** | Coverage numbers, Lighthouse scores, accessibility results |
| 9 | **What I Learned** | 3 concrete technical skills + 1 non-technical insight |
| 10 | **Next Steps** | What you'd build with 2 more weeks |

**Presentation rules**
- 5 minutes + 3 minutes Q&A
- Live demo, with a recorded backup in case the network fails
- No reading from slides
- Show the code for one interesting function
- End with the live URL and the GitHub link

---

### 30.5 Demo Script

```
0:00  Open the live app on a phone-sized viewport to prove responsiveness
0:20  Register a new account
0:40  Land on the dashboard → point out the stats, the chart, the overdue list
1:00  Navigate to Employees → search → filter by department → paginate
1:30  Create an employee → show inline validation by submitting an invalid email
2:00  Navigate to Tasks → show the 4-column board
2:20  Create a task with a due date and an assignee → show the success toast
2:50  Show the notification bell updating
3:10  Drag a task from To Do → In Progress → Done
3:40  Show the completed_at timestamp updating
4:00  Delete a task → confirmation → undo toast
4:20  Switch to a dark theme
4:30  Log out → log back in as an employee → show restricted UI
5:00  Show the GitHub repo, the passing CI, and the coverage report
```

**Have ready**
- A seeded account for each role
- A pre-recorded video in case the live demo fails
- The API docs open in another tab
- The React DevTools Profiler result

---

### 30.6 Evaluation Rubric (100)

| Criterion | Weight | What's assessed |
|---|---|---|
| **Functionality** | 25 | All required features work end to end; no critical bugs |
| **Code quality** | 15 | Architecture, naming, structure, DRY, readability, consistency |
| **Frontend quality** | 12 | UI polish, responsiveness, loading/empty/error states, UX |
| **Backend quality** | 12 | Layering, validation, error handling, security, query efficiency |
| **Database design** | 8 | Normalisation, keys, constraints, indexing, query correctness |
| **Testing** | 10 | Coverage, test quality, edge cases, CI integration |
| **Accessibility** | 8 | Keyboard, screen reader, contrast, ARIA, focus management |
| **Documentation** | 5 | README, architecture, API, database, deployment docs |
| **Presentation** | 5 | Clarity, demo quality, ability to answer questions |

**Grade bands**

| Score | Grade | Outcome |
|---|---|---|
| 90–100 | A+ | Outstanding — recommend for advanced tracks |
| 80–89 | A | Excellent — job-ready |
| 70–79 | B | Good — certificate issued |
| 60–69 | C | Satisfactory — targeted feedback, resubmit one component |
| < 60 | F | Not yet — repeat with mentor support |

**Certification gate**
- Project score ≥ 70
- All practical tasks submitted
- Attendance ≥ 75%
- Final quiz ≥ 70%

---

### 30.7 Self-Assessment Template

```markdown
# Self-Assessment — [Your Name]

## 1. What I built
[2–3 sentences describing the project and its purpose]

## 2. Features completed
| Feature | Status | Notes |
|---|---|---|
| Authentication | ✅ | JWT + refresh cookie |
| Employee CRUD | ✅ | With search, filter, pagination |
| Task board | ✅ | 4 columns, status transitions |
| Dashboard stats | ✅ | 6 stat cards + chart |
| Notifications | ✅ | In-app, unread badge |
| Audit log | ⚠️ | Partially — no UI yet |

## 3. Technical skills I gained
| Skill | Before | After | Evidence |
|---|---|---|---|
| React hooks | 1/5 | 4/5 | Built the whole app with hooks |
| SQL joins | 2/5 | 4/5 | Wrote 25 analytical queries |
| Testing | 1/5 | 3/5 | 60 tests, 74% coverage |
| Accessibility | 1/5 | 3/5 | Lighthouse a11y 97 |

## 4. Hardest problem I solved
[Describe the problem, your investigation, and the fix]

## 5. What I would do differently
[Honest reflection — at least 3 points]

## 6. What I want to learn next
[3 specific topics]

## 7. Self-rating
| Area | Rating |
|---|---|
| Functionality | 4/5 |
| Code quality | 4/5 |
| Testing | 3/5 |
| Documentation | 4/5 |
| Presentation | 3/5 |
```

---

### 30.8 Mentor Feedback Form

```markdown
# Mentor Evaluation — [Intern Name]

## Technical
| Criterion | 1–5 | Comments |
|---|---|---|
| Requirements understanding | | |
| Frontend implementation | | |
| Backend implementation | | |
| Database design | | |
| Testing rigour | | |
| Debugging ability | | |
| Code readability | | |
| Accessibility awareness | | |

## Professional
| Criterion | 1–5 | Comments |
|---|---|---|
| Communication | | |
| Time management | | |
| Response to feedback | | |
| Problem ownership | | |
| Collaboration | | |
| Documentation habits | | |

## Strengths
- 
- 
- 

## Areas to improve
- 
- 
- 

## Recommendation
[ ] Strongly recommend for advanced track
[ ] Recommend
[ ] Recommend with mentorship
[ ] Needs more practice

## Suggested next steps
1. 
2. 
3. 
```

---

### 30.9 30-Day Program Summary

| Week | Days | Focus | Key Deliverable |
|---|---|---|---|
| 1 | 1–7 | SDLC, HTML5, CSS3, Responsive, Git | Responsive website on GitHub |
| 2 | 8–14 | JavaScript core → advanced | Interactive JS app |
| 3 | 15–21 | UI/UX, React.js | React SPA with routing + state |
| 4 | 22–30 | APIs, Backend, Integration, Project | Deployed full-stack project |

**Total content delivered**

| Artifact | Count |
|---|---|
| Lessons | 30 |
| Day quizzes | 30 (150 questions) |
| Day tasks | 30 |
| Practicals | 5 (from `PROG-FUND`) |
| Assignments | 3 |
| Capstone project | 1 |
| Final evaluation | 1 |

**Skills acquired**

```
Frontend      HTML5 • CSS3 • Tailwind • JavaScript (ES6+) • React • React Router • Context • Vite
Backend       Node.js • Express • REST API • JWT • bcrypt • zod • MySQL
Tooling       Git • GitHub • Postman • Figma • VS Code • Vitest • Testing Library
Practices     Responsive design • Accessibility • Testing • Debugging • Code review • Deployment
Soft skills   Requirements analysis • Documentation • Presentation • Time management
```

**What's next**

| If you scored | Recommended next step |
|---|---|
| 90+ | Enrol in `ETH-AIFS-60` — Advanced Full Stack + AI |
| 80–89 | Enrol in `ETH-FS-45` — Full Stack Development |
| 70–79 | Repeat 30-day with a focus on testing and architecture |
| < 70 | Revisit Days 8–14 (JavaScript) and Days 16–21 (React), then retry |

---

### ❓ DAY 30 QUIZ — `D30-Q` (5 Questions)

| # | Question | Options | Answer |
|---|---|---|---|
| 1 | Lighthouse Accessibility target | A) 70 B) 80 C) 95 D) 100 | **C** |
| 2 | A destructive action should always have | A) No confirmation B) Confirmation + undo where possible C) A toast only D) A spinner | **B** |
| 3 | The certification gate requires a project score of at least | A) 50 B) 60 C) 70 D) 90 | **C** |
| 4 | The server is the authoritative source for | A) Styling B) Authorization decisions C) Font choices D) Animations | **B** |
| 5 | A good commit history uses | A) "update", "fix", "wip" B) Conventional commits with scope C) Random messages D) No messages | **B** |

---

# 📋 PROGRAM COMPLETE — QUICK REFERENCE

## Commands

```bash
# Client
npm create vite@latest client -- --template react
cd client && npm install && npm run dev
npm run build && npm run preview
npm run lint
npm test

# Server
npm init -y
npm i express cors helmet morgan cookie-parser dotenv mysql2 bcrypt jsonwebtoken zod express-rate-limit
npm i -D nodemon vitest supertest
npm run dev
npm run db:setup

# Both
npm run dev          # concurrently
```

## Key Files Reference

| File | Purpose |
|---|---|
| `vite.config.js` | Vite config + dev proxy + test config |
| `tailwind.config.js` | Tailwind theme extensions |
| `.env.local` / `.env` | Local secrets (gitignored) |
| `.env.example` | Committed template |
| `src/lib/apiClient.js` | Central fetch wrapper with auth + refresh |
| `src/hooks/` | All custom hooks |
| `server/src/app.js` | Express app, middleware, routes |
| `server/src/server.js` | HTTP server + graceful shutdown |
| `server/src/config/db.js` | MySQL pool + `query()` helper |
| `server/src/middleware/errorHandler.js` | Central error envelope |
| `db/schema.sql` | Full database schema |
| `db/seed.sql` | Development seed data |

## URL Cheat Sheet

| Service | Dev URL |
|---|---|
| Client | http://localhost:5173 |
| API | http://localhost:5000/api/v1 |
| Health | http://localhost:5000/health |
| MySQL | localhost:3306 |
| phpMyAdmin (optional) | http://localhost:8080 |

---

**End of `ETH-WEB-30` — Web Development Foundation Internship — Complete 30-Day Content Pack.**

Say the word and I'll produce the equivalent full detail pack for the **45-Day** (`ETH-FS-45`) or **60-Day** (`ETH-AIFS-60`) program.