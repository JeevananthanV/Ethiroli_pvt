const fs = require('fs');

function q(type, question, options, correct, code, expected) {
  const base = { type, question };
  if (type === 'multiple_choice') {
    base.options = options;
    base.correct_answer = correct;
  } else if (type === 'true_false') {
    base.correct_answer = correct;
  } else if (type === 'code_output') {
    base.code = code;
    base.expected_output = expected;
  }
  return base;
}

function makeQuiz(topic) {
  return [
    q('multiple_choice', 'What is the primary purpose of ' + topic + ' in web development?', ['To style web pages','To add interactivity','To structure content','To manage data'], 2),
    q('true_false', topic + ' is only used in frontend development.', false),
    q('code_output', 'What is the output of a basic ' + topic + ' example?', null, null, '// Example code for ' + topic, 'Expected output'),
    q('multiple_choice', 'Which of the following is related to ' + topic + '?', ['Option A','Option B','Option C','Option D'], 0),
    q('true_false', 'Understanding ' + topic + ' is essential for modern web development.', true),
    q('multiple_choice', 'When should ' + topic + ' be used in a project?', ['Only at the beginning','Throughout the development process','Only at the end','Never'], 1),
    q('code_output', 'What does ' + topic + ' return when executed correctly?', null, null, topic + ' execution', 'Successful result'),
    q('multiple_choice', 'What is a key benefit of learning ' + topic + '?', ['It makes code faster','It improves developer productivity','It reduces file size','It eliminates bugs'], 1),
    q('true_false', topic + ' can be combined with other technologies.', true),
    q('multiple_choice', 'Which statement about ' + topic + ' is correct?', ['It is obsolete','It is widely used','It is only for beginners','It requires no practice'], 1)
  ];
}

function makeLesson(day, topic, moduleName) {
  const learningObjectives = [
    'Understand the basics of ' + topic,
    'Learn key concepts related to ' + topic,
    'Apply ' + topic + ' in practical exercises',
    'Explore best practices for ' + topic
  ];
  const contentBody = '## Learning Objectives\n' + learningObjectives.map(o => '- ' + o).join('\n') + '\n\n## Detailed Learning Content\n' + topic + ' is a fundamental concept in web development. In this session, we will cover the essential aspects of ' + topic + ', including its definition, purpose, and how it is used in building web applications. We will also look at examples and best practices.\n\n## Resources\n- MDN Web Docs: https://developer.mozilla.org/\n- W3Schools: https://www.w3schools.com/\n- Official Documentation: [Link to ' + topic + ' documentation]';

  const taskRequirements = [
    'Create a demonstration of ' + topic,
    'Implement at least three key features of ' + topic,
    'Test your implementation in a modern browser',
    'Document your code with comments'
  ];
  const assignmentRequirements = [
    'Build a project that utilizes ' + topic,
    'Follow best practices for ' + topic,
    'Ensure the project is responsive and accessible',
    'Deploy the project to a hosting service (if applicable)'
  ];

  return {
    title: 'Day ' + day + ' — ' + topic,
    content: contentBody,
    video_url: null,
    lesson_order: day,
    blocks: [
      { block_type: 'MARKDOWN', block_order: 1, content_payload: { body: contentBody }, is_interactive: false },
      { block_type: 'QUIZ', block_order: 2, content_payload: { title: 'Day ' + day + ' Quiz: ' + topic, questions: makeQuiz(topic), pass_mark: 70 }, is_interactive: true },
      { block_type: 'TASK', block_order: 3, content_payload: { title: 'Practical Task: ' + topic, description: 'Apply the concepts learned in ' + topic + ' to complete a practical exercise.', requirements: taskRequirements }, is_interactive: true },
      { block_type: 'ASSIGNMENT', block_order: 4, content_payload: { title: 'Assignment: ' + topic, description: 'Complete an assignment that demonstrates your understanding of ' + topic + '.', requirements: assignmentRequirements, submission_type: ['github', 'deployment'] }, is_interactive: true },
      { block_type: 'WORK_LOG', block_order: 5, content_payload: { questions: ['What did you learn?', 'What did you implement?', 'Problems faced?', 'How solved?', 'Hours worked?'] }, is_interactive: true }
    ]
  };
}

function makeModule(title, moduleOrder, days) {
  return {
    title,
    module_order: moduleOrder,
    lessons: days.map(d => makeLesson(d.day, d.topic, title))
  };
}

const course = {
  code: 'ETH-WEB-30',
  name: '30-Day Web Development Internship',
  duration_days: 30,
  level: 'Beginner',
  description: 'A comprehensive 30-day web development internship program covering HTML, CSS, JavaScript, React, Node.js, Express, MySQL, and a final project.',
  final_project: 'Employee Task Management System'
};

const modules = [
  makeModule('Phase 1 — Web Foundation', 1, [
    {day:1, topic:'Web Fundamentals'},
    {day:2, topic:'HTML Introduction'},
    {day:3, topic:'Semantic HTML'}
  ]),
  makeModule('Phase 1 — Web Foundation', 2, [
    {day:4, topic:'CSS Basics'},
    {day:5, topic:'Box Model & Typography'},
    {day:6, topic:'Flexbox & Grid'},
    {day:7, topic:'Responsive Design + Git/GitHub'}
  ]),
  makeModule('Phase 2 — JavaScript', 3, [
    {day:8, topic:'Variables & Data Types'},
    {day:9, topic:'Conditions & Operators'},
    {day:10, topic:'Loops'},
    {day:11, topic:'Functions'},
    {day:12, topic:'Arrays'},
    {day:13, topic:'Objects'},
    {day:14, topic:'Async JavaScript'}
  ]),
  makeModule('Phase 3 — React', 4, [
    {day:15, topic:'React Introduction'},
    {day:16, topic:'JSX + Components'},
    {day:17, topic:'Props + State'},
    {day:18, topic:'Events + Forms'},
    {day:19, topic:'Hooks'},
    {day:20, topic:'React Router'},
    {day:21, topic:'API Integration'}
  ]),
  makeModule('Phase 4 — Backend Basics', 5, [
    {day:22, topic:'Node.js'},
    {day:23, topic:'Express.js'},
    {day:24, topic:'REST API'},
    {day:25, topic:'MySQL'},
    {day:26, topic:'Frontend + Backend Integration'}
  ]),
  makeModule('Phase 5 — FINAL PROJECT', 6, [
    {day:27, topic:'Requirements + Database'},
    {day:28, topic:'Development'},
    {day:29, topic:'Testing + Deployment'},
    {day:30, topic:'Presentation + Evaluation'}
  ])
];

const output = { course, modules };
fs.writeFileSync('J:\\eithiroli\\ethiroli_react\\data\\courses\\eth-web-30.json', JSON.stringify(output, null, 2));
console.log('JSON file generated successfully.');
