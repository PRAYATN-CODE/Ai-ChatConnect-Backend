import 'dotenv/config.js';
import http from 'http';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import app from './app.js';
import projectModel from './database/models/ProjectModel.js';
import { generateResult } from './services/aiservice.js';
import { saveMessage } from './services/chatservice.js';

const port = process.env.PORT || 3000


const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: '*',
        credentials: true,
    },
});


io.use(async (socket, next) => {
    try {
        const authHeader = socket.handshake.auth?.token || socket.handshake.headers['authorization'];
        const projectId = socket.handshake.query.projectId;
        let token;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else {
            token = authHeader;
        }

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return next(new Error('Invalid Project ID'));
        }

        socket.project = await projectModel.findById(projectId);

        if (!token) {
            return next(new Error('Not authorized, token is required'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SCRECT);

        if (!decoded) {
            return next(new Error('Invalid token'));
        }

        socket.user = { email: decoded.email };
        next();

    } catch (error) {
        next(error);
    }
})

io.on('connection', socket => {
    console.log('User Connection Established');

    socket.roomId = socket.project._id.toString();

    socket.join(socket.roomId)

    socket.on('project-message', async data => {

        const message = data.message;
        console.log('Message', data);

        const storechat = await saveMessage(
            socket.roomId,
            data.sender._id,
            data.sender.name,
            data.message
        )

        if (storechat) {
            console.log('Chat saved successfully')
        }

        const aiIsPresentInMessage = message.includes('@ai')

        if (aiIsPresentInMessage) {

            socket.broadcast.to(socket.roomId).emit('project-message', data)
            const prompt = message.replace('@ai', ' ')
            const result = await generateResult(prompt)
            const ai_id = "677456facb1e3cbadd313e6a"

            io.to(socket.roomId).emit('project-message', {
                message: result,
                sender: {
                    _id: ai_id,
                    name: 'J.A.R.V.I.S'
                }
            })

            const storechat = await saveMessage(
                socket.roomId,
                ai_id,
                'J.A.R.V.I.S',
                result
            )

            if (storechat) {
                console.log('Ai Chat saved successfully')
            }

            return
        }

        socket.broadcast.to(socket.roomId).emit('project-message', data)
    })

    socket.on('event', data => { /* _ */ });
    socket.on('disconnect', () => {
        console.log('User disconnected');
        socket.leave(socket.roomId);
    });
});

process.on('SIGINT', () => {
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Trying a different port...`);
      const newPort = port + 1; // Increment the port number
      server.listen(newPort, () => {
        console.log(`Server is now running on http://localhost:${newPort}`);
      });
    } else {
      console.error("An unexpected error occurred:", error);
      process.exit(1); // Exit process if the error is not recoverable
    }
  });