import { type Request, type Response } from "express";
import Account from "../models/account.model";
import { ConflictError, UnauthorizedError } from "../utils/api-errors";
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
