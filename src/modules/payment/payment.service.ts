import { Payment } from "./payment.model";
import { IPayment, PaymentStatus } from "./payment.interface";
import AppError from "../../errorHelper/AppError";
import { StatusCodes } from "http-status-codes";

const createPayment = async (data: IPayment) => {
  const payment = await Payment.create(data);
  return payment;
};

const getPaymentById = async (paymentId: string) => {
  const payment = await Payment.findById(paymentId);
  if (!payment) throw new AppError("Payment not found", StatusCodes.NOT_FOUND);
  return payment;
};

const updatePaymentStatus = async (
  paymentId: string,
  status: PaymentStatus,
  completedAt?: Date
) => {
  const payment = await Payment.findById(paymentId);
  if (!payment) throw new AppError("Payment not found", StatusCodes.NOT_FOUND);

  payment.paymentStatus = status;
  if (completedAt) payment.completedAt = completedAt;

  await payment.save();
  return payment;
};

export const PaymentService = {
  createPayment,
  getPaymentById,
  updatePaymentStatus,
};
