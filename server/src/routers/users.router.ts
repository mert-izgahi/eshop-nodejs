import { Router } from "express";
import { tryCatchMiddleware } from "../middlewares/try-catch.middleware";
import { adminGetCustomers, adminGetUser, adminDeleteUser, adminUpdateUser } from "../controllers/users.controller";
import { authMiddleware, adminAccessMiddleware } from "../middlewares/auth.middleware";

const router = Router();
// Admin Routes
router.get("/customers", authMiddleware, adminAccessMiddleware, tryCatchMiddleware(adminGetCustomers));
router.get("/:id", authMiddleware, adminAccessMiddleware, tryCatchMiddleware(adminGetUser));
router.delete("/:id", authMiddleware, adminAccessMiddleware, tryCatchMiddleware(adminDeleteUser));
router.put("/:id", authMiddleware, adminAccessMiddleware, tryCatchMiddleware(adminUpdateUser));

export { router as usersRouter };