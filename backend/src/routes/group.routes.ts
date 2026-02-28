import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  createGroup,
  getMyGroups,
  getGroupById,
  inviteMember,
  getGroupBalances
} from "../controllers/group.controller";

const router = Router();

router.use(authenticate); // all group routes are protected

router.post("/", createGroup);
router.get("/", getMyGroups);
router.get("/:id", getGroupById);
router.post("/:id/invite", inviteMember);
router.get("/:id/balances", getGroupBalances);

export default router;