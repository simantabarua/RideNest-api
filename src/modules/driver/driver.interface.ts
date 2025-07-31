import { Types } from "mongoose";

export interface IDriver {
  user: Types.ObjectId;
  isApproved: boolean;
  isOnline: boolean;
  earnings: number;
  currentRide: Types.ObjectId | null;
  vehicleInfo?: {
    type: string;
    plate: string;
    color: string;
  };
}
