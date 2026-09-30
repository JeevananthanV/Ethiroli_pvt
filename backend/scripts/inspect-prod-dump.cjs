const fs = require('fs');
const prodSql = fs.readFileSync('backend/u629721489_ethiroli_Db.sql', 'utf8');

// Find all view definitions
const viewMatches = prodSql.match(/CREATE(?: ALGORITHM=[^\n]+)? VIEW `[^`]+` AS [\s\S]*?;/gi) || [];
console.log('Views found:', viewMatches.length);
viewMatches.forEach(v => console.log('\n--- VIEW ---\n', v));

// Check users in prod
const userInsert = prodSql.match(/INSERT INTO `users` [\s\S]*?;/);
if (userInsert) {
  console.log('\n--- USERS INSERT ---\n', userInsert[0]);
}

// Check roles in prod
const roleInsert = prodSql.match(/INSERT INTO `roles` [\s\S]*?;/);
if (roleInsert) {
  console.log('\n--- ROLES INSERT ---\n', roleInsert[0]);
}
