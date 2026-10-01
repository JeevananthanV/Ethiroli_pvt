const fs = require('fs');
const mysql = require('mysql2/promise');
const path = require('path');
const crypto = require('crypto');

const envPath = path.join(__dirname, '../.env');
const env = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
const get = (k, d = '') => (env.match(new RegExp('^' + k + '=(.*)$', 'm'))?.[1] ?? d).trim();

const ENCRYPTION_KEY = get('ENCRYPTION_KEY', '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef');

function decrypt(text) {
  if (!text || typeof text !== 'string') return text;
  const parts = text.split(':');
  if (parts.length !== 3) return text;
  try {
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encryptedText = Buffer.from(parts[2], 'hex');
    const key = Buffer.from(ENCRYPTION_KEY, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    return `[DEC_ERROR: ${err.message}]`;
  }
}

async function testDec() {
  const pool = await mysql.createPool({
    host: get('DB_HOST', 'localhost'),
    port: Number(get('DB_PORT', 3306)),
    user: get('DB_USER', 'root'),
    password: get('DB_PASSWORD', ''),
    database: get('DB_NAME', 'ethiroli')
  });

  const [users] = await pool.query("SELECT id, email, full_name, role FROM users LIMIT 15");
  console.log('ENCRYPTION_KEY:', ENCRYPTION_KEY.substring(0, 10) + '...');
  for (const u of users) {
    console.log({
      id: u.id,
      role: u.role,
      rawEmail: u.email.substring(0, 25) + '...',
      decryptedEmail: decrypt(u.email),
      decryptedName: decrypt(u.full_name)
    });
  }

  await pool.end();
}

testDec().catch(console.error);
