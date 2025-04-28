const User = require('../models/users')
const { createJWT, createRefreshToken } = require('../service/JWT_service')
const jwt = require('jsonwebtoken')

module.exports = {
    Query: {
        async getUser(_, {ID}) {
            try {
                return await User.findById(ID)
            } catch (e) {
                console.error("Error get user:", e);
            }

        },
        async getUsers(_, {amount}) {
            try {
                return await User.find().sort({_created_at: -1}).limit(amount)
            } catch (e) {
                console.error("Error get user list:", e);
            }

        }
    },
    Mutation: {
        async createUser(_, {userInput: {username, password, first_name, last_name}}) {
            try {

                const existingUser = await User.findOne({ username });
                if (existingUser) {
                    throw new Error('Username already exists');
                }

                const newUser = new User({
                    username,
                    password,
                    first_name,
                    last_name,
                    role: 'admin',
                    _created_at: new Date().toISOString(),
                });

                const res = await newUser.save();
                return {
                    id: res.id,
                    ...res._doc,
                };
            } catch (e) {
                console.error('Error creating user:', e.message);
                throw new Error('Error creating user');
            }
        },
        async loginUser(_, { loginInput }, context) {
            const { username } = loginInput;
            const { res } = context;

            try {
                const findUser = await User.findOne({ username: username});

                if (!findUser) {
                    throw new Error('Invalid credentials');
                }

                const accessToken = createJWT({ username, userId: findUser._id });
                const refreshToken = createRefreshToken({ username, userId: findUser._id });
                res.cookie('refresh_token',refreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 86400000 });

                return { accessToken: accessToken };
            } catch (e) {
                console.error("Error during login:", e);
                throw new Error('Internal server error');
            }
        },
        async refreshToken(_, __, context) {
            try {
                const { req } = context
                const refreshToken = req.headers.cookie.split('=')[1];

                if (!refreshToken) {
                    throw new Error('Refresh token not provided');
                }

                const userData = jwt.verify(refreshToken, process.env.SECRET_KEY);
                const newAccessToken = createJWT({ username:userData.username, userId: userData.userId });

                return { accessToken: newAccessToken };
            } catch (e) {
                console.error("Error during token refresh:", e);
                throw new Error('Internal server error');
            }
        }
    }
}
