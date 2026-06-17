import { DriverService } from "./driver.service";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

const getPublicDrivers = catchAsync(async (req: any, res: any) => {
  const result = await DriverService.getPublicDrivers(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Public drivers fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getDriverById = catchAsync(async (req: any, res: any) => {
  const { id } = req.params;
  const result = await DriverService.getDriverById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Driver details fetched successfully",
    data: result,
  });
});

const setAvailability = catchAsync(async (req: any, res: any) => {
  const { id: userId } = req.user as JwtPayload;
  const { isAvailable } = req.body;
  if (typeof isAvailable !== "boolean") {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "`isAvailable` must be a boolean.",
      data: null,
    });
  }
  const updatedDriver = await DriverService.setAvailability(
    userId,
    isAvailable
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Driver availability updated",
    data: updatedDriver,
  });
});

const isAvailable = catchAsync(async (req: any, res: any) => {
  const { id: userId } = req.user as JwtPayload;
  const isAvailable = await DriverService.isAvailable(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Driver availability fetched",
    data: isAvailable,
  });
});

export const DriverController = {
  getPublicDrivers,
  getDriverById,
  setAvailability,
  isAvailable,
};
