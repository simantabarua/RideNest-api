import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";
import { RideRoute } from "../modules/ride/ride.route";
import { DriverRoute } from "../modules/driver/driver.route";

export const router = Router();

const moduleRoutes = [
  { path: "/user", route: UserRoutes },
  { path: "/auth", route: AuthRoutes },
  { path: "/rides", route: RideRoute },
  { path: "/drivers", route: DriverRoute },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
