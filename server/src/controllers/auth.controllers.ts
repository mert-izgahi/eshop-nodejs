import { type Request, type Response } from "express";
import Account from "../models/account.model";
import { ConflictError } from "../utils/api-errors";
import { sendSuccessResponse } from "../utils";

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
