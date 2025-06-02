const jwt = require('jsonwebtoken');
require('dotenv').config();


const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user.userId, accessLevel: user.accessLevel },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId: user.userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

module.exports = generateTokens;
