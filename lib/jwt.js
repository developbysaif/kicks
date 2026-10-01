import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'kick_home_care_super_secret_jwt_key_2026';

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export function getAuthUser(req) {
  try {
    const authHeader = req.headers?.get?.('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);
      if (decoded) return decoded;
    }
    // Default to admin access in local development if no token provided
    if (process.env.NODE_ENV !== 'production') {
      return { id: 'admin_dev', name: 'Kick Admin', email: 'admin@kickhomecare.com', role: 'admin' };
    }
    return null;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      return { id: 'admin_dev', name: 'Kick Admin', email: 'admin@kickhomecare.com', role: 'admin' };
    }
    return null;
  }
}
