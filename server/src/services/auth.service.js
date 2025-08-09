import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import { errorResponse, successResponse } from "../helpers/response.helper.js";

const generateAccessToken = async ({ _id, role }) => {
    return jwt.sign(
        { id: _id, role: role },
        process.env.JWT_ACCESS_KEY,
        { expiresIn: "1h" }
    );
};

const generateRefreshToken = async ({ _id, role }) => {
    return jwt.sign(
        { id: _id, role: role },
        process.env.JWT_REFRESH_KEY,
        { expiresIn: "7d"}
    );
};

const AuthService = {
    signup: async({ name, penName, email, password }) => {
        try {
            const userExist = await User.findOne({ email });
            if(userExist) return errorResponse("email already registered", 409);

            const penNameExist = await User.findOne({ penName });
            if(penNameExist) return errorResponse("pen name already taken", 409);

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = new User({
                name,
                email,
                penName,
                password: hashedPassword,
                role: 'user'
            });

            await newUser.save();

            const payload = {
                _id: newUser._id,
                role: newUser.role
            };
            const accessToken = await generateAccessToken(payload);
            const refreshToken = await generateRefreshToken(payload);

            newUser.refreshToken = refreshToken;
            await newUser.save();

            return successResponse("register successful", {
                id: newUser._id,
                name: newUser.name,
                penName: newUser.penName,
                email: newUser.email,
                avatar: newUser.avatar,
                accessToken,
                refreshToken
            }, 201);
        } catch(error) {
            return errorResponse(error.message, 500);
        }
    },

    login: async({ email, password }) => {
        try {
            const user = await User.findOne({ email });
            if(!user) return errorResponse("invalid email or password", 401);

            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) return errorResponse("invalid email or password", 401);

            const payload = {
                _id: user._id,
                role: user.role
            }
            const accessToken = await generateAccessToken(payload);
            const refreshToken = await generateRefreshToken(payload);
            user.refreshToken = refreshToken;
            await user.save();

            return successResponse("login successful", {
                id: user._id,
                name: user.name,
                penName: user.penName,
                email: user.email,
                avatar: user.avatar,
                accessToken,
                refreshToken
            }, 200);
        } catch (error) {
            return errorResponse(error.message, 500);
        }
    } 
}

export default AuthService;
