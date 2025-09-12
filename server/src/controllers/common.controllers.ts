import { type Request, type Response } from "express";
import { sendSuccessResponse } from "../utils";
import { NotFoundError } from "../utils/api-errors";
import Category from "../models/category.model";
import { getCategoriesQuery } from "../utils/query-helpers";

// @desc Health check
// @route GET /api/v1/health
// @access Public
export const checkHealth = async (req: Request, res: Response) => {
  const message = "Server is running!!!";
  const timestamp = new Date().toISOString();
  const apiVersion = "1.0.0";
  const environment = process.env.NODE_ENV || "development";
  const uptime = process.uptime();
  sendSuccessResponse(res, 200, message, {
    timestamp,
    apiVersion,
    environment,
    uptime,
  });
};

// @desc Get all categories 
// @route GET /api/v1/categories
// @access Public
export const getCategories = async (req: Request, res: Response) => {
    const { page, limit, skip, queryObj, sortBy, sortType } = getCategoriesQuery(req);
    const categories = await Category.find(queryObj).skip(skip).limit(limit).
        sort({ [sortBy as string]: sortType });

    const totalResults = await Category.countDocuments(queryObj);
    const totalPages = Math.ceil(totalResults / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    const response = {
        results: categories,
        pagination: {
            page,
            limit,
            totalResults,
            totalPages,
            hasNextPage,
            hasPrevPage
        }
    }
    sendSuccessResponse(res, 200, "Categories", response);
};

// @desc Get single category 
// @route GET /api/v1/categories/:id
// @access Public
export const getCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    const category = await Category.findById(id);
    sendSuccessResponse(res, 200, "Category", category);
};
