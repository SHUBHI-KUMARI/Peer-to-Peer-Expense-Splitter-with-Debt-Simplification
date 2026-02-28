import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  addPersonalExpense,
  getPersonalExpenses,
  getPersonalExpenseById,
  updatePersonalExpense,
  deletePersonalExpense
} from "../controllers/personal.controller";

const router = Router();
router.use(authenticate);

router.post("/", addPersonalExpense);
router.get("/", getPersonalExpenses);
router.get("/:id", getPersonalExpenseById);
router.put("/:id", updatePersonalExpense);
router.delete("/:id", deletePersonalExpense);

export default router;