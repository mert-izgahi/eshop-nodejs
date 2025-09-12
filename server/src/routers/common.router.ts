import { Router } from "express";
import { tryCatchMiddleware } from "../middlewares/try-catch.middleware";
import {
    checkHealth,
    getCategories,
    getCategory,
} from "../controllers/common.controllers";

const router = Router();


router.get("/health", tryCatchMiddleware(checkHealth));

// Categories
router.get("/categories", tryCatchMiddleware(getCategories));
router.get("/categories/:id", tryCatchMiddleware(getCategory));

export { router as commonRouter };