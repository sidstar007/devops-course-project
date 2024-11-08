// user-service/src/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/userModels');
const config = require('.././config/config');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token =
    authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;
      console.log(token);
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized, user not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: 'Unauthorized, invalid or expired token' });
  }
};
