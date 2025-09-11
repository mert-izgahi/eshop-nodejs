
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
  setAccessToken
} from "../utils";
import { JwtService, type IPayload } from "../services/jwt";
import { log } from "../utils/logger";
import mailService from "../services/mail";
import redisService from "../services/redis";
import crypto from "crypto";

// @desc Register a new account
// @route POST /auth/register
// @access Public
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

  const accessToken = JwtService.generateAccessToken({ id: account._id } as IPayload);
  setAccessToken(res, accessToken);
  const response = { accessToken, ...account.toObject() }
  sendSuccessResponse(res, 201, "Account created successfully", response);
};

// @desc Login an existing account
// @route POST /auth/login
// @access Public
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

  const accessToken = JwtService.generateAccessToken({ id: account._id } as IPayload);
  setAccessToken(res, accessToken);

  // Always include fresh admin permission status
  const accountObj = account.toObject();
  const hasValidAdminAccess = account.role === 'admin' &&
    account.adminAccessKey &&
    account.adminAccessKeyExpires &&
    new Date(account.adminAccessKeyExpires) > new Date();

  const response = {
    accessToken,
    ...accountObj,
    hasValidAdminAccess
  };

  sendSuccessResponse(res, 200, "Login successful", response);
};

// @desc Logout user
// @route POST /auth/logout
// @access Private
export const logout = async (req: Request, res: Response) => {
  // Clear admin access key on logout for security
  const account = res.locals.account;
  if (account && account.role === 'admin') {
    await Account.findByIdAndUpdate(account._id, {
      $unset: {
        adminAccessKey: 1,
        adminAccessKeyExpires: 1
      }
    });
  }

  res.clearCookie("access_token");
  const response = { accessToken: null };
  sendSuccessResponse(res, 200, "Logout successful", response);
};


// @desc Get account details
// @route GET /auth/me
// @access Private
export const getMe = async (req: Request, res: Response) => {
  const account = res.locals.account;

  // Always return fresh admin permission status
  const hasValidAdminAccess = account.role === 'admin' &&
    account.adminAccessKey &&
    account.adminAccessKeyExpires &&
    new Date(account.adminAccessKeyExpires) > new Date();

  const accountData = {
    ...account.toObject(),
    hasValidAdminAccess
  };

  sendSuccessResponse(res, 200, "Account details", accountData);
};

// @desc Update account details
// @route PUT /auth/me
// @access Private
export const updateMe = async (req: Request, res: Response) => {
  const account = res.locals.account;
  const { firstName, lastName, profilePicture } = req.body;

  account.firstName = firstName;
  account.lastName = lastName;
  account.profilePicture = profilePicture;
  await account.save();

  sendSuccessResponse(res, 200, "Account updated", true);
};

// @desc Update account password
// @route PUT /auth/password
// @access Private
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

  // Clear admin access on password change for security
  if (currentAccount.role === 'admin') {
    currentAccount.adminAccessKey = undefined;
    currentAccount.adminAccessKeyExpires = undefined;
  }

  currentAccount.password = newPassword;
  await currentAccount.save();

  sendSuccessResponse(res, 200, "Password updated", true);
};

// @desc Reset password request
// @route POST /auth/reset-password
// @access Public
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

  await redisService.set(redisKey, JSON.stringify(redisData), { EX: 3600 });

  try {
    await mailService.sendResetPasswordEmail(email, resetToken);
    log.info(`Password reset email sent to: ${email}`);
  } catch (emailError: any) {
    log.error("Failed to send reset password email:", emailError);
    await redisService.del(redisKey).catch(err =>
      log.error("Failed to cleanup Redis entry:", err)
    );
    throw new Error("Failed to send reset password email");
  }

  sendSuccessResponse(res, 200, "Reset password email sent", true);
};

// @desc Reset password
// @route POST /auth/reset-password/verify
// @access Public
export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    throw new ValidationError("Token and new password are required");
  }

  const redisKey = `password_reset:${token}`;
  const tokenDataStr = await redisService.get(redisKey);

  if (!tokenDataStr) {
    throw new UnauthorizedError("Invalid or expired reset token");
  }

  const tokenData = JSON.parse(tokenDataStr) as {
    accountId: string;
    token: string;
    createdAt: number;
  };

  // Double-check token age
  const tokenAge = Date.now() - tokenData.createdAt;
  const oneHour = 60 * 60 * 1000;

  if (tokenAge > oneHour) {
    await redisService.del(redisKey);
    throw new UnauthorizedError("Reset token has expired");
  }

  const account = await Account.findById(tokenData.accountId);
  if (!account) {
    throw new UnauthorizedError("Invalid token");
  }

  // Clear admin access on password reset for security
  if (account.role === 'admin') {
    account.adminAccessKey = undefined;
    account.adminAccessKeyExpires = undefined;
  }

  account.password = newPassword;
  await account.save();
  await redisService.del(redisKey);

  sendSuccessResponse(res, 200, "Password reset successful", true);
};

