import cloudinary from '../config/cloudinaryConfig.js';
import userModel from '../database/models/UserModel.js';

// Upload image to Cloudinary
export const uploadProfileImage = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.path, {
            folder: 'user-profile-images',
            allowed_formats: ['jpeg', 'png', 'jpg'],
        });

        return result.secure_url;
    } catch (error) {
        throw new Error('Image upload failed');
    }
};
 

export const updateUserProfileImage = async (userId, imageUrl) => {
    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { profileImage: imageUrl },
            { new: true } 
        );

        return updatedUser;
    } catch (error) {
        throw new Error('Failed to update user profile image');
    }
};
