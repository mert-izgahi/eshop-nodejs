import { type Request, type Response } from "express";
import PartnerProfile from "../models/partner.model";
import mailService from "../services/mail";
import redisService from "../services/redis";
import crypto from "crypto";
import {
    generateOTP,
    sendSuccessResponse,
} from "../utils";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../utils/api-errors";


// ======================================================================================================
// Profile
// ======================================================================================================

// @desc Request partner access
// @route POST /partner/request-partner-access
// @access Private (Only for users with partner role)
export const requestPartnerAccess = async (req: Request, res: Response) => {
    const account = res.locals.account;

    if (!account) {
        throw new BadRequestError("Account not found");
    }

    if (account.role !== 'partner') {
        throw new UnauthorizedError("You are not authorized to request partner access");
    }

    if (!account.isActive) {
        throw new UnauthorizedError("Account is not active");
    }

    // Clear any existing partner access first
    await PartnerProfile.findOneAndUpdate({ accountId: account._id }, {
        $unset: {
            partnerAccessKey: 1,
            partnerAccessKeyExpires: 1
        }
    });

    const partnerKey = generateOTP();
    const redisKey = `partner_access:${partnerKey}`;

    await redisService.set(
        redisKey,
        JSON.stringify({ accountId: account._id, partnerKey }),
        { EX: 30 * 60 } // 30 minutes
    );

    try {
        await mailService.sendPartnerAccessEmail(account.email, partnerKey);
    } catch (error) {
        await redisService.del(redisKey);
        throw new BadRequestError("Failed to send partner access email");
    }

    sendSuccessResponse(res, 200, "Partner access email sent successfully", true);
};

// @desc Verify partner access
// @route POST /auth/verify-admin-access
// @access Private (Only for users with admin role)
export const verifyPartnerAccess = async (req: Request, res: Response) => {
    const { partnerKey } = req.body;
    const account = res.locals.account;

    if (!partnerKey) {
        throw new BadRequestError("Partner key is required");
    }

    if (!account || account.role !== 'partner') {
        throw new UnauthorizedError("Unauthorized");
    }

    const redisKey = `partner_access:${partnerKey}`;
    const redisData = await redisService.get(redisKey);

    if (!redisData) {
        throw new UnauthorizedError("Invalid or expired partner key");
    }

    const { accountId, partnerKey: storedPartnerKey } = JSON.parse(redisData);

    if (storedPartnerKey !== partnerKey || accountId !== account._id.toString()) {
        throw new UnauthorizedError("Invalid partner key");
    }

    // Generate new admin access token
    const partnerAccessKey = crypto.randomBytes(32).toString("hex");
    const partnerAccessKeyExpires = new Date(Date.now() + 60 * 60 * 1000 * 24 * 30);  // 30 days

    await PartnerProfile.findOneAndUpdate({ accountId: account._id }, {
        partnerAccessKey,
        partnerAccessKeyExpires,
    });

    await redisService.del(redisKey);


    sendSuccessResponse(res, 200, "Partner access verified successfully", true);
};

// @desc Check partner access status
// @route GET /partner/check-partner-status
// @access Private (Partner only)
export const checkPartnerStatus = async (req: Request, res: Response) => {
    const account = res.locals.account;

    if (!account || account.role !== 'partner') {
        throw new UnauthorizedError("Unauthorized");
    }

    const profile = await PartnerProfile.findOne({ accountId: account._id });

    if (!profile) {
        throw new BadRequestError("Partner profile not found");
    }
    const hasValidPartnerAccess = profile.partnerAccessKey &&
        profile.partnerAccessKeyExpires &&
        new Date(profile.partnerAccessKeyExpires) > new Date();

    sendSuccessResponse(res, 200, "Partner status retrieved", {
        hasValidPartnerAccess,
        partnerAccessKeyExpires: profile.partnerAccessKeyExpires,
        onboarding: profile.onboarding
    });
};