import { type Request, type Response } from "express";
import { sendSuccessResponse } from "../utils";

export const checkHealth = async (req: Request, res: Response) => {
  const message = "Server is running!!!";
  const timestamp = new Date().toISOString();
  const apiVersion = "1.0.0";
  const environment = process.env.NODE_ENV || "development";
  const uptime = process.uptime();
  sendSuccessResponse(res, 200, message, {
    timestamp,
    apiVersion,
    environment,
    uptime,
  });
};
