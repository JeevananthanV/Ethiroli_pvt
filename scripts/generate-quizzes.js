const fs = require('fs');
const path = require('path');

const registry = JSON.parse(fs.readFileSync('data/modules/module-registry.json', 'utf8'));

function generateQuiz(moduleCode, moduleData) {
  const topics = moduleData.topics;
  const outcomes = moduleData.learning_outcomes;
  const techs = moduleData.technologies;
  
  const questions = [];
  let qId = 1;

  // Topic-based questions (1-6)
  const topicQuestions = topics.slice(0, 6).map(topic => {
    const question = {
      id: qId++,
      question: `Which of the following best describes ${topic.toLowerCase()} in ${moduleData.title}?`,
      options: [
        `Core concept: ${topic} is fundamental to ${moduleData.title}`,
        `Alternative approach to ${topic} using different methodology`,
        `Advanced implementation of ${topic} with optimizations`,
        `Legacy technique for ${topic} no longer recommended`
      ],
      correct_index: 0,
      explanation: `${topic} is a key topic in ${moduleData.title}. ${outcomes[0] || 'This concept is essential for mastering this module.'}`
    };
    return question;
  });
  questions.push(...topicQuestions);

  // Technology-based questions (7-8)
  if (techs.length > 0) {
    questions.push({
      id: qId++,
      question: `Which technology is primarily used in ${moduleData.title}?`,
      options: [
        techs[0],
        techs.length > 1 ? techs[1] : 'Java',
        'Python (unrelated)',
        'C++ (unrelated)'
      ],
      correct_index: 0,
      explanation: `${moduleData.title} uses ${techs.join(', ')} as its primary technology stack.`
    });
  }

  // Learning outcome-based question (9)
  if (outcomes.length > 0) {
    questions.push({
      id: qId++,
      question: `What is a key learning outcome of ${moduleData.title}?`,
      options: [
        outcomes[0],
        'Unrelated outcome about mobile development',
        'Unrelated outcome about data science',
        'Unrelated outcome about game development'
      ],
      correct_index: 0,
      explanation: outcomes[0]
    });
  }

  // Practical application question (10)
  questions.push({
    id: qId++,
    question: `When applying ${moduleData.title} in a real project, what is a best practice?`,
    options: [
      'Follow established patterns and use the recommended tools for this module',
      'Use whatever approach works without considering standards',
      'Avoid using any of the module\'s core technologies',
      'Skip testing and validation to save time'
    ],
    correct_index: 0,
    explanation: `Best practices for ${moduleData.title} include following established patterns, using recommended tools (${techs.join(', ')}), and thorough testing.`
  });

  // Ensure exactly 10 questions
  return questions.slice(0, 10);
}

function writeQuiz(moduleCode, moduleData) {
  const quizDir = `data/modules/${moduleCode}/quizzes`;
  if (!fs.existsSync(quizDir)) {
    fs.mkdirSync(quizDir, { recursive: true });
  }

  const quiz = {
    id: `QZ-${moduleCode}-COMPREHENSIVE`,
    module_code: moduleCode,
    title: `Comprehensive Quiz: ${moduleData.title}`,
    time_limit_minutes: 25,
    passing_percentage: 70,
    questions: generateQuiz(moduleCode, moduleData)
  };

  const filePath = `${quizDir}/quiz-comprehensive.json`;
  fs.writeFileSync(filePath, JSON.stringify(quiz, null, 2));
  console.log(`Created: ${filePath}`);
}

Object.entries(registry).forEach(([code, data]) => {
  writeQuiz(code, data);
});

console.log('\nAll quizzes generated successfully!');