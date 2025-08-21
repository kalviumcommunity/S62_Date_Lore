import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import historyRoutes from "./routes/history.js";
import aiRoutes from "./routes/ai.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/history", historyRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => res.json({ message: "DateLore API is running 🚀" }));

connectDB().then(() => {
  app.listen(process.env.PORT, () =>
    console.log(`✅ Server running at http://localhost:${process.env.PORT}`)
  );
});
