import { Router } from "express";
import { tryCatchMiddleware } from "../middlewares/try-catch.middleware";
import { authMiddleware, authorizeFor, partnerAccessMiddleware } from "../middlewares/auth.middleware";
import {
    checkPartnerStatus, requestPartnerAccess, verifyPartnerAccess,
    createStore, getStore, getStores, updateStore, deleteStore
} from "../controllers/partner.controllers";

const router = Router();


// Profile
router.post("/request-partner-access", authMiddleware, authorizeFor(["partner"]), tryCatchMiddleware(requestPartnerAccess));
router.post("/verify-partner-access", authMiddleware, authorizeFor(["partner"]), tryCatchMiddleware(verifyPartnerAccess));
router.get("/check-partner-status", authMiddleware, authorizeFor(["partner"]), tryCatchMiddleware(checkPartnerStatus));

// Stores
router.post("/stores", authMiddleware, authorizeFor(["partner"]), partnerAccessMiddleware, tryCatchMiddleware(createStore));
router.get("/stores", authMiddleware, authorizeFor(["partner"]), partnerAccessMiddleware, tryCatchMiddleware(getStores));
router.get("/stores/:id", authMiddleware, authorizeFor(["partner"]), partnerAccessMiddleware, tryCatchMiddleware(getStore));
router.put("/stores/:id", authMiddleware, authorizeFor(["partner"]), partnerAccessMiddleware, tryCatchMiddleware(updateStore));
router.delete("/stores/:id", authMiddleware, authorizeFor(["partner"]), partnerAccessMiddleware, tryCatchMiddleware(deleteStore));

export { router as partnerRouter };