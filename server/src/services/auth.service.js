import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import slugify from "slugify";

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
    signup: async({ fullname, penName, email, password }) => {
        try {
            const userExist = await User.findOne({ email });
            if(userExist) return errorResponse("email already registered", 409);

            const penNameExist = await User.findOne({ penName });
            if(penNameExist) return errorResponse("pen name already taken", 409);

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = new User({
                fullname,
                email,
                penName,
                slug: slugify(penName, { lower: true, strict: true }),
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
                fullname: newUser.fullname,
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
                fullname: user.fullname,
                penName: user.penName,
                email: user.email,
                avatar: user.avatar,
                accessToken,
                refreshToken
            }, 200);
        } catch (error) {
            return errorResponse(error.message, 500);
        }
    },

    logout: async({ id }) => {
        try {
            const user = await User.findById(id);
            if(!user) {
                return errorResponse("user not found", 404);
            }
            user.refreshToken = null;
            await user.save();
            return successResponse("logout successful", null, 200);
        } catch (error) {
            return errorResponse(error.message, 500);
        }
    },

    refreshToken: async({ refreshToken }) => {
        try {
            if(!refreshToken) {
                return errorResponse("refreshtoken is required", 400);
            }

            const user = await User.findOne({ refreshToken });
            if(!user) {
                return errorResponse("invalid refreshtoken", 403);
            }

            let payload;
            try {
                payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
            } catch (err) {
                return errorResponse("refreshtoken expired or invalid", 403)
            }

            const newAccessToken = await generateAccessToken({ _id: user._id, role: user.role });
            const newRefreshToken = await generateRefreshToken({ _id: user._id, role: user.role });

            user.refreshToken = newRefreshToken;
            await user.save();

            return successResponse("token refreshed successfully", {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            }, 200);
        } catch (error) {
            return errorResponse(error.message, 500);
        }
    }
}

export default AuthService;
