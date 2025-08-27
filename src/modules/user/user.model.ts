import mongoose, { Schema, Model } from "mongoose";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";

const AuthProviderSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, enum: ["google", "credentials"], required: true },
    providerId: { type: String, required: true },
  },
  { _id: false, versionKey: false }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String },
    newPassword: { type: String },
    currentPassword: { type: String },
    phone: { type: String },
    picture: { type: String },
    address: { type: String },
    role: { type: String, enum: Object.values(Role), default: Role.RIDER },
    isDeleted: { type: Boolean, default: false },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    isApproved: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isSuspend: { type: Boolean, default: false },
    auths: { type: [AuthProviderSchema], default: [] },

    driverInfo: { type: Schema.Types.ObjectId, ref: "DriverInfo" },
    riderInfo: { type: Schema.Types.ObjectId, ref: "RiderInfo" },
    agreeToTerms: { type: Boolean, default: false },
    agreeToMarketing: { type: Boolean, default: false },
    emergencyContacts: { type: [Schema.Types.Mixed], default: [] },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
