import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Ask AI about history
router.post("/chat", async (req, res) => {
  const { date } = req.body;
  if (!date) return res.status(400).json({ error: "Date required" });

  const systemPrompt = "You are a knowledgeable historian AI. Provide accurate historical events.";
  const userPrompt = `Tell me an important historical event that happened on ${date}.`;

  const finalPrompt = `${systemPrompt}\n\nUser: ${userPrompt}`;

  try {
    const result = await model.generateContent(finalPrompt);
    res.json({ answer: result.response.text() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
