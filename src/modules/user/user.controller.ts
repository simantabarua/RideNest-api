import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserService.createUser(req.body);
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "User created successfully",
      data: user,
    });
  }
);

const updateUser = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const verifiedUser = req.user as JwtPayload;
    const userId = verifiedUser.id;

    const user = await UserService.UpdateUser(payload, userId);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "User updated successfully",
      data: user,
    });
  }
);

const getProfile = catchAsync(async (req: Request, res: Response) => {
  const { id: userId } = req.user as JwtPayload;
  const driver = await UserService.getProfile(userId);
  if (!driver) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Driver not found",
      data: null,
    });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Driver profile fetched",
    data: driver,
  });
});
export const UserController = {
  createUser,
  updateUser,
  getProfile,
};
