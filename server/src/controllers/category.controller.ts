import { type Request, type Response } from "express";
import { sendSuccessResponse } from "../utils";
import { NotFoundError } from "../utils/api-errors";
import Category from "../models/category.model";

import { getCategoriesQuery } from "../utils/query-helpers";

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