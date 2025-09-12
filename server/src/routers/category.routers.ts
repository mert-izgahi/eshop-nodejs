import { Router } from "express";
import { tryCatchMiddleware } from "../middlewares/try-catch.middleware";
import {
    getCategories,
    getCategory,
    adminCreateCategory,
    adminUpdateCategory,
    adminDeleteCategory,
    adminDuplicateCategory
} from "../controllers/category.controller";
import { authMiddleware, adminAccessMiddleware } from "../middlewares/auth.middleware";
const router = Router();
router.get("/", tryCatchMiddleware(getCategories));
router.get("/:id", tryCatchMiddleware(getCategory));
router.post("/", authMiddleware, adminAccessMiddleware, tryCatchMiddleware(adminCreateCategory));
router.put("/:id", authMiddleware, adminAccessMiddleware, tryCatchMiddleware(adminUpdateCategory));
router.delete("/:id", authMiddleware, adminAccessMiddleware, tryCatchMiddleware(adminDeleteCategory));
router.post("/:id/duplicate", authMiddleware, adminAccessMiddleware, tryCatchMiddleware(adminDuplicateCategory));

export { router as categoryRouter };