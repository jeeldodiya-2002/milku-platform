const jwt = require('jsonwebtoken');

/**
 * JWT Authentication Middleware
 * Validates the Bearer token in the Authorization header.
 */
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            success: false, 
            message: "No token provided" 
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach decoded payload (admin id, etc) to request
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                message: "Token expired. Please login again." 
            });
        }
        
        return res.status(401).json({ 
            success: false, 
            message: "Invalid token." 
        });
    }
};

module.exports = { verifyToken };
