import { Router } from "express";
import { PaymentController } from "./payment.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import {
  createPaymentSchema,
  updatePaymentStatusSchema,
} from "./payment.validation";
import validateRequest from "../../middlewares/validatedRequest";

const router = Router();

router.post(
  "/",
  checkAuth(...Object.values(Role)),
  validateRequest(createPaymentSchema),
  PaymentController.createPayment
);

router.get(
  "/:paymentId",
  checkAuth(...Object.values(Role)),
  PaymentController.getPayment
);

router.patch(
  "/:paymentId",
  checkAuth(Role.ADMIN), 
  validateRequest(updatePaymentStatusSchema),
  PaymentController.updatePaymentStatus
);

export const PaymentRoute = router;
