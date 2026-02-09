require('dotenv').config();

async function testOpenRouter() {
    console.log("Testing OpenRouter API...");
    console.log("Key length:", process.env.OPENROUTER_API_KEY?.length);

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'http://localhost:5000',
                'X-Title': 'Agrimate'
            },
            body: JSON.stringify({
                model: 'google/gemini-2.0-flash-001',
                messages: [{ role: 'user', content: 'Say hello in one word' }]
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log("✅ SUCCESS!");
            console.log("Response:", data.choices?.[0]?.message?.content);
        } else {
            console.log("❌ API Error:", data.error?.message || JSON.stringify(data));
        }
    } catch (error) {
        console.log("❌ Network Error:", error.message);
    }
}

testOpenRouter();
