import { validateLogin, validateCreateUser, validateCreateLead } from '../utils/validators.js';

export const validateBody = (type) => {
  return (req, res, next) => {
    let result = { isValid: true, errors: {} };
    
    if (type === 'login') {
      result = validateLogin(req.body);
    } else if (type === 'createUser') {
      result = validateCreateUser(req.body);
    } else if (type === 'createLead') {
      result = validateCreateLead(req.body);
    }
    
    if (!result.isValid) {
      return res.status(400).json({ message: 'Validation failed.', errors: result.errors });
    }
    
    next();
  };
};
