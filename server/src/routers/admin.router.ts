import { Router } from "express";
import { tryCatchMiddleware } from "../middlewares/try-catch.middleware";
import { authMiddleware, authorizeFor } from "../middlewares/auth.middleware";
import {
    checkAdminStatus, requestAdminAccess, verifyAdminAccess, adminCreateCategory, adminUpdateCategory, adminDeleteCategory, adminDuplicateCategory,
    adminGetAccounts, adminGetAccount, adminDeleteAccount, adminUpdateAccount, adminGetCustomers
} from "../controllers/admin.controllers";

const router = Router();


// Profile
router.post("/request-admin-access", authMiddleware, authorizeFor(["admin"]), tryCatchMiddleware(requestAdminAccess));
router.post("/verify-admin-access", authMiddleware, authorizeFor(["admin"]), tryCatchMiddleware(verifyAdminAccess));
router.get("/check-admin-status", authMiddleware, authorizeFor(["admin"]), tryCatchMiddleware(checkAdminStatus));


// Categories
router.post("/categories", authMiddleware, authorizeFor(["admin"]), tryCatchMiddleware(adminCreateCategory));
router.put("/categories/:id", authMiddleware, authorizeFor(["admin"]), tryCatchMiddleware(adminUpdateCategory));
router.delete("/categories/:id", authMiddleware, authorizeFor(["admin"]), tryCatchMiddleware(adminDeleteCategory));
router.post("/categories/:id/duplicate", authMiddleware, authorizeFor(["admin"]), tryCatchMiddleware(adminDuplicateCategory));


// Accounts
router.get("/accounts", authMiddleware, authorizeFor(["admin"]), tryCatchMiddleware(adminGetAccounts));
router.get("/accounts/:id", authMiddleware, authorizeFor(["admin"]), tryCatchMiddleware(adminGetAccount));
router.delete("/accounts/:id", authMiddleware, authorizeFor(["admin"]), tryCatchMiddleware(adminDeleteAccount));
router.put("/accounts/:id", authMiddleware, authorizeFor(["admin"]), tryCatchMiddleware(adminUpdateAccount));

// Customers
router.get("/customers",authMiddleware,authorizeFor(["admin"]),tryCatchMiddleware(adminGetCustomers));

export { router as adminRouter };