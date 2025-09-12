import { Router } from "express";
import { tryCatchMiddleware } from "../middlewares/try-catch.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  register,
  registerAsPartner,
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
} from "../controllers/auth.controllers";


const router = Router();

router.post("/register", tryCatchMiddleware(register));
router.post("/register-as-partner", tryCatchMiddleware(registerAsPartner));
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

export { router as authRouter };
