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

export const error = (res, errorOrStatus, message = 'Error', details = null) => {
  if (typeof errorOrStatus === 'number') {
    const statusCode = errorOrStatus;
    const response = {
      success: false,
      message,
      error: {
        statusCode,
        message,
        ...(details && { details })
      }
    };
    return res.status(statusCode).json(response);
  }

  const formatted = formatError(errorOrStatus);
  const response = {
    success: false,
    message: formatted.message,
    error: {
      statusCode: formatted.statusCode,
      message: formatted.message,
      ...(formatted.details && { details: formatted.details })
    }
  };

  return res.status(formatted.statusCode).json(response);
};
