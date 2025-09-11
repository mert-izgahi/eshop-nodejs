import { type Request, type Response } from "express";
import Category from "../models/category.model";
import { sendSuccessResponse } from "../utils";
import { NotFoundError } from "../utils/api-errors";

// @desc Get all categories 
// @route GET /api/v1/categories
// @access Public
export const getCategories = async (req: Request, res: Response) => {
    const categories = await Category.find();
    sendSuccessResponse(res, 200, "Categories", categories);
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
    if(!category) {
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
    if(!category) {
        throw new NotFoundError("Category not found");
    }
    sendSuccessResponse(res, 200, "Category deleted", true);
};

