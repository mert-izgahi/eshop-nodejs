import { type Response } from "express";

export const sendSuccessResponse = (
  res: Response,
  status: number,
  message: string,
  data: any,
) => {
  return res.status(status).json({ success: true, message, data });
};

export const setAccessToken = (res: Response, token: string) => {
  res.cookie("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // prevent CSRF
    //maxAge: 1000 * 60 * 60 * 1, // 1 hour
    maxAge: 1000 * 60 * 1, // 1 minutes
  });
};

export const setRefreshToken = (res: Response, token: string) => {
  res.cookie("refresh_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // prevent CSRF
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
  });
};

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
