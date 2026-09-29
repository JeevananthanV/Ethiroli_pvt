import { AppError, ValidationError } from '../utils/errors.js';
import validationSchemas from './validationSchemas.js';
import {
  validateRequired,
  validateEmail,
  validatePhone,
  validateUUID,
  validateDate,
  validateDateTime,
  validateEnum,
  sanitizeInput
} from '../utils/validators.js';

export const validateBody = (schemaInput) => {
  return (req, res, next) => {
    const sanitized = sanitizeInput(req.body);
    req.body = sanitized;
    const errors = [];

    const schema = typeof schemaInput === 'string'
      ? (validationSchemas[schemaInput] || {})
      : (schemaInput || {});

    const isPatch = req.method === 'PATCH';

    if (schema.required && !isPatch) {
      const missing = validateRequired(sanitized, schema.required);
      if (missing.length > 0) {
        errors.push({ field: 'required', message: `Missing required fields: ${missing.join(', ')}`, missing });
      }
    }

    if (schema.fields) {
      for (const [field, rules] of Object.entries(schema.fields)) {
        const value = sanitized[field];

        if (!isPatch && rules.required && (value === undefined || value === null || String(value).trim() === '')) {
          errors.push({ field, message: `${field} is required`, code: 'REQUIRED' });
          continue;
        }

        if (value === undefined || value === null) continue;

        if (rules.type === 'array') {
          if (!Array.isArray(value)) {
            errors.push({ field, message: `${field} must be an array`, code: 'INVALID_TYPE', received: typeof value });
          }
        } else if (rules.type && typeof value !== rules.type) {
          errors.push({ field, message: `${field} must be of type ${rules.type}`, code: 'INVALID_TYPE', received: typeof value });
        }

        if (rules.email && !validateEmail(value)) {
          errors.push({ field, message: `${field} must be a valid email address`, code: 'INVALID_EMAIL' });
        }

        if (rules.phone && !validatePhone(value)) {
          errors.push({ field, message: `${field} must be a valid phone number`, code: 'INVALID_PHONE' });
        }

        if (rules.uuid && !validateUUID(value)) {
          errors.push({ field, message: `${field} must be a valid UUID`, code: 'INVALID_UUID' });
        }

        if (rules.date && !validateDate(value)) {
          errors.push({ field, message: `${field} must be a valid date (YYYY-MM-DD)`, code: 'INVALID_DATE' });
        }

        if (rules.datetime && !validateDateTime(value)) {
          errors.push({ field, message: `${field} must be a valid datetime`, code: 'INVALID_DATETIME' });
        }

        if (rules.enum && !validateEnum(value, rules.enum)) {
          errors.push({ field, message: `${field} must be one of: ${rules.enum.join(', ')}`, code: 'INVALID_ENUM', allowed: rules.enum });
        }

        if (rules.minLength && String(value).length < rules.minLength) {
          errors.push({ field, message: `${field} must be at least ${rules.minLength} characters`, code: 'TOO_SHORT' });
        }

        if (rules.maxLength && String(value).length > rules.maxLength) {
          errors.push({ field, message: `${field} must be at most ${rules.maxLength} characters`, code: 'TOO_LONG' });
        }

        if (rules.min !== undefined && Number(value) < rules.min) {
          errors.push({ field, message: `${field} must be >= ${rules.min}`, code: 'BELOW_MIN' });
        }

        if (rules.max !== undefined && Number(value) > rules.max) {
          errors.push({ field, message: `${field} must be <= ${rules.max}`, code: 'ABOVE_MAX' });
        }
      }
    }

    if (errors.length > 0) {
      throw new ValidationError('Validation failed', { errors });
    }

    next();
  };
};
