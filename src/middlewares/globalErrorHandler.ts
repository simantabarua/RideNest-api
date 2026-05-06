/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZodError } from "zod";
import {
  handlerZodError,
  handlerValidationError,
  handlerCastError,
  handlerDuplicateError,
} from "../errorHelper/ErrorHelper";
import AppError from "../errorHelper/AppError";

interface TErrorSources {
  path: string | number;
  message: string;
}

export const globalErrorHandler = (
  err: any,
  req: any,
  res: any,
  next: any
) => {
  // setting default values
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorSources: TErrorSources[] = [
    {
      path: "",
      message: "Something went wrong",
    },
  ];

  if (err instanceof ZodError) {
    const simplifiedError = handlerZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources || [];
  } else if (err?.name === "ValidationError") {
    const simplifiedError = handlerValidationError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources || [];
  } else if (err?.name === "CastError") {
    const simplifiedError = handlerCastError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = [
      {
        path: err.path,
        message: err.message,
      },
    ];
  } else if (err?.code === 11000) {
    const simplifiedError = handlerDuplicateError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = [
      {
        path: "",
        message: simplifiedError?.message,
      },
    ];
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err?.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err?.message,
      },
    ];
  }

  // ultimate return
  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err,
    stack: process.env.NODE_ENV === "development" ? err?.stack : null,
  });
};
