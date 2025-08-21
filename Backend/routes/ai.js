// // // // // // import { Router } from "express";
// // // // // // import { GoogleGenerativeAI } from "@google/generative-ai";

// // // // // // const router = Router();
// // // // // // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// // // // // // const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// // // // // // router.post("/chat", async (req, res) => {
// // // // // //   const { date } = req.body;
// // // // // //   if (!date) return res.status(400).json({ error: "Date required" });

// // // // // //   const systemPrompt = "You are a knowledgeable historian AI. Provide accurate historical events.";
// // // // // //   const userPrompt = `Tell me an important historical event that happened on ${date}.`;

// // // // // //   const finalPrompt = `${systemPrompt}\n\nUser: ${userPrompt}`;

// // // // // //   try {
// // // // // //     const result = await model.generateContent(finalPrompt);
// // // // // //     res.json({ answer: result.response.text() });
// // // // // //   } catch (err) {
// // // // // //     res.status(500).json({ error: err.message });
// // // // // //   }
// // // // // // });

// // // // // // export default router;

// // // // // import { Router } from "express";
// // // // // import { GoogleGenerativeAI } from "@google/generative-ai";

// // // // // const router = Router();
// // // // // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // // // // // Load model
// // // // // const model = genAI.getGenerativeModel({
// // // // //   model: "gemini-2.0-flash",
// // // // // });

// // // // // // Define function schema
// // // // // const functions = [
// // // // //   {
// // // // //     name: "getHistoricalEvent",
// // // // //     description: "Fetch an important historical event for a given date",
// // // // //     parameters: {
// // // // //       type: "object",
// // // // //       properties: {
// // // // //         date: {
// // // // //           type: "string",
// // // // //           description: "The date in YYYY-MM-DD format",
// // // // //         },
// // // // //       },
// // // // //       required: ["date"],
// // // // //     },
// // // // //   },
// // // // // ];

// // // // // // Dummy implementation of the function
// // // // // async function getHistoricalEvent({ date }) {
// // // // //   // later you can connect this with DB or API
// // // // //   return {
// // // // //     event: `On ${date}, a significant historical event occurred (example).`,
// // // // //   };
// // // // // }

// // // // // function formatDate(input) {
// // // // //   const [day, month, year] = input.split("-");
// // // // //   return `${year}-${month}-${day}`;
// // // // // }

// // // // // router.post("/chat", async (req, res) => {
// // // // //   const { date } = req.body;
// // // // //   if (!date) return res.status(400).json({ error: "Date required" });

// // // // //   try {
// // // // //     const result = await model.generateContent({
// // // // //       contents: [
// // // // //         {
// // // // //           role: "user",
// // // // //           parts: [{ text: `Get historical event for this date: ${date}` }],
// // // // //         },
// // // // //       ],
// // // // //       tools: [{ functionDeclarations: functions }],
// // // // //       toolConfig: {
// // // // //         functionCallingConfig: { mode: "ANY" },
// // // // //       },
// // // // //     });

// // // // //     // Check if Gemini asked for a function call
// // // // //     const call = result.response.functionCalls?.[0];

// // // // //     if (call && call.name === "getHistoricalEvent") {
// // // // //       const args = JSON.parse(call.args); // Gemini passes arguments as string
// // // // //       const event = await getHistoricalEvent(args);
// // // // //       return res.json({ answer: event.event });
// // // // //     }

// // // // //     // Otherwise return plain text response
// // // // //     res.json({ answer: result.response.text() });
// // // // //   } catch (err) {
// // // // //     res.status(500).json({ error: err.message });
// // // // //   }
// // // // // });

// // // // // export default router;


// // // // import { Router } from "express";
// // // // import { GoogleGenerativeAI } from "@google/generative-ai";

// // // // const router = Router();
// // // // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // // // // Load model
// // // // const model = genAI.getGenerativeModel({
// // // //   model: "gemini-2.0-flash",
// // // // });

// // // // // Define function schema
// // // // const functions = [
// // // //   {
// // // //     name: "getHistoricalEvent",
// // // //     description: "Fetch an important historical event for a given date",
// // // //     parameters: {
// // // //       type: "object",
// // // //       properties: {
// // // //         date: {
// // // //           type: "string",
// // // //           description: "The date in YYYY-MM-DD or DD-MM-YYYY format",
// // // //         },
// // // //       },
// // // //       required: ["date"],
// // // //     },
// // // //   },
// // // // ];

// // // // // Dummy implementation of the function
// // // // async function getHistoricalEvent({ date }) {
// // // //   // later you can connect this with DB or API
// // // //   return {
// // // //     event: `On ${date}, India gained independence from British rule.`,
// // // //   };
// // // // }

