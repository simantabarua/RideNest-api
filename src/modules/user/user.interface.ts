export enum Role {
  ADMIN = "ADMIN",
  DRIVER = "DRIVER",
  RIDER = "RIDER",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: string;
  role: Role;
  isDeleted?: boolean;
  isActive?: IsActive;
  isApproved?: boolean;
  isVerified?: boolean;
  isBlocked?: boolean;
  auths: IAuthProvider[];
  createdAt?: Date;
  updatedAt?: Date;
  driverInfo?: string;
  riderInfo?: string;
}
