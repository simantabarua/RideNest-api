import mongoose from "mongoose";
import { ZodError } from "zod";
import { TErrorSources, TGenericErrorResponse } from "../interface/error.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handlerDuplicateError = (err: any): TGenericErrorResponse => {
  const matchedArray = err.message.match(/"([^"]*)"/);
  const fieldName = matchedArray?.[1] || "Field";

  return {
    statusCode: 400,
    message: `${fieldName} already exists!`,
    code: "DB_DUPLICATE_KEY",
  };
};

// Handle Mongoose validation errors
export const handlerValidationError = (
  err: mongoose.Error.ValidationError
): TGenericErrorResponse => {
  const errorSources: TErrorSources[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Object.values(err.errors).forEach((errorObject: any) => {
    errorSources.push({
      path: errorObject?.path,
      message: errorObject?.message,
    });
  });

  return {
    statusCode: 400,
    message: "Validation Error",
    code: "DB_VALIDATION_ERROR",
    errorSources,
  };
};

// Handle Mongoose cast errors (e.g., invalid ObjectId)
export const handlerCastError = (
  err: mongoose.Error.CastError
): TGenericErrorResponse => {
  return {
    statusCode: 400,
    message: `Invalid value for ${err.path}: ${err.value}`,
    code: "DB_CAST_ERROR",
  };
};

// Handle Zod validation errors
export const handlerZodError = (err: ZodError): TGenericErrorResponse => {
  const errorSources: TErrorSources[] = [];

  err.issues.forEach((issue) => {
    errorSources.push({
      path: issue.path[issue.path.length - 1]?.toString(),
      message: issue.message,
    });
  });

  return {
    statusCode: 400,
    message: "Validation Error",
    code: "VALIDATION_ERROR",
    errorSources,
  };
};
