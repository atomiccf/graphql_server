const User = require('../models/users')
const { createJWT, createRefreshToken, verifyGoogleToken } = require('../service/JWT_service')
const jwt = require('jsonwebtoken')
const crypto = require('crypto');

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
        async createUser(_, {userInput: {username, password, first_name, last_name, email ,terms}}, context) {
            const { res } = context;
            try {
                const existingUser = await User.findOne({ username });
                const existingEmail = await User.findOne({ email });
                if (!terms) {
                    throw new Error('Terms must be accepted');
                }


                if (existingUser) {
                    throw new Error('Username already exists');
                }

                if (existingEmail) {
                    throw new Error('Email already exists');
                }

                const newUser = new User({
                    username,
                    password,
                    email: email,
                    first_name,
                    last_name,
                    terms,
                    role: 'user',
                    _created_at: new Date().toISOString(),
                });

                const result = await newUser.save();
                console.log('resultUser',result)
                const accessToken = createJWT({ username, userId: result._id });
                const refreshToken = createRefreshToken({ username, userId: result._id });
                res.cookie('refresh_token',refreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 86400000 });

                return { accessToken: accessToken };
            } catch (e) {
                console.error('Error creating user:', e);
                if (e instanceof Error) {
                    throw new Error(e.message);
                }
                throw new Error('Unexpected error while creating user');
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

        async googleAuth(_,{googleAuthInput},context){
           if(!googleAuthInput) return null
            console.log('googleAuthInput',googleAuthInput)
            const { res } = context;
            try {
                const user = await verifyGoogleToken(googleAuthInput.idToken);
                if (!user) throw new Error('Invalid Google token');
                const first_name = user.given_name  || '';
                const last_name = user.family_name  || '';

                let existingUser = await User.findOne({ username: user.sub });
                if(!existingUser){
                    const generatedPassword = crypto.randomBytes(32).toString('hex');
                    const newUser = new User({
                        username:user.sub,
                        password:generatedPassword,
                        email: user.email,
                        first_name:first_name,
                        last_name:last_name,
                        terms:true,
                        role: 'user',
                        _created_at: new Date().toISOString(),
                    });

                    existingUser = await newUser.save();
                }

                const accessToken = createJWT({ username:existingUser.username, userId:existingUser._id });
                const refreshToken = createRefreshToken({ username:existingUser.username, userId:existingUser._id });
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
