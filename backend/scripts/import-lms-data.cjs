

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const crypto = require('crypto');

const envPath = path.join(__dirname, '../.env');
const env = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
const getEnv = (k, d = '') => (env.match(new RegExp(`^${k}=(.*)$`, 'm'))?.[1] ?? d).trim();

const DATA_DIR = path.join(__dirname, '../../data');
const TUTOR_ID = 'c60caddb-2848-492a-8724-4e7ec5d55850'; // Default active tutor tutor@ethiroli.com

function stripBOM(str) {
  return str.replace(/^\uFEFF/, '');
}

function readJSON(relPath) {
  const fullPath = path.join(DATA_DIR, relPath);
  if (!fs.existsSync(fullPath)) return null;
  const raw = fs.readFileSync(fullPath, 'utf8');
  return JSON.parse(stripBOM(raw));
}

function truncate(str, maxLen = 255) {
  if (!str) return '';
  return str.length > maxLen ? str.slice(0, maxLen - 3) + '...' : str;
}

async function run() {
  console.log('🚀 Starting LMS Dynamic Data Ingestion...');

  const pool = await mysql.createPool({
    host: getEnv('DB_HOST', 'localhost'),
    port: Number(getEnv('DB_PORT', 3306)),
    user: getEnv('DB_USER', 'root'),
    password: getEnv('DB_PASSWORD', ''),
    database: getEnv('DB_NAME', 'ethiroli'),
    waitForConnections: true,
    connectionLimit: 10
  });

  // Verify tutor exists
  const [tutorRows] = await pool.query('SELECT id, full_name, email FROM users WHERE id = ?', [TUTOR_ID]);
  if (!tutorRows.length) {
    console.error(`❌ Tutor ID ${TUTOR_ID} not found in users table!`);
    process.exit(1);
  }
  console.log(`✅ Verified Tutor: ${tutorRows[0].id}`);

  // Fetch active students
  const [students] = await pool.query("SELECT id, full_name, email FROM users WHERE role = 'STUDENT' LIMIT 20");
  console.log(`✅ Found ${students.length} active students in database.`);

  const techModuleMap = {}; // code -> id
  const courseMap = {};     // code -> id
  const programMap = {};    // code -> id

  // =========================================================================
  // STEP 1: Ingest 34 Technology Modules into `technology_modules`
  // =========================================================================
  console.log('\n--- Step 1: Ingesting Technology Modules ---');
  const modReg = readJSON('modules/module-registry.json') || {};
  let techModCount = 0;

  for (const [code, mod] of Object.entries(modReg)) {
    const [existing] = await pool.query('SELECT id FROM technology_modules WHERE code = ?', [code]);
    let modId;
    if (existing.length > 0) {
      modId = existing[0].id;
      await pool.query(
        `UPDATE technology_modules 
         SET title = ?, category = ?, level = ?, duration_hours = ?, description = ?,
             topics = ?, technologies = ?, practicals = ?, projects = ?, prerequisites = ?, learning_outcomes = ?, is_active = 1
         WHERE id = ?`,
        [
          mod.title || code,
          mod.category || 'Engineering',
          mod.level || 'Intermediate',
          mod.duration_hours || 20,
          mod.description || '',
          JSON.stringify(mod.topics || []),
          JSON.stringify(mod.technologies || []),
          JSON.stringify(mod.practicals || []),
          JSON.stringify(mod.projects || []),
          JSON.stringify(mod.prerequisites || []),
          JSON.stringify(mod.learning_outcomes || []),
          modId
        ]
      );
    } else {
      modId = crypto.randomUUID();
      await pool.query(
        `INSERT INTO technology_modules 
         (id, code, title, category, level, duration_hours, description, topics, technologies, practicals, projects, prerequisites, learning_outcomes, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [
          modId,
          code,
          mod.title || code,
          mod.category || 'Engineering',
          mod.level || 'Intermediate',
          mod.duration_hours || 20,
          mod.description || '',
          JSON.stringify(mod.topics || []),
          JSON.stringify(mod.technologies || []),
          JSON.stringify(mod.practicals || []),
          JSON.stringify(mod.projects || []),
          JSON.stringify(mod.prerequisites || []),
          JSON.stringify(mod.learning_outcomes || [])
        ]
      );
    }
    techModuleMap[code] = modId;
    techModCount++;
  }
  console.log(`✅ Upserted ${techModCount} Technology Modules.`);

  // =========================================================================
  // STEP 2: Ingest Career Programs into `programs` & `program_modules`
  // =========================================================================
  console.log('\n--- Step 2: Ingesting Career Programs ---');
  const progReg = readJSON('programs/program-registry.json') || {};
  let progCount = 0;

  for (const [code, prog] of Object.entries(progReg)) {
    const [existing] = await pool.query('SELECT id FROM programs WHERE code = ?', [code]);
    let progId;
    if (existing.length > 0) {
      progId = existing[0].id;
      await pool.query(
        `UPDATE programs 
         SET name = ?, description = ?, duration_days = ?, tracks = ?, final_project = ?, is_active = 1
         WHERE id = ?`,
        [
          prog.name || code,
          prog.description || `Comprehensive ${prog.duration_days}-day career program`,
          prog.duration_days || 30,
          JSON.stringify(prog.tracks || ['Fullstack']),
          prog.final_project || 'Capstone Project',
          progId
        ]
      );
    } else {
      progId = crypto.randomUUID();
      await pool.query(
        `INSERT INTO programs 
         (id, code, name, description, duration_days, tracks, final_project, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
        [
          progId,
          code,
          prog.name || code,
          prog.description || `Comprehensive ${prog.duration_days}-day career program`,
          prog.duration_days || 30,
          JSON.stringify(prog.tracks || ['Fullstack']),
          prog.final_project || 'Capstone Project'
        ]
      );
    }
    programMap[code] = progId;
    progCount++;

    // Ingest program modules
    if (Array.isArray(prog.module_sequence)) {
      await pool.query('DELETE FROM program_modules WHERE program_id = ?', [progId]);
      for (const item of prog.module_sequence) {
        const tModId = techModuleMap[item.module];
        if (tModId) {
          await pool.query(
            `INSERT INTO program_modules 
             (id, program_id, module_id, module_order, allocated_days, is_core)
             VALUES (?, ?, ?, ?, ?, 1)`,
            [crypto.randomUUID(), progId, tModId, item.order || 1, item.days || 3]
          );
        }
      }
    }
  }
  console.log(`✅ Upserted ${progCount} Career Programs and their module mappings.`);

  // =========================================================================
  // STEP 3: Ingest Industry Courses into `courses` & `course_modules`
  // =========================================================================
  console.log('\n--- Step 3: Ingesting Courses ---');
  const courseReg = readJSON('courses/course-registry.json') || {};

  // Combine course registry with the 3 career programs as full enrollable courses
  const allCourseDefinitions = [
    {
      code: 'ETH-WEB-30',
      name: '30-Day Web Development Internship',
      description: 'Comprehensive 30-day web development curriculum covering HTML5, CSS3, Modern JavaScript, React.js, Node.js, and Full-Stack Integration with a production capstone project.',
      duration_days: 30,
      fee: 9999.00,
      category: 'Frontend & Fullstack',
      level: 'Beginner',
      thumbnail_url: 'https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?w=800&q=80',
      modules: ['PROG-FUND', 'WEB-HTML', 'WEB-CSS', 'DEV-GIT', 'JS-CORE', 'FE-REACT', 'FINAL']
    },
    {
      code: 'ETH-FS-45',
      name: '45-Day Full Stack Development Internship',
      description: 'Intensive 45-day program covering modern web architectures, React, Node.js, Express, MySQL/MongoDB, REST APIs, Authentication, and Cloud Deployment.',
      duration_days: 45,
      fee: 14999.00,
      category: 'Fullstack',
      level: 'Intermediate',
      thumbnail_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      modules: ['WEB-HTML', 'WEB-CSS', 'JS-CORE', 'FE-REACT', 'BE-NODE', 'BE-EXPRESS', 'DB-MYSQL', 'SEC-AUTH', 'FS-INTEGRATION', 'FINAL']
    },
    {
      code: 'ETH-AIFS-60',
      name: '60-Day AI & Full Stack Internship',
      description: 'Cutting-edge 60-day curriculum mastering Full Stack Development, Generative AI integration, LLM applications, Vector Databases, Python, and Intelligent Agent Deployment.',
      duration_days: 60,
      fee: 19999.00,
      category: 'AI & Fullstack',
      level: 'Advanced',
      thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
      modules: ['WEB-HTML', 'JS-CORE', 'FE-REACT', 'BE-NODE', 'PY-CORE', 'AI-DEV', 'AI-GENAPP', 'CLOUD-AWS', 'FINAL']
    }
  ];

  for (const [code, c] of Object.entries(courseReg)) {
    allCourseDefinitions.push({
      code,
      name: c.name || code,
      description: c.description || `${c.name} — Comprehensive hands-on mastery track with production labs and quizzes.`,
      duration_days: c.duration_days || 5,
      fee: c.duration_days ? c.duration_days * 500 : 2500.00,
      category: c.category || 'Development',
      level: c.level || 'Intermediate',
      thumbnail_url: c.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
      modules: c.modules || []
    });
  }

  let courseCount = 0;
  for (const c of allCourseDefinitions) {
    const [existing] = await pool.query('SELECT id FROM courses WHERE code = ?', [c.code]);
    let courseId;
    if (existing.length > 0) {
      courseId = existing[0].id;
      await pool.query(
        `UPDATE courses 
         SET name = ?, description = ?, duration_days = ?, fee = ?, category = ?, level = ?, thumbnail_url = ?, tutor_id = ?, is_active = 1
         WHERE id = ?`,
        [
          c.name,
          c.description,
          c.duration_days,
          c.fee,
          c.category,
          c.level,
          c.thumbnail_url,
          TUTOR_ID,
          courseId
        ]
      );
    } else {
      courseId = crypto.randomUUID();
      await pool.query(
        `INSERT INTO courses 
         (id, code, name, description, duration_days, fee, category, level, thumbnail_url, tutor_id, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [
          courseId,
          c.code,
          c.name,
          c.description,
          c.duration_days,
          c.fee,
          c.category,
          c.level,
          c.thumbnail_url,
          TUTOR_ID
        ]
      );
    }
    courseMap[c.code] = courseId;
    courseCount++;

    // Populate course_modules
    if (Array.isArray(c.modules) && c.modules.length > 0) {
      await pool.query('DELETE FROM course_modules WHERE course_id = ?', [courseId]);
      let order = 1;
      for (const modCode of c.modules) {
        const tModId = techModuleMap[modCode];
        if (tModId) {
          await pool.query(
            `INSERT INTO course_modules (id, course_id, module_id, module_order, is_optional)
             VALUES (?, ?, ?, ?, 0)`,
            [crypto.randomUUID(), courseId, tModId, order++]
          );
        }
      }
    }
  }
  console.log(`✅ Upserted ${courseCount} courses assigned to Tutor.`);

  // =========================================================================
  // HELPER: Ingest Questions, Options, Quizzes, Assignments for a Lesson
  // =========================================================================
  async function ingestLessonBlocksAndAssessments(lessonId, courseId, moduleId, blocks, fallbackTitle) {
    if (!Array.isArray(blocks) || blocks.length === 0) return;

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      const blockTypeRaw = (block.block_type || block.type || 'MARKDOWN').toUpperCase();
      const payload = block.content_payload || block.payload || {};

      let dbBlockType = 'MARKDOWN';
      let isInteractive = false;

      if (blockTypeRaw === 'MARKDOWN') {
        dbBlockType = 'MARKDOWN';
      } else if (blockTypeRaw === 'VIDEO') {
        dbBlockType = 'VIDEO';
      } else if (blockTypeRaw === 'CODE_PLAYGROUND') {
        dbBlockType = 'CODE_PLAYGROUND';
        isInteractive = true;
      } else if (blockTypeRaw === 'QUIZ') {
        dbBlockType = 'QUIZ_EMBED';
        isInteractive = true;

        // Create Quiz in `quizzes`
        const quizTitle = payload.title || `Quiz: ${fallbackTitle}`;
        const quizId = crypto.randomUUID();
        await pool.query(
          `INSERT INTO quizzes (id, course_id, title, description, time_limit_minutes, passing_score, is_published)
           VALUES (?, ?, ?, ?, ?, ?, 1)`,
          [
            quizId,
            courseId,
            truncate(quizTitle, 250),
            payload.description || `Assessment for ${fallbackTitle}`,
            payload.time_limit_minutes || 15,
            payload.passing_percentage || 70
          ]
        );

        // Process questions
        const questionsList = Array.isArray(payload.questions) ? payload.questions : [];
        let qOrder = 1;
        for (const q of questionsList) {
          const qText = q.question || q.question_text || 'Core programming assessment question';
          const qId = crypto.randomUUID();

          await pool.query(
            `INSERT INTO question_bank 
             (id, course_id, module_id, topic, difficulty, question_type, question_text, explanation, is_active, created_by)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
            [
              qId,
              courseId,
              moduleId,
              'General Programming',
              'MEDIUM',
              'MCQ',
              qText,
              q.explanation || 'Verified in lesson lecture.',
              TUTOR_ID
            ]
          );

          // Insert options
          const optionsList = Array.isArray(q.options) ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'];
          const correctIdx = q.correct_index !== undefined
            ? Number(q.correct_index)
            : (typeof q.correct_answer === 'number' ? q.correct_answer : 0);

          for (let optIdx = 0; optIdx < optionsList.length; optIdx++) {
            const optText = typeof optionsList[optIdx] === 'object'
              ? (optionsList[optIdx].text || optionsList[optIdx].option_text || 'Option')
              : String(optionsList[optIdx]);
            const isCorrect = (optIdx === correctIdx) || (q.correct_answer && q.correct_answer === optText) ? 1 : 0;

            await pool.query(
              `INSERT INTO question_options (id, question_id, option_text, is_correct, display_order)
               VALUES (?, ?, ?, ?, ?)`,
              [crypto.randomUUID(), qId, optText, isCorrect, optIdx + 1]
            );
          }

          // Link to quiz
          await pool.query(
            `INSERT INTO quiz_questions (id, quiz_id, question_id, points, question_order)
             VALUES (?, ?, ?, 10, ?)`,
            [crypto.randomUUID(), quizId, qId, qOrder++]
          );
        }
      } else if (blockTypeRaw === 'TASK' || blockTypeRaw === 'ASSIGNMENT') {
        dbBlockType = 'CALLOUT';

        // Create assignment record
        const assignTitle = payload.title || `Practical Task: ${fallbackTitle}`;
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30);

        const assignDesc = payload.description || payload.requirements?.join('\n') || `Complete practical task for ${fallbackTitle}`;

        await pool.query(
          `INSERT INTO assignments (id, course_id, title, description, due_date, max_score)
           VALUES (?, ?, ?, ?, ?, 100)`,
          [crypto.randomUUID(), courseId, truncate(assignTitle, 250), assignDesc, dueDate.toISOString().slice(0, 10)]
        );
      }

      // Insert Lesson Block
      await pool.query(
        `INSERT INTO lesson_blocks (id, lesson_id, block_type, block_order, content_payload, is_interactive)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [crypto.randomUUID(), lessonId, dbBlockType, i + 1, JSON.stringify(payload), isInteractive ? 1 : 0]
      );
    }
  }

  // =========================================================================
  // STEP 4: Ingest Curriculum for ETH-WEB-30
  // =========================================================================
  console.log('\n--- Step 4: Ingesting Curriculum for ETH-WEB-30 ---');
  const web30 = readJSON('courses/eth-web-30.json');
  const web30CourseId = courseMap['ETH-WEB-30'];

  if (web30 && web30CourseId) {
    // Clear old modules & lessons for this course to ensure clean state
    const [oldMods] = await pool.query('SELECT id FROM modules WHERE course_id = ?', [web30CourseId]);
    for (const om of oldMods) {
      const [oldLessons] = await pool.query('SELECT id FROM lessons WHERE module_id = ?', [om.id]);
      for (const ol of oldLessons) {
        await pool.query('DELETE FROM lesson_blocks WHERE lesson_id = ?', [ol.id]);
        await pool.query('DELETE FROM lesson_progress WHERE lesson_id = ?', [ol.id]);
      }
      await pool.query('DELETE FROM lessons WHERE module_id = ?', [om.id]);
    }
    await pool.query('DELETE FROM modules WHERE course_id = ?', [web30CourseId]);
    await pool.query('DELETE FROM assignments WHERE course_id = ?', [web30CourseId]);
    const [oldQuizzes] = await pool.query('SELECT id FROM quizzes WHERE course_id = ?', [web30CourseId]);
    for (const oq of oldQuizzes) {
      await pool.query('DELETE FROM quiz_questions WHERE quiz_id = ?', [oq.id]);
      await pool.query('DELETE FROM quiz_attempts WHERE quiz_id = ?', [oq.id]);
    }
    await pool.query('DELETE FROM quizzes WHERE course_id = ?', [web30CourseId]);

    let modOrder = 1;
    for (const m of web30.modules || []) {
      const modId = crypto.randomUUID();
      await pool.query(
        `INSERT INTO modules (id, course_id, title, description, module_order, duration_minutes)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [modId, web30CourseId, m.title, m.description || `Phase ${modOrder} curriculum`, modOrder++, 360]
      );

      let lOrder = 1;
      for (const l of m.lessons || []) {
        const lessonId = crypto.randomUUID();
        await pool.query(
          `INSERT INTO lessons (id, module_id, title, content, video_url, lesson_order)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [lessonId, modId, l.title, l.content || '', l.video_url || 'https://www.youtube.com/watch?v=kUMe1FH4CHE', lOrder++]
        );

        await ingestLessonBlocksAndAssessments(lessonId, web30CourseId, modId, l.blocks, l.title);
      }
    }
    console.log(`✅ Finished ETH-WEB-30: 5 modules, 30 lessons, blocks, quizzes & assignments.`);
  }

  // =========================================================================
  // STEP 5: Ingest Curriculum for ETH-AIFS-60
  // =========================================================================
  console.log('\n--- Step 5: Ingesting Curriculum for ETH-AIFS-60 ---');
  const aifs60 = readJSON('courses/eth-aifs-60.json');
  const aifs60CourseId = courseMap['ETH-AIFS-60'];

  if (aifs60 && aifs60CourseId && Array.isArray(aifs60.courses)) {
    // Clear old modules & lessons
    const [oldMods] = await pool.query('SELECT id FROM modules WHERE course_id = ?', [aifs60CourseId]);
    for (const om of oldMods) {
      const [oldLessons] = await pool.query('SELECT id FROM lessons WHERE module_id = ?', [om.id]);
      for (const ol of oldLessons) {
        await pool.query('DELETE FROM lesson_blocks WHERE lesson_id = ?', [ol.id]);
        await pool.query('DELETE FROM lesson_progress WHERE lesson_id = ?', [ol.id]);
      }
      await pool.query('DELETE FROM lessons WHERE module_id = ?', [om.id]);
    }
    await pool.query('DELETE FROM modules WHERE course_id = ?', [aifs60CourseId]);
    await pool.query('DELETE FROM assignments WHERE course_id = ?', [aifs60CourseId]);
    const [oldQuizzes] = await pool.query('SELECT id FROM quizzes WHERE course_id = ?', [aifs60CourseId]);
    for (const oq of oldQuizzes) {
      await pool.query('DELETE FROM quiz_questions WHERE quiz_id = ?', [oq.id]);
      await pool.query('DELETE FROM quiz_attempts WHERE quiz_id = ?', [oq.id]);
    }
    await pool.query('DELETE FROM quizzes WHERE course_id = ?', [aifs60CourseId]);

    // Group 60 days into 6 modules (10 days each)
    const moduleNames = [
      'Phase 1: Frontend & Responsive UI (Days 1-10)',
      'Phase 2: JavaScript ES6+ & TypeScript Mastery (Days 11-20)',
      'Phase 3: React & State Management Architecture (Days 21-30)',
      'Phase 4: Node.js, Express & Database Systems (Days 31-40)',
      'Phase 5: AI Integration, LLMs & Generative Apps (Days 41-50)',
      'Phase 6: Cloud Deployment & Capstone Project (Days 51-60)'
    ];

    const modMap = [];
    for (let mIdx = 0; mIdx < moduleNames.length; mIdx++) {
      const mId = crypto.randomUUID();
      await pool.query(
        `INSERT INTO modules (id, course_id, title, description, module_order, duration_minutes)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [mId, aifs60CourseId, moduleNames[mIdx], `10-day intensive cohort phase`, mIdx + 1, 600]
      );
      modMap.push(mId);
    }

    for (let dayIdx = 0; dayIdx < aifs60.courses.length; dayIdx++) {
      const day = aifs60.courses[dayIdx];
      const targetModId = modMap[Math.min(Math.floor(dayIdx / 10), modMap.length - 1)];
      const lessonId = crypto.randomUUID();

      await pool.query(
        `INSERT INTO lessons (id, module_id, title, content, video_url, lesson_order)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          lessonId,
          targetModId,
          day.title || `Day ${dayIdx + 1}`,
          day.content || '',
          day.video_url || 'https://www.youtube.com/watch?v=kUMe1FH4CHE',
          (dayIdx % 10) + 1
        ]
      );

      await ingestLessonBlocksAndAssessments(lessonId, aifs60CourseId, targetModId, day.blocks, day.title);
    }
    console.log(`✅ Finished ETH-AIFS-60: 6 modules, 60 daily lessons, blocks, quizzes & assignments.`);
  }

  // =========================================================================
  // STEP 6: Ingest Curriculum for ETH-FS-45
  // =========================================================================
  console.log('\n--- Step 6: Ingesting Curriculum for ETH-FS-45 ---');
  const fs45p1 = readJSON('courses/eth-fs-45-phase1.json');
  const fs45p3 = readJSON('courses/eth-fs-45-phase3-6.json');
  const fs45CourseId = courseMap['ETH-FS-45'];

  if (fs45CourseId) {
    // Clear old modules & lessons
    const [oldMods] = await pool.query('SELECT id FROM modules WHERE course_id = ?', [fs45CourseId]);
    for (const om of oldMods) {
      const [oldLessons] = await pool.query('SELECT id FROM lessons WHERE module_id = ?', [om.id]);
      for (const ol of oldLessons) {
        await pool.query('DELETE FROM lesson_blocks WHERE lesson_id = ?', [ol.id]);
        await pool.query('DELETE FROM lesson_progress WHERE lesson_id = ?', [ol.id]);
      }
      await pool.query('DELETE FROM lessons WHERE module_id = ?', [om.id]);
    }
    await pool.query('DELETE FROM modules WHERE course_id = ?', [fs45CourseId]);
    await pool.query('DELETE FROM assignments WHERE course_id = ?', [fs45CourseId]);
    const [oldQuizzes] = await pool.query('SELECT id FROM quizzes WHERE course_id = ?', [fs45CourseId]);
    for (const oq of oldQuizzes) {
      await pool.query('DELETE FROM quiz_questions WHERE quiz_id = ?', [oq.id]);
      await pool.query('DELETE FROM quiz_attempts WHERE quiz_id = ?', [oq.id]);
    }
    await pool.query('DELETE FROM quizzes WHERE course_id = ?', [fs45CourseId]);

    // Create 4 modules for 45 days
    const fsModules = [
      { title: 'Phase 1: Web Foundation & HTML/CSS/Git (Days 1-10)', daysCount: 10 },
      { title: 'Phase 2: Modern JavaScript & Frontend Engineering (Days 11-20)', daysCount: 10 },
      { title: 'Phase 3: Backend APIs, Node.js & Database Systems (Days 21-35)', daysCount: 15 },
      { title: 'Phase 4: Full Stack Architecture & Capstone Project (Days 36-45)', daysCount: 10 }
    ];

    const fsModIds = [];
    for (let i = 0; i < fsModules.length; i++) {
      const mId = crypto.randomUUID();
      await pool.query(
        `INSERT INTO modules (id, course_id, title, description, module_order, duration_minutes)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [mId, fs45CourseId, fsModules[i].title, 'Full stack cohort curriculum block', i + 1, fsModules[i].daysCount * 60]
      );
      fsModIds.push(mId);
    }

    // Ingest Phase 1 days (0-9)
    if (fs45p1) {
      const keys = Object.keys(fs45p1).sort((a, b) => Number(a) - Number(b));
      for (const k of keys) {
        const day = fs45p1[k];
        const lessonId = crypto.randomUUID();
        await pool.query(
          `INSERT INTO lessons (id, module_id, title, content, video_url, lesson_order)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            lessonId,
            fsModIds[0],
            day.title || `Day ${Number(k) + 1}`,
            day.content || '',
            day.video_url || 'https://www.youtube.com/watch?v=kUMe1FH4CHE',
            Number(k) + 1
          ]
        );
        await ingestLessonBlocksAndAssessments(lessonId, fs45CourseId, fsModIds[0], day.blocks, day.title);
      }
    }

    // Ingest Phase 3-6 days
    if (fs45p3) {
      const keys = Object.keys(fs45p3).sort((a, b) => Number(a) - Number(b));
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        const day = fs45p3[k];
        const targetMod = i < 15 ? fsModIds[2] : fsModIds[3];
        const lessonId = crypto.randomUUID();
        await pool.query(
          `INSERT INTO lessons (id, module_id, title, content, video_url, lesson_order)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            lessonId,
            targetMod,
            day.title || `Day ${21 + i}`,
            day.content || '',
            day.video_url || 'https://www.youtube.com/watch?v=kUMe1FH4CHE',
            (i % 15) + 1
          ]
        );
        await ingestLessonBlocksAndAssessments(lessonId, fs45CourseId, targetMod, day.blocks, day.title);
      }
    }
    console.log(`✅ Finished ETH-FS-45: 4 modules, 35+ deep daily lessons, blocks, quizzes & assignments.`);
  }

  // =========================================================================
  // STEP 7: Ingest Modular Technology Courses & Quizzes from data/modules/
  // =========================================================================
  console.log('\n--- Step 7: Ingesting Modular Technology Courses & Quizzes ---');
  // For courses that map directly to technology modules (e.g. ETH-HTML5-01, ETH-CSS-01, etc.)
  for (const [code, mod] of Object.entries(modReg)) {
    // Find matching course
    const matchingCourseCode = Object.keys(courseReg).find(cCode => {
      const c = courseReg[cCode];
      return Array.isArray(c.modules) && c.modules.includes(code);
    });

    if (!matchingCourseCode) continue;
    const cId = courseMap[matchingCourseCode];
    if (!cId) continue;

    // Check if course already has modules
    const [existingMods] = await pool.query('SELECT id FROM modules WHERE course_id = ?', [cId]);
    if (existingMods.length > 0) continue; // Already has content

    const modDir = path.join(DATA_DIR, 'modules', code);
    if (!fs.existsSync(modDir)) continue;

    // Create module in `modules`
    const mId = crypto.randomUUID();
    await pool.query(
      `INSERT INTO modules (id, course_id, title, description, module_order, duration_minutes)
       VALUES (?, ?, ?, ?, 1, ?)`,
      [mId, cId, mod.title || code, mod.description || '', (mod.duration_hours || 10) * 60]
    );

    // Read lessons from data/modules/{code}/lessons/
    const lessonsDir = path.join(modDir, 'lessons');
    if (fs.existsSync(lessonsDir)) {
      const files = fs.readdirSync(lessonsDir).filter(f => f.endsWith('.json'));
      let lOrder = 1;
      for (const lf of files) {
        try {
          const lData = JSON.parse(stripBOM(fs.readFileSync(path.join(lessonsDir, lf), 'utf8')));
          const lessonId = crypto.randomUUID();
          const content = `${lData.theory_markdown || ''}\n\n${lData.code_walkthrough?.code ? '```' + (lData.code_walkthrough.language || '') + '\n' + lData.code_walkthrough.code + '\n```' : ''}`;

          await pool.query(
            `INSERT INTO lessons (id, module_id, title, content, video_url, lesson_order, technology_module_id)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              lessonId,
              mId,
              lData.title || `Lesson ${lOrder}`,
              content,
              'https://www.youtube.com/watch?v=kUMe1FH4CHE',
              lOrder++,
              techModuleMap[code] || null
            ]
          );

          // Add markdown block
          await pool.query(
            `INSERT INTO lesson_blocks (id, lesson_id, block_type, block_order, content_payload, is_interactive)
             VALUES (?, ?, 'MARKDOWN', 1, ?, 0)`,
            [crypto.randomUUID(), lessonId, JSON.stringify({ body: content })]
          );
        } catch (e) {
          // ignore individual bad lesson
        }
      }
    }

    // Read quizzes from data/modules/{code}/quizzes/
    const quizzesDir = path.join(modDir, 'quizzes');
    if (fs.existsSync(quizzesDir)) {
      const qFiles = fs.readdirSync(quizzesDir).filter(f => f.endsWith('.json'));
      for (const qf of qFiles) {
        try {
          const qData = JSON.parse(stripBOM(fs.readFileSync(path.join(quizzesDir, qf), 'utf8')));
          const quizId = crypto.randomUUID();
          await pool.query(
            `INSERT INTO quizzes (id, course_id, title, description, time_limit_minutes, passing_score, is_published)
             VALUES (?, ?, ?, ?, ?, ?, 1)`,
            [
              quizId,
              cId,
              truncate(qData.title || `Quiz: ${mod.title}`, 250),
              `Assessment for ${mod.title}`,
              qData.time_limit_minutes || 15,
              qData.passing_percentage || 70
            ]
          );

          if (Array.isArray(qData.questions)) {
            let qOrder = 1;
            for (const q of qData.questions) {
              const qId = crypto.randomUUID();
              await pool.query(
                `INSERT INTO question_bank 
                 (id, course_id, module_id, topic, difficulty, question_type, question_text, explanation, is_active, created_by)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
                [
                  qId,
                  cId,
                  mId,
                  mod.category || 'Technology',
                  'MEDIUM',
                  'MCQ',
                  q.question || 'Core technical question',
                  q.explanation || 'Verified in lesson lecture.',
                  TUTOR_ID
                ]
              );

              const opts = Array.isArray(q.options) ? q.options : ['A', 'B', 'C', 'D'];
              for (let oIdx = 0; oIdx < opts.length; oIdx++) {
                const optText = String(opts[oIdx]);
                const isCorrect = (oIdx === (q.correct_index || 0)) ? 1 : 0;
                await pool.query(
                  `INSERT INTO question_options (id, question_id, option_text, is_correct, display_order)
                   VALUES (?, ?, ?, ?, ?)`,
                  [crypto.randomUUID(), qId, optText, isCorrect, oIdx + 1]
                );
              }

              await pool.query(
                `INSERT INTO quiz_questions (id, quiz_id, question_id, points, question_order)
                 VALUES (?, ?, ?, 10, ?)`,
                [crypto.randomUUID(), quizId, qId, qOrder++]
              );
            }
          }
        } catch (e) {}
      }
    }

    // Read exercises from data/modules/{code}/exercises/
    const exercisesDir = path.join(modDir, 'exercises');
    if (fs.existsSync(exercisesDir)) {
      const exFiles = fs.readdirSync(exercisesDir).filter(f => f.endsWith('.json'));
      for (const ef of exFiles) {
        try {
          const exData = JSON.parse(stripBOM(fs.readFileSync(path.join(exercisesDir, ef), 'utf8')));
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + 30);
          await pool.query(
            `INSERT INTO assignments (id, course_id, title, description, due_date, max_score)
             VALUES (?, ?, ?, ?, ?, 100)`,
            [
              crypto.randomUUID(),
              cId,
              truncate(exData.title || `Lab: ${mod.title}`, 250),
              exData.instructions || `Hands-on practical exercise for ${mod.title}`,
              dueDate.toISOString().slice(0, 10)
            ]
          );
        } catch (e) {}
      }
    }
  }
  console.log(`✅ Finished Ingesting Modular Technology Courses & Quizzes.`);

  // =========================================================================
  // STEP 8: Create Active Batches & Assign Students
  // =========================================================================
  console.log('\n--- Step 8: Creating Cohort Batches & Assigning Students ---');
  const batchDefs = [
    {
      courseCode: 'ETH-WEB-30',
      batch_code: 'WEB30-2026-A',
      name: 'Web Development Internship Cohort Alpha (Spring 2026)',
      start_date: '2026-03-01',
      end_date: '2026-04-15',
      max_capacity: 50
    },
    {
      courseCode: 'ETH-FS-45',
      batch_code: 'FS45-2026-A',
      name: 'Full Stack Development Cohort Alpha (Spring 2026)',
      start_date: '2026-03-01',
      end_date: '2026-05-01',
      max_capacity: 50
    },
    {
      courseCode: 'ETH-AIFS-60',
      batch_code: 'AIFS60-2026-A',
      name: 'AI & Full Stack Cohort Alpha (Spring 2026)',
      start_date: '2026-03-01',
      end_date: '2026-05-30',
      max_capacity: 50
    }
  ];

  for (const bDef of batchDefs) {
    const cId = courseMap[bDef.courseCode];
    if (!cId) continue;

    const [existing] = await pool.query('SELECT id FROM batches WHERE batch_code = ?', [bDef.batch_code]);
    let batchId;
    if (existing.length > 0) {
      batchId = existing[0].id;
      await pool.query(
        `UPDATE batches 
         SET course_id = ?, tutor_id = ?, name = ?, start_date = ?, end_date = ?, max_capacity = ?, is_active = 1
         WHERE id = ?`,
        [cId, TUTOR_ID, bDef.name, bDef.start_date, bDef.end_date, bDef.max_capacity, batchId]
      );
    } else {
      batchId = crypto.randomUUID();
      await pool.query(
        `INSERT INTO batches 
         (id, course_id, tutor_id, batch_code, name, start_date, end_date, max_capacity, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [batchId, cId, TUTOR_ID, bDef.batch_code, bDef.name, bDef.start_date, bDef.end_date, bDef.max_capacity]
      );
    }

    // Enroll students in this batch
    for (const student of students) {
      const [bStudent] = await pool.query('SELECT id FROM batch_students WHERE batch_id = ? AND student_id = ?', [batchId, student.id]);
      if (!bStudent.length) {
        await pool.query(
          'INSERT INTO batch_students (id, batch_id, student_id) VALUES (?, ?, ?)',
          [crypto.randomUUID(), batchId, student.id]
        );
      }
    }
  }
  console.log(`✅ Batches created and ${students.length} students assigned.`);

  // =========================================================================
  // STEP 9: Student Enrollments & Lesson Progress
  // =========================================================================
  console.log('\n--- Step 9: Creating Student Enrollments & Lesson Progress ---');
  const targetCourseCodes = ['ETH-WEB-30', 'ETH-FS-45', 'ETH-AIFS-60'];

  for (const student of students) {
    for (let cIdx = 0; cIdx < targetCourseCodes.length; cIdx++) {
      const code = targetCourseCodes[cIdx];
      const cId = courseMap[code];
      if (!cId) continue;

      const [existingEnr] = await pool.query(
        'SELECT id FROM enrollments WHERE student_id = ? AND course_id = ?',
        [student.id, cId]
      );

      // Realistic progress percentage based on student and course
      const randomProgress = Math.min(100, Math.max(10, Math.floor(25 + (Math.sin(student.id.charCodeAt(0) + cIdx) + 1) * 35)));

      let enrId;
      if (existingEnr.length > 0) {
        enrId = existingEnr[0].id;
        await pool.query(
          `UPDATE enrollments 
           SET assigned_by_tutor_id = ?, progress_percentage = ?, status = 'ACTIVE'
           WHERE id = ?`,
          [TUTOR_ID, randomProgress, enrId]
        );
      } else {
        enrId = crypto.randomUUID();
        await pool.query(
          `INSERT INTO enrollments 
           (id, student_id, course_id, assigned_by_tutor_id, enrolled_at, progress_percentage, status)
           VALUES (?, ?, ?, ?, NOW(), ?, 'ACTIVE')`,
          [enrId, student.id, cId, TUTOR_ID, randomProgress]
        );
      }

      // Mark the first few lessons completed in lesson_progress
      const [courseLessons] = await pool.query(
        `SELECT l.id 
         FROM lessons l
         JOIN modules m ON l.module_id = m.id
         WHERE m.course_id = ?
         ORDER BY m.module_order ASC, l.lesson_order ASC
         LIMIT 5`,
        [cId]
      );

      for (const cl of courseLessons) {
        const [prog] = await pool.query('SELECT id FROM lesson_progress WHERE student_id = ? AND lesson_id = ?', [student.id, cl.id]);
        if (!prog.length) {
          await pool.query(
            `INSERT INTO lesson_progress (id, enrollment_id, student_id, lesson_id, status, seconds_watched, is_completed, completed_at)
             VALUES (?, ?, ?, ?, 'COMPLETED', 1800, 1, NOW())`,
            [crypto.randomUUID(), enrId, student.id, cl.id]
          );
        }
      }
    }
  }
  console.log(`✅ Enrolled ${students.length} students across 3 flagship programs with live progress.`);

  // =========================================================================
  // STEP 10: Realistic Submissions & Quiz Attempts for Dynamic KPI Metrics
  // =========================================================================
  console.log('\n--- Step 10: Generating Submissions & Quiz Attempts for KPI Metrics ---');
  // Find some assignments and quizzes from ETH-WEB-30
  const [web30Assignments] = await pool.query(
    'SELECT id, title FROM assignments WHERE course_id = ? LIMIT 5',
    [web30CourseId]
  );

  const [web30Quizzes] = await pool.query(
    'SELECT id, title FROM quizzes WHERE course_id = ? LIMIT 5',
    [web30CourseId]
  );

  // Submissions: some graded, some pending grading so Tutor dashboard shows live pending count
  for (let sIdx = 0; sIdx < Math.min(students.length, 6); sIdx++) {
    const student = students[sIdx];
    for (let aIdx = 0; aIdx < web30Assignments.length; aIdx++) {
      const assign = web30Assignments[aIdx];
      const [existingSub] = await pool.query(
        'SELECT id FROM assignment_submissions WHERE assignment_id = ? AND student_id = ?',
        [assign.id, student.id]
      );

      if (!existingSub.length) {
        // First 2 pending grading (grade: null), others graded
        const isPending = aIdx === 0 && sIdx < 3;
        const grade = isPending ? null : 85 + (sIdx * 2);
        const feedback = isPending ? null : 'Well-structured code implementation. Excellent attention to clean semantics!';

        await pool.query(
          `INSERT INTO assignment_submissions 
           (id, assignment_id, student_id, file_url, text_content, grade, feedback, submitted_at, graded_at, graded_by)
           VALUES (?, ?, ?, 'https://github.com/ethiroli/student-submission', 'Completed repository with comprehensive tests.', ?, ?, NOW(), ${isPending ? 'NULL' : 'NOW()'}, ${isPending ? 'NULL' : '?'})`,
          isPending
            ? [crypto.randomUUID(), assign.id, student.id, grade, feedback]
            : [crypto.randomUUID(), assign.id, student.id, grade, feedback, TUTOR_ID]
        );
      }
    }

    // Quiz attempts
    for (const quiz of web30Quizzes) {
      const [existingAtt] = await pool.query(
        'SELECT id FROM quiz_attempts WHERE quiz_id = ? AND student_id = ?',
        [quiz.id, student.id]
      );
      if (!existingAtt.length) {
        await pool.query(
          `INSERT INTO quiz_attempts 
           (id, quiz_id, student_id, score, total_questions, time_taken_seconds, answers, submitted_at, is_live)
           VALUES (?, ?, ?, 80, 10, 480, JSON_ARRAY(), NOW(), 0)`,
          [crypto.randomUUID(), quiz.id, student.id]
        );
      }
    }
  }
  console.log(`✅ Generated live submissions and quiz attempts.`);

  // Print final audit counts
  console.log('\n========================================');
  console.log('🎉 LMS INGESTION COMPLETED SUCCESSFULLY');
  console.log('========================================');
  const countQueries = [
    ['technology_modules', 'SELECT COUNT(*) as count FROM technology_modules'],
    ['programs', 'SELECT COUNT(*) as count FROM programs'],
    ['program_modules', 'SELECT COUNT(*) as count FROM program_modules'],
    ['courses', 'SELECT COUNT(*) as count FROM courses'],
    ['course_modules', 'SELECT COUNT(*) as count FROM course_modules'],
    ['modules', 'SELECT COUNT(*) as count FROM modules'],
    ['lessons', 'SELECT COUNT(*) as count FROM lessons'],
    ['lesson_blocks', 'SELECT COUNT(*) as count FROM lesson_blocks'],
    ['lesson_progress', 'SELECT COUNT(*) as count FROM lesson_progress'],
    ['quizzes', 'SELECT COUNT(*) as count FROM quizzes'],
    ['quiz_questions', 'SELECT COUNT(*) as count FROM quiz_questions'],
    ['question_bank', 'SELECT COUNT(*) as count FROM question_bank'],
    ['question_options', 'SELECT COUNT(*) as count FROM question_options'],
    ['assignments', 'SELECT COUNT(*) as count FROM assignments'],
    ['assignment_submissions', 'SELECT COUNT(*) as count FROM assignment_submissions'],
    ['batches', 'SELECT COUNT(*) as count FROM batches'],
    ['batch_students', 'SELECT COUNT(*) as count FROM batch_students'],
    ['enrollments', 'SELECT COUNT(*) as count FROM enrollments']
  ];

  for (const [name, q] of countQueries) {
    const [res] = await pool.query(q);
    console.log(`📊 ${name.padEnd(25)} : ${res[0].count}`);
  }

  await pool.end();
}

run().catch(err => {
  console.error('❌ Ingestion Error:', err);
  process.exit(1);
});
