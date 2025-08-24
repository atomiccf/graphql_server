import User from "@models/users.js";
import { createJWT, createRefreshToken, verifyGoogleToken } from '@service/JWT_service.js'
import jwt, { JwtPayload } from 'jsonwebtoken'
import crypto from 'crypto'
import {hashPassword, verifyPassword} from "@utils/password_utils.js";

interface googleAuthInput {
    idToken: string
}

interface loginInput {
    username: string,
    password: string,
}

interface AuthGraphQLContext {
    req: {
        headers: {
            cookie: string;
        };
    };
    res: {
        cookie: (name: string, value: string, options: {
            httpOnly?: boolean;
            secure?: boolean;
            sameSite?: 'strict' | 'lax' | 'none';
            maxAge?: number;
        }) => void;
    };
}


export const authResolvers = {
    Mutation: {
        async loginUser(_: unknown,
                        { loginInput }: { loginInput: loginInput },
                        context:AuthGraphQLContext
        ) {
            const { username, password } = loginInput;
            const { res } = context;

            try {
                const findUser = await User.findOne({ username });

                if (!findUser) {
                    throw new Error("Invalid credentials");
                }


                const isValid = verifyPassword(password, findUser.password, findUser.salt);

                if (!isValid) {
                    throw new Error("Invalid credentials");
                }

                const accessToken:string | undefined = createJWT({ username, userId: findUser._id } as { username: string; userId: string });
                const refreshToken:string | undefined = createRefreshToken({ username, userId: findUser._id } as { username: string; userId: string });

                if (!refreshToken) {
                    throw new Error('Failed to create refresh token');
                }

                res.cookie('refresh_token',refreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 86400000 });

                return { accessToken: accessToken };
            } catch (e) {
                console.error("Error during login:", e);
                throw new Error('Internal server error');
            }
        },
        async refreshToken(
            _: unknown,
            __: unknown,
            context:AuthGraphQLContext
        ) {
            try {
                const { req } = context
                const cookies = req.headers.cookie?.split(';').reduce((acc:Record<string, string>, cookie:string) => {
                    const [name, value] = cookie.trim().split('=').map(part => part.trim());
                    return { ...acc, [name]: value };
                }, {} as Record<string, string>);
                const refreshToken = cookies.refresh_token;

                if (!refreshToken) {
                    throw new Error('Refresh token not provided');
                }

                const userData = jwt.verify(refreshToken, process.env.JWT_PRIVATE_KEY!, { algorithms: ['HS256'] } ) as JwtPayload & { username: string; userId: string };
                const newAccessToken:string | undefined = createJWT({ username:userData.username, userId: userData.userId });

                return { accessToken: newAccessToken };
            } catch (e) {
                console.error("Error during token refresh:", e);
                throw new Error('Internal server error');
            }
        },

        async googleAuth(
            _:unknown,
            { googleAuthInput }:{ googleAuthInput: googleAuthInput },
            context:AuthGraphQLContext
        ){
            if(!googleAuthInput) return null

            const { res } = context;
            try {
                const user = await verifyGoogleToken(googleAuthInput.idToken);
                if (!user) throw new Error('Invalid Google token');
                const first_name = user.given_name  || '';
                const last_name = user.family_name  || '';

                let existingUser = await User.findOne({ username: user.sub });
                if(!existingUser){
                    const generatedPassword = crypto.randomBytes(32).toString('hex');
                    const {salt, hashed } = hashPassword(generatedPassword);
                    const newUser = new User({
                        username:user.sub,
                        password:hashed,
                        salt,
                        email: user.email,
                        first_name:first_name,
                        last_name:last_name,
                        terms:true,
                        role: 'user',
                        _created_at: new Date().toISOString(),
                    });

                    existingUser = await newUser.save();
                }

                const accessToken = createJWT({ username:existingUser.username, userId:existingUser._id } as { username: string; userId: string });
                const refreshToken = createRefreshToken({ username:existingUser.username, userId:existingUser._id } as { username: string; userId: string });

                if (!refreshToken) {
                    throw new Error('Failed to create refresh token');
                }

                res.cookie('refresh_token',refreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 86400000 });

                return { accessToken: accessToken };
            }catch (e) {
                console.error('Error creating user:', e);
                if (e instanceof Error) {
                    throw new Error(e.message);
                }
                throw new Error('Unexpected error while creating user');
            }

        },

    }
}
