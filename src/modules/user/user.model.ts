import mongoose, { Schema, Model } from "mongoose";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";

const AuthProviderSchema = new Schema<IAuthProvider>(
  {
    provider: {
      type: String,
      enum: ["google", "credentials"],
      required: true,
    },
    providerId: {
      type: String,
      required: true,
    },
  },
  { _id: false, versionKey: false }
);

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    picture: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    earnings: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.RIDER,
    },
    isBlocked: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    auths: {
      type: [AuthProviderSchema],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
