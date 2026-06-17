import { INotification } from "./notification.interface";
import Notification from "./notification.model";

const createNotification = async (payload: Partial<INotification>) => {
  return await Notification.create(payload);
};

const getNotificationsByUser = async (userId: string) => {
  return await Notification.find({ user: userId }).sort({ createdAt: -1 });
};

const markAsRead = async (notificationId: string, userId: string) => {
  return await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { $set: { isRead: true } },
    { new: true }
  );
};

const markAllAsRead = async (userId: string) => {
  return await Notification.updateMany(
    { user: userId, isRead: false },
    { $set: { isRead: true } }
  );
};

const deleteNotification = async (notificationId: string, userId: string) => {
  return await Notification.findOneAndDelete({ _id: notificationId, user: userId });
};

export const NotificationService = {
  createNotification,
  getNotificationsByUser,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
