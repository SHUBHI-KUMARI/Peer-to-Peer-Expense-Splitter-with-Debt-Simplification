import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getGroupAnalytics } from "../controllers/analytics.controller";

const router = Router();
router.use(authenticate);

router.get("/groups/:id/analytics", getGroupAnalytics);

export default router;