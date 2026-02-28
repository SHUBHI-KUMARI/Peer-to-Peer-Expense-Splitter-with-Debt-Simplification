import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import groupRoutes from "./routes/group.routes";
import expenseRoutes from "./routes/expense.routes";
<<<<<<< Updated upstream
import settlemenRoutes from "./routes/settlement.routes";
=======
import settlementRoutes from "./routes/settlement.routes";
import personalRoutes from "./routes/personal.routes";
import analyticsRoutes from "./routes/analytics.routes";
>>>>>>> Stashed changes

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "SpliX API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api", expenseRoutes);
<<<<<<< Updated upstream
app.use('/api', settlemenRoutes)
=======
app.use("/api", settlementRoutes);
app.use("/api/personal", personalRoutes);
app.use("/api", analyticsRoutes);
>>>>>>> Stashed changes


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;