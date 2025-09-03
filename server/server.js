import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
console.log('GOOGLE_API_KEY:', process.env.GOOGLE_API_KEY);


// Correct import for Google Generative AI
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const app = express();
app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173",   // your React frontend URL
    methods: ["GET", "POST"],          // allowed methods
    allowedHeaders: ["Content-Type"],  // allowed headers
}));

app.post('/api/analyze', async(req, res) => {
    console.log("Incoming body:", req.body);
    const { url } = req.body;

    if (!url) {
        console.log("Error, url not received.");
        return res.status(400).json({ error: "URL is required" });
    }

    try {
        // Get the model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const promptText = `Analyze this news article URL: ${url}
        1. Give the response back as FAKE, LIKELY FAKE, LIKELY REAL, REAL 
        2. Provide a "Likely to be fake" score out of 100.
        3. Explain clearly why you gave that score.
        
        Format your answer like this:
        FAKE, LIKELY FAKE, ETC...
        Likely to be fake score: XX/100

        Structure your reasons as a list without the dash and without bolding. 
        - Reason 1
        - Reason 2
        - ...
        `;

        // Correct method call
        const result = await model.generateContent(promptText);
        const response = await result.response;
        const analysis = response.text();

        const lines = analysis.split("\n").map(l => l.trim()).filter(Boolean);

        const verdict = lines[0] || "No verdict";
        const score = lines[1] || "No score";
        const reasons = lines.slice(2);

        res.json({ verdict, score, reasons });

    } catch (error) {
        console.error('Error calling Gemini API:', error);
        
        // More detailed error response
        if (error.message?.includes('API key')) {
            return res.status(401).json({ error: 'Invalid API key' });
        }
        
        res.status(500).json({ 
            error: 'Failed to analyze article',
            details: error.message 
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));