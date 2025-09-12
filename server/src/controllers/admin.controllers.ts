import { type Request, type Response } from "express";
import AdminProfile from "../models/admin.model";
import mailService from "../services/mail";
import redisService from "../services/redis";
import crypto from "crypto";
import {
    generateOTP,
    sendSuccessResponse,
} from "../utils";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../utils/api-errors";
import Category from "../models/category.model";
import { getAccountsQuery } from "../utils/query-helpers";
import Account from "../models/account.model";
import CustomerProfile from "../models/customer.model";

// ======================================================================================================
// Profile
// ======================================================================================================

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
    await AdminProfile.findOneAndUpdate({ accountId: account._id }, {
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
    const adminAccessKeyExpires = new Date(Date.now() + 60 * 60 * 1000 * 24 * 30);  // 30 days

    await AdminProfile.findOneAndUpdate({ accountId: account._id }, {
        adminAccessKey,
        adminAccessKeyExpires
    });

    await redisService.del(redisKey);

    sendSuccessResponse(res, 200, "Admin access verified successfully", true);
};

// @desc Check admin access status
// @route GET /auth/admin-status
// @access Private (Admin only)
export const checkAdminStatus = async (req: Request, res: Response) => {
    const account = res.locals.account;

    if (!account || account.role !== 'admin') {
        throw new UnauthorizedError("Unauthorized");
    }

    const profile = await AdminProfile.findOne({ accountId: account._id });

    if (!profile) {
        throw new BadRequestError("Admin profile not found");
    }
    const hasValidAdminAccess = profile.adminAccessKey &&
        profile.adminAccessKeyExpires &&
        new Date(profile.adminAccessKeyExpires) > new Date();

    sendSuccessResponse(res, 200, "Admin status retrieved", {
        hasValidAdminAccess,
        adminAccessKeyExpires: profile.adminAccessKeyExpires
    });
};


// ======================================================================================================
// Categories
// ======================================================================================================

// @desc Create new category
// @route POST /api/v1/admin/categories
// @access Private (Only for users with admin role)
export const adminCreateCategory = async (req: Request, res: Response) => {
    const { name, description, image, parent } = req.body;
    const category = new Category({ name, description, image, parent });
    await category.save();
    sendSuccessResponse(res, 201, "Category created", true);
};

// @desc Update category
// @route PUT /api/v1/admin/categories/:id
// @access Private (Only for users with admin role)
export const adminUpdateCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, image, parent } = req.body;
    const category = await Category.findByIdAndUpdate(id, { name, description, image, parent }, { new: true });
    if (!category) {
        throw new NotFoundError("Category not found");
    }
    sendSuccessResponse(res, 200, "Category updated", true);
};

// @desc Delete category
// @route DELETE /api/v1/admin/categories/:id
// @access Private (Only for users with admin role)
export const adminDeleteCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
        throw new NotFoundError("Category not found");
    }
    sendSuccessResponse(res, 200, "Category deleted", true);
};


// @desc Duplicate category
// @route POST /api/v1/admin/categories/:id/duplicate
// @access Private (Only for users with admin role)
export const adminDuplicateCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
        throw new NotFoundError("Category not found");
    }

    const newCategory = await Category.create({
        name: `Copy of ${category.name}`,
        description: category.description,
        image: category.image,
    });
    console.log(newCategory);

    sendSuccessResponse(res, 200, "Category duplicated", true);
};


// ======================================================================================================
// Accounts
// ======================================================================================================
// @desc Get all accounts
// @route GET /api/v1/admin/accounts
// @access Private (Only for users with admin role)
export const adminGetAccounts = async (req: Request, res: Response) => {
    const { page, limit, skip, queryObj, sortBy, sortType } = getAccountsQuery(req);
    const users = await Account.find({ isActive: true, ...queryObj }).skip(skip).limit(limit).
        sort({ [sortBy as string]: sortType });

    const totalResults = await Account.countDocuments({ ...queryObj });
    const totalPages = Math.ceil(totalResults / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    const response = {
        results: users,
        pagination: {
            page,
            limit,
            totalResults,
            totalPages,
            hasNextPage,
            hasPrevPage
        }
    }
    sendSuccessResponse(res, 200, "Users fetched successfully", response);
};


// @desc Get single account
// @route GET /api/v1/admin/accounts/:id
// @access Private (Only for users with admin role)
export const adminGetAccount = async (req: Request, res: Response) => {
    const { id } = req.params;
    const account = await Account.findById(id);
    if (!account) {
        throw new NotFoundError("User not found");
    }
    sendSuccessResponse(res, 200, "User fetched successfully", account);
};


// @desc Update account
// @route PUT /api/v1/admin/accounts/:id
// @access Private (Only for users with admin role)
export const adminUpdateAccount = async (req: Request, res: Response) => {
    const { id } = req.params;
    const account = await Account.findByIdAndUpdate(id, { ...req.body }, { new: true });
    if (!account) {
        throw new NotFoundError("User not found");
    }
    sendSuccessResponse(res, 200, "User updated successfully", true);
};


// @desc Delete account
// @route DELETE /api/v1/admin/accounts/:id
// @access Private (Only for users with admin role)
export const adminDeleteAccount = async (req: Request, res: Response) => {
    const { id } = req.params;
    const account = await Account.softDelete(id);

    if (!account) {
        throw new NotFoundError("User not found");
    }
    sendSuccessResponse(res, 200, "User deleted successfully", true);
};

// ======================================================================================================
// Customer Profiles
// ======================================================================================================

export const adminGetCustomers = async (req: Request, res: Response) => {
    const { page, limit, skip, queryObj, sortBy, sortType } = getAccountsQuery(req);
    const users = await CustomerProfile.find({ ...queryObj }).skip(skip).limit(limit).
        sort({ [sortBy as string]: sortType });

    const totalResults = await CustomerProfile.countDocuments(queryObj);
    const totalPages = Math.ceil(totalResults / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    const response = {
        results: users,
        pagination: {
            page,
            limit,
            totalResults,
            totalPages,
            hasNextPage,
            hasPrevPage
        }
    }
    sendSuccessResponse(res, 200, "Customers fetched successfully", response);
};