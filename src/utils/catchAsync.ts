import { NextFunction, Request, Response } from "express";

export const catchAsync =
  (fn: any) => (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      next(error);
    });
  };
