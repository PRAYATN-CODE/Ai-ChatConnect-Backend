import mongoose from 'mongoose';
import projectModel from '../database/models/ProjectModel.js';

export const createProject = async ({ name, userId, adminName }) => {

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
            admin: userId,
            adminName: adminName,
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

    const projectBelong = await projectModel.findOne({
        _id: projectId,
        users: userId
    })

    if (!projectBelong) {
        throw new Error('User Not Belong to this Project')
    }

    const project = await projectModel.findOne({
        _id: projectId,
        admin: userId,
    });

    if (!project) {
        throw new Error('Only the Project Admin can add users');
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


export const deleteUserFromProject = async ({ adminId, userId, projectId }) => {
    try {

        if (!adminId || !userId || !projectId) {
            throw new Error('Admin ID, User ID, and Project ID are required');
        }

        const project = await projectModel.findById(projectId);

        if (!project) {
            throw new Error('Project not found');
        }

        console.log(project);

        if (project.admin.toString() !== adminId) {
            throw new Error('Only the admin can remove users from the project');
        }

        const updatedProject = await projectModel.findByIdAndUpdate(
            projectId,
            { $pull: { users: userId } },
            { new: true }
        );

        return updatedProject;

    } catch (error) {
        return {
            success: false,
            message: error.message || 'Failed to remove user from the project',
        };
    }
};

export const deleteProjectById = async ({ adminId, projectId }) => {
    try {
        if (!adminId || !projectId) {
            throw new Error('Admin ID and Project ID are required');
        }

        const project = await projectModel.findById(projectId);

        if (!project) {
            throw new Error('Project not found');
        }

        if (project.admin.toString() !== adminId) {
            throw new Error('Only the admin can delete the project');
        }

        await projectModel.findByIdAndDelete(projectId);

        return {
            message: 'Project deleted successfully',
        };

    } catch (error) {
        return {
            success: false,
            message: error.message || 'Failed to delete the project',
        };
    }
}