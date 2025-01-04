import chatservice from '../services/chatservice.js';

// Save a new message
const saveMessage = async (req, res) => {
    const { roomId, senderId, senderName, messageText } = req.body;

    try {
        const updatedChat = await chatservice.saveMessage(roomId, senderId, senderName, messageText);
        res.status(200).json({
            message: 'Message saved successfully',
            chat: updatedChat,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fetch chat history for a room
const fetchChatHistory = async (req, res) => {
    const { roomId } = req.params;

    try {
        const messages = await chatservice.fetchChatHistory(roomId);
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default {
    saveMessage,
    fetchChatHistory,
};
