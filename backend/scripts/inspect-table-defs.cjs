const fs = require('fs');
const path = require('path');

const prodSql = fs.readFileSync(path.join(__dirname, '..', 'u629721489_ethiroli_Db.sql'), 'utf8');

const tables = ['courses', 'lessons', 'tasks', 'transactions', 'leads', 'approval_chains', 'payroll', 'forum_posts', 'application_statuses'];

for (const t of tables) {
  const regex = new RegExp(`CREATE TABLE \`${t}\` \\(([\\s\\S]*?)\\) ENGINE=`, 'i');
  const match = prodSql.match(regex);
  if (match) {
    console.log(`\n================ ${t} ================`);
    console.log(match[0]);
  }
}
