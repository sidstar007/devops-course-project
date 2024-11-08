// product-service/src/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = (adminOnly = false) => {
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
  
        if (adminOnly) {
          console.log('Admin Emails:', config.adminEmails);
          console.log('User Email:', decoded.email);
          if (!config.adminEmails.includes(decoded.email)) {
            return res.status(403).json({ message: 'Forbidden, admin access required' });
          }
        }
  
        next();
      } catch (error) {
        console.error('JWT Verification Error:', error);
        return res
          .status(401)
          .json({ message: 'Unauthorized, invalid or expired token' });
      }
    };
  };