#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

/**
 * Expands curriculum by creating submodules for each module based on topics
 * Skips FINAL module
 */

const MODULE_REGISTRY_PATH = path.resolve('data/modules/module-registry.json');
const MODULES_BASE_PATH = path.resolve('data/modules');

/**
 * Generates submodule ID from module code and group index
 */
function generateSubmoduleId(moduleCode, groupIndex) {
  return `${moduleCode}-SUB${String(groupIndex + 1).padStart(2, '0')}`;
}

/**
 * Splits topics into 2-3 groups
 */
function splitTopicsIntoGroups(topics) {
  const topicCount = topics.length;
  
  if (topicCount <= 4) {
    return [topics]; // Single group for very small topic counts
  } else if (topicCount <= 8) {
    // Split into 2 groups
    const mid = Math.ceil(topicCount / 2);
    return [
      topics.slice(0, mid),
      topics.slice(mid)
    ];
  } else {
    // Split into 3 groups
    const third = Math.ceil(topicCount / 3);
    return [
      topics.slice(0, third),
      topics.slice(third, 2 * third),
      topics.slice(2 * third)
    ];
  }
}

/**
 * Generates module.json for a submodule
 */
function generateSubmoduleMetadata(moduleInfo, submoduleId, groupIndex, topicGroup) {
  return {
    code: submoduleId,
    title: `${moduleInfo.title} - Part ${groupIndex + 1}`,
    category: moduleInfo.category,
    level: moduleInfo.level,
    duration_hours: Math.max(4, Math.round(moduleInfo.duration_hours / 3)), // Distribute hours
    description: `${moduleInfo.description} This submodule covers: ${topicGroup.join(', ')}.`,
    topics: topicGroup,
    technologies: moduleInfo.technologies,
    practicals: [],
    projects: [],
    prerequisites: [...moduleInfo.prerequisites],
    learning_outcomes: moduleInfo.learning_outcomes.slice(0, 3) // First 3 outcomes
  };
}

/**
 * Generates a lesson JSON file
 */
function generateLesson(moduleCode, submoduleId, lessonNumber, topicGroup) {
  const topicIndex = (lessonNumber - 1) % topicGroup.length;
  const topic = topicGroup[topicIndex];
  
  return {
    id: `${submoduleId}-L${String(lessonNumber).padStart(2, '0')}`,
    day: 1 + (lessonNumber - 1) * 2, // Spread across days
    module_code: moduleCode,
    lesson_order: lessonNumber,
    title: `${topic}: Practical Implementation`,
    duration_minutes: 60,
    objectives: [
      `Understand core concepts of ${topic}`,
      `Apply ${topic} in practical scenarios`,
      `Build a small project using ${topic}`
    ],
    theory_markdown: `# ${topic}\n\n## Overview\nThis lesson covers the fundamentals of ${topic} and its practical applications.\n\n## Key Concepts\n- Concept 1 related to ${topic}\n- Concept 2 related to ${topic}\n- Best practices for ${topic}\n\n## Learning Objectives\nBy the end of this lesson, you will be able to:\n1. Explain the core principles of ${topic}\n2. Implement basic ${topic} functionality\n3. Apply ${topic} to solve simple problems`,
    code_walkthrough: {
      language: 'javascript',
      code: `// Example ${topic} implementation\nconsole.log('Learning ${topic}');\n\n// Basic ${topic} example\nconst example = {\n  topic: '${topic}',\n  learned: true\n};\n\nconsole.log(example);`,
      explanation: `This example demonstrates basic ${topic} usage.`
    },
    ai_tool_spotlight: {
      description: `Use AI assistants to help understand ${topic} concepts and generate code examples.\n\n---`
    }
  };
}

/**
 * Generates a quiz JSON file with 5 questions
 */
