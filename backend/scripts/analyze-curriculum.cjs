const m = require("mysql2/promise");
(async () => {
  const c = await m.createConnection({host: "localhost", user: "root", password: "Admin@123", database: "ethiroli"});
  
  // 1. Technology modules as separate courses
  console.log("=" .repeat(60));
  console.log("TECHNOLOGY MODULES AS SEPARATE COURSES");
  console.log("=" .repeat(60));
  const [tmods] = await c.query("SELECT id, code, title, category, level, duration_hours FROM technology_modules ORDER BY code");
  
  // Get topic counts per module
  const [topics] = await c.query("SELECT module_id, COUNT(*) as cnt FROM module_topics GROUP BY module_id");
  const topicMap = {};
  topics.forEach(t => topicMap[t.module_id] = t.cnt);
  
  // Get prerequisite info from the JSON data would need to read the file
  // For now, show basic info
  tmods.forEach(m => {
    const topicsCnt = topicMap[m.id] || 0;
    console.log(`\n${m.code}: ${m.title}`);
    console.log(`  Category: ${m.category}`);
    console.log(`  Level: ${m.level}`);
    console.log(`  Duration: ${m.duration_hours} hours`);
    console.log(`  Submodules/Topics: ${topicsCnt}`);
  });
  
  // 2. Day-wise course analysis for each program
  console.log("\n" + "=".repeat(60));
  console.log("DAY-WISE COURSE ANALYSIS BY PROGRAM");
  console.log("=".repeat(60));
  
  const [progs] = await c.query("SELECT * FROM programs ORDER BY code");
  
  // Get program_modules with module details
  const [pm] = await c.query("SELECT pm.program_id, pm.module_id, tm.code as module_code, tm.title as module_title, pm.module_order, pm.allocated_days, pm.is_core FROM program_modules pm JOIN technology_modules tm ON pm.module_id = tm.id ORDER BY pm.program_id, pm.module_order");
  
  // Get module order per program
  const programModules = {};
  pm.forEach(row => {
    if (!programModules[row.program_id]) programModules[row.program_id] = [];
    programModules[row.program_id].push({
      module_code: row.module_code,
      module_title: row.module_title,
      order: row.module_order,
      allocated_days: row.allocated_days,
      is_core: row.is_core
    });
  });
  
  progs.forEach(p => {
    console.log(`\n${p.code}: ${p.name} (${p.duration_days} days)`);
    console.log("  ".repeat(2) + "Phase breakdown:");
    const modules = programModules[p.code] || [];
    let currentDay = 1;
    modules.forEach((mod, i) => {
      const phase = Math.floor(mod.order / 7) + 1; // approximate phase
      console.log(`  ${mod.order}. ${mod.module_code}: ${mod.module_title.padEnd(30)} | ${mod.allocated_days} days (Day ~${currentDay}-${currentDay + mod.allocated_days - 1}) | Core: ${mod.is_core}`);
      currentDay += mod.allocated_days;
    });
  });
  
  // 3. Technology-based course grouping
  console.log("\n" + "=".repeat(60));
  console.log("TECHNOLOGY-BASED COURSE GROUPING");
  console.log("=".repeat(60));
  
  // Group modules by category
  const [tmods2] = await c.query("SELECT id, code, title, category FROM technology_modules ORDER BY category, code");
  const categories = {};
  tmods2.forEach(m => {
    if (!categories[m.category]) categories[m.category] = [];
    categories[m.category].push(m);
  });
  
  console.log("\nModules by Category:");
  Object.entries(categories).forEach(([category, mods]) => {
    console.log(`\n${category}:`);
    mods.forEach(m => {
      const topicsCnt = topicMap[m.id] || 0;
      console.log(`  ${m.code}: ${m.title} - ${topicsCnt} submodules`);
    });
  });
  
  // Technology families
  console.log("\nTechnology Families (from module_topics):");
  // Count distinct technologies mentioned in topic descriptions or just show module count
  const [distinctModulesByFamily] = await c.query("SELECT COUNT(*) as cnt, module_id FROM module_topics GROUP BY module_id HAVING cnt > 0");
  
  console.log("\n" + "=".repeat(60));
  console.log("SUMMARY");
  console.log("=".repeat(60));
  console.log(`Total Technology Modules: ${tmods.length}`);
  console.log(`Total Submodules/Topics: ${topicMap ? Object.values(topicMap).reduce((a,b) => a+b, 0) : 0}`);
  console.log(`Total Programs: ${progs.length}`);
  progs.forEach(p => console.log(`  - ${p.code}: ${p.duration_days}-day program`));
  
  await c.end();
})()