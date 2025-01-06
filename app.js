import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import connect from './database/db.js';
import aiRoutes from './routes/aiRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import executeRoutes from './routes/executeRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import userRoutes from './routes/userRoutes.js';

connect();

const app = express()

app.use(cors());
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use('/users', userRoutes)
app.use('/projects', projectRoutes)
app.use('/ai', aiRoutes)
app.use('/chat', chatRoutes)
app.use('/code', executeRoutes)
app.use('/profile', profileRoutes)

export default app;