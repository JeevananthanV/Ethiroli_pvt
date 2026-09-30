import json, os

day_topics = {
    1: ("HTML5 Basics", "Introduction to HTML5 semantic elements, document structure, and basic tags"),
    2: ("HTML5 Advanced", "Forms, media elements, canvas, and accessibility features"),
    3: ("CSS3 Basics", "CSS selectors, box model, typography, and color schemes"),
    4: ("CSS3 Responsive Design", "Flexbox, CSS Grid, media queries, and responsive units"),
    5: ("CSS3 Advanced", "CSS animations, transitions, custom properties, and preprocessors"),
    6: ("UI/UX Design Systems", "Design tokens, component libraries, design patterns, and user research"),
    7: ("UI/UX Figma & Prototyping", "Figma design tools, prototyping workflows, design handoff, and collaboration"),
    8: ("Git & GitHub Advanced", "Branching strategies, merge conflicts, collaborative workflows, and Git commands"),
    9: ("Git CI/CD Basics", "CI/CD pipelines, GitHub Actions, automated testing, and deployment workflows"),
    10: ("JavaScript Fundamentals", "Variables, data types, operators, functions, and basic control flow"),
    11: ("JavaScript Objects & Arrays", "Object manipulation, array methods, iteration, and functional programming basics"),
    12: ("JavaScript Closures & Scope", "Lexical scope, closures, hoisting, and execution context"),
    13: ("JavaScript Async Programming", "Promises, async/await, fetch API, and error handling"),
    14: ("JavaScript Patterns", "Design patterns, error handling, modules, and advanced JavaScript techniques"),
    15: ("React Introduction", "JSX syntax, functional components, props, and React ecosystem"),
    16: ("React Components", "Component composition, state management, event handling, and conditional rendering"),
    17: ("React Hooks Core", "useState, useEffect, useRef, and component lifecycle management"),
    18: ("React Hooks Advanced", "useContext, useReducer, custom hooks, and state management patterns"),
    19: ("React Router", "Client-side routing, navigation, route guards, and dynamic routing"),
    20: ("React Advanced Patterns", "Context API, performance optimization, and advanced component patterns"),
    21: ("React API Integration", "Fetch API, Axios, GraphQL integration, and data fetching patterns"),
    22: ("React Project Build", "Building a complete single-page application with React"),
    23: ("Node.js Fundamentals", "Modules, npm, events, streams, and Node.js runtime"),
    24: ("Express.js Basics", "Routing, middleware, error handling, and HTTP methods"),
    25: ("Express.js Advanced", "Advanced middleware, security practices, and request handling"),
    26: ("REST API Design", "RESTful design principles, API documentation, and testing strategies"),
    27: ("MySQL Basics", "Database tables, SQL queries, relationships, and data types"),
    28: ("MySQL Advanced", "Joins, subqueries, query optimization, and indexing"),
    29: ("SQL Advanced Concepts", "Views, triggers, stored procedures, and advanced SQL techniques"),
    30: ("Database Relationships", "One-to-one, one-to-many, many-to-many relationships and normalization"),
    31: ("Authentication", "JWT tokens, OAuth flows, session management, and security best practices"),
    32: ("Authorization", "RBAC, middleware permissions, role-based access control"),
    33: ("RBAC Advanced", "Fine-grained access control, multi-tenant architecture, and permission systems"),
    34: ("MongoDB NoSQL", "NoSQL concepts, document structure, MongoDB queries, and aggregation"),
    35: ("API Integration", "Third-party APIs, webhooks, API design patterns, and integration testing"),
    36: ("Advanced React Patterns", "Custom hooks, render props, higher-order components, and advanced patterns"),
    37: ("State Management", "Redux Toolkit, Zustand, global state management, and data flow"),
    38: ("Performance Optimization", "Lazy loading, memoization, code splitting, and bundle optimization"),
    39: ("Security Best Practices", "XSS prevention, CSRF protection, CORS configuration, and Helmet"),
    40: ("Testing Strategies", "Jest unit testing, React Testing Library, and end-to-end testing"),
    41: ("Debugging Techniques", "DevTools usage, performance profiling, error tracking, and debugging workflows"),
    42: ("Code Review & Quality", "Code review patterns, best practices, linting, and code quality"),
    43: ("AI for Developers", "What is AI, machine learning vs deep learning, AI ecosystem, and tools overview"),
    44: ("Prompt Engineering", "Prompt engineering techniques, frameworks, and best practices for AI tools"),
    45: ("AI Code Generation", "GitHub Copilot, Cursor, v0, and AI-assisted code generation workflows"),
    46: ("AI Debugging", "AI-assisted debugging, bug identification, and automated code analysis"),
    47: ("AI Testing & Documentation", "AI test generation, documentation automation, and AI-powered quality assurance"),
    48: ("AI-Assisted Development", "End-to-end AI workflow: requirements to deployment using AI tools"),
    49: ("Third-Party APIs", "Stripe, Twilio, SendGrid integration and API consumption patterns"),
    50: ("Communication APIs", "Email, SMS, WhatsApp integration, templates, and delivery tracking"),
    51: ("Payment Integration", "Stripe integration, checkout flows, payment processing, and security"),
    52: ("Deployment & Docker", "Docker containers, CI/CD pipelines, cloud deployment, and infrastructure"),
    53: ("Production Monitoring", "Logging, alerting, analytics, and production monitoring strategies"),
    54: ("Capstone Requirements", "Project planning, architecture design, technology stack selection"),
    55: ("Capstone Backend", "Database schema design, backend models, API endpoint development"),
    56: ("Capstone Frontend", "Frontend components, page design, state management, and UI implementation"),
    57: ("Capstone Integration", "API integration, authentication, deployment preparation"),
    58: ("Capstone Testing", "Testing strategies, staging environment, production deployment"),
    59: ("Technical Assessment", "Coding assessment, system design, code review, and technical evaluation"),
    60: ("Final Presentation", "Final demo, evaluation, certificate ceremony, and career guidance")
}

