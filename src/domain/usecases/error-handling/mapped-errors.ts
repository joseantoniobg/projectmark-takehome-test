export class MappedError extends Error {
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

export class NotFoundError extends MappedError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

export class UnauthorizedError extends MappedError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

export class ValidationError extends MappedError {
  constructor(message = "Validation failed") {
    super(message, 400);
  }
}

export class ConflictError extends MappedError {
  constructor(message = "Conflict") {
    super(message, 409);
  }
}

export class InternalServerError extends MappedError {
  constructor(message = "Unexpected Error") {
    super(message, 500);
  }
}
