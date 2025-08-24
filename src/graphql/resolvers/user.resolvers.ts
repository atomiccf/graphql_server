import User from '@models/users.js'
import { createJWT, createRefreshToken } from '@service/JWT_service.js'
import {hashPassword} from "@utils/password_utils.js";


interface userInput {
    email: string,
    username: string,
    password: string,
    first_name: string,
    last_name: string,
    terms: boolean
}



interface UserGraphQLContext {
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

export const userResolvers = {
    Query: {
        async getUser(_:unknown, { id }: { id: string }) {
            try {
                const user = await User.findById(id);
                if (!user) {
                    throw new Error("User not found");
                }
                return user;
            } catch (e) {
                console.error("Error get user:", e);
                throw new Error("Failed to fetch user");
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
            { userInput: {username, password, first_name, last_name, terms, email }}: { userInput: userInput },
            context:UserGraphQLContext
        ) {
            try {
                const { res } = context;
                const existingUser = await User.findOne({ username });

                if (existingUser) {
                    throw new Error('Username already exists');
                }
                const {salt, hashed } = await hashPassword(password,);
                const newUser = new User({
                    email,
                    username,
                    password:hashed,
                    salt,
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
    }
}
