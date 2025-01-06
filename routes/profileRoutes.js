import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinaryConfig.js';
import { uploadProfileImageController } from '../controllers/profileController.js';
import * as authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'user-profile-images',
        allowed_formats: ['jpeg', 'png', 'jpg'],
    },
});

const upload = multer({ storage: storage });

router.post(
    '/upload-profile-image',
    authMiddleware.authUser,
    upload.single('profileImage'),
    uploadProfileImageController
);

export default router;
