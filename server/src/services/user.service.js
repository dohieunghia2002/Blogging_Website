import User from "../models/user.model.js";
import { errorResponse, successResponse } from "../helpers/response.helper.js";


const UserService = {
    getMe: async({ id }) => {
        try {
            const user = await User.findById(id).select("-password -refreshToken");
            if(!user) {
                return errorResponse("user not found", 404);
            }
            return successResponse("get user profile successful", user, 200);
        } catch (error) {
            return errorResponse(error.message, 500);
        }
    },

    getUserByPenName: async({ penName }) => {
        try {
            const user = await User.findOne({ penName }).select("name penName avatar role createdAt");
            if(!user) {
                return errorResponse("user not found", 404);
            }
            return successResponse("get public user profile successful", user, 200);
        } catch (error) {
            return errorResponse(error.message, 500);
        }
    }
}

export default UserService;
