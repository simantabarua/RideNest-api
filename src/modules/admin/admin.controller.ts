// src/modules/admin/admin.controller.ts

import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AdminService } from "./admin.service";

export const AdminController = {
  getAllUsers: catchAsync(async (req: Request, res: Response) => {
    const users = await AdminService.getAllUsers();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All users fetched successfully",
      data: users,
    });
  }),

  updateUserRole: catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const updatedUser = await AdminService.updateUserRole(userId, req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  }),

  deleteUser: catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;
    await AdminService.deleteUser(userId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User deleted successfully",
      data: null,
    });
  }),

  getDashboardStats: catchAsync(async (req: Request, res: Response) => {
    const stats = await AdminService.getDashboardStats();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Dashboard stats retrieved",
      data: stats,
    });
  }),
};
