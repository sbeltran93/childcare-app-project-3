
const jwt = require('jsonwebtoken')



const verifyRole = (role) => {
    return (req, res, next) => {
        const user = req.user;
        console.log('User role:', req.user?.role);  // Log the role from the token

        if (!req.user) {
            return res.status(401).json({ error: 'No user found in token' });
        }

        if (req.user.role !== role) {
            console.log(`Access denied: ${req.user.role} does not have ${role} access`);
            return res.status(403).json({ error: 'Access denied' });
        }
        next();
    };
};




module.exports = verifyRole;