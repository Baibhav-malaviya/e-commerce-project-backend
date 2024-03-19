const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

app.use(
    cors({
        // origin: process.env.CORS_ORIGIN,
        origin: "http://localhost:5173",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true, // Enable cookies and other credentials to be included in CORS requests
    })
);

app.use(express.json({ limit: "16kb" })); // Maximum request body size
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //extended: true because it use modern qs library to encode and decode the form data
app.use(express.static("public")); // for serving the static files
app.use(cookieParser());

const authRouter = require("./routes/auth.route");
const productRouter = require("./routes/product.route");
const cartRouter = require("./routes/cart.route");
const orderRouter = require("./routes/order.route");
const userRouter = require("./routes/user.route");
const wishListRouter = require("./routes/wishlist.route");
const paymentRouter = require("./routes/payment.route");
const chatbotRouter = require("./routes/chatbot.route");

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/user", userRouter);
app.use("/api/wishlist", wishListRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/chatbot", chatbotRouter);

module.exports = { app };

//!_____________

// node --version # Should be >= 18
// npm install @google/generative-ai express

// const express = require('express');
// const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
// const dotenv = require('dotenv').config()

// const app = express();
// const port = process.env.PORT || 3000;
// app.use(express.json());
// const MODEL_NAME = "gemini-pro";
// const API_KEY = 'AIzaSyBwLrNQ-dANYeJckrR6DncTfKQQ0XcRwXI';

// async function runChat(userInput) {
//   const genAI = new GoogleGenerativeAI(API_KEY);
//   const model = genAI.getGenerativeModel({ model: MODEL_NAME });

//   const generationConfig = {
//     temperature: 0.9,
//     topK: 1,
//     topP: 1,
//     maxOutputTokens: 1000,
//   };

//   const safetySettings = [
//     {
//       "category": "HARM_CATEGORY_HARASSMENT",
//       "threshold": "BLOCK_MEDIUM_AND_ABOVE"
//     },
//     {
//       "category": "HARM_CATEGORY_HATE_SPEECH",
//       "threshold": "BLOCK_MEDIUM_AND_ABOVE"
//     },
//     {
//       "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
//       "threshold": "BLOCK_MEDIUM_AND_ABOVE"
//     },
//     {
//       "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
//       "threshold": "BLOCK_MEDIUM_AND_ABOVE"
//     },
//     // ... other safety settings
//   ];

//   const chat = model.startChat({
//     generationConfig,
//     safetySettings,
//     history: [
//       {
//     "role": "user",
//     "parts": ["hello"]
//   },
//   {
//     "role": "model",
//     "parts": ["Hello! Welcome to Fashion Hub. My name is Bama, and I am your helpful assistant.\n\nHow can I assist you today? Whether you have questions about our products, need help generating a catalog, or have any other inquiries, I am here to provide support.\n\nPlease feel free to ask away, and I will do my best to assist you."]
//   },
//   {
//     "role": "user",
//     "parts": ["hello"]
//   },
//   {
//     "role": "model",
//     "parts": ["Hello! Welcome back to Fashion Hub. My name is Bama, and I am your helpful assistant.\n\nIs there anything I can assist you with today? I am here to provide support with any questions you may have about our products, help you generate a catalog, or assist with any other inquiries you may have.\n\nPlease do not hesitate to ask. I am here to make your experience as seamless as possible."]
//   },
//     ],
//   });

//   const result = await chat.sendMessage(userInput);
//   const response = result.response;
//   return response.text();
// }

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });
// app.get('/loader.gif', (req, res) => {
//   res.sendFile(__dirname + '/loader.gif');
// });
// app.post('/chat', async (req, res) => {
//   try {
//     const userInput = req.body?.userInput;
//     console.log('incoming /chat req', userInput)
//     if (!userInput) {
//       return res.status(400).json({ error: 'Invalid request body' });
//     }

//     const response = await runChat(userInput);
//     res.json({ response });
//   } catch (error) {
//     console.error('Error in chat endpoint:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// app.listen(port, () => {
//   console.log(Server listening on port ${port});
// });
