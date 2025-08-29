// // // // import { Router } from "express";
// // // // import { Event } from "../models/Event.js";

// // // // const router = Router();

// // // // router.get("/", async (req, res) => {
// // // //   const { date } = req.query;
// // // //   if (!date) return res.status(400).json({ error: "date=MM-DD required" });

// // // //   const [month, day] = date.split("-").map(Number);
// // // //   const events = await Event.find({ month, day });
// // // //   res.json(events);
// // // // });

// // // // export default router;
// // // import { Router } from "express";
// // // import OpenAI from "openai";
// // // import { Event } from "../models/Event.js";

// // // const router = Router();
// // // const openai = new OpenAI({
// // //   apiKey: process.env.OPENAI_API_KEY,
// // // });

// // // // Multi-shot prompt examples
// // // const multiShotExamples = [
// // //   {
// // //     user: "Tell me what happened on 01-26.",
// // //     assistant: "On January 26, 1950, India officially adopted its Constitution and became a Republic. This day is celebrated annually as Republic Day in India."
// // //   },
// // //   {
// // //     user: "Tell me what happened on 07-20.",
// // //     assistant: "On July 20, 1969, Apollo 11 astronauts Neil Armstrong and Buzz Aldrin became the first humans to walk on the Moon."
// // //   },
// // //   {
// // //     user: "Tell me what happened on 12-25.",
// // //     assistant: "On December 25, Christmas Day is celebrated worldwide to commemorate the birth of Jesus Christ."
// // //   }
// // // ];

// // // // Helper: build multi-shot prompt
// // // function buildMultiShotPrompt(date, historyData) {
// // //   let prompt = "You are a helpful assistant that provides historical facts for given dates.\n\n";
// // //   multiShotExamples.forEach(example => {
// // //     prompt += `User: ${example.user}\nAssistant: ${example.assistant}\n\n`;
// // //   });
// // //   prompt += `User: Tell me what happened on ${date}.\nAssistant:`;
// // //   if (historyData) {
// // //     prompt += ` Here’s an event from the database: ${historyData.event}.`;
// // //   }
// // //   return prompt;
// // // }

// // // router.get("/", async (req, res) => {
// // //   const { date } = req.query;
// // //   if (!date) return res.status(400).json({ error: "date=MM-DD required" });

// // //   try {
// // //     // Step 1: Check if event already exists in DB
// // //     let history = await Event.findOne({ date });

// // //     // Step 2: If not in DB, use OpenAI multi-shot prompting
// // //     if (!history) {
// // //       const prompt = buildMultiShotPrompt(date, null);

// // //       const completion = await openai.chat.completions.create({
// // //         model: "gpt-4o-mini",
// // //         messages: [{ role: "user", content: prompt }],
// // //       });

// // //       const responseText = completion.choices[0].message.content;

// // //       // Save into DB for caching / scalability
// // //       history = new Event({ date, event: responseText });
// // //       await history.save();
// // //     }

// // //     res.json({ date, event: history.event });
// // //   } catch (err) {
// // //     console.error(err);
// // //     res.status(500).json({ error: "Something went wrong" });
// // //   }
// // // });

// // // export default router;


// // import { Router } from "express";
// // import { Event } from "../models/Event.js";
// // import OpenAI from "openai";

// // const router = Router();

// // // ✅ Initialize OpenAI with env variable
// // const openai = new OpenAI({
// //   apiKey: process.env.GEMINI_ API_KEY,
// // });

// // router.get("/", async (req, res) => {
// //   const { date } = req.query;

// //   if (!date) {
// //     return res.status(400).json({ error: "date=MM-DD required" });
// //   }

// //   try {
// //     // Check if event exists in DB
// //     let event = await Event.findOne({ date });

// //     if (!event) {
// //       // If not, fetch from OpenAI
// //       const prompt = `Tell me a historical fact that happened on ${date} in history.`;
// //       const response = await openai.chat.completions.create({
// //         model: "gpt-4o-mini",
// //         messages: [{ role: "user", content: prompt }],
// //       });

// //       const fact = response.choices[0].message.content;

// //       // Save to DB
// //       event = new Event({ date, fact });
// //       await event.save();
// //     }

// //     res.json(event);
// //   } catch (err) {
// //     console.error("Error:", err);
// //     res.status(500).json({ error: "Internal server error" });
// //   }
// // });

// // // export default router;
// // import { Router } from "express";
// // import { Event } from "../models/Event.js";
// // import fetch from "node-fetch";

// // const router = Router();

// // // GET /api/history?date=MM-DD
// // router.get("/", async (req, res) => {
// //   const { date } = req.query;
// //   if (!date) {
// //     return res.status(400).json({ error: "date=MM-DD required" });
// //   }

// //   try {
// //     // Fetch events from MongoDB
// //     const events = await Event.find({ date });
// //     if (!events || events.length === 0) {
// //       return res.status(404).json({ error: "No events found for this date" });
// //     }

