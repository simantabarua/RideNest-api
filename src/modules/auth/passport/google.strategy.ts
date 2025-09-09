import {
  Strategy as GoogleStrategy,
  VerifyCallback,
} from "passport-google-oauth20";
import { envVars } from "../../../config/env";
import { Role } from "../../user/user.interface";
import User from "../../user/user.model";
import { Profile } from "passport";

export const googleStrategy = new GoogleStrategy(
  {
    clientID: envVars.GOOGLE_CLIENT_ID,
    clientSecret: envVars.GOOGLE_CLIENT_SECRET,
    callbackURL: envVars.GOOGLE_CALLBACK_URL,
  },
  async (
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ) => {
    try {
      const email = profile.emails?.[0]?.value;

      if (!email) {
        return done(undefined, false, {
          message: "No email found in Google profile",
        });
      }

      let user = await User.findOne({ email });

      if (user && !user.isVerified) {
        return done(undefined, false, { message: "User is not verified" });
      }

      if (user && user.isDeleted) {
        return done(undefined, false, { message: "User is deleted" });
      }

      if (!user) {
        user = await User.create({
          email,
          name: profile.displayName,
          picture: profile.photos?.[0]?.value,
          role: Role.RIDER,
          isVerified: true,
          auths: [
            {
              provider: "google",
              providerId: profile.id,
            },
          ],
        });
        await user.save();
      }

      return done(undefined, user);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Google Strategy Error:", error);
      return done(error as Error, false, { message: "Authentication failed" });
    }
  }
);
