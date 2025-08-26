import bcryptjs from "bcryptjs";
import { envVars } from "../config/env";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import User from "../modules/user/user.model";

// Super Admin
export const seedSuperAdmin = async () => {
  try {
    const exists = await User.findOne({ email: envVars.SUPER_ADMIN_EMAIL });
    if (exists) return;

    const hashedPassword = await bcryptjs.hash(
      envVars.SUPER_ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.SUPER_ADMIN_EMAIL,
    };

    const payload: IUser = {
      name: "Super Admin",
      role: Role.SUPER_ADMIN,
      email: envVars.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      isVerified: true,
      auths: [authProvider],
      agreeToTerms: true,
      agreeToMarketing: false,
    };

    await User.create(payload);
    console.log("Super Admin seeded successfully");
  } catch (error) {
    console.log("Error seeding Super Admin:", error);
  }
};

// Admin
export const seedAdmin = async () => {
  try {
    const exists = await User.findOne({ email: envVars.ADMIN_EMAIL });
    if (exists) return;

    const hashedPassword = await bcryptjs.hash(
      envVars.ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.ADMIN_EMAIL,
    };

    const payload: IUser = {
      name: "Admin",
      role: Role.ADMIN,
      email: envVars.ADMIN_EMAIL,
      password: hashedPassword,
      isVerified: true,
      auths: [authProvider],
      agreeToTerms: true,
      agreeToMarketing: false,
    };

    await User.create(payload);
    console.log("Admin seeded successfully");
  } catch (error) {
    console.log("Error seeding Admin:", error);
  }
};

// Driver
export const seedDriver = async () => {
  try {
    const exists = await User.findOne({ email: envVars.DRIVER_EMAIL });
    if (exists) return;

    const hashedPassword = await bcryptjs.hash(
      envVars.DRIVER_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.DRIVER_EMAIL,
    };

    const payload: IUser = {
      name: "Driver",
      role: Role.DRIVER,
      email: envVars.DRIVER_EMAIL,
      password: hashedPassword,
      isVerified: true,
      auths: [authProvider],
      agreeToTerms: true,
      agreeToMarketing: false,
    };

    await User.create(payload);
    console.log("Driver seeded successfully");
  } catch (error) {
    console.log("Error seeding Driver:", error);
  }
};

// Rider
export const seedRider = async () => {
  try {
    const exists = await User.findOne({ email: envVars.RIDER_EMAIL });
    if (exists) return;

    const hashedPassword = await bcryptjs.hash(
      envVars.RIDER_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.RIDER_EMAIL,
    };

    const payload: IUser = {
      name: "Rider",
      role: Role.RIDER,
      email: envVars.RIDER_EMAIL,
      password: hashedPassword,
      isVerified: true,
      auths: [authProvider],
      agreeToTerms: true,
      agreeToMarketing: false,
    };

    await User.create(payload);
    console.log("Rider seeded successfully");
  } catch (error) {
    console.log("Error seeding Rider:", error);
  }
};
