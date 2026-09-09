export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/;
export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
export const DATETIME_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;

export const validateEmail = (email) => {
  return EMAIL_REGEX.test(String(email).toLowerCase());
};

export const validatePhone = (phone) => {
  if (!phone) return true;
  return PHONE_REGEX.test(String(phone).replace(/[\s()-]/g, ''));
};

export const validateUUID = (value) => {
  if (!value) return true;
  return UUID_REGEX.test(String(value));
};

export const validateDate = (value) => {
  if (!value) return true;
  return DATE_REGEX.test(String(value));
};

export const validateDateTime = (value) => {
  if (!value) return true;
  return DATETIME_REGEX.test(String(value));
};

export const validateEnum = (value, allowedValues) => {
  if (!value) return true;
  return allowedValues.includes(String(value).toUpperCase());
};

export const validateRequired = (body, fields) => {
  const missing = [];
  for (const field of fields) {
    const value = body[field];
    if (value === undefined || value === null || String(value).trim() === '') {
      missing.push(field);
    }
  }
  return missing;
};

export const sanitizeInput = (input) => {
  if (input === null || input === undefined) {
    return input;
  }

  if (typeof input === 'string') {
    return input.replace(/\0/g, '').trim();
  }

  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }

  if (typeof input === 'object') {
    const sanitized = {};
    for (const key of Object.keys(input)) {
      sanitized[key] = sanitizeInput(input[key]);
    }
    return sanitized;
  }

  return input;
};
