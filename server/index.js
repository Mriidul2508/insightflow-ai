// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();

// Middleware
// In production, you can restrict cors to your specific frontend URL, but for a portfolio, open is fine.
app.use(cors()); 
app.use(express.json());

// Render provides its own PORT environment variable, so this line is critical
const PORT = process.env.PORT || 5000;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Basic Test Route
app.get('/', (req, res) => {
    res.send("InsightFlow Backend is LIVE on Render!");
});

// The AI Route
app.post('/api/generate-readme', async (req, res) => {
    try {
        const { projectName, techStack, features } = req.body;
        
        // Using your preferred 2.5 Flash model
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 
        
        const prompt = `Act as a Senior Software Engineer. Write a professional GitHub README.md for a project named ${projectName}. 
        Tech Stack: ${techStack}. 
        Key Features: ${features}. 
        Include modern sections for Project Overview, Tech Stack, Features, and Getting Started. Use proper Markdown formatting.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ markdown: text });
    } catch (error) {
        console.error("❌ AI Generation Error:", error);
        res.status(500).json({ error: "Failed to generate README." });
    }
});

// Database Connection & Server Start
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB Connected Successfully!");
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ Database Connection Error:", err.message);
    });