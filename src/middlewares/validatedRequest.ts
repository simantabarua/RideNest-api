import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

const validateRequest =
  (zodSchema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line no-console
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
      // eslint-disable-next-line no-console
      console.log(err)
    }
  };

export default validateRequest;
