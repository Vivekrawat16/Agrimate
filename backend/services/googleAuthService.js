const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

console.log("Service initializing, GOOGLE_CLIENT_ID length:", process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.length : 0);

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogleToken = async (idToken) => {
    console.log("Verifying token. Token starts with:", idToken.substring(0, 15) + "...");
    console.log("Configured Audience:", process.env.GOOGLE_CLIENT_ID);
    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        console.log("Token verified successfully for:", payload.email);
        return payload;
    } catch (error) {
        console.error("Error verifying Google token explicitly:", error);
        throw new Error("Invalid Google token: " + error.message);
    }
};

module.exports = {
    verifyGoogleToken,
};
