import jwt from 'jsonwebtoken';


export const authUser = async (req, res, next) => {
    try {
        const token = req.headers['authorization'] || req.cookies.token;

        if (!token) {
            return res.status(401).json({ error: 'Not authorized, token is required' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SCRECT)

        req.user = decoded
        next()
    } catch (error) {
        res.status(401).json({ error: 'Not authorized, token is required' })
    }
}