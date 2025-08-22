/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let customCode = "UNKNOWN_ERROR";
  let message = "An unexpected error occurred";
  let errorSources: TErrorSources[] = [];

  if (envVars.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    const simplifiedError = handlerDuplicateError(err);
    customCode = "DB_DUPLICATE_KEY";
    message = simplifiedError.message;
  }
  // Mongoose CastError
  else if (err.name === "CastError") {
    const simplifiedError = handlerCastError(err);
    customCode = "DB_CAST_ERROR";
    message = simplifiedError.message;
  }
  // Zod schema validation error
  else if (err.name === "ZodError") {
    const simplifiedError = handlerZodError(err);
    customCode = "VALIDATION_ERROR";
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources ?? [];
  }
  // Mongoose validation error
  else if (err.name === "ValidationError") {
    const simplifiedError = handlerValidationError(err);
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
  const responseStatus = err.statusCode || 500;

  res.status(responseStatus).json({
    success: false,
    code: customCode,
    message,
    errorSources,
    err: envVars.NODE_ENV === "development" ? err : undefined,
    stack: envVars.NODE_ENV === "development" ? err.stack : undefined,
  });
};