// @desc Resend verification email
// @route POST /auth/resend-verification
// @access Public
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
    { EX: 60 * 60 }
  );

  try {
    await mailService.sendVerificationEmail(email, token);
  } catch (error) {
    await redisService.del(redisKey);
    throw new BadRequestError("Failed to send verification email");
  }

  sendSuccessResponse(res, 200, "Verification email sent", true);
};

// @desc Verify email
// @route POST /auth/verify-email
// @access Public
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

// @desc Delete account
// @route POST /auth/delete-account
// @access Private
export const deleteAccount = async (req: Request, res: Response) => {
  const { account } = res.locals;

  if (!account) {
    throw new NotFoundError("Account not found");
  }

  if (!account.isActive) {
    throw new BadRequestError("Account is already inactive");
  }

  account.isActive = false;
  // Clear admin access keys when deactivating
  if (account.role === 'admin') {
    account.adminAccessKey = undefined;
    account.adminAccessKeyExpires = undefined;
  }

  await account.save();
  res.clearCookie("access_token");

  sendSuccessResponse(res, 200, "Account deleted successfully", true);
};


// @desc Request admin access
// @route POST /auth/request-admin-access
// @access Private (Only for users with admin role)
export const requestAdminAccess = async (req: Request, res: Response) => {
  const account = res.locals.account;

  if (!account) {
    throw new BadRequestError("Account not found");
  }

  if (account.role !== 'admin') {
    throw new UnauthorizedError("You are not authorized to request admin access");
  }

  if (!account.isActive) {
    throw new UnauthorizedError("Account is not active");
  }

  // Clear any existing admin access first
  await Account.findByIdAndUpdate(account._id, {
    $unset: {
      adminAccessKey: 1,
      adminAccessKeyExpires: 1
    }
  });

  const adminKey = generateOTP();
  const redisKey = `admin_access:${adminKey}`;

  await redisService.set(
    redisKey,
    JSON.stringify({ accountId: account._id, adminKey }),
    { EX: 30 * 60 } // 30 minutes
  );

  try {
    await mailService.sendAdminAccessEmail(account.email, adminKey);
  } catch (error) {
    await redisService.del(redisKey);
    throw new BadRequestError("Failed to send admin access email");
  }

  sendSuccessResponse(res, 200, "Admin access email sent successfully", true);
};

// @desc Verify admin access
// @route POST /auth/verify-admin-access
// @access Private (Only for users with admin role)
export const verifyAdminAccess = async (req: Request, res: Response) => {
  const { adminKey } = req.body;
  const account = res.locals.account;

  if (!adminKey) {
    throw new BadRequestError("Admin key is required");
  }

  if (!account || account.role !== 'admin') {
    throw new UnauthorizedError("Unauthorized");
  }

  const redisKey = `admin_access:${adminKey}`;
  const redisData = await redisService.get(redisKey);

  if (!redisData) {
    throw new UnauthorizedError("Invalid or expired admin key");
  }

  const { accountId, adminKey: storedAdminKey } = JSON.parse(redisData);

  if (storedAdminKey !== adminKey || accountId !== account._id.toString()) {
    throw new UnauthorizedError("Invalid admin key");
  }

  // Generate new admin access token
  const adminAccessKey = crypto.randomBytes(32).toString("hex");
  const adminAccessKeyExpires = new Date(Date.now() + 60 * 60 * 1000 * 12); // 12 hour

  await Account.findByIdAndUpdate(accountId, {
    adminAccessKey,
    adminAccessKeyExpires
  });

  await redisService.del(redisKey);

  // Return updated user data with admin access
  const updatedAccount = await Account.findById(accountId).select("-password");
  const response = {
    ...updatedAccount?.toObject(),
    hasValidAdminAccess: true
  };

  sendSuccessResponse(res, 200, "Admin access verified successfully", response);
};

// @desc Check admin access status
// @route GET /auth/admin-status
// @access Private (Admin only)
export const checkAdminStatus = async (req: Request, res: Response) => {
  const account = res.locals.account;

  if (!account || account.role !== 'admin') {
    throw new UnauthorizedError("Unauthorized");
  }

  const hasValidAdminAccess = account.adminAccessKey &&
    account.adminAccessKeyExpires &&
    new Date(account.adminAccessKeyExpires) > new Date();

  sendSuccessResponse(res, 200, "Admin status retrieved", {
    hasValidAdminAccess,
    adminAccessKeyExpires: account.adminAccessKeyExpires
  });
};