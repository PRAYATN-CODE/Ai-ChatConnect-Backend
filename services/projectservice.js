import mongoose from 'mongoose';
import projectModel from '../database/models/ProjectModel.js';

export const createProject = async ({ name, userId }) => {

    if (!name) {
        throw new Error('Name is required', name)
    }

    if (!userId) {
        throw new Error('User ID is required')
    }

    let project;
    try {
        project = await projectModel.create({
            name: name,
            users: [userId],
        })
    } catch (error) {
        if (error.code === 11000) {
            throw new Error('Project Name Already Exists')
        }
        throw error;
    }

    return project;
}


export const getAllProjectByUserId = async ({ userId }) => {

    if (!userId) {
        throw new Error("userId is required")
    }

    const allUserProjects = await projectModel.find({
        users: userId
    })

    return allUserProjects;
}

export const addUserToProject = async ({
    projectId, users, userId
}) => {
    if (!projectId) {
        throw new Error('Project ID is required')
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error('Invalid project ID')
    }

    if (!users) {
        throw new Error('Users must be specified')
    }

    if (!userId) {
        throw new Error('User ID is required')
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid User ID')
    }

    if (!Array.isArray(users) || users.some(userId => !mongoose.Types.ObjectId.isValid(userId))) {
        throw new Error('Invalid User ID in User Array')
    }

    const project = await projectModel.findOne({
        _id: projectId,
        users: userId
    })

    if (!project) {
        throw new Error('User Not Belong to this Project')
    }

    const updatedProject = await projectModel.findByIdAndUpdate({
        _id: projectId
    }, {
        $addToSet: {
            users: {
                $each: users
            }
        }
    }, {
        new: true,
        runValidators: true
    })


    if (!updatedProject) {
        throw new Error(`Project with ID ${projectId} not found.`);
    }

    return updatedProject;
}

export const getProjectById = async ({ projectId }) => {

    if (!projectId) {
        throw new Error("projectId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error('Invalid project ID')
    }

    const project = await projectModel.findOne({
        _id: projectId
    }).populate('users')

    return project;
}