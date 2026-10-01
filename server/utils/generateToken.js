import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'kick_home_care_super_secret_jwt_key_2026', {
    expiresIn: '30d'
  });
};
