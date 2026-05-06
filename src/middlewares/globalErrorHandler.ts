/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import handleZodError from "../errorHelper/handleZodError";
import handleValidationError from "../errorHelper/handleValidationError";
import handleCastError from "../errorHelper/handleCastError";
import handleDuplicateError from "../errorHelper/handleDuplicateError";
import AppError from "../errorHelper/AppError";

interface TErrorSources {
  path: string | number;
  message: string;
}

interface TGenericErrorResponse {
  statusCode: number;
  message: string;
  errorSources: TErrorSources[];
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
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err?.name === "ValidationError") {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err?.name === "CastError") {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err?.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
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
