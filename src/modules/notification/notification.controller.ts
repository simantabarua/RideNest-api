import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { NotificationService } from "./notification.service";
import { JwtPayload } from "jsonwebtoken";

const getMyNotifications = catchAsync(async (req: any, res: any) => {
  const userId = (req.user as JwtPayload).id;
  const notifications = await NotificationService.getNotificationsByUser(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notifications retrieved successfully",
    data: notifications,
  });
});

const markAsRead = catchAsync(async (req: any, res: any) => {
  const userId = (req.user as JwtPayload).id;
  const notificationId = req.params.id;
  const notification = await NotificationService.markAsRead(notificationId, userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notification marked as read successfully",
    data: notification,
  });
});

const markAllAsRead = catchAsync(async (req: any, res: any) => {
  const userId = (req.user as JwtPayload).id;
  await NotificationService.markAllAsRead(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All notifications marked as read successfully",
    data: null,
  });
});

const deleteNotification = catchAsync(async (req: any, res: any) => {
  const userId = (req.user as JwtPayload).id;
  const notificationId = req.params.id;
  await NotificationService.deleteNotification(notificationId, userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notification deleted successfully",
    data: null,
  });
});

export const NotificationController = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
