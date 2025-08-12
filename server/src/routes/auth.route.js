import express from 'express';
import AuthController from '../controllers/auth.controller.js';
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);
router.post('/logout', verifyToken, AuthController.logout);
router.post('/refresh', AuthController.refreshToken);


export default router;
