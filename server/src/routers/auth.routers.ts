import { Router, type Request, type Response } from "express";
import { tryCatchMiddleware } from "../middlewares/try-catch.middleware";
import {
  register,
  login,
  getMe,
  updateMe,
  updatePassword,
  logout,
  resetPasswordRequest,
  resetPassword,
  resendVerificationEmail,
  verifyEmail,
  deleteAccount,
  requestAdminAccess,
  verifyAdminAccess,
  checkAdminStatus
} from "../controllers/auth.controllers";
import { authMiddleware, authorizeFor } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", tryCatchMiddleware(register));
router.post("/login", tryCatchMiddleware(login));
router.get("/me", authMiddleware, tryCatchMiddleware(getMe));
router.post("/logout", authMiddleware, tryCatchMiddleware(logout));
router.patch("/update-me", authMiddleware, tryCatchMiddleware(updateMe));
router.patch(
  "/update-password",
  authMiddleware,
  tryCatchMiddleware(updatePassword),
);
router.post(
  "/reset-password-request",
  tryCatchMiddleware(resetPasswordRequest),
);
router.post("/reset-password", tryCatchMiddleware(resetPassword));
router.post(
  "/resend-verification-email",
  tryCatchMiddleware(resendVerificationEmail),
);
router.post("/verify-email", tryCatchMiddleware(verifyEmail));
router.delete("/me", authMiddleware, tryCatchMiddleware(deleteAccount));
router.post("/request-admin-access", authMiddleware, authorizeFor(["admin"]), tryCatchMiddleware(requestAdminAccess));
router.post("/verify-admin-access", authMiddleware, authorizeFor(["admin"]), tryCatchMiddleware(verifyAdminAccess));
router.get("/admin-status", authMiddleware, authorizeFor(["admin"]), tryCatchMiddleware(checkAdminStatus));
export { router as authRouter };