function generateQuiz(moduleCode, submoduleId, quizNumber, topicGroup) {
  return {
    id: `${submoduleId}-Q${String(quizNumber).padStart(2, '0')}`,
    module_code: moduleCode,
    day: 1 + (quizNumber - 1) * 2,
    title: `Quiz ${quizNumber}: ${topicGroup[0]} Fundamentals`,
    time_limit_minutes: 15,
    passing_percentage: 70,
    questions: Array.from({ length: 5 }, (_, i) => {
      const topic = topicGroup[i % topicGroup.length];
      return {
        id: i + 1,
        question: `What is a key concept in ${topic}?`,
        options: [
          `Core principle of ${topic}`,
          `Advanced ${topic} technique`,
          `Alternative approach to ${topic}`,
          `Unrelated concept`
        ],
        correct_index: 0,
        explanation: `This tests understanding of fundamental ${topic} concepts.`
      };
    })
  };
}

/**
 * Generates an exercise JSON file with subtasks array
 */
function generateExercise(moduleCode, submoduleId, exerciseNumber, topicGroup) {
  const topic = topicGroup[(exerciseNumber - 1) % topicGroup.length];
  
  return {
    id: `${submoduleId}-E${String(exerciseNumber).padStart(2, '0')}`,
    module_code: moduleCode,
    day: 2 + (exerciseNumber - 1) * 2,
    title: `Hands-on Lab: ${topic} Application`,
    estimated_minutes: 45,
    difficulty: 'Intermediate',
    instructions: `Complete the following exercises to practice ${topic}:`,
    subtasks: [
      {
        id: 1,
        description: `Explain the core concepts of ${topic} in your own words`,
        estimated_minutes: 10
      },
      {
        id: 2,
        description: `Create a simple implementation demonstrating ${topic} basics`,
        estimated_minutes: 15
      },
      {
        id: 3,
        description: `Enhance your implementation with additional features`,
        estimated_minutes: 15
      },
      {
        id: 4,
        description: `Test your implementation and document any issues`,
        estimated_minutes: 5
      }
    ],
    starter_code: `// Starter code for ${topic} exercise\n// TODO: Implement ${topic} functionality here\n\nconsole.log('${topic} exercise starter');\n`,
    solution_code: `// Solution for ${topic} exercise\nconsole.log('Completed ${topic} exercise');\n\n// Basic implementation\nconst ${topic.toLowerCase().replace(/\s+/g, '')} = {\n  name: '${topic}',\n  completed: true\n};\n\nconsole.log(${topic.toLowerCase().replace(/\s+/g, '')});`
  };
}

/**
 * Generates a cheat-sheet markdown file
 */
function generateCheatSheet(moduleCode, submoduleId, topicGroup) {
  return `# ${moduleCode} - ${submoduleId} Cheat Sheet

## Overview
This cheat sheet covers key concepts from ${topicGroup.join(', ')}.

## Key Concepts
${topicGroup.map(topic => `- **${topic}**: Essential principles and applications`).join('\n')}

## Common Patterns
- Pattern 1: Basic implementation approach
- Pattern 2: Best practices for ${topicGroup[0]}
- Pattern 3: Common pitfalls to avoid

## Quick Reference
| Concept | Description | Example |
|---------|-------------|---------|
| Core Concept | Fundamental principle | Basic usage |
| Advanced Technique | Enhanced functionality | Complex implementation |
| Best Practice | Recommended approach | Industry standard |

## Resources
- Official documentation
- Tutorial links
- Practice exercises

---
*Generated for ${submoduleId}*
`;
}

/**
 * Ensures directory exists
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✓ Created directory: ${dirPath}`);
  }
}

/**
 * Writes JSON file with pretty formatting
 */
function writeJsonFile(filePath, data) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`✓ Created: ${filePath}`);
}

/**
 * Writes markdown file
 */
function writeMarkdownFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
  console.log(`✓ Created: ${filePath}`);
}

/**
 * Main function
 */
