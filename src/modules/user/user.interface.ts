import { Types } from "mongoose";

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  DRIVER = "DRIVER",
  RIDER = "RIDER",
}

export type AuthProvider = "google" | "credentials";

export interface IAuthProvider {
  provider: AuthProvider;
  providerId: string;
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: string;
  role: Role;
  auths: IAuthProvider[];
  isDeleted?: boolean;
  isActive?: IsActive;
  isVerified?: boolean;
  isApproved?: boolean;
  isAvailable?: boolean;
  isBlocked: boolean;
  isOnline: boolean;
  earnings?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
