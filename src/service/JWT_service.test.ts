import {createJWT, createRefreshToken } from "service/JWT_service";
import { beforeAll, it, describe, expect } from '@jest/globals';
import jwt from'jsonwebtoken';

interface IUserData {
    userId: string;
    username: string;
    password?: string;
}

jest.mock('jsonwebtoken');

const mockJwt = jwt as jest.Mocked<typeof jwt>;

describe('createJWT service test', () => {
    const userData:IUserData = { userId: '1', username: 'Test User' };
    const secret = 'test_secret';

    beforeAll(() => {
        process.env.SECRET_KEY = secret;
    });

    it('should generate a JWT token', () => {
        const token = 'mocked_token';
        (mockJwt.sign as jest.MockedFunction<typeof jwt.sign>).mockReturnValue(token as any);

        const result = createJWT(userData);

        expect(result).toBe(token);
        expect(mockJwt.sign).toHaveBeenCalledWith(
            userData,
            secret,
            { algorithm: 'RS256', expiresIn: '30m' }
        );
    });

    it('should log an error if JWT generation fails', () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        mockJwt.sign.mockImplementation(() => {
            throw new Error('JWT error');
        });

        createJWT(userData);

        expect(consoleSpy).toHaveBeenCalledWith(
            "Error generating JWT:",
            expect.any(Error)
        );

        consoleSpy.mockRestore();
    });
});

describe('createRefreshToken service test', () => {
    const userData:IUserData = { userId: '1', username: 'Test User' };
    const secret = 'test_secret';

    beforeAll(() => {
        process.env.SECRET_KEY = secret;
    });

    it('should generate a refresh token', () => {
        const token:string = 'mocked_token';
        (mockJwt.sign as jest.MockedFunction<typeof jwt.sign>).mockReturnValue(token as any);

        const result = createRefreshToken(userData);

        expect(result).toBe(token);
        expect(mockJwt.sign).toHaveBeenCalledWith(
            userData,
            secret,
            { algorithm: 'RS256', expiresIn: '1d' }
        );
    });

    it('should log an error if refresh token generation fails', () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        mockJwt.sign.mockImplementation(() => {
            throw new Error('JWT error');
        });

        createRefreshToken(userData);

        expect(consoleSpy).toHaveBeenCalledWith(
            "Error generating JWT:",
            expect.any(Error)
        );

        consoleSpy.mockRestore();
    });
});
