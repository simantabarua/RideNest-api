import { Types } from "mongoose";

export interface INotification {
  user: Types.ObjectId;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
