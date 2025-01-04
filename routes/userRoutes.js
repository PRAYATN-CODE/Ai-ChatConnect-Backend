import { Router } from "express";
import { body } from "express-validator";
import * as userController from '../controllers/userController.js';
import * as authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register',
    body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('password').isLength({ min: 4 }).withMessage('Password must be at least 4 characters long'),
    userController.createUserController)

router.post('/login',
    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('password').isLength({ min: 4 }).withMessage('Password must be at least 4 characters long'),
    userController.loginUserController)

router.get('/profile', authMiddleware.authUser, userController.profileController)

router.get('/logout', authMiddleware.authUser, userController.logOutController)

router.get('/all', authMiddleware.authUser, userController.getAllUserControllers)

export default router