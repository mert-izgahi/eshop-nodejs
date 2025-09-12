import { type Request, type Response } from "express";
import { sendSuccessResponse } from "../utils";
import { NotFoundError } from "../utils/api-errors";
import { getAccountsQuery } from "../utils/query-helpers";
import Account from "../models/account.model";

// @desc Get all users
// @route GET /api/v1/admin/users
// @access Private (Only for users with admin role)
export const adminGetCustomers = async (req: Request, res: Response) => {
    const { page, limit, skip, queryObj, sortBy, sortType } = getAccountsQuery(req);
    const users = await Account.find({ role: "customer", isActive: true, ...queryObj }).skip(skip).limit(limit).
        sort({ [sortBy as string]: sortType });

    const totalResults = await Account.countDocuments({ role: "customer", ...queryObj });
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


// @desc Get single user
// @route GET /api/v1/admin/users/:id
// @access Private (Only for users with admin role)
export const adminGetUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await Account.findById(id);
    if (!user) {
        throw new NotFoundError("User not found");
    }
    sendSuccessResponse(res, 200, "User fetched successfully", user);
};


// @desc Update user
// @route PUT /api/v1/admin/users/:id
// @access Private (Only for users with admin role)
export const adminUpdateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await Account.findByIdAndUpdate(id, { ...req.body }, { new: true });
    if (!user) {
        throw new NotFoundError("User not found");
    }
    sendSuccessResponse(res, 200, "User updated successfully", user);
};


// @desc Delete user
// @route DELETE /api/v1/admin/users/:id
// @access Private (Only for users with admin role)
export const adminDeleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await Account.softDelete(id);
    console.log(user)
    if (!user) {
        throw new NotFoundError("User not found");
    }
    sendSuccessResponse(res, 200, "User deleted successfully", user);
};