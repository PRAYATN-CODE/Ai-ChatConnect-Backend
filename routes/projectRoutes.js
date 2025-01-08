import { Router } from 'express';
import { body } from 'express-validator';
import * as projectController from '../controllers/projectController.js';
import * as authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.post('/create',
    authMiddleware.authUser,
    body('name').isString().withMessage('Name is must be a String.'),
    projectController.createProjectController
)

router.get('/all', authMiddleware.authUser, projectController.getAllProject)

router.put('/add-user', authMiddleware.authUser,
    body('projectId').isString().withMessage('Project Id is required.'),
    body('users').isArray({ min: 1 }).withMessage('User must be an Array')
        .custom((users) => users.every(user => typeof user === 'string')).withMessage('Each user must be a String'),
    projectController.addUserToProject
)

router.get("/get-project/:projectId", authMiddleware.authUser, projectController.getProjectById)

router.put('/delete-user', authMiddleware.authUser,
    body('projectId').isString().withMessage('Project Id is required.'),
    body('userId').isString().withMessage('userId is required.'),
    projectController.deleteUserFromProjectByAdmin
)

router.delete('/delete-project/:projectId', authMiddleware.authUser, projectController.deleteUserFromProjectByUser)

router.delete('/leave-room/:projectId', authMiddleware.authUser, projectController.LeaveRoomById);

export default router;