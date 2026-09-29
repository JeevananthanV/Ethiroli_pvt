#!/usr/bin/env node
/**
 * Migration script: Adds phase-based curriculum structure to existing program files
 * while preserving backward compatibility with the day-by-day format.
 */

import fs from 'fs';
import path from 'path';

const PROJECT_ROOT = path.resolve('.');
const PROGRAMS_DIR = path.join(PROJECT_ROOT, 'data/programs');
const CURRICULUM_PROGRAMS_DIR = path.join(PROJECT_ROOT, 'data/curriculum/programs');

const PROGRAM_FILES = ['eth-web-30.json', 'eth-fs-45.json', 'eth-aifs-60.json'];

function migrateProgram(programFile) {
  const sourcePath = path.join(PROGRAMS_DIR, programFile);
  const destPath = path.join(CURRICULUM_PROGRAMS_DIR, programFile);
  
  if (!fs.existsSync(sourcePath)) {
    console.log(`  ⚠️  Source not found: ${sourcePath}`);
    return false;
  }
  
  const programData = JSON.parse(fs.readFileSync(sourcePath, 'utf-8'));
  
  // If already has phases, skip
  if (programData.phases) {
    console.log(`  ✓ ${programFile} already has phases`);
    return true;
  }
  
  // Build phases from day data
  const days = programData.days || [];
  if (days.length === 0) {
    console.log(`  ⚠️  No days found in ${programFile}`);
    return false;
  }
  
  // Group days by module
  const moduleGroups = {};
  days.forEach(day => {
    const moduleCode = day.module;
    if (!moduleGroups[moduleCode]) {
      moduleGroups[moduleCode] = [];
    }
    moduleGroups[moduleCode].push(day);
  });
  
  // Build phase structure (simple: one phase per module)
  const phases = [];
  let phaseOrder = 1;
  
  // Special handling: group related modules into logical phases
  const phaseMap = {
    'PROG-FUND': 1,
    'WEB-HTML': 1,
    'WEB-CSS': 1,
    'DEV-GIT': 1,
    'JS-CORE': 2,
    'FE-REACT': 2,
    'FE-TS': 2,
    'FE-NEXT': 2,
    'BE-NODE': 3,
    'BE-EXPRESS': 3,
    'BE-REST': 3,
    'DB-MYSQL': 3,
    'DB-MONGO': 3,
    'SEC-AUTH': 4,
    'FS-INTEGRATION': 4,
    'API-PAYMENT': 5,
    'API-COMM': 5,
    'AUTO-N8N': 5,
    'AI-DEV': 6,
    'AI-GENAPP': 6,
    'PY-CORE': 6,
    'DATA-ANALYTICS': 6,
    'ML-CORE': 6,
    'ML-DL': 6,
    'QA-TEST': 7,
    'DEVOPS-CORE': 7,
    'CLOUD-AWS': 7,
    'SEC-WEB': 7,
    'FINAL': 99
  };
  
  const phaseTitles = {
    1: 'Web Foundation',
    2: 'JavaScript, TypeScript & Frontend Framework',
    3: 'Backend & Databases',
    4: 'Security, Integration & Automation',
    5: 'APIs & Automation',
    6: 'AI & Machine Learning',
    7: 'Testing, DevOps & Cloud',
    99: 'Capstone Project & Portfolio'
  };
  
  // Create phase entries
  const phaseModules = {};
  days.forEach(day => {
    const phaseNum = phaseMap[day.module] || 1;
    if (!phaseModules[phaseNum]) {
      phaseModules[phaseNum] = {
        phase_order: phaseNum,
        title: phaseTitles[phaseNum] || `Phase ${phaseNum}`,
        modules: []
      };
    }
  });
  
  // Add module info to phases
  Object.keys(moduleGroups).forEach(moduleCode => {
    const phaseNum = phaseMap[moduleCode] || 1;
    if (phaseModules[phaseNum]) {
      phaseModules[phaseNum].modules.push(moduleCode);
    }
  });
  
  // Convert to array and sort
  const sortedPhases = Object.values(phaseModules).sort((a, b) => a.phase_order - b.phase_order);
  
  // Add description to each phase
  sortedPhases.forEach(phase => {
    phase.description = `${phase.title} phase covering core technologies and concepts.`;
  });
  
  // Create the new program structure
  const newProgram = {
    ...programData,
    phases: sortedPhases,
    module_sequence: days.map(day => ({
      module: day.module,
      days: day.duration || 1,
      order: day.day
    })),
    architecture: {
      hierarchy: "CAREER PROGRAM → PHASE → MODULE → TOPICS → LESSONS → QUIZ → PRACTICAL TASK → ASSIGNMENT → PROJECT",
      modules_are_reusable: true,
      programs_are_curriculum_paths: true
    }
  };
  
  // Write to curriculum directory
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, JSON.stringify(newProgram, null, 2));
  console.log(`  ✓ Migrated ${programFile} to ${destPath}`);
  return true;
}

function main() {
  console.log('🔄 Migrating program files to phase-based curriculum structure...\n');
  
  // Ensure curriculum programs directory exists
  fs.mkdirSync(CURRICULUM_PROGRAMS_DIR, { recursive: true });
  
  let successCount = 0;
  PROGRAM_FILES.forEach(file => {
    if (migrateProgram(file)) {
      successCount++;
    }
  });
  
  console.log(`\n🎉 Successfully migrated ${successCount}/${PROGRAM_FILES.length} program files`);
}

main().catch(error => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});