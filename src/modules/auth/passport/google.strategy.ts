import {
  Strategy as GoogleStrategy,
  VerifyCallback,
} from "passport-google-oauth20";
import { envVars } from "../../../config/env";
import { IUser, Role } from "../../user/user.interface";
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
        return done(new Error("Email not found in Google profile"));
      }

      let user = await User.findOne({ email });

      if (!user) {
        user = await User.create<IUser>({
          name: profile.displayName,
          email,
          isVerified: true,
          role: Role.RIDER,
          picture: profile.photos?.[0]?.value,
          auths: [
            {
              provider: "google",
              providerId: profile.id,
            },
          ],
        });
        await user.save();
      }

      done(null, user);
    } catch (err) {
      done(err as Error);
    }
  }
);
