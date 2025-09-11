
import { AdminAccessError, UnauthorizedError } from "../utils/api-errors";
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

    if (!account.adminAccessKey) {
      throw new AdminAccessError("Admin access key required");
    }

    if (!account.adminAccessKeyExpires) {
      throw new AdminAccessError("Admin access key expired");
    }

    const now = new Date();
    const expiresAt = new Date(account.adminAccessKeyExpires);
    
    if (expiresAt <= now) {
      // Clean up expired key
      await Account.findByIdAndUpdate(account._id, {
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

// Optional: Middleware to refresh admin access if it's about to expire
export const refreshAdminAccessIfNeeded = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const account = res.locals.account;
    
    if (account && account.role === 'admin' && account.adminAccessKeyExpires) {
      const now = new Date();
      const expiresAt = new Date(account.adminAccessKeyExpires);
      const timeUntilExpiry = expiresAt.getTime() - now.getTime();
      const fifteenMinutes = 15 * 60 * 1000;

      // If less than 15 minutes remaining, add a header to inform frontend
      if (timeUntilExpiry > 0 && timeUntilExpiry < fifteenMinutes) {
        res.setHeader('X-Admin-Access-Expiring-Soon', 'true');
        res.setHeader('X-Admin-Access-Expires-At', expiresAt.toISOString());
      }
    }

    next();
  } catch (error) {
    log.error(error);
    next(error);
  }
};