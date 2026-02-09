const AiCache = require('../models/AiCache');
const crypto = require('crypto');
const mongoose = require('mongoose');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const generateHash = (data) => {
    return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
};

const getAIResponse = async (prompt, systemInstruction = "", retries = 3) => {
    const messages = [];

    if (systemInstruction) {
        messages.push({ role: "system", content: systemInstruction });
    }
    messages.push({ role: "user", content: prompt });

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log("Fetching from OpenRouter...");

            const response = await fetch(OPENROUTER_URL, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:5000",
                    "X-Title": "Agrimate"
                },
                body: JSON.stringify({
                    model: "google/gemini-2.0-flash-001",
                    messages: messages,
                    response_format: { type: "json_object" }
                })
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`OpenRouter API error (${response.status}): ${errorData}`);
            }

            const data = await response.json();
            let text = data.choices[0]?.message?.content || "";

            console.log("Raw OpenRouter Response:", text);

            // Sanitize JSON
            text = text.replace(/```json|```/g, '').trim();

            try {
                return JSON.parse(text);
            } catch (parseError) {
                console.error("AI returned invalid JSON:", text);
                throw new Error("Invalid JSON response from AI");
            }
        } catch (error) {
            console.error(`OpenRouter API Error (Attempt ${attempt}/${retries}):`, error.message);

            // Retry on rate limits, server errors, or network failures
            const isRetryable = error.message.includes('429') ||
                error.message.includes('503') ||
                error.message.includes('fetch failed') ||
                error.message.includes('ECONNRESET') ||
                error.message.includes('ETIMEDOUT');

            if (isRetryable && attempt < retries) {
                const delay = 2000 * attempt;
                console.log(`Retrying in ${delay}ms...`);
                await new Promise(res => setTimeout(res, delay));
            } else {
                logError(error);
                throw new Error("AI Service Error: " + error.message);
            }
        }
    }
};

const fs = require('fs');
const path = require('path');

const logError = (error) => {
    const logPath = path.join(__dirname, '../api_error.log');
    const timestamp = new Date().toISOString();
    const message = `[${timestamp}] ERROR: ${error.message}\nSTACK: ${error.stack}\n\n`;
    try {
        fs.appendFileSync(logPath, message);
    } catch (e) {
        console.error("Failed to write to log file");
    }
};

const getCachedOrFreshResponse = async (promptData, promptTemplate, cacheKeyIdentifier) => {
    const promptHash = generateHash(promptData);

    // Check Cache
    try {
        if (mongoose.connection.readyState === 1) {
            const cachedEntry = await AiCache.findOne({ promptHash });
            if (cachedEntry) {
                console.log("Serving from Cache");
                return cachedEntry.response;
            }
        }
    } catch (dbError) {
        console.warn("Cache lookup failed, skipping cache:", dbError.message);
    }

    // If not in cache, call AI
    console.log("Fetching from AI");
    let aiResponse;
    try {
        aiResponse = await getAIResponse(promptTemplate);
    } catch (error) {
        console.error("AI API Error:", error.message);
        throw new Error(`AI Service Error: ${error.message}`);
    }

    // Save to Cache
    try {
        if (mongoose.connection.readyState === 1) {
            AiCache.create({
                promptHash,
                prompt: promptTemplate,
                response: aiResponse
            }).catch(err => console.error("Failed to cache response:", err.message));
        }
    } catch (err) {
        console.error("Cache write failed:", err.message);
    }

    return aiResponse;
};

module.exports = {
    getCachedOrFreshResponse
};
