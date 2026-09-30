import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

function writeFile(relPath, content) {
  const fullPath = path.join(ROOT, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
  console.log('Created: ' + relPath);
}

function writeJSON(relPath, data) {
  writeFile(relPath, JSON.stringify(data, null, 2));
}

function ensureDir(relPath) {
  fs.mkdirSync(path.join(ROOT, relPath), { recursive: true });
}

// ==========================================
// 1. CREATE DIRECTORIES
// ==========================================
const moduleCodes = [
  'PROG-FUND','WEB-HTML','WEB-CSS','JS-CORE','DEV-GIT','DESIGN-UIUX',
  'FE-REACT','FE-TS','FE-NEXT','BE-NODE','BE-EXPRESS','BE-REST',
  'DB-MYSQL','DB-MONGO','SEC-AUTH','FS-INTEGRATION','API-PAYMENT',
  'API-COMM','AUTO-N8N','AI-DEV','AI-GENAPP','PY-CORE','DATA-ANALYTICS',
  'ML-CORE','ML-DL','QA-TEST','DEVOPS-CORE','CLOUD-AWS','SEC-WEB',
  'ARCH-SYSTEM','DSA-CORE','MOBILE-RN','SEO-TECH'
];

ensureDir('data/modules');
for (const code of moduleCodes) ensureDir('data/modules/' + code);
ensureDir('data/programs');
ensureDir('backend/src/models/technology');
ensureDir('backend/src/controllers/technology');
ensureDir('backend/src/routes/technology');
ensureDir('backend/src/migrations');
ensureDir('backend/migrations');

// ==========================================
// 2. MASTER MODULE REGISTRY
// ==========================================
const moduleDescriptions = {
  'PROG-FUND': 'Foundational programming concepts using JavaScript and Python, covering variables, control structures, data structures, and problem-solving techniques essential for beginners entering software development.',
  'WEB-HTML': 'Comprehensive HTML5 development covering document structure, semantic elements, forms, multimedia, accessibility, and SEO best practices to build modern, accessible web pages.',
  'WEB-CSS': 'CSS3 and responsive design fundamentals including selectors, box model, Flexbox, Grid, animations, media queries, and Tailwind CSS for building visually appealing, mobile-ready layouts.',
  'JS-CORE': 'Core JavaScript programming covering ES6+, DOM manipulation, events, async/await, fetch API, modules, and modern development practices for dynamic web applications.',
  'DEV-GIT': 'Version control with Git and GitHub including repository management, branching, merging, conflict resolution, pull requests, and collaborative development workflows.',
  'DESIGN-UIUX': 'User experience and user interface design principles using Figma, covering user research, wireframing, prototyping, usability testing, and developer handoff.',
  'FE-REACT': 'React.js development with Vite, covering components, state management, hooks, routing, API integration, Redux Toolkit, React Query, and performance optimization.',
  'FE-TS': 'TypeScript programming covering type annotations, interfaces, generics, classes, and integration with React for type-safe frontend development.',
  'FE-NEXT': 'Next.js development with App Router, Server/Client Components, API routes, authentication, SEO, image optimization, and production deployment strategies.',
  'BE-NODE': 'Node.js backend development covering runtime architecture, modules, file system, HTTP server, async programming, REST APIs, error handling, and security best practices.',
  'BE-EXPRESS': 'Express.js framework for building production-ready REST APIs with middleware, routing, validation, error handling, authentication, and API documentation.',
  'BE-REST': 'REST API architecture and best practices covering HTTP methods, status codes, CRUD operations, pagination, filtering, versioning, and API documentation with Swagger.',
  'DB-MYSQL': 'MySQL database management covering tables, relationships, joins, subqueries, indexing, transactions, stored procedures, and query optimization with MySQL Workbench.',
  'DB-MONGO': 'MongoDB NoSQL database covering collections, documents, CRUD operations, aggregation, indexing, schema design, and Mongoose ODM with MongoDB Atlas.',
  'SEC-AUTH': 'Authentication and authorization covering password hashing, JWT, sessions, cookies, role-based access control, OAuth, and security best practices.',
  'FS-INTEGRATION': 'Full-stack integration of React frontend with Node.js/Express backend, covering authentication, CRUD operations, forms, validation, file uploads, and database integration.',
  'API-PAYMENT': 'Payment gateway integration covering order creation, verification, webhooks, refunds, receipts, transaction records, and payment security with Razorpay and Stripe.',
  'API-COMM': 'Email, SMS, and WhatsApp automation covering transactional emails, OTP delivery, notifications, templates, webhooks, and delivery tracking with Twilio and Meta APIs.',
  'AUTO-N8N': 'Business automation with n8n covering workflow design, nodes, triggers, webhooks, HTTP requests, expressions, database workflows, and AI automation.',
  'AI-DEV': 'AI fundamentals for developers covering generative AI, LLMs, prompt engineering, AI-assisted coding, debugging, documentation, and AI API integration with major platforms.',
  'AI-GENAPP': 'Generative AI application development covering LLM APIs, embeddings, vector databases, RAG, AI agents, chatbots, and document processing with LangChain/LangGraph.',
  'PY-CORE': 'Python programming covering syntax, data types, control structures, functions, data structures, OOP, exception handling, file handling, modules, and API development.',
  'DATA-ANALYTICS': 'Data analytics fundamentals covering data cleaning, transformation, statistics, EDA, visualization, KPIs, dashboards, and storytelling with Pandas and Power BI.',
  'ML-CORE': 'Machine learning fundamentals covering supervised/unsupervised learning, regression, classification, clustering, feature engineering, evaluation, and hyperparameter tuning with Scikit-learn.',
  'ML-DL': 'Deep learning covering neural networks, CNN, RNN, LSTM, transfer learning, model training, and evaluation with TensorFlow, Keras, and PyTorch.',
  'QA-TEST': 'Software testing fundamentals covering test cases, bug reporting, functional/regression/integration testing, API testing, and automation with Postman, Jest, and Cypress.',
  'DEVOPS-CORE': 'DevOps practices covering Linux, Git, CI/CD pipelines, Docker, containers, Docker Compose, Nginx, deployment, monitoring, and logging.',
  'CLOUD-AWS': 'Cloud computing with AWS covering EC2, S3, IAM, RDS, VPC, security, DNS, deployment, monitoring, and backup strategies.',
  'SEC-WEB': 'Web cybersecurity covering OWASP Top 10, SQL injection prevention, XSS/CSRF mitigation, authentication security, API security, and secure coding practices.',
  'ARCH-SYSTEM': 'System design covering requirements analysis, architecture patterns, scalability, availability, load balancing, caching, databases, Redis, queues, microservices, and API gateways.',
  'DSA-CORE': 'Data structures and algorithms covering arrays, strings, linked lists, stacks, queues, trees, graphs, dynamic programming, and problem-solving with JavaScript, Python, and Java.',
  'MOBILE-RN': 'React Native mobile development covering components, navigation, state management, API integration, authentication, camera, location, testing, and production deployment with Expo.',
  'SEO-TECH': 'Technical SEO covering keyword research, on-page optimization, structured data, sitemaps, robots.txt, canonical URLs, Core Web Vitals, page speed, and analytics with Google tools.'
};

