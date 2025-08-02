import { z } from "zod";
import {
  PaymentStatus,
  PaymentMethod,
  RefundStatus,
} from "./payment.interface";

export const createPaymentSchema = z.object({
  paymentStatus: z.enum(Object.values(PaymentStatus) as [string, ...string[]]),
  paymentMethod: z.enum(Object.values(PaymentMethod) as [string, ...string[]]),
  amount: z.number().positive(),
  currency: z.string().min(3).max(3),
  transactionId: z.string().optional(),
  cardInfo: z
    .object({
      brand: z.string(),
      last4: z.string().length(4),
      expMonth: z.number().min(1).max(12),
      expYear: z.number().min(2023),
    })
    .optional(),
  failureReason: z.string().optional(),
  provider: z.string().optional(),
  refundStatus: z.enum(Object.values(RefundStatus) as [string, ...string[]]).optional(),
  refundAmount: z.number().nonnegative().optional(),
});

export const updatePaymentStatusSchema = z.object({
  paymentStatus: z.enum(Object.values(PaymentStatus) as [string, ...string[]]),
  completedAt: z.string().datetime().optional(),
});
