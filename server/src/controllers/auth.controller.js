import AuthService from "../services/auth.service.js";
import { errorResponse } from "../helpers/response.helper.js";

const AuthController = {
    // [POST] /auth/signup
    signup: async(req, res) => {
        const { name, penName, email, password } = req.body;
        if (!name || !penName || !email || !password) {
            return res.status(400).json(
                errorResponse('name, pen name, email, and password are required', 400)
            );
        }
        const result = await AuthService.signup({ name, penName, email, password });
        return res.status(result.statusCode).json(result);

    },

    // [POST] /auth/login
    login: async(req, res) => {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json(
                errorResponse('email and password are required', 400)
            );
        }

        const result = await AuthService.login({ email, password });
        return res.status(result.statusCode).json(result);
    },

    // [POST] /auth/logout
    logout: async(req, res) => {
        const id = req.user.id;
        const result = await AuthService.logout({ id });
        return res.status(result.statusCode).json(result);
    },

    // [POST] /auth/refresh
    refreshToken: async(req, res) => {
        const { refreshToken } = req.body;
        const result = await AuthService.refreshToken({ refreshToken });
        return res.status(result.statusCode).json(result);
    }
}

export default AuthController;
