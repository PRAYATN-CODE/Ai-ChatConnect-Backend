import { Router } from "express";
import chatController from '../controllers/chatController.js';

const router = Router();

router.post('/save-message', chatController.saveMessage);

// Route to fetch chat history
router.get('/history/:roomId', chatController.fetchChatHistory);

export default router;