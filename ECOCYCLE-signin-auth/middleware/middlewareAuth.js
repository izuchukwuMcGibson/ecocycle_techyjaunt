const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const parts = authHeader.split(' ');
  if (parts.length !== 2) return res.status(401).json({ message: 'Token error' });

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) return res.status(401).json({ message: 'Bad token format' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      // Distinguish between expired tokens and other verification errors to help
      // debugging. Keep messages generic in production if desired.
      if (err.name === 'TokenExpiredError') {
        console.warn('Auth middleware: token expired');
        return res.status(401).json({ message: 'Token expired' });
      }
      console.warn('Auth middleware: token invalid', err && err.message);
      return res.status(401).json({ message: 'Token invalid' });
    }

    // Attach common user info from token to the request
    req.userId = decoded.sub;
    req.userEmail = decoded.email;
    req.userRole = decoded.role;
    next();
  });
};
