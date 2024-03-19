const {
    GoogleGenerativeAI,
    HarmBlockThreshold,
} = require("@google/generative-ai");

// Constants for API configuration
const MODEL_NAME = "gemini-pro";
const API_KEY = "AIzaSyBwLrNQ-dANYeJckrR6DncTfKQQ0XcRwXI";

// Function to handle chat requests
async function runChat(req, res) {
    try {
        // Extract user input from request body
        const userInput = req.body?.userInput;

        if (!userInput) {
            return res.status(400).json({ error: "User input is required." });
        }

        // Initialize GoogleGenerativeAI with API key
        const genAI = new GoogleGenerativeAI(API_KEY);

        // Retrieve generative model for chat
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        // Configuration for chat generation
        const generationConfig = {
            temperature: 0.9,
            topK: 1,
            topP: 1,
            maxOutputTokens: 1000,
        };

        // Safety settings to filter harmful content
        const safetySettings = [
            {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            // Add more safety settings as needed
        ];

        // Define chat history with initial messages
        const history = [
            {
                role: "user",
                parts: [{ text: "hello" }], // Each part should be an object with a 'text' property
            },
            {
                role: "model",
                parts: [
                    {
                        text: "Welcome to Fashion Hub! How can I assist you today?",
                    },
                ],
            },
        ];

        // Start a chat session
        const chat = model.startChat({
            generationConfig,
            safetySettings,
            history,
        });

        // Send user input to the chatbot and retrieve response
        const result = await chat.sendMessage(userInput);
        const response = result.response;

        // Return success response with the generated chat response
        return res.status(200).json({
            message: "Chat response generated successfully.",
            data: response.text(),
        });
    } catch (error) {
        // Handle any errors that occur during chat processing
        console.error("An error occurred during chat processing:", error);
        return res
            .status(500)
            .json({ error: "An error occurred during chat processing." });
    }
}

module.exports = { runChat };
