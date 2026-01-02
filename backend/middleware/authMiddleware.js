import { verify } from 'jsonwebtoken';
import { findById } from '../models/User';

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = verify(token, process.env.JWT_SECRET);

            // Get user from the token
            req.user = await findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            // Check if token version matches
            if (decoded.tokenVersion !== undefined && decoded.tokenVersion !== req.user.tokenVersion) {
                return res.status(401).json({ message: 'Not authorized, token invalid' });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export default { protect };
