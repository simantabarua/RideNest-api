import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../errorHelper/AppError";
import { verifyToken } from "../utils/jwt";
import User from "../modules/user/user.model";
export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers.authorization;
    try {
      if (!accessToken) {
        throw new AppError(
          "Access token is required",
          StatusCodes.UNAUTHORIZED
        );
      }
      const verifiedToken = verifyToken(
        accessToken,
        process.env.JWT_ACCESS_SECRET || ""
      ) as JwtPayload;

      const user = await User.findOne({ email: verifiedToken.email });
      if (!user) {
        throw new AppError("User not found", StatusCodes.NOT_FOUND);
      }

      if (user.isDeleted === true) {
        throw new AppError("User is deleted", StatusCodes.BAD_REQUEST);
      }
      if (user.isActive === "INACTIVE" || user.isActive === "BLOCKED") {
        throw new AppError(`User is ${user.isActive}`, StatusCodes.FORBIDDEN);
      }
      if (!verifiedToken) {
        throw new AppError("Invalid access token", StatusCodes.UNAUTHORIZED);
      }
      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError("Unauthorized access", StatusCodes.FORBIDDEN);
      }
      req.user = verifiedToken;
      next();
    } catch (error) {
      next(error);
    }
  };
