const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Look for the token in the headers
  const token = req.header('Authorization');
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token (removes the "Bearer " prefix if it exists)
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = decoded;
    
    // Token is valid! Pass them through to the route
    next(); 
  } catch (ex) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};