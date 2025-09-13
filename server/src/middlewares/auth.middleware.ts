
import { AdminAccessError, PartnerAccessError, UnauthorizedError } from "../utils/api-errors";
import { type Request, type Response, type NextFunction } from "express";
import { log } from "../utils/logger";
import { JwtService, type IPayload } from "../services/jwt";
import Account from "../models/account.model";
import AdminProfile from "../models/admin.model";
import PartnerProfile from "../models/partner.model";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      throw new UnauthorizedError("Please provide a token");
    }

    const isExpired = JwtService.isTokenExpired(token);
    if (isExpired) {
      throw new UnauthorizedError("Token expired");
    }

    const payload = JwtService.verifyToken(token) as IPayload;
    const account = await Account.findById(payload.id).select("-password");

    if (!account) {
      throw new UnauthorizedError("Account not found");
    }

    if (!account.isActive) {
      throw new UnauthorizedError("Account is not active");
    }

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

      if (!account) {
        throw new UnauthorizedError("Account not found");
      }

      if (!roles.includes(account.role)) {
        throw new UnauthorizedError("Insufficient permissions");
      }

      next();
    } catch (error) {
      log.error(error);
      next(error);
    }
  };
};


export const adminAccessMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const account = res.locals.account;

    if (!account) {
      throw new AdminAccessError("Account not found");
    }

    if (account.role !== "admin") {
      throw new AdminAccessError("Admin role required");
    }

    const profile = await AdminProfile.findOne({ account: account._id });

    if (!profile) {
      throw new AdminAccessError("Admin profile not found");
    }
    const now = new Date();
    const expiresAt = new Date(profile.adminAccessKeyExpires);

    if (expiresAt <= now) {
      // Clean up expired key
      await AdminProfile.findOne({ account: account._id }, {
        $unset: {
          adminAccessKey: 1,
          adminAccessKeyExpires: 1
        }
      });
      throw new AdminAccessError("Admin access key expired");
    }

    next();
  } catch (error) {
    log.error(error);
    next(error);
  }
};


export const partnerAccessMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const account = res.locals.account;

    if (!account) {
      throw new PartnerAccessError("Account not found");
    }

    if (account.role !== "partner") {
      throw new PartnerAccessError("Partner role required");
    }
    
    
    const profile = await PartnerProfile.findOne({ accountId: account._id });

    if (!profile) {
      throw new PartnerAccessError("Partner profile not found");
    }
    const now = new Date();
    const expiresAt = new Date(profile.partnerAccessKeyExpires!);

    if (expiresAt <= now) {
      // Clean up expired key
      await PartnerProfile.findOne({ accountId: account._id }, {
        $unset: {
          partnerAccessKey: 1,
          partnerAccessKeyExpires: 1
        }
      });
      throw new PartnerAccessError("Partner access key expired");
    }

    next();
  } catch (error) {
    log.error(error);
    next(error);
  }
};