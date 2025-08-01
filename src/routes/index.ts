import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";
import { RideRoute } from "../modules/ride/ride.route";
import { DriverRoute } from "../modules/driver/driver.route";
import { AdminRoute } from "../modules/admin/admin.route";
import { PaymentRoute } from "../modules/payment/payment.route";

export const router = Router();

const moduleRoutes = [
  { path: "/users", route: UserRoutes },
  { path: "/auth", route: AuthRoutes },
  { path: "/rides", route: RideRoute },
  { path: "/drivers", route: DriverRoute },
  { path: "/admin", route: AdminRoute },
  { path: "/payment", route: PaymentRoute },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
