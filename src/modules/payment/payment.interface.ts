import { Types } from "mongoose";

export enum PaymentStatus {
  PENDING = "pending",
  COMPLETE = "complete",
  FAILED = "failed",
}

export enum PaymentMethod {
  CASH = "cash",
  CARD = "card",
}

export enum RefundStatus {
  NONE = "none",
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
}

export interface IPayment {
  ride: Types.ObjectId;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  amount: number;
  currency: string;
  initiatedAt?: Date;
  completedAt?: Date;
  transactionId?: string;
  cardInfo?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
  failureReason?: string;
  provider?: string;
  refundStatus?: RefundStatus;
  refundAmount?: number;
}
