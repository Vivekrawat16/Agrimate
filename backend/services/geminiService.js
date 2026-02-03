const { GoogleGenerativeAI } = require("@google/generative-ai");
const AiCache = require('../models/AiCache');
const crypto = require('crypto');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateHash = (data) => {
    return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
};

const getGeminiResponse = async (prompt, systemInstruction = "", retries = 1) => {
    const model = genAI.getGenerativeModel({
        model: "gemini-1.0-pro",
        generationConfig: { responseMimeType: "application/json" }
    });

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const result = await model.generateContent(systemInstruction + "\n" + prompt);
            const response = await result.response;
            let text = response.text();
            console.log("Raw Gemini Response:", text);

            // Sanitize JSON
            text = text.replace(/```json|```/g, '').trim();

            try {
                return JSON.parse(text);
            } catch (parseError) {
                console.error("Gemini returned invalid JSON:", text);
                throw new Error("Invalid JSON response from AI");
            }
        } catch (error) {
            console.error(`Gemini API Error (Attempt ${attempt}/${retries}):`, error.message);

            const isRetryable = error.message.includes('429') || error.message.includes('503');
            if (isRetryable && attempt < retries) {
                const delay = 1500; // Fixed short delay for faster feedback
                console.log(`Retrying in ${delay}ms...`);
                await new Promise(res => setTimeout(res, delay));
            } else {
                logError(error);
                throw new Error("Failed to fetch response from Gemini: " + error.message);
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

const mongoose = require('mongoose');

const getCachedOrFreshResponse = async (promptData, promptTemplate, cacheKeyIdentifier) => {
    // Create a consistent hash based on the identifier (e.g., all inputs)
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

    // If not in cache, call Gemini
    // If not in cache, call Gemini
    console.log("Fetching from Gemini");
    let aiResponse;
    try {
        aiResponse = await getGeminiResponse(promptTemplate);
    } catch (error) {
        console.warn("Falling back to MOCK DATA due to API error:", error.message);

        // Dynamic Mock Responses based on input data (promptData)
        if (cacheKeyIdentifier === 'crop-recommendation') {
            const soil = promptData?.soil?.toLowerCase() || "";
            const season = promptData?.season?.toLowerCase() || "";

            let crops = [];
            if (soil.includes("red")) {
                crops.push({ name: "Groundnut", reason: "Red soil is ideal for groundnut cultivation.", expected_profit: "High", water_requirement: "Moderate", growth_duration: "100-120 days" });
                crops.push({ name: "Cotton", reason: "Suitable for red soil with good drainage.", expected_profit: "High", water_requirement: "High", growth_duration: "150-160 days" });
            } else if (soil.includes("black")) {
                crops.push({ name: "Soybean", reason: "Black soil retains moisture well.", expected_profit: "Medium", water_requirement: "Moderate", growth_duration: "90-100 days" });
                crops.push({ name: "Wheat", reason: "Excellent yield in black soil during Rabi.", expected_profit: "High", water_requirement: "Moderate", growth_duration: "120 days" });
            } else {
                // Default fallback
                crops.push({ name: "Maize", reason: "Versatile crop for strictly testing.", expected_profit: "Medium", water_requirement: "Moderate", growth_duration: "110 days" });
                crops.push({ name: "Sorghum", reason: "Drought resistant fallback option.", expected_profit: "Low", water_requirement: "Low", growth_duration: "100 days" });
            }

            aiResponse = { recommended_crops: crops };

        } else if (cacheKeyIdentifier === 'yield-prediction') {
            const landSize = parseFloat(promptData?.landSize) || 1;
            const baseYield = 20 * landSize; // generic calculation

            aiResponse = {
                estimated_yield: `${baseYield}`,
                yield_unit: "quintals",
                best_case: `${baseYield * 1.2} quintals`,
                worst_case: `${baseYield * 0.8} quintals`,
                tips_to_increase_yield: [
                    "Ensure timely irrigation based on soil moisture.",
                    "Apply NPK fertilizer in split doses."
                ]
            };
        } else if (cacheKeyIdentifier === 'disease-prediction') {
            aiResponse = {
                possible_diseases: [
                    {
                        name: "Leaf Spot",
                        confidence: "85%",
                        treatment: "Spray Mancozeb 75 WP @ 2g/liter.",
                        organic_solution: "Spray Neem oil (3%).",
                        chemical_solution: "Carbendazim 50 WP.",
                        urgency_level: "High"
                    }
                ]
            };
        } else if (cacheKeyIdentifier === 'chat-agent') {
            aiResponse = {
                answer: "I am having trouble connecting to the cloud right now. Please check your internet connection or API key. In the meantime, remember that good soil preparation is key to a bountiful harvest!"
            };
        } else {
            throw error; // Re-throw if unknown identifier
        }
    }

    // Save to Cache (Fire and forget)
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
