const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/generate-readme', async (req, res) => {
    try {
        const { projectName, techStack, features } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Generate a README.md for ${projectName} using ${techStack}. Features: ${features}`;
        const result = await model.generateContent(prompt);
        res.json({ markdown: result.response.text() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;