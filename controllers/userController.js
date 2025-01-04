import { validationResult } from 'express-validator';
import userModel from '../database/models/UserModel.js';
import * as userService from '../services/userservice.js';


export const createUserController = async (req, res) => {

    const error = validationResult(req);

    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }

    try {
        const user = await userService.createUser(req.body);
        const token = await user.generateJWT();
        delete user._doc.password;
        res.status(201).json({ user: user, token: token });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export const loginUserController = async (req, res) => {

    const error = validationResult(req);

    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }

    try {

        const { email, password } = req.body;
        const user = await userModel.findOne({ email: email }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.isValidPassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        delete user._doc.password;

        const token = await user.generateJWT();
        res.json({ user: user, token: token });

    } catch (error) {

        res.status(500).send(error.message);

    }
}

export const profileController = async (req, res) => {

    const { email } = req.user;
    const user = await userModel.findOne({ email: email });

    console.log(user);
    res.status(200).json({
        user: user
    })
}

export const logOutController = async (req, res) => {
    try {
        const token = req.headers['authorization'] || req.cookies.token;

        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }

        res.clearCookie('token');
        res.status(200).json({
            message: 'User logged out successfully',
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


export const getAllUserControllers = async (req, res) => {
    try {

        const loggedInUser = await userModel.findOne({ email: req.user.email });

        const allUsers = await userService.getAllUsers({ userId: loggedInUser._id });

        return res.status(200).json({
            users: allUsers
        })
    } catch (error) {

    }
}