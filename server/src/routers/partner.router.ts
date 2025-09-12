import { Router } from "express";
import { tryCatchMiddleware } from "../middlewares/try-catch.middleware";
import { authMiddleware, authorizeFor } from "../middlewares/auth.middleware";
import { checkPartnerStatus, requestPartnerAccess, verifyPartnerAccess } from "../controllers/partner.controllers";

const router = Router();


// Profile
router.post("/request-partner-access", authMiddleware, authorizeFor(["partner"]), tryCatchMiddleware(requestPartnerAccess));
router.post("/verify-partner-access", authMiddleware, authorizeFor(["partner"]), tryCatchMiddleware(verifyPartnerAccess));
router.get("/check-partner-status", authMiddleware, authorizeFor(["partner"]), tryCatchMiddleware(checkPartnerStatus));


export { router as partnerRouter };