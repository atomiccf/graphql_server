const jwt = require('jsonwebtoken')

module.exports = {
    createJWT: (userData) => {
        try {
            const secret = process.env.SECRET_KEY.trim().replace(/\\n/g, '\n')
            const accessToken = jwt.sign(userData, secret, { algorithm: 'RS256', expiresIn: '30m' });

            return accessToken
        } catch (e) {
            console.error("Error generating JWT:", e);

        }
    },

    createRefreshToken: (userData) => {
        try {
            const secret = process.env.SECRET_KEY.trim().replace(/\\n/g, '\n')
            const refreshToken = jwt.sign(userData, secret, { algorithm: 'RS256', expiresIn: '1d' });

            return refreshToken
        } catch (e) {
            console.error("Error generating JWT:", e);
        }
    }
}

