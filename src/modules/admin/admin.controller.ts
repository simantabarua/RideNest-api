import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AdminService } from "./admin.service";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const users = await AdminService.getAllUsers(query as Record<string, string>);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All users fetched successfully",
    data: users,
  });
});

const getAllDrivers = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const drivers = await AdminService.getAllDrivers(
    query as Record<string, string>
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All drivers fetched successfully",
    data: drivers,
  });
});

const getAllRides = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const rides = await AdminService.getAllRides(query as Record<string, string>);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All rides fetched successfully",
    data: rides,
  });
});

const updateUserRole = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const updatedUser = await AdminService.updateUserRole(userId, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User role updated successfully",
    data: updatedUser,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  await AdminService.deleteUser(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User deleted successfully",
    data: null,
  });
});

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await AdminService.getDashboardStats();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Dashboard stats retrieved",
    data: stats,
  });
});

export const AdminController = {
  getAllUsers,
  getAllDrivers,
  getAllRides,
  updateUserRole,
  deleteUser,
  getDashboardStats,
};
