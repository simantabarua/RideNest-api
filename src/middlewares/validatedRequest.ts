import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

const validateRequest =
  (zodSchema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("Request Body:", req.body);
    try {
      await zodSchema.parseAsync(req.body);
      next();
    } catch (err) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        error: err,
      });
    }
  };

export default validateRequest;
