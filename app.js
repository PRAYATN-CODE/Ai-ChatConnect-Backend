import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import connect from './database/db.js';

// Route Imports
import aiRoutes from './routes/aiRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import executeRoutes from './routes/executeRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Connect to Database
connect();

const app = express();

// Middleware
app.use(cors({
    origin: '*',
    credentials: true, // allow credentials if needed (cookies, etc.)
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/users', userRoutes);
app.use('/projects', projectRoutes);
app.use('/ai', aiRoutes);
app.use('/chat', chatRoutes);
app.use('/code', executeRoutes);
app.use('/profile', profileRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Optional: Catch-all 404 route
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

// Optional: Central error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

export default app;
