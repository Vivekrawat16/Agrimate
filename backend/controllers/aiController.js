const asyncHandler = require('express-async-handler');
const { getCachedOrFreshResponse } = require('../services/geminiService');

// @desc    Get Crop Recommendations
// @route   POST /api/ai/recommend-crop
// @access  Public
const recommendCrop = asyncHandler(async (req, res) => {
    const { soil, landSize, season, irrigation, state, district, previousCrop } = req.body;

    if (!soil || !landSize || !season || !irrigation || !state || !district) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }

    const prompt = `
You are an agricultural expert. 
Based on the following farmer data, recommend the best crops. 
Return ONLY valid JSON.

Farmer Data:
Soil Type: ${soil}
Land Size: ${landSize}
Season: ${season}
Irrigation: ${irrigation}
Location: ${district}, ${state}
Previous Crop: ${previousCrop || 'None'}

JSON Format:
{
 "recommended_crops":[
   {
     "name":"",
     "reason":"",
     "expected_profit":"",
     "water_requirement":"",
     "growth_duration":""
   }
 ]
}
`;

    const response = await getCachedOrFreshResponse(req.body, prompt, 'crop-recommendation');
    res.json(response);
});

// @desc    AI Chat Agent
// @route   POST /api/ai/chat
// @access  Public
const chatAgent = asyncHandler(async (req, res) => {
    const { query, history } = req.body;
    // Construct prompt with history context if needed
    const prompt = `You are an expert agriculture assistant named Agrimate. Answer the user's question politely and accurately. Return strictly valid JSON.
    User Query: "${query}"
    Answer should be in concise markdown format inside the JSON.
    Schema: { "answer": "Markdown string here" }`;

    const response = await getCachedOrFreshResponse({ query }, prompt, 'chat-agent');
    res.json(response);
});

// @desc    Predict Yield
// @route   POST /api/ai/predict-yield
// @access  Public
const predictYield = asyncHandler(async (req, res) => {
    const { cropName, landSize, soil, irrigation, fertilizer, season, location } = req.body;

    if (!cropName || !landSize || !soil) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }

    const prompt = `
Act as an agricultural yield expert.
Predict expected crop yield for:
Crop: ${cropName}
Land Size: ${landSize}
Soil: ${soil}
Irrigation: ${irrigation}
Fertilizer: ${fertilizer}
Season: ${season}
Location: ${location}

Return ONLY JSON.

{
 "estimated_yield":"",
 "yield_unit":"quintals",
 "best_case":"",
 "worst_case":"",
 "tips_to_increase_yield":[]
}
`;

    const response = await getCachedOrFreshResponse(req.body, prompt, 'yield-prediction');
    res.json(response);
});

// @desc    Predict Disease
// @route   POST /api/ai/predict-disease
// @access  Public
const predictDisease = asyncHandler(async (req, res) => {
    const { cropName, symptoms, daysSinceParams, weather, fertilizer } = req.body;

    if (!cropName || !symptoms) {
        res.status(400);
        throw new Error('Please provide crop name and symptoms');
    }

    const prompt = `
You are a plant pathologist.
Identify likely crop diseases and solutions.
Crop: ${cropName}
Symptoms: ${symptoms}
Days since symptoms: ${daysSinceParams}
Weather: ${weather}
Fertilizer/Pesticide: ${fertilizer}

Return ONLY JSON.

{
 "possible_diseases":[
   {
     "name":"",
     "confidence":"",
     "treatment":"",
     "organic_solution":"",
     "chemical_solution":"",
     "urgency_level":"High/Medium/Low"
   }
 ]
}
`;

    const response = await getCachedOrFreshResponse(req.body, prompt, 'disease-prediction');
    res.json(response);
});

module.exports = {
    recommendCrop,
    predictYield,
    predictDisease,
    chatAgent
};