async function main() {
  console.log('🔄 Reading module registry...');
  
  if (!fs.existsSync(MODULE_REGISTRY_PATH)) {
    console.error(`❌ Module registry not found at ${MODULE_REGISTRY_PATH}`);
    process.exit(1);
  }
  
  const moduleRegistry = JSON.parse(fs.readFileSync(MODULE_REGISTRY_PATH, 'utf8'));
  const moduleCodes = Object.keys(moduleRegistry).filter(code => code !== 'FINAL');
  
  console.log(`📚 Found ${moduleCodes.length} modules to process (skipping FINAL)\n`);
  
  let totalSubmodules = 0;
  
  for (const moduleCode of moduleCodes) {
    const moduleInfo = moduleRegistry[moduleCode];
    console.log(`📖 Processing module: ${moduleInfo.title} (${moduleCode})`);
    
    const topics = moduleInfo.topics;
    if (!topics || topics.length === 0) {
      console.log(`  ⚠️  No topics found for ${moduleCode}, skipping`);
      continue;
    }
    
    const topicGroups = splitTopicsIntoGroups(topics);
    console.log(`  🔀 Split ${topics.length} topics into ${topicGroups.length} group(s)`);
    
    const modulePath = path.join(MODULES_BASE_PATH, moduleCode);
    const submodulesPath = path.join(modulePath, 'submodules');
    ensureDir(submodulesPath);
    
    for (let groupIndex = 0; groupIndex < topicGroups.length; groupIndex++) {
      const topicGroup = topicGroups[groupIndex];
      const submoduleId = generateSubmoduleId(moduleCode, groupIndex);
      const submodulePath = path.join(submodulesPath, submoduleId);
      
      console.log(`  📦 Creating submodule: ${submoduleId}`);
      
      // Create submodule directory structure
      ensureDir(path.join(submodulePath, 'lessons'));
      ensureDir(path.join(submodulePath, 'quizzes'));
      ensureDir(path.join(submodulePath, 'exercises'));
      ensureDir(path.join(submodulePath, 'resources'));
      
      // Generate and write module.json
      const moduleJson = generateSubmoduleMetadata(moduleInfo, submoduleId, groupIndex, topicGroup);
      writeJsonFile(path.join(submodulePath, 'module.json'), moduleJson);
      
      // Generate and write 4 lessons
      for (let lessonNum = 1; lessonNum <= 4; lessonNum++) {
        const lesson = generateLesson(moduleCode, submoduleId, lessonNum, topicGroup);
        writeJsonFile(path.join(submodulePath, 'lessons', `lesson-${String(lessonNum).padStart(2, '0')}.json`), lesson);
      }
      
      // Generate and write 4 quizzes
      for (let quizNum = 1; quizNum <= 4; quizNum++) {
        const quiz = generateQuiz(moduleCode, submoduleId, quizNum, topicGroup);
        writeJsonFile(path.join(submodulePath, 'quizzes', `quiz-${String(quizNum).padStart(2, '0')}.json`), quiz);
      }
      
      // Generate and write 4 exercises
      for (let exerciseNum = 1; exerciseNum <= 4; exerciseNum++) {
        const exercise = generateExercise(moduleCode, submoduleId, exerciseNum, topicGroup);
        writeJsonFile(path.join(submodulePath, 'exercises', `exercise-${String(exerciseNum).padStart(2, '0')}.json`), exercise);
      }
      
      // Generate and write cheat-sheet.md
      const cheatSheet = generateCheatSheet(moduleCode, submoduleId, topicGroup);
      writeMarkdownFile(path.join(submodulePath, 'resources', 'cheat-sheet.md'), cheatSheet);
      
      totalSubmodules++;
    }
    
    console.log(`  ✅ Completed ${moduleCode}\n`);
  }
  
  console.log(`🎉 Successfully created ${totalSubmodules} submodules across ${moduleCodes.length} modules!`);
}

// Run the script
main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
