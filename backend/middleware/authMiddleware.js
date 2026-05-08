// middleware/authMiddleware.js
// This middleware protects routes by verifying the JWT token
const jwt = require('jsonwebtoken');
require('dotenv').config();

const protect = (req, res, next) => {
  try {
    // 1. Get the Authorization header (format: "Bearer <token>")
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    // 2. Extract the token (remove "Bearer " prefix)
    const token = authHeader.split(' ')[1];

    // 3. Verify the token using the JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach the decoded user info to req.user for use in controllers
    req.user = decoded;

    // 5. Move to the next middleware/route handler
    next();
  } catch (error) {
    // Token is invalid or expired
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please log in again.',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid token. Please log in again.',
    });
  }
};

module.exports = { protect };
