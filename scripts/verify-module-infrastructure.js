import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

const checks = [
  {
    name: 'Module registry exists and is valid JSON',
    path: path.join(ROOT_DIR, 'data', 'modules', 'module-registry.json'),
    type: 'json',
  },
  {
    name: 'Course registry exists and is valid JSON',
    path: path.join(ROOT_DIR, 'data', 'courses', 'course-registry.json'),
    type: 'json',
  },
  {
    name: 'Program registry exists and is valid JSON',
    path: path.join(ROOT_DIR, 'data', 'programs', 'program-registry.json'),
    type: 'json',
  },
  {
    name: 'Module-based curriculum migration exists',
    path: path.join(ROOT_DIR, 'backend', 'migrations', '001_module_based_curriculum.sql'),
    type: 'file',
  },
  {
    name: 'TechnologyModule model exists',
    path: path.join(ROOT_DIR, 'backend', 'src', 'models', 'technology', 'TechnologyModule.js'),
    type: 'file',
  },
  {
    name: 'CourseModule model exists',
    path: path.join(ROOT_DIR, 'backend', 'src', 'models', 'technology', 'CourseModule.js'),
    type: 'file',
  },
  {
    name: 'Program model exists',
    path: path.join(ROOT_DIR, 'backend', 'src', 'models', 'technology', 'Program.js'),
    type: 'file',
  },
  {
    name: 'ProgramModule model exists',
    path: path.join(ROOT_DIR, 'backend', 'src', 'models', 'technology', 'ProgramModule.js'),
    type: 'file',
  },
  {
    name: 'Technology controller exists',
    path: path.join(ROOT_DIR, 'backend', 'src', 'controllers', 'technologyController.js'),
    type: 'file',
  },
  {
    name: 'Curriculum controller exists',
    path: path.join(ROOT_DIR, 'backend', 'src', 'controllers', 'curriculumController.js'),
    type: 'file',
  },
  {
    name: 'Technology routes exist',
    path: path.join(ROOT_DIR, 'backend', 'src', 'routes', 'technologyRoutes.js'),
    type: 'file',
  },
  {
    name: 'Curriculum routes exist',
    path: path.join(ROOT_DIR, 'backend', 'src', 'routes', 'curriculumRoutes.js'),
    type: 'file',
  },
  {
    name: 'Routes are properly imported in routes/index.js',
    path: path.join(ROOT_DIR, 'backend', 'src', 'routes', 'index.js'),
    type: 'routes',
  },
];

const PASS = '\u2713';
const FAIL = '\u2717';

let passed = 0;
let failed = 0;

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function checkJson(filePath) {
  if (!fileExists(filePath)) {
    return { ok: false, detail: 'file does not exist' };
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    JSON.parse(content);
    return { ok: true, detail: '' };
  } catch (error) {
    return { ok: false, detail: `invalid JSON: ${error.message}` };
  }
}

function checkRoutes(filePath) {
  if (!fileExists(filePath)) {
    return { ok: false, detail: 'routes/index.js does not exist' };
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const requiredImports = [
    { name: 'technologyRoutes', pattern: /technologyRoutes/ },
    { name: 'curriculumRoutes', pattern: /curriculumRoutes/ },
  ];

  const missing = requiredImports
    .filter(({ pattern }) => !pattern.test(content))
    .map(({ name }) => name);

  if (missing.length > 0) {
    return {
      ok: false,
      detail: `missing import(s): ${missing.join(', ')}`,
    };
  }

  return { ok: true, detail: '' };
}

console.log('Verifying module-based curriculum infrastructure...\n');

for (const check of checks) {
  let result;

  if (check.type === 'json') {
    result = checkJson(check.path);
  } else if (check.type === 'routes') {
    result = checkRoutes(check.path);
  } else {
    result = fileExists(check.path)
      ? { ok: true, detail: '' }
      : { ok: false, detail: 'file does not exist' };
  }

  if (result.ok) {
    passed++;
    console.log(`${PASS} ${check.name}`);
  } else {
    failed++;
    console.log(`${FAIL} ${check.name} - ${result.detail}`);
  }
}

console.log('\n----------------------------------------');
console.log(`Summary: ${passed} passed, ${failed} failed, ${checks.length} total`);

if (failed > 0) {
  console.log('Verification FAILED');
  process.exitCode = 1;
} else {
  console.log('Verification PASSED');
}