// // // // router.post("/chat", async (req, res) => {
// // // //   const { date } = req.body;
// // // //   if (!date) return res.status(400).json({ error: "Date required" });

// // // //   try {
// // // //     // Send prompt + functions to Gemini
// // // //     const result = await model.generateContent({
// // // //       contents: [
// // // //         {
// // // //           role: "user",
// // // //           parts: [{ text: `Tell me an important historical event on ${date}.` }],
// // // //         },
// // // //       ],
// // // //       tools: [{ functionDeclarations: functions }],
// // // //     });

// // // //     // 1️⃣ Always check response structure
// // // //     console.log("Gemini raw response:", JSON.stringify(result, null, 2));

// // // //     // 2️⃣ Extract function call if present
// // // //     const call = result.response?.functionCalls?.[0];

// // // //     if (call && call.name === "getHistoricalEvent") {
// // // //       const args = JSON.parse(call.args || "{}");
// // // //       const event = await getHistoricalEvent(args);
// // // //       return res.json({ answer: event.event });
// // // //     }

// // // //     // 3️⃣ If AI responds with plain text instead of function call
// // // //     if (result.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
// // // //       return res.json({ answer: result.response.candidates[0].content.parts[0].text });
// // // //     }

// // // //     // 4️⃣ Fallback
// // // //     res.json({ answer: "No response from AI" });
// // // //   } catch (err) {
// // // //     console.error("Error in /chat:", err);
// // // //     res.status(500).json({ error: err.message });
// // // //   }
// // // // });

// // // // export default router;


// // // import { Router } from "express";
// // // import { GoogleGenerativeAI } from "@google/generative-ai";

// // // const router = Router();
// // // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // // // Load model
// // // const model = genAI.getGenerativeModel({
// // //   model: "gemini-2.0-flash",
// // // });

// // // // Define function schema
// // // const functions = [
// // //   {
// // //     name: "getHistoricalEvent",
// // //     description: "Fetch an important historical event for a given date",
// // //     parameters: {
// // //       type: "object",
// // //       properties: {
// // //         date: {
// // //           type: "string",
// // //           description: "The date in YYYY-MM-DD format",
// // //         },
// // //       },
// // //       required: ["date"],
// // //     },
// // //   },
// // // ];

// // // // Dummy implementation of the function
// // // async function getHistoricalEvent({ date }) {
// // //   // later you can connect this with DB or API
// // //   return {
// // //     event: `On ${date}, a significant historical event occurred (example).`,
// // //   };
// // // }

// // // router.post("/chat", async (req, res) => {
// // //   const { date } = req.body;
// // //   if (!date) return res.status(400).json({ error: "Date required" });

// // //   try {
// // //     // Ask Gemini
// // //     const result = await model.generateContent({
// // //       contents: [
// // //         {
// // //           role: "user",
// // //           parts: [{ text: `Tell me an important historical event on ${date}.` }],
// // //         },
// // //       ],
// // //       tools: [{ functionDeclarations: functions }],
// // //     });

// // //     const response = result.response;

// // //     // ✅ Case 1: AI triggers a function call
// // //     const call = response.functionCalls?.[0];
// // //     if (call && call.name === "getHistoricalEvent") {
// // //       const args = JSON.parse(call.args);
// // //       const event = await getHistoricalEvent(args);
// // //       return res.json({ answer: event.event });
// // //     }

// // //     // ✅ Case 2: AI replies with plain text
// // //     const textAnswer = response.text?.();
// // //     if (textAnswer && textAnswer.trim() !== "") {
// // //       return res.json({ answer: textAnswer });
// // //     }

// // //     // ✅ Case 3: No response at all → fallback
// // //     return res.json({ answer: "No response from AI" });
// // //   } catch (err) {
// // //     console.error("Error in /chat:", err);
// // //     res.status(500).json({ error: err.message });
// // //   }
// // // });

// // // export default router;


// // // routes/ai.js
// // import { Router } from "express";
// // import { GoogleGenerativeAI } from "@google/generative-ai";

// // const router = Router();
// // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // // Load Gemini model
// // const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// // // Function schema
// // const functions = [
// //   {
// //     name: "getHistoricalEvent",
// //     description: "Fetch an important historical event for a given date",
// //     parameters: {
// //       type: "object",
// //       properties: {
// //         date: {
// //           type: "string",
// //           description: "Date in YYYY-MM-DD format",
// //         },
// //       },
// //       required: ["date"],
// //     },
// //   },
// // ];

// // // Dummy implementation of the function
// // async function getHistoricalEvent({ date }) {
// //   // You can later connect this with a DB or external API
// //   return {
// //     event: `On ${date}, a significant historical event occurred (example).`,
// //   };
// // }

