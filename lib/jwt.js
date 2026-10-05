import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || process.env.AUTH_SECRET || 'kick_home_care_super_secret_jwt_key_2026';

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
}

export function verifyToken(token) {
  try {
    if (!token) return null;
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export function getAuthUser(req) {
  try {
    // 1. Authorization header (Bearer token)
    const authHeader = req.headers?.get?.('authorization') || req.headers?.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);
      if (decoded) return decoded;
    }

    // 2. Cookie header
    const cookieHeader = req.headers?.get?.('cookie');
    if (cookieHeader) {
      const match = cookieHeader.match(/token=([^;]+)/);
      if (match) {
        const decoded = verifyToken(match[1]);
        if (decoded) return decoded;
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}
