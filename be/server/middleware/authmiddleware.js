const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  // console.log('Authorization Header:', req.headers.authorization); // 👈

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, jwtSecret);
    // console.log('Decoded JWT:', decoded); // 👈
    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error); // 👈
    return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
  }
};


module.exports = authMiddleware;
