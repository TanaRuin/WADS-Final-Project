const { verifyFirebaseToken } = require('../utils/firebase-admin');
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const firebaseToken = authHeader.split(' ')[1];

  try {
    const decoded = await verifyFirebaseToken(firebaseToken);
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name || '',
      accessLevel: decoded.accessLevel || 'user' // optional custom claim
    };
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired Firebase token' });
  }
};

// Optional: Check access level from Firebase custom claims or fallback
const authorizeLevel = (...allowedLevels) => {
  return (req, res, next) => {
    if (!req.user || !allowedLevels.includes(req.user.accessLevel)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorizeLevel,
};
