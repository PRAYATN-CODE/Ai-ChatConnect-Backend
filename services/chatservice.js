import Chat from "../database/models/ChatHistory.js";

// Save a message to the database
export const saveMessage = async (roomId, senderId, senderName, messageText) => {
    try {
        let chat = await Chat.findOne({ roomId });

        if (!chat) {
            // If no chat exists, create a new one
            chat = new Chat({ roomId, messages: [] });
        }

        // Add the new message
        chat.messages.push({
            sender: {
                id: senderId,
                name: senderName,
            },
            text: messageText,
        });


        await chat.save();
        return chat;
    } catch (error) {
        throw new Error(`Error saving message: ${error.message}`);
    }
};

// Fetch chat history for a room
const fetchChatHistory = async (roomId) => {
    try {
        const chat = await Chat.findOne({ roomId }).populate('messages.sender.id', 'name');

        return chat ? chat.messages : [];
    } catch (error) {
        throw new Error(`Error fetching chat history: ${error.message}`);
    }
};

export default {
    fetchChatHistory,
};
