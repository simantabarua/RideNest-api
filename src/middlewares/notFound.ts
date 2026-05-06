import { StatusCodes } from "http-status-codes";

export const notFound = (req: any, res: any) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: "API Not Found",
    error: "",
  });
};
