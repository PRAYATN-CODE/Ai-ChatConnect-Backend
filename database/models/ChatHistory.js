import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'project',
        required: true,
    },
    messages: [
        {
            sender: {
                id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
                name: { type: String, required: true },
            },
            text: { type: String, required: true },
            timestamp: { type: Date, default: Date.now },
        },
    ],
});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
