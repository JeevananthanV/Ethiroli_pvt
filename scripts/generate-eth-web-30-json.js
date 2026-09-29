import fs from 'fs';

const mdPath = 'J:/eithiroli/ethiroli_react/docs/ETH-WEB-30.md';
const outPath = 'J:/eithiroli/ethiroli_react/data/courses/eth-web-30.json';

const md = fs.readFileSync(mdPath, 'utf-8');
const lines = md.split(/\r?\n/);

const DELIVERABLE_REGEX = /^\*\*Deliverable:\*\*\s*(.+)/;
const BONUS_REGEX = /^\*\*Bonus:\*\*\s*(.+)/;
const NUMBERED_REGEX = /^(\d+)\.\s+(.+)/;

function parseQuiz(startIdx) {
  const questions = [];
  let i = startIdx + 1;
  while (i < lines.length && !lines[i].includes('| #')) i++;
  if (i >= lines.length) return questions;
  i++;
  if (i < lines.length && /^\|[\s\-|]+\|/.test(lines[i])) i++;
  while (i < lines.length && lines[i].trim().startsWith('|')) {
    const parts = lines[i].trim().split('|').map(p => p.trim()).filter(p => p);
    if (parts.length >= 4) {
      const qText = parts[1];
      const optsStr = parts[2];
      const ansLetter = parts[3].replace(/\*\*/g, '').trim();
      const optRegex = /([A-D])\)\s*(.+?)(?=\s+[A-D]\)|$)/g;
      const options = [];
      let m;
      while ((m = optRegex.exec(optsStr)) !== null) options.push(m[2].trim());
      const am = { A: 0, B: 1, C: 2, D: 3 };
      const ci = am[ansLetter] || 0;
      if (options.length > 0) {
        questions.push({ type: 'multiple_choice', question: qText, options, correct_answer: ci });
      }
    }
    i++;
  }
  return questions;
}

function parseTask(startIdx) {
  const requirements = [];
  let description = '';
  let i = startIdx + 1;
  const maxLines = 2000;
  while (i < lines.length && (i - startIdx) < maxLines) {
    const line = lines[i].trim();
    if (line === '---' || line.startsWith('###')) break;
    if (line) {
      const dm = line.match(DELIVERABLE_REGEX);
      if (dm) { description = dm[1]; i++; continue; }
      
      const bm = line.match(BONUS_REGEX);
      if (bm) { requirements.push('Bonus: ' + bm[1]); i++; continue; }
      
      const nm = line.match(NUMBERED_REGEX);
      if (nm) { requirements.push(nm[2].trim()); i++; continue; }
      
      if (line.startsWith('**File ') && line.includes(':**')) {
        const parts = line.split(':**');
        if (parts.length === 2) {
          const prefix = parts[0].substring(3);
          const content = parts[1].trim();
          requirements.push(`${prefix}: ${content}`);
          i++;
          continue;
        }
      }
      
      if (line.startsWith('- ') || line.startsWith('* ')) {
        requirements.push(line.substring(2).trim());
        i++;
        continue;
      }
      
      if (line.length > 10) {
        requirements.push(line);
        i++;
        continue;
      }
    }
    i++;
  }
  
  if (!description && requirements.length > 0) {
    description = requirements.shift();
  }
  
  if (!description) {
    description = 'Complete the practical task';
  }
  
  const seen = new Set();
  const uniqueReqs = requirements.filter(req => {
    if (seen.has(req)) return false;
    seen.add(req);
    return true;
  });
  
  return { description, requirements: uniqueReqs };
}

const daySections = [];
let cur = null;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  const dm = line.match(/^# DAY (\d+) \u2014 (.+)/);
  if (dm) {
    if (cur) {
      cur.contentEnd = cur.taskStart > 0 ? cur.taskStart : (cur.quizStart > 0 ? cur.quizStart : lines.length);
    }
    cur = { day: +dm[1], title: dm[2].trim(), objectivesStart: 0, taskStart: 0, quizStart: 0 };
    daySections.push(cur);
  } else if (cur) {
    if (/^### (Learning Objectives|Objective)$/.test(line)) cur.objectivesStart = i;
    if (/^### 🧪 DAY \d+ TASK/.test(line)) cur.taskStart = i;
    if (/^### \u2753 DAY \d+ QUIZ/.test(line)) cur.quizStart = i;
  }
}
if (cur) cur.contentEnd = cur.taskStart > 0 ? cur.taskStart : (cur.quizStart > 0 ? cur.quizStart : lines.length);

const dayMap = {};
daySections.forEach(d => dayMap[d.day] = d);

const moduleGroups = [
  { title: 'Phase 1 — Web Foundation', days: [1,2,3,4,5,6,7] },
  { title: 'Phase 2 — JavaScript', days: [8,9,10,11,12,13,14] },
  { title: 'Phase 3 — React', days: [15,16,17,18,19,20,21] },
  { title: 'Phase 4 — Backend Basics', days: [22,23,24,25,26,27] },
  { title: 'Phase 5 — Final Project', days: [28,29,30] }
];

const result = {
  course: {
    code: 'ETH-WEB-30',
    name: '30-Day Web Development Internship',
    duration_days: 30,
    level: 'Beginner',
    description: 'A comprehensive 30-day web development internship program covering HTML, CSS, JavaScript, React, Node.js, Express, MySQL, and a final project.',
    final_project: 'Employee Task Management System'
  },
  modules: []
};

let tl = 0, tq = 0, tk = 0;

moduleGroups.forEach((group, gi) => {
  const mod = { title: group.title, module_order: gi + 1, lessons: [] };
  group.days.forEach((dayNum, di) => {
    const d = dayMap[dayNum];
    if (!d) return;
    const cStart = d.objectivesStart > 0 ? d.objectivesStart : d.taskStart;
    const cEnd = d.taskStart > 0 ? d.taskStart : (d.quizStart > 0 ? d.quizStart : d.contentEnd);
    let contentBody = '';
    if (cStart > 0 && cEnd > cStart) {
      contentBody = lines.slice(cStart, cEnd).join('\n').trim();
    }
    const blocks = [];
    if (contentBody) {
      blocks.push({ block_type: 'MARKDOWN', block_order: 1, content_payload: { body: contentBody }, is_interactive: false });
    }
    if (d.quizStart > 0) {
      const qs = parseQuiz(d.quizStart);
      if (qs.length > 0) {
        blocks.push({ block_type: 'QUIZ', block_order: blocks.length + 1, content_payload: { title: `Day ${dayNum} Quiz`, questions: qs, pass_mark: 70 }, is_interactive: true });
        tq++;
      }
    }
    if (d.taskStart > 0) {
      const { description, requirements } = parseTask(d.taskStart);
      if (requirements.length > 0) {
        blocks.push({ block_type: 'TASK', block_order: blocks.length + 1, content_payload: { title: `Day ${dayNum} Practical Task`, description, requirements }, is_interactive: true });
        tk++;
      }
    }
    mod.lessons.push({
      title: `Day ${dayNum} — ${d.title}`,
      content: contentBody,
      video_url: null,
      lesson_order: di + 1,
      blocks
    });
    tl++;
  });
  result.modules.push(mod);
});

console.log(`Modules: ${result.modules.length}, Lessons: ${tl}, Quizzes: ${tq}, Tasks: ${tk}`);
fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
console.log('Written to ' + outPath);

