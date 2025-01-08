import { validationResult } from 'express-validator';
import userModel from '../database/models/UserModel.js';
import * as projectservice from '../services/projectservice.js';

export const createProjectController = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name } = req.body;
        const loggedInUser = await userModel.findOne({ email: req.user.email })
        const userId = loggedInUser._id;
        const adminName = loggedInUser.name;

        const newProject = await projectservice.createProject({ name, userId, adminName });
        res.status(201).json(newProject);

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

export const getAllProject = async (req, res) => {
    try {
        const loggedInUser = await userModel.findOne({ email: req.user.email });

        const allUserProjects = await projectservice.getAllProjectByUserId({
            userId: loggedInUser._id
        })

        return res.status(200).json({ Projects: allUserProjects })

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

export const addUserToProject = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { projectId, users } = req.body;
        const loggedInUser = await userModel.findOne({ email: req.user.email });

        const updatedProject = await projectservice.addUserToProject({
            projectId,
            users,
            userId: loggedInUser._id
        })

        return res.status(200).json({ updatedProject: updatedProject })

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getProjectById = async (req, res) => {
    try {
        const { projectId } = req.params;
        const loggedInUser = await userModel.findOne({ email: req.user.email });

        const project = await projectservice.getProjectById({
            projectId
        })

        return res.status(200).json({ project: project })

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

export const deleteUserFromProjectByAdmin = async (req, res) => {
    try {
        const { projectId, userId } = req.body;

        const admin = await userModel.findOne({ email: req.user.email });

        const adminId = admin._id.toString();

        const project = await projectservice.deleteUserFromProject({
            adminId,
            userId,
            projectId
        });

        return res.status(200).json({ project: project });

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

export const deleteUserFromProjectByUser = async (req, res) => {
    try {
        const { projectId } = req.params;
        const admin = await userModel.findOne({ email: req.user.email });

        const adminId = admin._id.toString();

        const project = await projectservice.deleteProjectById({
            adminId,
            projectId
        })

        return res.status(200).json({ project: project });
    } catch {
        res.status(500).send({ error: error.message });
    }
}

export const LeaveRoomById = async (req, res) => {
    try {
        const { projectId } = req.params;
        const loggedInUser = await userModel.findOne({ email: req.user.email });
        const userId = loggedInUser._id.toString();

        const project = await projectservice.leaveRoom({
            userId: userId,
            projectId
        })

        return res.status(200).json({ project: project });

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}