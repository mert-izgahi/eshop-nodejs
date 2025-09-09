import { type Request, type Response } from "express";
import Account from "../models/account.model";
import {
  ConflictError,
  UnauthorizedError,
  BadRequestError,
  NotFoundError,
  ValidationError,
} from "../utils/api-errors";
import {
  generateOTP,
  sendSuccessResponse,
  setAccessToken,
  setRefreshToken,
} from "../utils";
import { JwtService, type IPayload } from "../services/jwt";
import { log } from "../utils/logger";
import mailService from "../services/mail";
import redisService from "../services/redis";
import crypto from "crypto";

export const register = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;

  const existingAccount = await Account.findOne({ email });
  if (existingAccount) {
    throw new ConflictError("Email already in use");
  }

  const account = new Account({
    firstName,
    lastName,
    email,
    password,
  });

  await account.save();

  await mailService.sendWelcomeEmail(account.email);

  sendSuccessResponse(res, 201, "Account created successfully", account);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const account = await Account.findOne({ email });
  if (!account) {
    throw new UnauthorizedError("Email not found");
  }

  const isPasswordValid = await account.comparePassword(password);
  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid password");
  }

  if (!account.isActive) {
    throw new UnauthorizedError("Account is not active");
  }

  const tokenPayload = { id: account._id } as IPayload;
  const tokens = JwtService.generateTokenPair(tokenPayload);

  // Set tokens in response cookies
  setAccessToken(res, tokens.accessToken);
  setRefreshToken(res, tokens.refreshToken);

  sendSuccessResponse(res, 200, "Login successful", tokens);
};

export const getMe = async (req: Request, res: Response) => {
  const account = res.locals.account;
  sendSuccessResponse(res, 200, "Account details", account);
};

export const updateMe = async (req: Request, res: Response) => {
  const account = res.locals.account;
  const { firstName, lastName, profilePicture } = req.body;

  account.firstName = firstName;
  account.lastName = lastName;
  account.profilePicture = profilePicture;
  await account.save();

  sendSuccessResponse(res, 200, "Account updated", true);
};

export const updatePassword = async (req: Request, res: Response) => {
  const account = res.locals.account;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new BadRequestError("Current password and new password are required");
  }
  const currentAccount = await Account.findById(account._id);
  if (!currentAccount) {
    throw new NotFoundError("Account not found");
  }
  const isMatch = await currentAccount.comparePassword(currentPassword);

  if (!isMatch) {
    throw new UnauthorizedError("Invalid current password");
  }

  account.password = newPassword;
  await account.save();

  sendSuccessResponse(res, 200, "Password updated", true);
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  sendSuccessResponse(res, 200, "Logout successful", true);
};

export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refresh_token;

  if (!refreshToken) {
    throw new UnauthorizedError("No refresh token provided");
  }

  const decoded = JwtService.verifyToken(refreshToken) as IPayload;
  const account = await Account.findById(decoded.id);

  if (!account) {
    throw new UnauthorizedError("Invalid refresh token");
  }

  const tokenPayload = { id: account._id } as IPayload;
  const newAccessToken = JwtService.generateAccessToken(tokenPayload);

  // Set new access token in response cookies
  setAccessToken(res, newAccessToken);

  sendSuccessResponse(res, 200, "Tokens refreshed successfully", true);
};

