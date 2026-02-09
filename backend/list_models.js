// Script to list available Gemini models for your API key
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Test different model names
    const modelsToTest = [
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-pro",
        "gemini-1.0-pro-latest",
        "models/gemini-1.5-flash"
    ];

    console.log("Testing models with your API key...\n");

    for (const modelName of modelsToTest) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Say hello in one word");
            const response = await result.response;
            console.log(`✅ ${modelName}: WORKS - "${response.text().trim()}"`);
        } catch (error) {
            if (error.message.includes('404')) {
                console.log(`❌ ${modelName}: NOT AVAILABLE`);
            } else if (error.message.includes('429')) {
                console.log(`⚠️  ${modelName}: RATE LIMITED (but model exists)`);
            } else {
                console.log(`❌ ${modelName}: ${error.message.substring(0, 50)}...`);
            }
        }
        // Small delay between requests
        await new Promise(r => setTimeout(r, 1000));
    }
}

listModels();
