import { NextFunction, Request, Response, Router } from "express";
import { AuthController } from "./auth.controller";
import { Role } from "../user/user.interface";
import passport from "passport";
import { checkAuth } from "../../middlewares/checkAuth";
const router = Router();
router.post("/login", AuthController.credentialLogin);
router.post("/refresh-token", AuthController.generateNewAccessToken);
router.post("/logout", AuthController.logout);
router.patch(
  "/change-password",
  checkAuth(...Object.values(Role)),
  AuthController.changePassword
);
router.get("/google", (req: Request, res: Response, next: NextFunction) => {
  const redirect = (req.query.redirect as string) ?? "/";
  passport.authenticate("google", {
    scope: ["email", "profile"],
    state: redirect,
  })(req, res, next);
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  AuthController.googleAuthController
);

export const AuthRoutes = router;
