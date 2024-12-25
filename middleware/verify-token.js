
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const verifyToken = async (req, res, next) => {
    
    // Extract token from the 'Authorization' header
    const token = req.headers['authorization']?.split(' ')[1];

    // If no token is provided
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();

    } catch (error) {
        // If token is invalid or expired
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

module.exports = verifyToken;
