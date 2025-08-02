import { Request, Response } from "express";
import { PaymentService } from "./payment.service";
import { StatusCodes } from "http-status-codes";
import { PaymentStatus } from "./payment.interface";
import { sendResponse } from "../../utils/sendResponse";

export const PaymentController = {
  createPayment: async (req: Request, res: Response) => {
    const payment = await PaymentService.createPayment(req.body);
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Payment created successfully",
      data: payment,
    });
  },

  getPayment: async (req: Request, res: Response) => {
    const payment = await PaymentService.getPaymentById(req.params.paymentId);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Payment fetched successfully",
      data: payment,
    });
  },

  updatePaymentStatus: async (req: Request, res: Response) => {
    const { status, completedAt } = req.body;

    if (!Object.values(PaymentStatus).includes(status)) {
      return sendResponse(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        success: false,
        message: "Invalid payment status value",
      });
    }

    const payment = await PaymentService.updatePaymentStatus(
      req.params.paymentId,
      status,
      completedAt ? new Date(completedAt) : undefined
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Payment status updated",
      data: payment,
    });
  },
};
