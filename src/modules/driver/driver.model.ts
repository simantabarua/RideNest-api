import mongoose, { Schema } from "mongoose";
import { IDriverInfo } from "./driver.interface";
import { IVehicleInfo, VehicleType } from "../vehicle/vehicle.interface";

const vehicleInfoSchema = new Schema<IVehicleInfo>(
  {
    type: { type: String, enum: Object.values(VehicleType) },
    model: String,
    registrationNumber: { type: String, unique: true },
  },
  { _id: false }
);

const driverInfoSchema = new Schema<IDriverInfo>(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    licenseNumber: { type: String, unique: true },
    vehicleInfo: vehicleInfoSchema,
    rating: { type: Number, default: 0 },
    completedRides: { type: Number, default: 0 },
    earnings: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

export const DriverInfo = mongoose.model<IDriverInfo>(
  "DriverInfo",
  driverInfoSchema
);
