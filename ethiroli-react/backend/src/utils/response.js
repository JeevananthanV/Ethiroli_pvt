import { formatError } from './errors.js';

export const success = (res, statusCode, data = null, message = 'Success') => {
  const response = {
    success: true,
    data,
    message
  };

  if (res.locals?.meta) {
    response.meta = res.locals.meta;
  }

  return res.status(statusCode).json(response);
};

export const error = (res, error) => {
  const formatted = formatError(error);
  const response = {
    success: false,
    error: {
      statusCode: formatted.statusCode,
      message: formatted.message,
      ...(formatted.details && { details: formatted.details })
    }
  };

  return res.status(formatted.statusCode).json(response);
};
