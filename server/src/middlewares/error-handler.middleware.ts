import { ApiError } from "../utils/api-errors";
import { type Request, type Response, type NextFunction } from "express";
import { log } from "../utils/logger";

export const errorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(err);
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      success: false,
      title: err.title,
      message: err.message,
      status: err.status,
    });
  }

  return res.status(500).json({
    success: false,
    title: "Unknown",
    message: "Unknown Error",
    status: 500,
  });
};
