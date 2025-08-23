import express from 'express';
import UserController from '../controllers/user.controller.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

router.get('/me', verifyToken, UserController.getMe);
router.get('/:slug', UserController.getUserBySlug);

export default router;
