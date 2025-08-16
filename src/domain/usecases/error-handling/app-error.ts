export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed") {
    super(message, 400);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, 409);
  }
}

export class InternalServerError extends AppError {
  constructor(message = "Unexpected Error") {
    super(message, 500);
  }
}
