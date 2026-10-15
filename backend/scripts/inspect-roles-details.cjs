const fs = require('fs');
const path = require('path');

const dump = fs.readFileSync(path.join(__dirname, '..', 'u629721489_ethiroli_Db (1).sql'), 'utf8');

// Find all indexes and collation on roles and users
const rolesIdx = dump.indexOf('CREATE TABLE `roles`');
console.log('ROLES TABLE in dump:\n', dump.slice(rolesIdx, rolesIdx + 600));

// Find primary key on roles
const rolesPkIdx = dump.indexOf('ALTER TABLE `roles`');
console.log('ROLES PK in dump:\n', dump.slice(rolesPkIdx, rolesPkIdx + 300));
