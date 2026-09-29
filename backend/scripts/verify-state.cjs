const m = require("mysql2/promise");
(async () => {
  const c = await m.createConnection({host: "localhost", user: "root", password: "Admin@123", database: "ethiroli"});
  
  // Check module_topics
  const [tmCount] = await c.query("SELECT COUNT(*) as cnt FROM module_topics");
  console.log("module_topics:", tmCount[0].cnt, "rows");
  
  // Check by module
  const [byModule] = await c.query("SELECT module_id, COUNT(*) as cnt FROM module_topics GROUP BY module_id ORDER BY cnt DESC");
  console.log("Module distribution:");
  byModule.forEach(row => {
    const prefix = row.module_id.slice(0, 8);
    console.log(" -", prefix, "|", row.cnt, "topics");
  });
  
  // Check programs
  const [progs] = await c.query("SELECT * FROM programs ORDER BY code");
  console.log("\nPrograms:");
  progs.forEach(p => console.log(" -", p.code, "|", p.name, "|", p.duration_days, "days"));
  
  // Check program_modules
  const [pm] = await c.query("SELECT program_id, COUNT(*) as cnt FROM program_modules GROUP BY program_id");
  console.log("\nProgram modules mapping:");
  pm.forEach(row => {
    const prefix = row.program_id.slice(0, 8);
    console.log(" - prog", prefix, "|", row.cnt, "modules");
  });
  
  // Check lessons
  const [lessons] = await c.query("SELECT COUNT(*) as cnt FROM lessons WHERE technology_module_id IS NOT NULL");
  console.log("\nLessons with technology_module_id:", lessons[0].cnt, "rows");
  
  const [lessonsTotal] = await c.query("SELECT COUNT(*) as cnt FROM lessons");
  console.log("Total lessons:", lessonsTotal[0].cnt, "rows");
  
  await c.end();
})()