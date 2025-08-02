import mongoose, { Schema, Document } from "mongoose";
import {
  IPayment,
  PaymentStatus,
  PaymentMethod,
  RefundStatus,
} from "./payment.interface";

export interface PaymentDocument extends IPayment, Document {}

const cardInfoSchema = new Schema(
  {
    brand: { type: String },
    last4: { type: String },
    expMonth: { type: Number },
    expYear: { type: Number },
  },
  { _id: false }
);

const paymentSchema = new Schema<PaymentDocument>(
  {
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },
    ride: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ride",
      required: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    initiatedAt: { type: Date, default: Date.now },
    completedAt: Date,
    transactionId: String,
    cardInfo: cardInfoSchema,
    failureReason: String,
    provider: String,
    refundStatus: {
      type: String,
      enum: Object.values(RefundStatus),
      default: RefundStatus.NONE,
    },
    refundAmount: Number,
  },
  {
    timestamps: true,
  }
);

export const Payment = mongoose.model<PaymentDocument>(
  "Payment",
  paymentSchema
);
