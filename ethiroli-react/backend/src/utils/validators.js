export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validateLogin = (data) => {
  const errors = {};
  if (!data.email || !validateEmail(data.email)) {
    errors.email = 'Valid email is required.';
  }
  if (!data.password || data.password.length < 3) {
    errors.password = 'Password must be at least 3 characters.';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateCreateUser = (data) => {
  const errors = {};
  if (!data.email || !validateEmail(data.email)) {
    errors.email = 'Valid email is required.';
  }
  if (!data.password || data.password.length < 3) {
    errors.password = 'Password must be at least 3 characters.';
  }
  if (!data.full_name || data.full_name.trim().length === 0) {
    errors.full_name = 'Full name is required.';
  }
  if (!data.role) {
    errors.role = 'Role is required.';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateCreateLead = (data) => {
  const errors = {};
  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Lead name is required.';
  }
  if (data.email && !validateEmail(data.email)) {
    errors.email = 'Provided email is invalid.';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