// // // Format date if needed (DD-MM-YYYY → YYYY-MM-DD)
// // function formatDate(input) {
// //   const [day, month, year] = input.split("-");
// //   return `${year}-${month}-${day}`;
// // }

// // // POST /api/ai/chat
// // router.post("/chat", async (req, res) => {
// //   const { date } = req.body;
// //   if (!date) return res.status(400).json({ error: "Date required" });

// //   // Convert date format if user sends DD-MM-YYYY
// //   const formattedDate = date.includes("-") && date.split("-")[0].length === 2
// //     ? formatDate(date)
// //     : date;

// //   try {
// //     // Call Gemini model
// //     const result = await model.generateContent({
// //       contents: [
// //         {
// //           role: "user",
// //           parts: [
// //             { text: `Get historical event for this date: ${formattedDate}` }
// //           ],
// //         },
// //       ],
// //       tools: [{ functionDeclarations: functions }],
// //       toolConfig: {
// //         functionCallingConfig: { mode: "ANY" },
// //       },
// //     });

// //     // Check if Gemini wants to call the function
// //     const call = result.response.functionCalls?.[0];

// //     if (call && call.name === "getHistoricalEvent") {
// //       const args = JSON.parse(call.args); // Gemini returns args as string
// //       const event = await getHistoricalEvent(args);
// //       return res.json({ answer: event.event });
// //     }

// //     // Otherwise return Gemini text response
// //     const textResponse = result.response.text?.() || "No response from AI";
// //     res.json({ answer: textResponse });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // export default router;




// // routes/ai.js
// import { Router } from "express";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const router = Router();
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // Load Gemini model
// const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// // Function schema
// const functions = [
//   {
//     name: "getHistoricalEvent",
//     description: "Fetch an important historical event for a given date",
//     parameters: {
//       type: "object",
//       properties: {
//         date: {
//           type: "string",
//           description: "Date in YYYY-MM-DD format",
//         },
//       },
//       required: ["date"],
//     },
//   },
// ];

// // Dummy implementation of the function
// async function getHistoricalEvent({ date }) {
//   // Later you can connect this with a database or real API
//   return {
//     event: `On ${date}, a significant historical event occurred (example).`,
//   };
// }

// // Format date if needed (DD-MM-YYYY → YYYY-MM-DD)
// function formatDate(input) {
//   const [day, month, year] = input.split("-");
//   return `${year}-${month}-${day}`;
// }

// // POST /api/ai/chat
// router.post("/chat", async (req, res) => {
//   const { date } = req.body;

//   if (!date) return res.status(400).json({ error: "Date required" });

//   // Convert date format if user sends DD-MM-YYYY
//   const formattedDate =
//     date.includes("-") && date.split("-")[0].length === 2
//       ? formatDate(date)
//       : date;

//   try {
//     // Call Gemini model with function calling enabled
//     const result = await model.generateContent({
//       contents: [
//         {
//           role: "user",
//           parts: [
//             { text: `Get historical event for this date: ${formattedDate}` },
//           ],
//         },
//       ],
//       tools: [{ functionDeclarations: functions }],
//       toolConfig: {
//         functionCallingConfig: { mode: "ANY" },
//       },
//     });

//     // Check if Gemini wants to call our function
//     const call = result.response.functionCalls?.[0];

//     if (call && call.name === "getHistoricalEvent") {
//       const args = JSON.parse(call.args); // Gemini returns args as string
//       const event = await getHistoricalEvent(args);
//       return res.json({ answer: event.event });
//     }

//     // Fallback: return Gemini text response
//     const textResponse = result.response.text?.() || "No response from AI";
//     res.json({ answer: textResponse });
//   } catch (err) {
//     console.error("Error in /chat:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;




// routes/ai.js
import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Load Gemini model
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Format date if needed (DD-MM-YYYY → YYYY-MM-DD)
function formatDate(input) {
  const [day, month, year] = input.split("-");
  return `${year}-${month}-${day}`;
}

// POST /api/ai/chat
router.post("/chat", async (req, res) => {
  const { date } = req.body;

  if (!date) return res.status(400).json({ error: "Date required" });

  // Convert date format if user sends DD-MM-YYYY
  const formattedDate =
    date.includes("-") && date.split("-")[0].length === 2
      ? formatDate(date)
      : date;

  try {
    // Ask Gemini to generate historical events directly
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are a historian AI. Tell me important historical events that happened on ${formattedDate}. Provide concise and accurate events.`,
            },
          ],
        },
      ],
    });

    // Get AI text response
    const answer = result.response.text?.() || "No response from AI";

    res.json({ answer });
  } catch (err) {
    console.error("Error in /chat:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
