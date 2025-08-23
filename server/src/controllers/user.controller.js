import UserService from "../services/user.service.js";

const UserController = {
    // [GET] /users/me
    getMe: async(req, res) => {
        const result = await UserService.getMe({ id: req.user.id });
        return res.status(result.statusCode).json(result);
    },

    // [GET] /users/:slug
    getUserBySlug: async(req, res) => {
        const { slug } = req.params;
        const result = await UserService.getUserBySlug({ slug });
        return res.status(result.statusCode).json(result);
    }
}

export default UserController;
