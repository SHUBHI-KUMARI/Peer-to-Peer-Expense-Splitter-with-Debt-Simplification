import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { addExpense, getExpenses, editExpense, deleteExpense } from "../controllers/expense.controller";

const router = Router();

router.use(authenticate);

router.post("/groups/:id/expenses", addExpense);
router.get("/groups/:id/expenses", getExpenses);
router.put("/expenses/:id", editExpense);
router.delete("/expenses/:id", deleteExpense);

export default router;