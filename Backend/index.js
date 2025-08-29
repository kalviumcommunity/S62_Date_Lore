// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import { connectDB } from "./db.js";
// import historyRoutes from "./routes/history.js";
// import aiRoutes from "./routes/ai.js";

// dotenv.config();
// const app = express();

// app.use(cors());
// app.use(express.json());

// app.use("/api/history", historyRoutes);
// app.use("/api/ai", aiRoutes);

// app.get("/", (req, res) => res.json({ message: "DateLore API is running 🚀" }));

// connectDB().then(() => {
//   app.listen(process.env.PORT, () =>
//     console.log(`✅ Server running at http://localhost:${process.env.PORT}`)
//   );
// });
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import historyRoutes from "./routes/history.js";

dotenv.config(); // Load .env variables

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;

// Connect to MongoDB

const MONGO_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/history", historyRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
