import { Router } from "express";
import { UserRoutes } from "../modules/driver/driver.route";
import { AuthRoutes } from "../modules/auth/auth.service";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
