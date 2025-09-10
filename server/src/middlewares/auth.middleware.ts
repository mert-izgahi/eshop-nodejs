import { UnauthorizedError } from "../utils/api-errors";
import { type Request, type Response, type NextFunction } from "express";
import { log } from "../utils/logger";
import { JwtService, type IPayload } from "../services/jwt";
import Account from "../models/account.model";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) throw new UnauthorizedError("Please provide a token");
    const isExpired = JwtService.isTokenExpired(token);
    if (isExpired) throw new UnauthorizedError("Token expired");
    const payload = JwtService.verifyToken(token) as IPayload;
    const account = await Account.findById(payload.id).select("-password");
    if (!account) throw new UnauthorizedError("Account not found");
    if (!account.isActive) throw new UnauthorizedError("Account is not active");
    res.locals.account = account;
    next();
  } catch (error) {
    log.error(error);
    next(error);
  }
};

export const authorizeFor = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const account = res.locals.account;
      if (!account) throw new UnauthorizedError("Account not found");
      if (!roles.includes(account.role))
        throw new UnauthorizedError("Unauthorized");
      next();
    } catch (error) {
      log.error(error);
      next(error);
    }
  };
};
