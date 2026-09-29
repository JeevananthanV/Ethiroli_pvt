const m = require("mysql2/promise");
const fs = require("fs");

async function main() {
  // Read the module registry
  const registry = JSON.parse(fs.readFileSync("J:\\eithiroli\\ethiroli_react\\data\\modules\\module-registry.json", "utf8"));

  const connection = await m.createConnection({
    host: "localhost",
    user: "root",
    password: "Admin@123",
    database: "ethiroli"
  });

  // Get technology_modules mapping: code -> id
  const [tmods] = await connection.query("SELECT id, code FROM technology_modules ORDER BY code");
  const codeToId = {};
  tmods.forEach(m => codeToId[m.code] = m.id);

  console.log("Modules in DB:", Object.keys(codeToId).length);
  console.log("Modules in registry:", Object.keys(registry).length);

  // Insert module_topics for each module
  let totalInserted = 0;

  for (const [code, modData] of Object.entries(registry)) {
    const moduleId = codeToId[code];
    if (!moduleId) {
      console.log("WARNING: Module not found in DB:", code);
      continue;
    }

    const topics = modData.topics || [];
    for (let i = 0; i < topics.length; i++) {
      const title = topics[i];
      const [result] = await connection.query(
        "INSERT INTO module_topics (module_id, title, description, topic_order, estimated_hours) VALUES (?, ?, ?, ?, ?)",
        [moduleId, title, `Submodule: ${title}`, i + 1, 1.0]
      );
      totalInserted++;
    }
  }

  console.log("Total module_topics inserted:", totalInserted);

  // Verify
  const [count] = await connection.query("SELECT COUNT(*) as cnt FROM module_topics");
  console.log("module_topics total now:", count[0].cnt);

  // Show sample
  const [samples] = await connection.query("SELECT * FROM module_topics LIMIT 10");
  console.log("Sample module_topics:");
  samples.forEach(t => console.log(" -", t.id.slice(0, 8), "|", t.module_id.slice(0, 8), "|", t.title.slice(0, 40), "| order", t.topic_order));

  await connection.end();
}

main().catch(console.error);