import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 12;  // 96 bits for GCM
const SALT = crypto.scryptSync(process.env.ENCRYPTION_SECRET || 'dev_encryption_secret_salt_123', 'salt', 32);

// Derive encryption key via PBKDF2
const deriveKey = (password) => {
  return crypto.pbkdf2Sync(password, SALT, 100000, KEY_LENGTH, 'sha256');
};

const SECRET = process.env.ENCRYPTION_SECRET || 'ethiroli_default_secret_32_chars_long!';
const KEY = deriveKey(SECRET);

// Randomized encryption (for non-searchable fields)
export const encrypt = (text) => {
  if (!text) return null;
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag().toString('hex');
    
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  } catch (err) {
    console.error('Encryption failed:', err);
    return null;
  }
};

// Decryption (works for both randomized and deterministic if format is iv:authTag:encryptedHex)
export const decrypt = (cipherText) => {
  if (!cipherText) return null;
  try {
    const parts = cipherText.split(':');
    if (parts.length !== 3) {
      return cipherText;
    }
    
    const [ivHex, authTagHex, encryptedHex] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');
    
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (err) {
    return cipherText;
  }
};

// Deterministic encryption (for searchable fields like email)
export const encryptDeterministic = (text) => {
  if (!text) return null;
  try {
    // Generate a fixed IV based on the text to maintain determinism
    const iv = crypto.createHash('sha256').update(text).digest().slice(0, IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag().toString('hex');
    
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  } catch (err) {
    console.error('Deterministic encryption failed:', err);
    return null;
  }
};
