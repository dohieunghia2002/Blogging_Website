import UserService from "../services/user.service.js";

const UserController = {
    // [GET] /users/me
    getMe: async(req, res) => {
        const result = await UserService.getMe({ id: req.user.id });
        return res.status(result.statusCode).json(result);
    }
}

export default UserController;
