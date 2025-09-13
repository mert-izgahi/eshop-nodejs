import { Router } from "express";
import { tryCatchMiddleware } from "../middlewares/try-catch.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import { uploadDocument, uploadSingle } from "../controllers/storage.controller";
import { uploadDocFile, uploadSingleFile } from "../middlewares/storage.middleware";


const router = Router();

router.post("/upload-image", authMiddleware, uploadSingleFile, tryCatchMiddleware(uploadSingle));
router.post("/upload-doc", uploadDocFile, tryCatchMiddleware(uploadDocument));

export { router as storageRouter };