def generate_questions(day_num, topic):
    questions = []
    for i in range(1, 11):
        q = f"Question {i} about {topic} for Day {day_num}"
        options = [f"Option A for Q{i}", f"Option B for Q{i}", f"Option C for Q{i}", f"Option D for Q{i}"]
        questions.append({"q": q, "type": "MCQ", "options": options, "answer": (i * 7 + 3) % 4})
    return questions

def generate_markdown(day_num, topic, content):
    return f"# {topic} - Day {day_num}\n\n## Overview\n{content}\n\n## Learning Objectives\n- Understand core concepts of {topic}\n- Apply practical implementation techniques\n- Build real-world examples\n\n## Detailed Content\nKey concepts covered in {topic} with hands-on examples.\n\n## Practice Exercises\nExercises to reinforce learning."

def generate_ai_markdown(day_num, topic, content):
    ai_tools = ["ChatGPT", "Gemini", "Cursor", "Copilot", "Claude"]
    tool = ai_tools[(day_num - 43) % len(ai_tools)]
    return f"# {topic} - Day {day_num}\n\n## AI Integration Focus\nThis day emphasizes practical AI tool usage with {tool}.\n\n## Overview\n{content}\n\n## AI Practical Tasks\n### Task 1: AI-Assisted Development\nUse {tool} to generate code snippets, debug existing code, and refactor solutions.\n\n### Task 2: Prompt Engineering Exercise\nCraft effective prompts for code generation related to {topic}.\n\n### Task 3: AI Workflow Implementation\nFollow the AI workflow: requirements analysis, schema design, API development, UI implementation, backend logic, testing, and documentation.\n\n## AI Tools Usage Guidelines\n- Use {tool} for code suggestions and reviews\n- Validate AI-generated code manually\n- Understand AI limitations and biases\n- Maintain code quality standards."

def generate_task(day_num, topic):
    return {"title": f"Day {day_num}: {topic} - Practical Task", "description": f"Complete the practical implementation for {topic}. Apply the concepts learned in today session to build a working solution.", "requirements": [f"Implement core {topic} functionality", f"Write clean, well-documented code", f"Include error handling and edge cases", f"Test the implementation thoroughly", f"Document the solution with comments"]}

def generate_assignment(day_num, topic):
    return {"title": f"Day {day_num}: {topic} - Assignment", "description": f"Build a comprehensive project demonstrating mastery of {topic}. This assignment should showcase your understanding and ability to apply concepts in a real-world scenario.", "requirements": ["Complete project setup with proper configuration", f"Implement all required features for {topic}", "Include unit tests for critical functionality", "Write comprehensive documentation", "Deploy or demonstrate the working solution"], "submission_type": ["github"]}

def is_ai_day(d): return 43 <= d <= 48

courses = []
for day_num in range(1, 61):
    topic, content = day_topics[day_num]
    if is_ai_day(day_num):
        md = generate_ai_markdown(day_num, topic, content)
    else:
        md = generate_markdown(day_num, topic, content)
    
    work_log = ["What did you learn today?", "What did you implement?", "What problem did you face?", "How did you solve it?", "Hours Worked?"]
    
    day_entry = {
        "title": f"Day {day_num} - {topic}",
        "content": content,
        "video_url": None,
        "lesson_order": day_num,
        "blocks": [
            {"block_type": "MARKDOWN", "block_order": 1, "content_payload": {"body": md}, "is_interactive": False},
            {"block_type": "QUIZ", "block_order": 2, "content_payload": {"title": f"Day {day_num} Quiz - {topic}", "questions": generate_questions(day_num, topic), "pass_mark": 70}, "is_interactive": True},
            {"block_type": "TASK", "block_order": 3, "content_payload": generate_task(day_num, topic), "is_interactive": True},
            {"block_type": "ASSIGNMENT", "block_order": 4, "content_payload": generate_assignment(day_num, topic), "is_interactive": True},
            {"block_type": "WORK_LOG", "block_order": 5, "content_payload": {"questions": work_log}, "is_interactive": True}
        ]
    }
    courses.append(day_entry)

output = {"courses": courses}
os.makedirs(r"J:\eithiroli\ethiroli_react\data\courses", exist_ok=True)
with open(r"J:\eithiroli\ethiroli_react\data\courses\eth-aifs-60.json", "w") as f:
    json.dump(output, f, indent=2)
print(f"Generated {len(courses)} days of course content")

