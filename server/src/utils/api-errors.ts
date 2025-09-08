// Api Error Class
class ApiError extends Error {
  title: string;
  status: number;

  constructor(
    title: string = "Internal Server Error",
    message: string = "Internal Server Error",
    status: number = 500,
  ) {
    super(message);
    this.title = title;
    this.status = status;
  }
}

class NotFoundError extends ApiError {
  constructor(message: string = "Resource Not Found") {
    super("Not Found", message, 404);
  }
}

class BadRequestError extends ApiError {
  constructor(message: string = "Bad Request") {
    super("Bad Request", message, 400);
  }
}

class UnauthorizedError extends ApiError {
  constructor(message: string = "Unauthorized") {
    super("Unauthorized", message, 401);
  }
}

class ForbiddenError extends ApiError {
  constructor(message: string = "Forbidden") {
    super("Forbidden", message, 403);
  }
}

class ConflictError extends ApiError {
  constructor(message: string = "Resource Conflict") {
    super("Conflict", message, 409);
  }
}

class InternalServerError extends ApiError {
  constructor(message: string = "Internal Server Error") {
    super("Internal Server Error", message, 500);
  }
}

class ValidationError extends ApiError {
  constructor(message: string = "Validation Error") {
    super("Validation Error", message, 400);
  }
}

export {
  ApiError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  InternalServerError,
  ValidationError,
};
