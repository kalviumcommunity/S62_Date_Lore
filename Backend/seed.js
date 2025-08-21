import { connectDB } from "./db.js";
import { Event } from "./models/Event.js";

async function seed() {
  await connectDB();

  await Event.deleteMany({}); 

  await Event.insertMany([
    { type: "event", year: 1947, month: 8, day: 15, text: "India gained independence." },
    { type: "event", year: 1969, month: 7, day: 20, text: "Apollo 11 landed on the moon." },
    { type: "birth", year: 1879, month: 3, day: 14, text: "Albert Einstein was born." }
  ]);

  console.log("✅ Seeded sample events");
  process.exit(0);
}

seed();
