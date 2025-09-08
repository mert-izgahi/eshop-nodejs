import { type Response } from "express";

export const sendSuccessResponse = (
  res: Response,
  status: number,
  message: string,
  data: any,
) => {
  return res.status(status).json({ success: true, message, data });
};
