import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelper/AppError";
import { envVars } from "../config/env";
import { TErrorSources } from "../interface/error.types";
import {
  handlerCastError,
  handlerDuplicateError,
  handlerValidationError,
  handlerZodError,
} from "../errorHelper/ErrorHelper";

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  let customCode = "UNKNOWN_ERROR";
  let message = "An unexpected error occurred";
  let errorSources: TErrorSources[] = [];

  if (envVars.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.log(err);
  }

  // Narrow unknown to a record-like shape for safe property access
  const e = err as {
    code?: number;
    name?: string;
    statusCode?: number;
    stack?: string;
  };

  // MongoDB duplicate key error
  if (e.code === 11000) {
    const simplifiedError = handlerDuplicateError(err);
    customCode = "DB_DUPLICATE_KEY";
    message = simplifiedError.message;
  }
  // Mongoose CastError
  else if (e.name === "CastError") {
    const simplifiedError = handlerCastError(err as Parameters<typeof handlerCastError>[0]);
    customCode = "DB_CAST_ERROR";
    message = simplifiedError.message;
  }
  // Zod schema validation error
  else if (e.name === "ZodError") {
    const simplifiedError = handlerZodError(err as Parameters<typeof handlerZodError>[0]);
    customCode = "VALIDATION_ERROR";
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources ?? [];
  }
  // Mongoose validation error
  else if (e.name === "ValidationError") {
    const simplifiedError = handlerValidationError(err as Parameters<typeof handlerValidationError>[0]);
    customCode = "DB_VALIDATION_ERROR";
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources ?? [];
  }
  // Custom application error
  else if (err instanceof AppError) {
    customCode = err.code ?? "APP_ERROR";
    message = err.message;
  }
  // General JS Error
  else if (err instanceof Error) {
    customCode = "GENERAL_ERROR";
    message = err.message;
  }

  // Use proper HTTP status code
  const responseStatus = e.statusCode || 500;

  res.status(responseStatus).json({
    success: false,
    code: customCode,
    message,
    errorSources,
    err: envVars.NODE_ENV === "development" ? err : undefined,
    stack: envVars.NODE_ENV === "development" ? e.stack : undefined,
  });
};
