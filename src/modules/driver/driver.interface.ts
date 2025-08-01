import { Types } from "mongoose";
import { IVehicleInfo } from "../vehicle/vehicle.interface";

export interface IDriverInfo {
  _id?: string;
  driver?: Types.ObjectId;
  licenseNumber?: string;
  vehicleInfo?: IVehicleInfo;
  rating?: number;
  completedRides?: number;
  isAvailable?: boolean;
  isVerified?: boolean;
  isApproved?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  earnings?: number;
}
