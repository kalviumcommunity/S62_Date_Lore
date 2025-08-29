// // // import express from "express";
// // // import cors from "cors";
// // // import dotenv from "dotenv";
// // // import { connectDB } from "./db.js";
// // // import historyRoutes from "./routes/history.js";
// // // import aiRoutes from "./routes/ai.js";

// // // dotenv.config();
// // // const app = express();

// // // app.use(cors());
// // // app.use(express.json());

// // // app.use("/api/history", historyRoutes);
// // // app.use("/api/ai", aiRoutes);

// // // app.get("/", (req, res) => res.json({ message: "DateLore API is running 🚀" }));

// // // connectDB().then(() => {
// // //   app.listen(process.env.PORT, () =>
// // //     console.log(`✅ Server running at http://localhost:${process.env.PORT}`)
// // //   );
// // // });
// // import express from "express";
// // import mongoose from "mongoose";
// // import dotenv from "dotenv";
// // import historyRoutes from "./routes/history.js";

// // dotenv.config(); // Load .env variables

// // const app = express();
// // app.use(express.json());

// // const PORT = process.env.PORT || 8080;

// // // Connect to MongoDB

// // const MONGO_URI = process.env.MONGODB_URI;

// // mongoose
// //   .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
// //   .then(() => console.log("✅ MongoDB connected"))
// //   .catch((err) => console.error("MongoDB connection error:", err));

// // // Routes
// // app.use("/api/history", historyRoutes);

// // app.listen(PORT, () => {
// //   console.log(`Server running on port ${PORT}`);
// // });
// import { Router } from "express";
// import { Event } from "../models/Event.js";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const router = Router();

// // Initialize Gemini API client
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// router.get("/", async (req, res) => {
//   const { date } = req.query;
//   if (!date) return res.status(400).json({ error: "date=MM-DD required" });

//   try {
//     // Find events in DB for given date
//     const events = await Event.find({ date });

//     let loreText;
//     if (events.length > 0) {
//       loreText = events.map((e) => e.description).join(" ");
//     } else {
//       // If no events, generate lore using Gemini with Stop Sequence
//       const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//       const prompt = `
//         Give me a historical fact or event that happened on ${date}.
//         Provide only the fact, do not add extra explanations.
//         Stop when you finish the historical fact.
//       `;

//       // Generate response with stop sequence
//       const result = await model.generateContent({
//         contents: [{ role: "user", parts: [{ text: prompt }] }],
//         generationConfig: {
//           stopSequences: ["Stop."], // stops when model outputs "Stop."
//         },
//       });

//       loreText = result.response.text().replace("Stop.", "").trim();

//       // Save in DB for caching
//       const newEvent = new Event({ date, description: loreText });
//       await newEvent.save();
//     }

//     res.json({ date, lore: loreText });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// export default router;



// import { Router } from "express";
// import { Event } from "./models/Event.js";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const router = Router();

// // Initialize Gemini API client
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// router.get("/", async (req, res) => {
//   const { date } = req.query;

//   // Validate query param
//   if (!date) {
//     return res.status(400).json({ error: "date=MM-DD required" });
//   }

//   try {
//     // Check DB first
//     const events = await Event.find({ date });

//     let loreText;
//     if (events.length > 0) {
//       // Use cached event(s)
//       loreText = events.map((e) => e.description).join(" ");
//     } else {
//       // If not found in DB, generate using Gemini
//       const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//       const prompt = `
//         Give me a historical fact or event that happened on ${date}.
//         Provide only the fact in one or two sentences.
//         Do not add explanations or commentary.
//         End with the word "Stop."
//       `;

//       const result = await model.generateContent({
//         contents: [{ role: "user", parts: [{ text: prompt }] }],
//         generationConfig: {
//           stopSequences: ["Stop."],
//           maxOutputTokens: 100,
//         },
//       });

//       loreText = result.response
//         .text()
//         .replace(/Stop\.$/, "") // Remove trailing "Stop."
//         .trim();

//       // Cache result in DB
//       if (loreText) {
//         const newEvent = new Event({ date, description: loreText });
//         await newEvent.save();
//       }
//     }

//     res.json({ date, lore: loreText });
//   } catch (err) {
//     console.error("Error in /history:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// export default router;

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import historyRoutes from "./routes/history.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/history", historyRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    // Start server only after DB connects
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
