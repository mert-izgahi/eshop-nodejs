import { Router } from "express";
import { tryCatchMiddleware } from "../middlewares/try-catch.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import { uploadSingle } from "../controllers/storage.controller";
import { uploadSingleFile } from "../middlewares/storage.middleware";


const router = Router();

router.post("/upload-image", authMiddleware, uploadSingleFile, tryCatchMiddleware(uploadSingle));

export { router as storageRouter };