const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = () => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token =
      authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : null;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized, no token provided' });
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      req.user = decoded;
      next();
    } catch (error) {
      return res
        .status(401)
        .json({ message: 'Unauthorized, invalid or expired token' });
    }
  };
};
