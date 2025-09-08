import { type Request, type Response } from "express";
import Account from "../models/account.model";
import {
  ConflictError,
  UnauthorizedError,
  BadRequestError,
} from "../utils/api-errors";
import { sendSuccessResponse, setAccessToken, setRefreshToken } from "../utils";
import { JwtService, type IPayload } from "../services/jwt";

export const register = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName, provider } = req.body;

  const existingAccount = await Account.findOne({ email });
  if (existingAccount) {
    throw new ConflictError("Email already in use");
  }

  const account = new Account({
    firstName,
    lastName,
    email,
    password,
    provider,
  });

  await account.save();

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

  const isMatch = await account.comparePassword(currentPassword);

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
