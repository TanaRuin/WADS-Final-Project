// utils/googleAuth.js
require('dotenv').config();
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3000/auth/google/callback' // Your redirect URI
);

// For verifying ID tokens (when you receive an ID token directly from frontend)
// This is useful for client-side Google Sign-In scenarios
async function verifyGoogleToken(idToken) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
}

// Handle authorization code from server-side OAuth flow
async function getGoogleUserFromCode(code) {
  try {
    const { tokens } = await client.getToken(code);
    
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    
    return {
      googleId: payload.sub,  // Add this line
      email: payload.email,
      firstName: payload.given_name,
      lastName: payload.family_name,
      profileImage: payload.picture || null,
    };
  } catch (error) {
    console.error('Error getting Google user from code:', error);
    throw new Error('Failed to authenticate with Google');
  }
}

module.exports = { 
  verifyGoogleToken, 
  getGoogleUserFromCode 
};