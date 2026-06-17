import bcryptjs from "bcryptjs";
import { envVars } from "../config/env";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import User from "../modules/user/user.model";
import { DriverInfo } from "../modules/driver/driver.model";

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
    // eslint-disable-next-line no-console
    console.log("Super Admin seeded successfully");
  } catch (error) {
    // eslint-disable-next-line no-console
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
    // eslint-disable-next-line no-console
    console.log("Admin seeded successfully");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("Error seeding Admin:", error);
  }
};

// Driver
export const seedDriver = async () => {
  try {
    const driversData = [
      {
        name: "Rahim Uddin",
        email: envVars.DRIVER_EMAIL,
        password: envVars.DRIVER_PASSWORD,
        phone: "+8801712345671",
        licenseNumber: "DL_45465461",
        vehicleInfo: { type: "car" as const, model: "Toyota Corolla", registrationNumber: "AZW45456451" },
        rating: 4.8,
        completedRides: 120,
        isAvailable: true,
      },
      {
        name: "Karim Ahmed",
        email: "driver2@mail.com",
        password: "Driver@123",
        phone: "+8801712345672",
        licenseNumber: "DL_45465462",
        vehicleInfo: { type: "car" as const, model: "Hyundai Elantra", registrationNumber: "AZW45456452" },
        rating: 4.5,
        completedRides: 85,
        isAvailable: true,
      },
      {
        name: "Sumon Khan",
        email: "driver3@mail.com",
        password: "Driver@123",
        phone: "+8801712345673",
        licenseNumber: "DL_45465463",
        vehicleInfo: { type: "bike" as const, model: "Yamaha R15 V3", registrationNumber: "AZW45456453" },
        rating: 4.9,
        completedRides: 240,
        isAvailable: false,
      },
      {
        name: "Jashim Uddin",
        email: "driver4@mail.com",
        password: "Driver@123",
        phone: "+8801712345674",
        licenseNumber: "DL_45465464",
        vehicleInfo: { type: "bike" as const, model: "Suzuki Gixxer SF", registrationNumber: "AZW45456454" },
        rating: 4.6,
        completedRides: 110,
        isAvailable: true,
      },
      {
        name: "Arifur Rahman",
        email: "driver5@mail.com",
        password: "Driver@123",
        phone: "+8801712345675",
        licenseNumber: "DL_45465465",
        vehicleInfo: { type: "car" as const, model: "Nissan Sunny", registrationNumber: "AZW45456455" },
        rating: 4.7,
        completedRides: 150,
        isAvailable: false,
      },
      {
        name: "Sajid Hasan",
        email: "driver6@mail.com",
        password: "Driver@123",
        phone: "+8801712345676",
        licenseNumber: "DL_45465466",
        vehicleInfo: { type: "car" as const, model: "Toyota Prius", registrationNumber: "AZW45456456" },
        rating: 4.2,
        completedRides: 45,
        isAvailable: true,
      },
      {
        name: "Rifat Islam",
        email: "driver7@mail.com",
        password: "Driver@123",
        phone: "+8801712345677",
        licenseNumber: "DL_45465467",
        vehicleInfo: { type: "scooter" as const, model: "Vespa Elegante", registrationNumber: "AZW45456457" },
        rating: 4.3,
        completedRides: 95,
        isAvailable: true,
      },
      {
        name: "Imran Hussain",
        email: "driver8@mail.com",
        password: "Driver@123",
        phone: "+8801712345678",
        licenseNumber: "DL_45465468",
        vehicleInfo: { type: "car" as const, model: "Honda Civic", registrationNumber: "AZW45456458" },
        rating: 4.9,
        completedRides: 310,
        isAvailable: true,
      },
    ];

    for (const d of driversData) {
      const exists = await User.findOne({ email: d.email });
      if (exists) continue;

      const hashedPassword = await bcryptjs.hash(
        d.password,
        Number(envVars.BCRYPT_SALT_ROUND)
      );

      const authProvider: IAuthProvider = {
        provider: "credentials",
        providerId: d.email,
      };

      const user = await User.create<IUser>({
        name: d.name,
        role: Role.DRIVER,
        email: d.email,
        password: hashedPassword,
        phone: d.phone,
        isVerified: true,
        auths: [authProvider],
        agreeToTerms: true,
        agreeToMarketing: false,
      });

      const driverInfo = await DriverInfo.create({
        driver: user._id,
        licenseNumber: d.licenseNumber,
        vehicleInfo: d.vehicleInfo,
        completedRides: d.completedRides,
        earnings: d.completedRides * 150,
        rating: d.rating,
        isAvailable: d.isAvailable,
      });

      user.driverInfo = driverInfo._id;
      await user.save();
    }

    // eslint-disable-next-line no-console
    console.log("Drivers seeded successfully");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("Error seeding Drivers:", error);
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
    // eslint-disable-next-line no-console
    console.log("Rider seeded successfully");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("Error seeding Rider:", error);
  }
};
