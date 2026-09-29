import 'dotenv/config';
import crypto from 'crypto';
import pool from '../src/config/database.js';
import User from '../src/models/User.js';

async function seedLMS() {
  console.log('╔══════════════════════════════════════════════════════════════════╗');
  console.log('║       Seeding Full LMS Curricula, Assessments & Batches          ║');
  console.log('║                  For 10 Seeded Student Profiles                  ║');
  console.log('╚══════════════════════════════════════════════════════════════════╝\n');

  try {
    // 1. Fetch tutor
    const [tutors] = await pool.execute("SELECT id FROM users WHERE role = 'TUTOR' LIMIT 1");
    const tutorId = tutors[0]?.id;
    if (!tutorId) throw new Error('No tutor found in database');
    console.log(`👨‍🏫 Tutor identified: ${tutorId}`);

    // 2. Fetch the 10 students
    const [students] = await pool.execute(
      "SELECT id, email, full_name FROM users WHERE role = 'STUDENT' ORDER BY created_at DESC LIMIT 10"
    );
    const formattedStudents = students.map(s => User.format(s));
    console.log(`👨‍🎓 Found ${formattedStudents.length} students to configure.`);

    // 3. Resolve Courses
    const [courses] = await pool.execute(
      "SELECT id, code, name FROM courses WHERE code IN ('FULLSTACK-101', 'PYTHON-101', 'CLOUD-101', 'TEST-101')"
    );
    const courseMap = {};
    for (const c of courses) {
      courseMap[c.code] = c;
    }
    console.log(`📚 Target courses mapped: ${Object.keys(courseMap).join(', ')}`);

    // =========================================================================
    // STEP A: SEED MODULES, LESSONS & LESSON BLOCKS
    // =========================================================================
    console.log('\n--- Step A: Seeding Course Modules, Lessons & Interactive Blocks ---');

    const CURRICULA = {
      'FULLSTACK-101': [
        {
          title: 'Module 1: Modern Frontend Architecture & React 19',
          description: 'Deep dive into concurrent React, hooks lifecycle, state management, and modern component boundaries.',
          duration_minutes: 180,
          lessons: [
            {
              title: '1.1 Component Tree & Pure Functional Rendering',
              content: `# Component Tree & Functional Rendering\n\nReact components must behave as pure functions with respect to their props. In this module, we explore how React's virtual DOM reconciliation and fiber reconciler process component updates without causing cascading reflows.\n\n### Key Concepts:\n- Unidirectional data flow\n- Props immutability\n- Reconciliation & Keys optimization`,
              video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              blocks: [
                {
                  type: 'VIDEO',
                  payload: { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', duration: '14:20', resolution: '1080p' }
                },
                {
                  type: 'MARKDOWN',
                  payload: { markdown: '### Architectural Takeaway\nNever mutate state objects directly. Always produce a fresh state reference to trigger deterministic re-renders.' }
                },
                {
                  type: 'CODE_PLAYGROUND',
                  is_interactive: true,
                  payload: {
                    language: 'javascript',
                    initial_code: 'function Counter() {\n  const [count, setCount] = React.useState(0);\n  return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>;\n}'
                  }
                }
              ]
            },
            {
              title: '1.2 Advanced Hooks: useCallback, useMemo & Custom Hooks',
              content: `# Advanced State & Memoization\n\nOptimizing render performance requires strategic caching of expensive calculations and referential integrity of callback functions across renders.\n\n### Best Practices:\n- Benchmark before memoizing\n- Extract domain state logic into custom hooks\n- Handle teardown effects cleanly with useEffect return handlers`,
              video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
              blocks: [
                {
                  type: 'VIDEO',
                  payload: { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', duration: '18:45', resolution: '1080p' }
                },
                {
                  type: 'MARKDOWN',
                  payload: { markdown: 'Custom hooks abstract complex asynchronous workflows (e.g., polling, web sockets, debouncing) while keeping components purely presentational.' }
                }
              ]
            }
          ]
        },
        {
          title: 'Module 2: Backend REST Services & Relational MySQL Architecture',
          description: 'Production Express.js design patterns, SQL connection pooling, parameterized queries, and transactions.',
          duration_minutes: 240,
          lessons: [
            {
              title: '2.1 Express Middleware & Defensive API Routing',
              content: `# Express Middleware Architecture\n\nMiddlewares compose request processing pipelines for authentication, validation, rate limiting, and centralized error logging.\n\n### Pipeline Stages:\n1. Body parsing & CORS\n2. JWT Authentication & RBAC\n3. Input validation via Zod / Joi\n4. Business controller handler\n5. Global error responder`,
              video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
              blocks: [
                {
                  type: 'VIDEO',
                  payload: { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', duration: '22:10', resolution: '1080p' }
                },
                {
                  type: 'CODE_PLAYGROUND',
                  is_interactive: true,
                  payload: {
                    language: 'javascript',
                    initial_code: 'export const requireAuth = (req, res, next) => {\n  const token = req.headers.authorization?.split(" ")[1];\n  if (!token) return res.status(401).json({ error: "Unauthorized" });\n  next();\n};'
                  }
                }
              ]
            },
            {
              title: '2.2 MySQL Relational Modeling & ACID Transactions',
              content: `# Relational Modeling & ACID Transactions\n\nDesign foreign keys with appropriate cascade policies and wrap multi-step financial or enrollment workflows inside atomic database transactions.\n\n### Transaction Template:\n\`\`\`sql\nSTART TRANSACTION;\nINSERT INTO enrollments ...;\nUPDATE courses SET active_students = active_students + 1 ...;\nCOMMIT;\n\`\`\``,
              video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
              blocks: [
                {
                  type: 'VIDEO',
                  payload: { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', duration: '25:30', resolution: '1080p' }
                }
              ]
            }
          ]
        }
      ],
      'PYTHON-101': [
        {
          title: 'Module 1: Idiomatic Python & Object-Oriented Principles',
          description: 'Harness the full power of Python 3.12: list comprehensions, generator expressions, decorators, and dunder methods.',
          duration_minutes: 190,
          lessons: [
            {
              title: '1.1 Generators, Iterators & Memory Optimization',
              content: `# Generators and Memory Optimization\n\nGenerators yield values lazily on demand using the \`yield\` keyword, keeping the memory footprint at O(1) even when processing gigabyte-scale datasets.\n\n\`\`\`python\ndef stream_records(filename):\n    with open(filename, 'r') as f:\n        for line in f:\n            yield parse_line(line)\n\`\`\``,
              video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
              blocks: [
                {
                  type: 'VIDEO',
                  payload: { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', duration: '16:15', resolution: '1080p' }
                }
              ]
            },
            {
              title: '1.2 Advanced OOP & Context Managers',
              content: `# Python Context Managers & Resource Safety\n\nUse \`__enter__\` and \`__exit__\` dunder methods or \`@contextmanager\` decorator to guarantee deterministic acquisition and release of locks, sockets, and DB connections.`,
              video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
              blocks: [
                {
                  type: 'VIDEO',
                  payload: { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4', duration: '19:40', resolution: '1080p' }
                }
              ]
            }
          ]
        },
        {
          title: 'Module 2: Algorithmic Thinking & Graph Data Structures',
          description: 'Tree traversals, heaps, balanced search trees, and dynamic programming applications.',
          duration_minutes: 220,
          lessons: [
            {
              title: '2.1 Tree & Graph Traversals (BFS vs DFS)',
              content: `# Tree & Graph Traversals\n\nUnderstand recursion call stacks in Depth First Search (DFS) versus queue-driven level order exploration in Breadth First Search (BFS).\n\n- BFS: Shortest path in unweighted graphs\n- DFS: Topological sorting & cycle detection`,
              video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
              blocks: [
                {
                  type: 'VIDEO',
                  payload: { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', duration: '24:00', resolution: '1080p' }
                }
              ]
            }
          ]
        }
      ],
      'CLOUD-101': [
        {
          title: 'Module 1: Containerization & Cloud Native Architecture',
          description: 'Master Docker container lifecycle, multi-stage compilation builds, network namespaces, and volume persistence.',
          duration_minutes: 170,
          lessons: [
            {
              title: '1.1 Docker Multi-Stage Builds & Image Security',
              content: `# Docker Multi-Stage Builds\n\nReduce attack surface and Docker image size by separating build tools from minimal production runtime scratch images.\n\n\`\`\`dockerfile\nFROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM node:20-alpine AS runner\nWORKDIR /app\nCOPY --from=builder /app/dist ./dist\nCMD ["node", "dist/index.js"]\n\`\`\``,
              video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
              blocks: [
                {
                  type: 'VIDEO',
                  payload: { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', duration: '20:10', resolution: '1080p' }
                }
              ]
            },
            {
              title: '1.2 Multi-Tier Orchestration with Docker Compose',
              content: `# Local Multi-Tier Topology\n\nDeclare network bridges, environment variables, healthchecks, and dependency startup ordering (\`depends_on\`) across Frontend, API, and DB services.`,
              video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
              blocks: [
                {
                  type: 'VIDEO',
                  payload: { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4', duration: '18:50', resolution: '1080p' }
                }
              ]
            }
          ]
        },
        {
          title: 'Module 2: Kubernetes Orchestration & Continuous Delivery',
          description: 'Deploy resilient microservices with Pods, Deployments, ClusterIP Services, and automated CI/CD.',
          duration_minutes: 210,
          lessons: [
            {
              title: '2.1 Kubernetes Deployments & Self-Healing Pods',
              content: `# Kubernetes Workload Controllers\n\nKubernetes reconciliation controllers continuously match current cluster state to declared desired state, auto-restarting crashed containers and facilitating zero-downtime rolling updates.`,
              video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
              blocks: [
                {
                  type: 'VIDEO',
                  payload: { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', duration: '26:15', resolution: '1080p' }
                }
              ]
            }
          ]
        }
      ],
      'TEST-101': [
        {
          title: 'Module 1: Test Pyramid & Automated Unit Testing',
          description: 'Construct solid test suites with Jest, Vitest, mocking strategies, and edge case coverage analysis.',
          duration_minutes: 150,
          lessons: [
            {
              title: '1.1 The Testing Pyramid & Deterministic Assertions',
              content: `# The Testing Pyramid\n\nBalance your test portfolio with 70% Unit tests, 20% Integration tests, and 10% End-to-End tests to achieve rapid feedback cycles without fragile test maintenance.\n\n### Core Rules:\n1. Fast execution (< 50ms per unit test)\n2. Isolated test fixtures\n3. Deterministic without network flakiness`,
              video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
              blocks: [
                {
                  type: 'VIDEO',
                  payload: { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4', duration: '17:30', resolution: '1080p' }
                }
              ]
            },
            {
              title: '1.2 Mocking, Spies & Stubs in Modern JavaScript',
              content: `# Test Doubles\n\nLearn when to employ Stubs (canned answers), Spies (recording interactions), and Mocks (pre-programmed expectations) to test side-effecting code.`,
              video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
              blocks: [
                {
                  type: 'VIDEO',
                  payload: { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4', duration: '21:00', resolution: '1080p' }
                }
              ]
            }
          ]
        },
        {
          title: 'Module 2: API Contract & End-to-End Verification',
          description: 'Integration test suites using Supertest and browser automation with Playwright.',
          duration_minutes: 190,
          lessons: [
            {
              title: '2.1 End-to-End Testing with Playwright',
              content: `# Playwright Browser Automation\n\nAutomate multi-browser user journeys with auto-waiting selectors, network interception, and visual screenshot regression comparisons.`,
              video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              blocks: [
                {
                  type: 'VIDEO',
                  payload: { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', duration: '23:45', resolution: '1080p' }
                }
              ]
            }
          ]
        }
      ]
    };

    const courseLessonsMap = {};

    for (const [courseCode, modulesList] of Object.entries(CURRICULA)) {
      const course = courseMap[courseCode];
      if (!course) continue;
      courseLessonsMap[course.id] = [];

      for (let mIdx = 0; mIdx < modulesList.length; mIdx++) {
        const modData = modulesList[mIdx];
        const moduleId = crypto.randomUUID();

        // Check if module title already exists for course
        const [existingMod] = await pool.execute(
          'SELECT id FROM modules WHERE course_id = ? AND title = ?',
          [course.id, modData.title]
        );

        let activeModId;
        if (existingMod.length > 0) {
          activeModId = existingMod[0].id;
        } else {
          await pool.execute(
            `INSERT INTO modules (id, course_id, title, description, duration_minutes, module_order)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [moduleId, course.id, modData.title, modData.description, modData.duration_minutes, mIdx + 1]
          );
          activeModId = moduleId;
        }

        // Insert Lessons
        for (let lIdx = 0; lIdx < modData.lessons.length; lIdx++) {
          const lData = modData.lessons[lIdx];
          const lessonId = crypto.randomUUID();

          const [existingLsn] = await pool.execute(
            'SELECT id FROM lessons WHERE module_id = ? AND title = ?',
            [activeModId, lData.title]
          );

          let activeLsnId;
          if (existingLsn.length > 0) {
            activeLsnId = existingLsn[0].id;
          } else {
            await pool.execute(
              `INSERT INTO lessons (id, module_id, title, content, video_url, lesson_order)
               VALUES (?, ?, ?, ?, ?, ?)`,
              [lessonId, activeModId, lData.title, lData.content, lData.video_url, lIdx + 1]
            );
            activeLsnId = lessonId;

            // Insert lesson blocks
            if (Array.isArray(lData.blocks)) {
              for (let bIdx = 0; bIdx < lData.blocks.length; bIdx++) {
                const b = lData.blocks[bIdx];
                await pool.execute(
                  `INSERT INTO lesson_blocks (id, lesson_id, block_type, block_order, content_payload, is_interactive)
                   VALUES (?, ?, ?, ?, ?, ?)`,
                  [crypto.randomUUID(), activeLsnId, b.type, bIdx + 1, JSON.stringify(b.payload), b.is_interactive ? 1 : 0]
                );
              }
            }
          }

          courseLessonsMap[course.id].push(activeLsnId);
        }
      }
      console.log(` ✅ Populated ${modulesList.length} modules for [${courseCode}]`);
    }

    // =========================================================================
    // STEP B: SEED LESSON PROGRESS FOR EACH STUDENT
    // =========================================================================
    console.log('\n--- Step B: Seeding Granular Lesson Progress Records ---');
    for (const student of formattedStudents) {
      const [enrollments] = await pool.execute(
        'SELECT id, course_id, progress_percentage FROM enrollments WHERE student_id = ?',
        [student.id]
      );

      for (const enr of enrollments) {
        const lessons = courseLessonsMap[enr.course_id] || [];
        if (lessons.length === 0) continue;

        const progressPct = parseFloat(enr.progress_percentage || 0);
        const completedCount = Math.round((progressPct / 100) * lessons.length);

        for (let i = 0; i < lessons.length; i++) {
          const lsnId = lessons[i];
          const isCompleted = i < completedCount;
          const status = isCompleted ? 'COMPLETED' : i === completedCount ? 'IN_PROGRESS' : 'NOT_STARTED';
          const completedAt = isCompleted ? new Date(Date.now() - (lessons.length - i) * 86400000) : null;
          const secondsWatched = isCompleted ? 900 : i === completedCount ? 450 : 0;

          await pool.execute(
            `INSERT INTO lesson_progress (id, enrollment_id, student_id, lesson_id, status, seconds_watched, is_completed, completed_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE status = VALUES(status), seconds_watched = VALUES(seconds_watched), is_completed = VALUES(is_completed), completed_at = VALUES(completed_at)`,
            [crypto.randomUUID(), enr.id, student.id, lsnId, status, secondsWatched, isCompleted ? 1 : 0, completedAt]
          );
        }
      }
    }
    console.log(` ✅ Synchronized lesson completions across all 10 students.`);

    // =========================================================================
    // STEP C: SEED ACADEMIC BATCHES & ENROLL STUDENTS
    // =========================================================================
    console.log('\n--- Step C: Seeding Academic Batches & Cohort Memberships ---');

    const BATCHES = [
      {
        courseCode: 'FULLSTACK-101',
        code: 'BATCH-2026-FSD-01',
        name: '2026 Full Stack Web Engineering Cohort Alpha',
        start_date: '2026-08-01',
        end_date: '2026-11-30'
      },
      {
        courseCode: 'PYTHON-101',
        code: 'BATCH-2026-PY-02',
        name: '2026 Python & Advanced Data Structures Elite',
        start_date: '2026-08-15',
        end_date: '2026-11-15'
      },
      {
        courseCode: 'CLOUD-101',
        code: 'BATCH-2026-CLD-03',
        name: '2026 Cloud DevOps & SRE Immersion Cohort',
        start_date: '2026-09-01',
        end_date: '2026-12-01'
      },
      {
        courseCode: 'TEST-101',
        code: 'BATCH-2026-QA-04',
        name: '2026 Software Quality Engineering & QA Mastery',
        start_date: '2026-07-15',
        end_date: '2026-10-30'
      }
    ];

    const batchIdMap = {};

    for (const b of BATCHES) {
      const course = courseMap[b.courseCode];
      if (!course) continue;

      const [existingBatch] = await pool.execute(
        'SELECT id FROM batches WHERE batch_code = ?',
        [b.code]
      );

      let bId;
      if (existingBatch.length > 0) {
        bId = existingBatch[0].id;
      } else {
        bId = crypto.randomUUID();
        await pool.execute(
          `INSERT INTO batches (id, course_id, tutor_id, batch_code, name, start_date, end_date, max_capacity, is_active)
           VALUES (?, ?, ?, ?, ?, ?, ?, 35, 1)`,
          [bId, course.id, tutorId, b.code, b.name, b.start_date, b.end_date]
        );
      }
      batchIdMap[course.id] = bId;
      console.log(` ✅ Batch active: [${b.code}] ${b.name}`);
    }

    // Assign students into their corresponding cohorts
    for (const student of formattedStudents) {
      const [enrollments] = await pool.execute(
        'SELECT course_id FROM enrollments WHERE student_id = ?',
        [student.id]
      );
      for (const enr of enrollments) {
        const batchId = batchIdMap[enr.course_id];
        if (batchId) {
          await pool.execute(
            `INSERT IGNORE INTO batch_students (id, batch_id, student_id)
             VALUES (?, ?, ?)`,
            [crypto.randomUUID(), batchId, student.id]
          );
        }
      }
    }
    console.log(' ✅ Enrolled students into course academic cohorts.');

    // =========================================================================
    // STEP D: SEED QUESTION BANK & PUBLISHED QUIZZES
    // =========================================================================
    console.log('\n--- Step D: Seeding Question Bank & Interactive Quizzes ---');

    const QUIZ_DEFINITIONS = [
      {
        courseCode: 'FULLSTACK-101',
        title: 'Full Stack Architecture & React Lifecycle Assessment',
        description: 'Comprehensive evaluation covering React reconciliation, custom hooks, and Express middleware ordering.',
        time_limit: 15,
        passing_score: 70,
        questions: [
          {
            topic: 'React Hooks',
            text: 'Which hook should be used to memoize an expensive computation between re-renders?',
            options: [
              { text: 'useMemo', is_correct: true },
              { text: 'useCallback', is_correct: false },
              { text: 'useRef', is_correct: false },
              { text: 'useEffect', is_correct: false }
            ],
            explanation: 'useMemo caches the result of a calculation between renders unless dependencies change.'
          },
          {
            topic: 'State Management',
            text: 'Why should React state never be mutated directly?',
            options: [
              { text: 'Direct mutations do not trigger a re-render because shallow equality check returns true', is_correct: true },
              { text: 'JavaScript throws a strict mode TypeError', is_correct: false },
              { text: 'It creates an infinite loop in the reconciler', is_correct: false },
              { text: 'React automatically deletes mutated properties', is_correct: false }
            ],
            explanation: 'React compares previous and next state by reference (Object.is). Direct mutations keep the same reference.'
          },
          {
            topic: 'Express Middleware',
            text: 'In Express, what argument must be called to pass execution to the next middleware in line?',
            options: [
              { text: 'next()', is_correct: true },
              { text: 'res.continue()', is_correct: false },
              { text: 'nextMiddleware()', is_correct: false },
              { text: 'return true', is_correct: false }
            ],
            explanation: 'Invoking next() moves request processing to the next registered middleware in the pipeline.'
          }
        ]
      },
      {
        courseCode: 'PYTHON-101',
        title: 'Python Idioms & Data Structure Complexity Assessment',
        description: 'Testing proficiency with generators, list comprehensions, BST traversals, and big-O efficiency.',
        time_limit: 15,
        passing_score: 70,
        questions: [
          {
            topic: 'Python Generators',
            text: 'What keyword transforms a regular Python function into a generator function?',
            options: [
              { text: 'yield', is_correct: true },
              { text: 'generate', is_correct: false },
              { text: 'return lazy', is_correct: false },
              { text: 'async produce', is_correct: false }
            ],
            explanation: 'The yield statement pauses execution and emits a value, resuming on the next invocation of next().'
          },
          {
            topic: 'Complexity Analysis',
            text: 'What is the average time complexity for searching an item in a Python dictionary (hash table)?',
            options: [
              { text: 'O(1)', is_correct: true },
              { text: 'O(log n)', is_correct: false },
              { text: 'O(n)', is_correct: false },
              { text: 'O(n log n)', is_correct: false }
            ],
            explanation: 'Python dict lookups use an optimized hash table offering amortized O(1) time complexity.'
          }
        ]
      },
      {
        courseCode: 'CLOUD-101',
        title: 'Cloud DevOps & Containerization Mastery Quiz',
        description: 'Assessing Docker layer caching, multi-stage builds, network topologies, and Kubernetes controllers.',
        time_limit: 15,
        passing_score: 70,
        questions: [
          {
            topic: 'Docker Optimization',
            text: 'What is the primary benefit of multi-stage Docker builds?',
            options: [
              { text: 'Significantly reduced final image size by discarding build tools and intermediate artifacts', is_correct: true },
              { text: 'Enables containers to run with rootless access automatically', is_correct: false },
              { text: 'Accelerates container network throughput', is_correct: false },
              { text: 'Eliminates the need for docker-compose files', is_correct: false }
            ],
            explanation: 'Multi-stage builds leave compiler SDKs and build caches behind, resulting in lean production images.'
          },
          {
            topic: 'Kubernetes Architecture',
            text: 'Which Kubernetes controller is responsible for maintaining a declared set of identical Pod replicas?',
            options: [
              { text: 'ReplicaSet (or Deployment)', is_correct: true },
              { text: 'Kubelet', is_correct: false },
              { text: 'ConfigMap', is_correct: false },
              { text: 'Ingress Controller', is_correct: false }
            ],
            explanation: 'Deployments manage ReplicaSets, which ensure the exact specified number of Pod replicas remain active.'
          }
        ]
      },
      {
        courseCode: 'TEST-101',
        title: 'Software Quality & Testing Fundamentals Quiz',
        description: 'Verification of Unit test boundaries, assertion semantics, mocking patterns, and E2E automation.',
        time_limit: 15,
        passing_score: 70,
        questions: [
          {
            topic: 'Testing Methodology',
            text: 'According to the standard Test Pyramid, which layer should represent the largest volume of tests?',
            options: [
              { text: 'Unit Tests', is_correct: true },
              { text: 'End-to-End Tests', is_correct: false },
              { text: 'Manual Acceptance Tests', is_correct: false },
              { text: 'Performance Stress Tests', is_correct: false }
            ],
            explanation: 'Unit tests are fast, deterministic, and cost-effective, forming the broad base of the test pyramid.'
          },
          {
            topic: 'Mocks and Stubs',
            text: 'In automated testing, what is the key difference between a Mock and a Stub?',
            options: [
              { text: 'Stubs provide pre-programmed canned data, while Mocks also verify behavioral expectations and call counts', is_correct: true },
              { text: 'Mocks cannot return values', is_correct: false },
              { text: 'Stubs only work in TypeScript', is_correct: false },
              { text: 'There is no difference; they are exact synonyms', is_correct: false }
            ],
            explanation: 'Mocks record and verify function interactions and assertions, while stubs merely supply canned responses.'
          }
        ]
      }
    ];

    const quizMap = {};

    for (const qDef of QUIZ_DEFINITIONS) {
      const course = courseMap[qDef.courseCode];
      if (!course) continue;

      const [existingQ] = await pool.execute(
        'SELECT id FROM quizzes WHERE course_id = ? AND title = ?',
        [course.id, qDef.title]
      );

      let quizId;
      if (existingQ.length > 0) {
        quizId = existingQ[0].id;
        await pool.execute(
          'UPDATE quizzes SET is_published = 1, time_limit_minutes = ?, passing_score = ? WHERE id = ?',
          [qDef.time_limit, qDef.passing_score, quizId]
        );
      } else {
        quizId = crypto.randomUUID();
        await pool.execute(
          `INSERT INTO quizzes (id, course_id, title, description, time_limit_minutes, passing_score, is_published)
           VALUES (?, ?, ?, ?, ?, ?, 1)`,
          [quizId, course.id, qDef.title, qDef.description, qDef.time_limit, qDef.passing_score]
        );
      }
      quizMap[qDef.courseCode] = quizId;

      // Seed Questions & Options
      for (let i = 0; i < qDef.questions.length; i++) {
        const qData = qDef.questions[i];
        const [existingQItem] = await pool.execute(
          'SELECT id FROM question_bank WHERE question_text = ?',
          [qData.text]
        );

        let qItemId;
        if (existingQItem.length > 0) {
          qItemId = existingQItem[0].id;
        } else {
          qItemId = crypto.randomUUID();
          await pool.execute(
            `INSERT INTO question_bank (id, course_id, topic, difficulty, question_type, question_text, explanation, is_active, created_by)
             VALUES (?, ?, ?, 'MEDIUM', 'MCQ', ?, ?, 1, ?)`,
            [qItemId, course.id, qData.topic, qData.text, qData.explanation, tutorId]
          );

          // Add Options
          for (let optIdx = 0; optIdx < qData.options.length; optIdx++) {
            const opt = qData.options[optIdx];
            await pool.execute(
              `INSERT INTO question_options (id, question_id, option_text, is_correct, display_order)
               VALUES (?, ?, ?, ?, ?)`,
              [crypto.randomUUID(), qItemId, opt.text, opt.is_correct ? 1 : 0, optIdx + 1]
            );
          }
        }

        // Link to Quiz
        await pool.execute(
          `INSERT INTO quiz_questions (id, quiz_id, question_id, points, question_order)
           VALUES (?, ?, ?, 5, ?)
           ON DUPLICATE KEY UPDATE question_order = VALUES(question_order)`,
          [crypto.randomUUID(), quizId, qItemId, i + 1]
        );
      }

      console.log(` ✅ Published Quiz: [${qDef.courseCode}] ${qDef.title}`);
    }

    // Seed sample quiz attempts for top students
    const topStudents = [
      { email: 'rahul.venkat@ethiroli.edu', courseCode: 'TEST-101', score: 100 },
      { email: 'sneha.sundaram@ethiroli.edu', courseCode: 'TEST-101', score: 95 },
      { email: 'priya.ramanathan@ethiroli.edu', courseCode: 'TEST-101', score: 90 },
      { email: 'karthik.subramanian@ethiroli.edu', courseCode: 'PYTHON-101', score: 85 }
    ];

    for (const item of topStudents) {
      const student = formattedStudents.find(s => s.email === item.email);
      const quizId = quizMap[item.courseCode];
      if (student && quizId) {
        await pool.execute(
          `INSERT INTO quiz_attempts (id, quiz_id, student_id, score, total_questions, time_taken_seconds, answers, submitted_at)
           VALUES (?, ?, ?, ?, 2, 420, ?, NOW())`,
          [crypto.randomUUID(), quizId, student.id, item.score, JSON.stringify({ q1: 'opt_1', q2: 'opt_2' })]
        );
      }
    }
    console.log(' ✅ Seeded quiz submissions for advanced learners.');

    // =========================================================================
    // STEP E: SEED ASSIGNMENTS & GRADED SUBMISSIONS
    // =========================================================================
    console.log('\n--- Step E: Seeding Course Assignments & Submissions ---');

    const ASSIGNMENT_DATA = [
      {
        courseCode: 'FULLSTACK-101',
        title: 'Assignment 1: Secure JWT Authentication Service & RBAC Middleware',
        description: 'Implement token issuance, secure HttpOnly cookie persistence, silent refresh rotation, and role hierarchy authorization.',
        due_days_ahead: 7,
        max_score: 100
      },
      {
        courseCode: 'FULLSTACK-101',
        title: 'Assignment 2: Full-Stack Real-Time Kanban Board with WebSockets',
        description: 'Build collaborative task board with drag-and-drop column states and live board sync via Socket.IO.',
        due_days_ahead: 18,
        max_score: 100
      },
      {
        courseCode: 'PYTHON-101',
        title: 'Assignment 1: Self-Balancing AVL Search Tree with Benchmarks',
        description: 'Construct complete AVL Tree class with left-right rotations, in-order generators, and complexity benchmarks.',
        due_days_ahead: 5,
        max_score: 100
      },
      {
        courseCode: 'PYTHON-101',
        title: 'Assignment 2: Concurrent Web Crawler & Data Cleansing Pipeline',
        description: 'Build an asynchronous crawler using asyncio and aiohttp with rate limiting, error retry backoff, and CSV export.',
        due_days_ahead: 15,
        max_score: 100
      },
      {
        courseCode: 'CLOUD-101',
        title: 'Assignment 1: Multi-Container Microservices Topology with Docker Compose',
        description: 'Containerize React client, Express API, and MySQL service with private networking and healthcheck dependencies.',
        due_days_ahead: 6,
        max_score: 100
      },
      {
        courseCode: 'TEST-101',
        title: 'Assignment 1: Comprehensive Unit & Mock Suite for REST Endpoints',
        description: 'Write complete unit tests with Jest & Supertest asserting 90%+ code coverage for auth and course controllers.',
        due_days_ahead: 4,
        max_score: 100
      },
      {
        courseCode: 'TEST-101',
        title: 'Assignment 2: Automated End-to-End Regression Suite with Playwright',
        description: 'Implement visual regression and critical path user journey tests with headless browser automation.',
        due_days_ahead: 12,
        max_score: 100
      }
    ];

    const assignmentMap = {};

    for (const aData of ASSIGNMENT_DATA) {
      const course = courseMap[aData.courseCode];
      if (!course) continue;

      const [existingA] = await pool.execute(
        'SELECT id FROM assignments WHERE course_id = ? AND title = ?',
        [course.id, aData.title]
      );

      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + aData.due_days_ahead);

      let aId;
      if (existingA.length > 0) {
        aId = existingA[0].id;
        await pool.execute(
          'UPDATE assignments SET due_date = ?, max_score = ? WHERE id = ?',
          [dueDate, aData.max_score, aId]
        );
      } else {
        aId = crypto.randomUUID();
        await pool.execute(
          `INSERT INTO assignments (id, course_id, title, description, due_date, max_score)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [aId, course.id, aData.title, aData.description, dueDate, aData.max_score]
        );
      }

      if (!assignmentMap[aData.courseCode]) assignmentMap[aData.courseCode] = [];
      assignmentMap[aData.courseCode].push(aId);
      console.log(` ✅ Assignment registered: [${aData.courseCode}] ${aData.title}`);
    }

    // Seed graded submissions for students
    const submissionsToCreate = [
      {
        studentEmail: 'rahul.venkat@ethiroli.edu',
        courseCode: 'TEST-101',
        assignIdx: 0,
        grade: 98,
        feedback: 'Flawless test doubles and 96% branch coverage. Excellent boundary condition analysis.',
        text_content: 'Attached git repository: https://github.com/ethiroli-students/rahul-jest-suite'
      },
      {
        studentEmail: 'sneha.sundaram@ethiroli.edu',
        courseCode: 'TEST-101',
        assignIdx: 0,
        grade: 94,
        feedback: 'Very thorough testing suite. Good separation of unit vs integration tests.',
        text_content: 'Attached test report and github PR link with automated CI workflow.'
      },
      {
        studentEmail: 'priya.ramanathan@ethiroli.edu',
        courseCode: 'TEST-101',
        assignIdx: 0,
        grade: 92,
        feedback: 'Clean mocks and assertion structure. Well documented setup guide.',
        text_content: 'Repository link: https://github.com/ethiroli-students/priya-test-suite'
      },
      {
        studentEmail: 'vignesh.balaji@ethiroli.edu',
        courseCode: 'CLOUD-101',
        assignIdx: 0,
        grade: null, // Pending grading
        feedback: null,
        text_content: 'Docker compose file and architecture diagram uploaded for tutor review.'
      }
    ];

    for (const sub of submissionsToCreate) {
      const student = formattedStudents.find(s => s.email === sub.studentEmail);
      const aList = assignmentMap[sub.courseCode];
      if (student && aList && aList[sub.assignIdx]) {
        const aId = aList[sub.assignIdx];
        await pool.execute(
          `INSERT INTO assignment_submissions (id, assignment_id, student_id, file_url, text_content, grade, feedback, submitted_at, graded_at, graded_by)
           VALUES (?, ?, ?, 'https://assets.ethiroli.edu/submissions/project-repo.zip', ?, ?, ?, NOW(), ?, ?)
           ON DUPLICATE KEY UPDATE grade = VALUES(grade), feedback = VALUES(feedback), graded_at = VALUES(graded_at), graded_by = VALUES(graded_by)`,
          [
            crypto.randomUUID(),
            aId,
            student.id,
            sub.text_content,
            sub.grade,
            sub.feedback,
            sub.grade !== null ? new Date() : null,
            sub.grade !== null ? tutorId : null
          ]
        );
      }
    }
    console.log(' ✅ Seeded graded and pending assignment submissions.');

    // =========================================================================
    // STEP F: SEED REAL-TIME DOUBTS
    // =========================================================================
    console.log('\n--- Step F: Seeding Live Doubt Inquiries & Tutor Resolutions ---');

    const priya = formattedStudents.find(s => s.email === 'priya.ramanathan@ethiroli.edu');
    const manoj = formattedStudents.find(s => s.email === 'manoj.kumar@ethiroli.edu');
    const rahul = formattedStudents.find(s => s.email === 'rahul.venkat@ethiroli.edu');

    const DOUBTS = [
      {
        studentId: priya?.id,
        courseId: courseMap['FULLSTACK-101']?.id,
        title: 'How to handle JWT token expiration gracefully with Axios Interceptors?',
        description: 'When an access token expires during an ongoing API request, what is the best pattern to queue pending requests while awaiting the refresh endpoint response?',
        code_snippet: 'axiosInstance.interceptors.response.use(res => res, async err => {\n  if (err.response?.status === 401 && !original._retry) { ... }\n});',
        status: 'OPEN'
      },
      {
        studentId: manoj?.id,
        courseId: courseMap['PYTHON-101']?.id,
        title: 'Recursion Depth vs Iterative DFS performance in large graphs',
        description: 'In Python, does the system recursion limit (sys.setrecursionlimit) introduce significant memory overhead compared to an explicit deque-backed iterative DFS?',
        code_snippet: 'def dfs(node, visited):\n    visited.add(node)\n    for neighbor in graph[node]:\n        if neighbor not in visited: dfs(neighbor, visited)',
        status: 'OPEN'
      },
      {
        studentId: rahul?.id,
        courseId: courseMap['CLOUD-101']?.id,
        title: 'Should Docker bind mounts ever be used in staging or production?',
        description: 'Our team was discussing whether bind mounting host code directories is appropriate for staging environments.',
        code_snippet: 'volumes:\n  - ./:/usr/src/app',
        status: 'RESOLVED',
        resolution_notes: 'Bind mounts should strictly be reserved for local development hot-reloading. Staging and Production must rely on immutable, self-contained container images or managed named volumes for data persistence.',
        resolved_at: new Date()
      }
    ];

    for (const d of DOUBTS) {
      if (d.studentId && d.courseId) {
        await pool.execute(
          `INSERT INTO doubts (id, student_id, course_id, title, description, code_snippet, status, assigned_tutor_id, resolution_notes, resolved_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            crypto.randomUUID(),
            d.studentId,
            d.courseId,
            d.title,
            d.description,
            d.code_snippet,
            d.status,
            tutorId,
            d.resolution_notes || null,
            d.resolved_at || null
          ]
        );
      }
    }
    console.log(' ✅ Seeded active and resolved tutor inquiries.');

    // =========================================================================
    // STEP G: ISSUE CERTIFICATES (FOR 100% COMPLETION)
    // =========================================================================
    console.log('\n--- Step G: Generating Official Verified Certificates ---');

    if (rahul && courseMap['TEST-101']) {
      const [enrRows] = await pool.execute(
        'SELECT id FROM enrollments WHERE student_id = ? AND course_id = ?',
        [rahul.id, courseMap['TEST-101'].id]
      );
      const enrId = enrRows[0]?.id;

      const certNumber = 'ETH-2026-TEST101-RV06';
      const [existingCert] = await pool.execute(
        'SELECT id FROM certificates WHERE certificate_number = ?',
        [certNumber]
      );

      if (existingCert.length === 0) {
        await pool.execute(
          `INSERT INTO certificates (id, enrollment_id, student_id, course_id, certificate_number, issue_date, pdf_url, qr_code_url, is_verified)
           VALUES (?, ?, ?, ?, ?, '2026-09-20', 'https://assets.ethiroli.edu/certificates/ETH-2026-TEST101-RV06.pdf', 'https://assets.ethiroli.edu/certificates/qr/ETH-2026-TEST101-RV06.png', 1)`,
          [crypto.randomUUID(), enrId, rahul.id, courseMap['TEST-101'].id, certNumber]
        );
        console.log(` 🏆 Certificate Issued: [${certNumber}] for Rahul Venkat (100% Course Completion)`);
      } else {
        console.log(` 🏆 Certificate [${certNumber}] already registered.`);
      }
    }

    // =========================================================================
    // STEP H: AWARD MASTER LEARNING BADGES
    // =========================================================================
    console.log('\n--- Step H: Awarding Gamification Badges ---');

    // Standard badge IDs
    const BADGE_COURSE_COMPLETED = 'b3f1a000000000000000000000000001';
    const BADGE_FIRST_LESSON = 'b3f1a000000000000000000000000002';
    const BADGE_MODULE_MASTER = 'b3f1a000000000000000000000000003';
    const BADGE_QUIZ_WHIZ = 'b3f1a000000000000000000000000004';
    const BADGE_ASSIGNMENT_PRO = 'b3f1a000000000000000000000000005';

    const BADGE_AWARDS = [
      { email: 'rahul.venkat@ethiroli.edu', badges: [BADGE_COURSE_COMPLETED, BADGE_QUIZ_WHIZ, BADGE_ASSIGNMENT_PRO, BADGE_MODULE_MASTER] },
      { email: 'sneha.sundaram@ethiroli.edu', badges: [BADGE_QUIZ_WHIZ, BADGE_ASSIGNMENT_PRO, BADGE_MODULE_MASTER] },
      { email: 'priya.ramanathan@ethiroli.edu', badges: [BADGE_FIRST_LESSON, BADGE_QUIZ_WHIZ, BADGE_ASSIGNMENT_PRO] },
      { email: 'keerthana.sridhar@ethiroli.edu', badges: [BADGE_FIRST_LESSON, BADGE_QUIZ_WHIZ] },
      { email: 'karthik.subramanian@ethiroli.edu', badges: [BADGE_FIRST_LESSON, BADGE_ASSIGNMENT_PRO] },
      { email: 'vignesh.balaji@ethiroli.edu', badges: [BADGE_FIRST_LESSON] },
      { email: 'divya.natarajan@ethiroli.edu', badges: [BADGE_FIRST_LESSON] },
      { email: 'ananya.krishnan@ethiroli.edu', badges: [BADGE_FIRST_LESSON] }
    ];

    for (const award of BADGE_AWARDS) {
      const student = formattedStudents.find(s => s.email === award.email);
      if (student) {
        for (const bId of award.badges) {
          await pool.execute(
            `INSERT IGNORE INTO user_badges (id, user_id, badge_id, earned_at)
             VALUES (?, ?, ?, NOW())`,
            [crypto.randomUUID(), student.id, bId]
          );
        }
      }
    }
    console.log(' ✅ Awarded achievement badges across student profiles.');

    console.log('\n🎉 ALL LMS DATA SEEDING COMPLETE FOR 10 STUDENTS!');
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('❌ LMS Seeding Error:', err);
    await pool.end();
    process.exit(1);
  }
}

seedLMS();
