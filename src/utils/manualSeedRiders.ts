import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import { envVars } from "../config/env";
import { IAuthProvider, Role } from "../modules/user/user.interface";
import User from "../modules/user/user.model";
import { dbConnect } from "../config/database";

const ridersData = [
  {
    name: "Rider One",
    email: "rider@mail.com",
    password: "Rider@123",
    phone: "+8801912345671",
  },
  {
    name: "Rider Two",
    email: "rider2@mail.com",
    password: "Rider@123",
    phone: "+8801912345672",
  },
  {
    name: "Rider Three",
    email: "rider3@mail.com",
    password: "Rider@123",
    phone: "+8801912345673",
  },
  {
    name: "Rider Four",
    email: "rider4@mail.com",
    password: "Rider@123",
    phone: "+8801912345674",
  },
  {
    name: "Rider Five",
    email: "rider5@mail.com",
    password: "Rider@123",
    phone: "+8801912345675",
  },
];

async function seed() {
  try {
    console.log("Connecting to database...");
    await dbConnect();
    console.log("Database connected successfully.");

    const saltRounds = Number(envVars.BCRYPT_SALT_ROUND) || 10;

    for (const rider of ridersData) {
      const exists = await User.findOne({ email: rider.email });
      if (exists) {
        console.log(`Rider with email ${rider.email} already exists.`);
        continue;
      }

      const hashedPassword = await bcryptjs.hash(rider.password, saltRounds);

      const authProvider: IAuthProvider = {
        provider: "credentials",
        providerId: rider.email,
      };

      const payload = {
        name: rider.name,
        role: Role.RIDER,
        email: rider.email,
        password: hashedPassword,
        phone: rider.phone,
        isVerified: true,
        auths: [authProvider],
        agreeToTerms: true,
        agreeToMarketing: false,
      };

      await User.create(payload);
      console.log(`Seeded rider: ${rider.name} (${rider.email})`);
    }

    console.log("All riders seeded successfully!");
  } catch (error) {
    console.error("Error seeding riders:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
    process.exit(0);
  }
}

seed();
