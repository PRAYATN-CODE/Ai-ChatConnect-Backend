import userModel from '../database/models/UserModel.js';
import { updateUserProfileImage, uploadProfileImage } from '../services/profileService.js';

export const uploadProfileImageController = async (req, res) => {
    try {

        const imageUrl = await uploadProfileImage(req.file);

        const user = await userModel.findOne({ email: req.user.email })

        const updatedUser = await updateUserProfileImage(user._id, imageUrl);

        res.status(200).json({
            success: true,
            message: 'Profile image uploaded successfully',
            data: updatedUser,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