export const resetPasswordRequest = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new BadRequestError("Email is required");
  }

  const account = await Account.findOne({ email });

  if (!account) {
    throw new NotFoundError("Account not found");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  const redisData = {
    token: resetToken,
    createdAt: Date.now(),
    accountId: account._id,
  };
  const redisKey = `password_reset:${resetToken}`;

  await redisService.set(redisKey, JSON.stringify(redisData), { EX: 3600 }); // Set expiration time to 1 hour

  try {
    await mailService.sendResetPasswordEmail(email, resetToken);
    log.info(`Password reset email sent to: ${email}`);
  } catch (emailError: any) {
    log.error("Failed to send reset password email:", emailError);
    // Clean up Redis entry if email fails
    try {
      await redisService.del(redisKey);
    } catch (cleanupError: any) {
      log.error(
        "Failed to cleanup Redis entry after email failure:",
        cleanupError,
      );
    }
    throw new Error("Failed to send reset password email");
  }

  sendSuccessResponse(res, 200, "Reset password email sent", true);
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  log.info(`Received token: ${token} and new password: ${newPassword}`);

  if (!token || !newPassword) {
    throw new ValidationError("Token and new password are required");
  }

  // Retrieve token data from Redis

  const redisKey = `password_reset:${token}`;
  log.info(`Redis key: ${redisKey}`);
  const tokenDataStr = await redisService.get(redisKey);
  log.info(`Token data retrieved from Redis: ${tokenDataStr}`);
  const isExists = await redisService.exists(redisKey);
  if (!isExists || !tokenDataStr) {
    throw new UnauthorizedError("Invalid or expired reset token");
  }
  log.info(`Token data retrieved from Redis: ${tokenDataStr}`);

  const tokenData = JSON.parse(tokenDataStr) as {
    accountId: string;
    token: string;
    createdAt: string;
  };

  if (!token || !newPassword) {
    throw new BadRequestError("Token and new password are required");
  }

  // Optional: Check token age (Redis expiration should handle this, but double-check)
  const tokenAge = Date.now() - new Date(tokenData.createdAt).getTime();
  const fifteenMinutes = 15 * 60 * 1000; // 50 minutes

  if (tokenAge > fifteenMinutes) {
    await redisService.del(redisKey);
    throw new UnauthorizedError("Reset token has expired");
  }

  const account = await Account.findById(tokenData.accountId);

  if (!account) {
    throw new UnauthorizedError("Invalid token");
  }

  account.password = newPassword;
  await account.save();

  // Clear the Redis entry after successful password reset
  await redisService.del(redisKey);

  sendSuccessResponse(res, 200, "Password reset successful", true);
};

export const resendVerificationEmail = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new BadRequestError("Email is required");
  }

  const account = await Account.findOne({ email });

  if (!account) {
    throw new NotFoundError("Account not found");
  }

  const token = crypto.randomBytes(32).toString("hex");
  const otp = generateOTP();

  const redisKey = `verification:${token}`;
  await redisService.set(
    redisKey,
    JSON.stringify({ accountId: account.id, token, otp }),
    { EX: 60 * 60 }, // Set expiration time to 1 hour
  );

  try {
    await mailService.sendVerificationEmail(email, token);
  } catch (error) {
    await redisService.del(redisKey);
    throw new BadRequestError("Failed to send verification email");
  }

  sendSuccessResponse(res, 200, "Verification email sent", true);
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { token, otp } = req.body;

  if (!token || !otp) {
    throw new BadRequestError("Token and OTP are required");
  }

  const redisKey = `verification:${token}`;
  const redisData = await redisService.get(redisKey);

  if (!redisData) {
    throw new UnauthorizedError("Invalid token");
  }

  const { accountId, token: redisToken, otp: redisOtp } = JSON.parse(redisData);

  if (token !== redisToken || otp !== redisOtp) {
    throw new UnauthorizedError("Invalid OTP");
  }

  const account = await Account.findById(accountId);

  if (!account) {
    throw new NotFoundError("Account not found");
  }

  account.verified = true;
  await account.save();

  await redisService.del(redisKey);

  sendSuccessResponse(res, 200, "Email verified successfully", true);
};

export const deleteAccount = async (req: Request, res: Response) => {
  const { account } = res.locals;

  if (!account) {
    throw new NotFoundError("Account not found");
  }

  if (!account.isActive) {
    throw new BadRequestError("Account is already inactive");
  }

  account.isActive = false;
  await account.save();

  // Clear access token cookie
  res.clearCookie("access_token");

  // Clear refresh token cookie
  res.clearCookie("refresh_token");

  sendSuccessResponse(res, 200, "Account deleted successfully", true);
};
