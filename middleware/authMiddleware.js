import jwt from 'jsonwebtoken';
import redisClient from '../services/redisClient.js';

export const authUser = async (req, res, next) => {
    try {
        const token = req.headers['authorization'] || req.cookies.token;

        if (!token) {
            return res.status(401).json({ error: 'Not authorized, token is required' })
        }

        const isBlackListed = await redisClient.get(token);

        if (isBlackListed) {
            console.log("redis hitting")
            res.cookies('token', '')
            return res.status(401).json({ error: 'token is Not Valid Redis Says' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SCRECT)

        req.user = decoded
        next()
    } catch (error) {
        res.status(401).json({ error: 'Not authorized, token is required' })
    }
}