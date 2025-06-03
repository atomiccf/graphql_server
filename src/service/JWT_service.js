const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library');
const SECRET = process.env.SECRET_KEY.trim().replace(/\\n/g, '\n')

module.exports = {
    createJWT: (userData) => {
        try {
            return jwt.sign(userData, SECRET, {algorithm: 'RS256', expiresIn: '30m'})
        } catch (e) {
            console.error("Error generating JWT:", e);

        }
    },

    createRefreshToken: (userData) => {
        try {
         return jwt.sign(userData, SECRET, {algorithm: 'RS256', expiresIn: '1d'})
        } catch (e) {
            console.error("Error generating JWT:", e);
        }
    },

    verifyGoogleToken: async (token) => {
        const { OAuth2Client } = require('google-auth-library');
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

        if (!token) return null;

        try {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID
            });

            const payload = ticket.getPayload();
            return payload;

        } catch (e) {
            console.error("Error verifying Google ID token:", e);
            return null;
        }
    }
}

