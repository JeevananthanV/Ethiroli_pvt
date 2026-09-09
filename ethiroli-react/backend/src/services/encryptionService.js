import { encrypt, decrypt, encryptDeterministic } from '../config/encryption.js';
import { logger } from '../config/logger.js';

export const encryptField = (field, value) => {
  try {
    if (value === undefined || value === null) return null;
    return encrypt(String(value));
  } catch (error) {
    logger.error('Field encryption failed', { field, error: error.message });
    throw new Error(`Failed to encrypt field: ${field}`);
  }
};

export const decryptField = (field, encryptedValue) => {
  try {
    if (encryptedValue === undefined || encryptedValue === null) return null;
    return decrypt(encryptedValue);
  } catch (error) {
    logger.error('Field decryption failed', { field, error: error.message });
    throw new Error(`Failed to decrypt field: ${field}`);
  }
};

export const encryptDeterministicField = (field, value) => {
  try {
    if (value === undefined || value === null) return null;
    return encryptDeterministic(String(value));
  } catch (error) {
    logger.error('Deterministic field encryption failed', { field, error: error.message });
    throw new Error(`Failed to encrypt deterministic field: ${field}`);
  }
};

export const decryptMultipleFields = (data, fields) => {
  const result = { ...data };
  for (const field of fields) {
    if (result[field]) {
      result[field] = decryptField(field, result[field]);
    }
  }
  return result;
};
