const jwt = require('jsonwebtoken');

exports.authMiddleware = (req) => {
  const token = req.headers.authorization;

  console.log('Authorization header:', token); 

  if (!token) {
    console.error('No token provided');
    return { user: null };
  }

  try {
  
    const decoded = jwt.verify(token, 'aryan'); 
    console.log('Decoded token:', decoded);
    
    decoded.token = token; 
    return { user: decoded };
  } catch (error) {
    console.error('Invalid or expired token:', error.message);
    return { user: null };
  }
};
