export class AppError extends Error {
  constructor(message, statusCode, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', details = null) {
    super(message, 400, details);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad request', details = null) {
    super(message, 400, details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required', details = null) {
    super(message, 401, details);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Insufficient permissions', details = null) {
    super(message, 403, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', details = null) {
    super(message, 404, details);
  }
}

export const notFound = (message = 'Resource not found', details = null) => new NotFoundError(message, details);

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict', details = null) {
    super(message, 409, details);
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Rate limit exceeded', details = null) {
    super(message, 429, details);
  }
}

export const formatError = (error) => {
  const statusCode = error.statusCode || error.status || 500;
  const message = error.message || 'Internal server error';
  const details = error.details || null;

  return {
    statusCode,
    message,
    details
  };
};
