import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
    optimizeSettlement,
    confirmSettlement,
    completeSettlement,
    getSettlementHistory,
} from "../controllers/settlement.controller";

const router = Router();

router.use(authenticate); // all settlement routes require auth

// GET  /api/groups/:id/settle/optimize  — run MCF, return optimized transactions
router.get("/groups/:id/settle/optimize", optimizeSettlement);

// POST /api/groups/:id/settle/confirm   — save the settlement plan
router.post("/groups/:id/settle/confirm", confirmSettlement);

// PUT  /api/settlements/:id/complete    — mark a single settlement as done
router.put("/settlements/:id/complete", completeSettlement);

// GET  /api/groups/:id/settle/history   — past settlements for a group
router.get("/groups/:id/settle/history", getSettlementHistory);

export default router;