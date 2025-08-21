import { Router } from "express";
import { Event } from "../models/Event.js";

const router = Router();

router.get("/", async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: "date=MM-DD required" });

  const [month, day] = date.split("-").map(Number);
  const events = await Event.find({ month, day });
  res.json(events);
});

export default router;
