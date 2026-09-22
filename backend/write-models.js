import fs from 'fs';
import path from 'path';

const MODELS_DIR = path.join(process.cwd(), 'src', 'models');

function toPascalCase(str) {
  return str.replace(/(^|_)(\w)/g, (_, __, c) => c.toUpperCase());
}

function toSnakeCase(str) {
  return str.replace(/[A-Z]/g, c => `_${c.toLowerCase()}`);
}

function generateModelCode(tableName, columns = []) {
  const modelName = toPascalCase(tableName);
  const encryptedFields = columns.filter(c => c.encrypted).map(c => c.name);
  const jsonFields = columns.filter(c => c.json).map(c => c.name);
  const hasEncryption = encryptedFields.length > 0;
  const hasJsonFields = jsonFields.length > 0;
  const primaryKey = columns.find(c => c.primaryKey)?.name || 'id';

  let formatFn = '  static format(row) {\n    if (!row) return null;\n    return row;\n  }';
  if (hasEncryption || hasJsonFields) {
    const mappings = [];
    if (hasEncryption) {
      for (const field of encryptedFields) {
        mappings.push(`      ${field}: row.${field} ? decrypt(row.${field}) : null`);
      }
    }
    if (hasJsonFields) {
      for (const field of jsonFields) {
        mappings.push(`      ${field}: row.${field} ? JSON.parse(row.${field}) : null`);
      }
    }
    formatFn = `  static format(row) {
    if (!row) return null;
    return {
      ...row,
${mappings.join(',\n')}
    };
  }`;
  }

  const findByIdFn = `  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM ${tableName} WHERE ${primaryKey} = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }`;

  const createParams = columns.map(c => c.name).join(', ');
  const createColumns = columns.map(c => c.name).join(', ');
  const createValues = columns.map(c => {
    if (c.json) return `${c.name} ? JSON.stringify(${c.name})`;
    if (c.encrypted) return `${c.name} ? encrypt(${c.name})`;
    return `${c.name} ?`;
  }).join(', ');

  const createFn = `  static async create({ ${createParams} }) {
    const id = crypto.randomUUID();
    await pool.execute(
      \`INSERT INTO ${tableName} (id, ${createColumns})
       VALUES (?, ${createValues})\`,
      [id${columns.map(() => ', ' + columns.map(c => c.name).join(', ')).join('')}]
    );
    return id;
  }`;

  let updateFn = `  static async update(id, updates) {
    const queryParts = [];
    const values = [];
`;
  for (const c of columns) {
    if (c.primaryKey) continue;
    let val = `updates.${c.name}`;
    if (c.json) val = `${val} ? JSON.stringify(${val}) : null`;
    if (c.encrypted) val = `${val} ? encrypt(${val}) : null`;
    updateFn += `    if (updates.${c.name} !== undefined) { queryParts.push('${c.name} = ?'); values.push(${val}); }\n`;
  }
  updateFn += `    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(\`UPDATE ${tableName} SET ${'${queryParts.join(', ')}'} WHERE ${primaryKey} = ?\`, values);
  }`;

  const listFilters = columns.filter(c => c.filterable && !c.primaryKey).map(c => {
    if (c.type === 'date' || c.type === 'string') {
      return `    if (${c.name}) { query += ' AND ${c.name} = ?'; values.push(${c.name}); }`;
    }
    return `    if (${c.name}) { query += ' AND ${c.name} = ?'; values.push(${c.name}); }`;
  }).join('\n');

  const listFn = `  static async list({ ${columns.filter(c => c.filterable && !c.primaryKey).map(c => c.name).join(', ')} limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM ${tableName} WHERE 1=1';
    const values = [];
${listFilters}
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);
    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }`;

  const countFilters = columns.filter(c => c.filterable && !c.primaryKey).map(c => {
    return `    if (${c.name}) { query += ' AND ${c.name} = ?'; values.push(${c.name}); }`;
  }).join('\n');

  const countFn = `  static async count({ ${columns.filter(c => c.filterable && !c.primaryKey).map(c => c.name).join(', ')} } = {}) {
    let query = 'SELECT COUNT(*) as total FROM ${tableName} WHERE 1=1';
    const values = [];
${countFilters}
    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }`;

  return `import crypto from 'crypto';
import pool from '../config/database.js';
${hasEncryption ? "import { encrypt, decrypt } from '../config/encryption.js';\n" : ''}

export default class ${modelName} {
${formatFn}

${findByIdFn}

${createFn}

${updateFn}

  static async delete(id) {
    await pool.execute('DELETE FROM ${tableName} WHERE ${primaryKey} = ?', [id]);
  }

${listFn}

${countFn}
}
`;
}

function writeModel(tableName, columns = []) {
  const modelName = toPascalCase(tableName);
  const filePath = path.join(MODELS_DIR, `${modelName}.js`);
  const code = generateModelCode(tableName, columns);
  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`Created: ${filePath}`);
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: node write-models.js <tableName> [--columns name:type:encrypted, name:type:json, ...]');
  process.exit(1);
}

const tableName = args[0];
const columnsArgIndex = args.indexOf('--columns');
let columns = [];
if (columnsArgIndex !== -1 && args[columnsArgIndex + 1]) {
  columns = args[columnsArgIndex + 1].split(',').map(col => {
    const [name, type, ...mods] = col.trim().split(':');
    return { name: name.trim(), type: type?.trim() || 'string', encrypted: mods.includes('encrypted'), json: mods.includes('json'), primaryKey: name.trim() === 'id', filterable: true };
  });
} else {
  columns = [{ name: 'id', type: 'string', primaryKey: true, encrypted: false, json: false, filterable: false }];
}

writeModel(tableName, columns);