// //     // Multi-shot prompt examples
// //     const examples = [
// //       {
// //         input: "Tell me about the event 'Moon Landing' that happened on 07-20.",
// //         output:
// //           "On July 20, 1969, Apollo 11 successfully landed the first humans on the Moon. Neil Armstrong and Buzz Aldrin became the first to walk on its surface."
// //       },
// //       {
// //         input: "Tell me about the event 'Independence Day of India' that happened on 08-15.",
// //         output:
// //           "On August 15, 1947, India gained independence from British rule, marking a historic moment celebrated annually as Independence Day."
// //       }
// //     ];

// //     // Create the multi-shot prompt with examples + actual request
// //     const prompt = `
// // You are a historical assistant. Below are some examples:

// // Example 1:
// // User: ${examples[0].input}
// // Assistant: ${examples[0].output}

// // Example 2:
// // User: ${examples[1].input}
// // Assistant: ${examples[1].output}

// // Now answer this request:
// // Tell me about the event "${events[0].title}" that happened on ${events[0].date}.
// // Description: ${events[0].description}
// //     `;

// //     // Call Gemini API
// //     const response = await fetch(
// //       `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
// //       {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json"
// //         },
// //         body: JSON.stringify({
// //           contents: [{ parts: [{ text: prompt }] }]
// //         })
// //       }
// //     );

// //     const data = await response.json();
// //     const aiMessage = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI";

// //     res.json({
// //       date,
// //       events,
// //       aiSummary: aiMessage
// //     });
// //   } catch (err) {
// //     console.error("Error in /api/history:", err);
// //     res.status(500).json({ error: "Internal Server Error" });
// //   }
// // });

// // export default router;



// import { Router } from "express";
// import { Event } from "../models/Event.js";
// import fetch from "node-fetch";

// const router = Router();

// // GET /api/history?date=MM-DD
// router.get("/", async (req, res) => {
//   const { date } = req.query;
//   if (!date) {
//     return res.status(400).json({ error: "date=MM-DD required" });
//   }

//   try {
//     // Fetch events from MongoDB
//     const events = await Event.find({ date });
//     if (!events || events.length === 0) {
//       return res.status(404).json({ error: "No events found for this date" });
//     }

//     // Multi-shot prompt examples
//     const examples = [
//       {
//         input: "Tell me about the event 'Moon Landing' that happened on 07-20.",
//         output:
//           "On July 20, 1969, Apollo 11 successfully landed the first humans on the Moon. Neil Armstrong and Buzz Aldrin became the first to walk on its surface."
//       },
//       {
//         input: "Tell me about the event 'Independence Day of India' that happened on 08-15.",
//         output:
//           "On August 15, 1947, India gained independence from British rule, marking a historic moment celebrated annually as Independence Day."
//       }
//     ];

//     // Create the multi-shot prompt with examples + actual request
//     const prompt = `
// You are a historical assistant. Below are some examples:

// Example 1:
// User: ${examples[0].input}
// Assistant: ${examples[0].output}

// Example 2:
// User: ${examples[1].input}
// Assistant: ${examples[1].output}

// Now answer this request:
// Tell me about the event "${events[0].title}" that happened on ${events[0].date}.
// Description: ${events[0].description}

// End your response with "###"
//     `;

//     // Call Gemini API with stop sequence
//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           contents: [{ parts: [{ text: prompt }] }],
//           generationConfig: {
//             stopSequences: ["###"], // 👈 AI will stop here
//             maxOutputTokens: 200
//           }
//         })
//       }
//     );

//     const data = await response.json();
//     let aiMessage =
//       data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI";

//     // Clean stop sequence from response
//     aiMessage = aiMessage.replace(/###$/, "").trim();

//     res.json({
//       date,
//       events,
//       aiSummary: aiMessage
//     });
//   } catch (err) {
//     console.error("Error in /api/history:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// export default router;



import { Router } from "express";
import { Event } from "../models/Event.js";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const router = Router();

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Utility function for dynamic prompting
function buildDynamicPrompt(date, events) {
  let basePrompt = `You are a history expert. The user is asking about events that happened on ${date}.`;

  if (events.length > 0) {
    basePrompt += ` Here are some historical events already stored in the database for that date:\n`;
    events.forEach((event, index) => {
      basePrompt += `${index + 1}. ${event.description}\n`;
    });
    basePrompt += `\nUsing this information, generate a rich narrative about ${date}. Add additional interesting facts if relevant.`;
  } else {
    basePrompt += ` There are no stored events in the database for this date. Please provide a rich and engaging historical narrative about ${date}, highlighting important events, people, or cultural milestones.`;
  }

  return basePrompt;
}

// GET /api/history?date=MM-DD
router.get("/", async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: "date=MM-DD required" });

  try {
    // Fetch stored events for this date
    const events = await Event.find({ date });

    // Build dynamic prompt
    const prompt = buildDynamicPrompt(date, events);

    // Call Gemini with stop sequence
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        stopSequences: ["User:", "Assistant:"], // prevents runaway responses
        maxOutputTokens: 300,
      },
    });

    const responseText = result.response.text();

    res.json({
      date,
      storedEvents: events,
      aiNarrative: responseText,
    });
  } catch (err) {
    console.error("Error in /api/history:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

