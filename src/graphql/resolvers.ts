import User from 'models/users'
import { createJWT, createRefreshToken } from 'service/JWT_service'
import jwt, {JwtPayload} from 'jsonwebtoken'

interface userInput {
    username: string,
    password: string,
    first_name: string,
    last_name: string,
    terms: boolean
}

interface loginInput {
    username: string,
    password: string,
}

interface GraphQLContext {
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

export const resolvers = {
    Query: {
        async getUser(_:unknown, { ID }: { ID: string }) {
            try {
                return await User.findById(ID)
            } catch (e) {
                console.error("Error get user:", e);
            }

        },
        async getUsers(_:unknown, { amount }: { amount: number }) {
            try {
                return await User.find().sort({_created_at: -1}).limit(amount)
            } catch (e) {
                console.error("Error get user list:", e);
            }

        }
    },
    Mutation: {
        async createUser(
            _:unknown,
            {userInput: {username, password, first_name, last_name, terms}}: { userInput: userInput },
            context:GraphQLContext
        ) {
            try {
                const { res } = context;
                const existingUser = await User.findOne({ username });

                if (existingUser) {
                    throw new Error('Username already exists');
                }

                const newUser = new User({
                    username,
                    password,
                    first_name,
                    last_name,
                    terms,
                    role: 'admin',
                    _created_at: new Date().toISOString(),
                });

                const result = await newUser.save();

                const accessToken:string | undefined = createJWT({ username, userId: result._id } as { username: string; userId: string });
                const refreshToken:string | undefined = createRefreshToken({ username, userId: result._id } as { username: string; userId: string });

                if (!refreshToken) {
                    throw new Error('Failed to create refresh token');
                }

                res.cookie('refresh_token',refreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 86400000 });

                return { accessToken: accessToken };

            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.error('Error creating user:', error.message);
                    throw new Error('Error creating user');
                } else {
                    console.error('Error creating user:', String(error));
                    throw new Error('Error creating user');
                }
            }
        },
        async loginUser(_: unknown,
                        { loginInput }: { loginInput: loginInput },
                        context:GraphQLContext
        ) {
            const { username } = loginInput;
            const { res } = context;

            try {
                const findUser = await User.findOne({ username: username});

                if (!findUser) {
                    throw new Error('Invalid credentials');
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
            context:GraphQLContext
        ) {
            try {
                const { req } = context
                const refreshToken = req.headers.cookie.split('=')[1];

                if (!refreshToken) {
                    throw new Error('Refresh token not provided');
                }

                const userData = jwt.verify(refreshToken, process.env.SECRET_KEY!) as JwtPayload & { username: string; userId: string };
                const newAccessToken:string | undefined = createJWT({ username:userData.username, userId: userData.userId });

                return { accessToken: newAccessToken };
            } catch (e) {
                console.error("Error during token refresh:", e);
                throw new Error('Internal server error');
            }
        }
    }
}
