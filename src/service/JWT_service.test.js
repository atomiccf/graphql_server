const { createJWT, createRefreshToken } = require('./JWT_service');
const { beforeAll, it, describe, expect } = require('@jest/globals');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('createJWT service test', () => {
    const userData = { id: 1, name: 'Test User' };
    const secret = 'test_secret';

    beforeAll(() => {
        process.env.SECRET_KEY = secret;
    });

    it('should generate a JWT token', () => {
        const token = 'mocked_token';
        jwt.sign.mockReturnValue(token);

        const result = createJWT(userData);

        expect(result).toBe(token);
        expect(jwt.sign).toHaveBeenCalledWith(userData, secret, { algorithm: 'RS256', expiresIn: '30m' });
    });

    it('should log an error if JWT generation fails', () => {
        console.error = jest.fn(); // Mock console.error
        jwt.sign.mockImplementation(() => { throw new Error('JWT error'); });

        createJWT(userData);

        expect(console.error).toHaveBeenCalledWith("Error generating JWT:", expect.any(Error));
    });
});

describe('createRefreshToken service test', () => {
    const userData = { id: 1, name: 'Test User' };
    const secret = 'test_secret';

    beforeAll(() => {
        process.env.SECRET_KEY = secret;
    });

    it('should generate a refresh token', () => {
        const token = 'mocked_token';
        jwt.sign.mockReturnValue(token);

        const result = createRefreshToken(userData);

        expect(result).toBe(token);
        expect(jwt.sign).toHaveBeenCalledWith(userData, secret, { algorithm: 'RS256', expiresIn: '1d' });
    });

    it('should log an error if refresh token generation fails', () => {
        console.error = jest.fn(); // Mock console.error
        jwt.sign.mockImplementation(() => { throw new Error('JWT error'); });

        createRefreshToken(userData);

        expect(console.error).toHaveBeenCalledWith("Error generating JWT:", expect.any(Error));
    });
});
