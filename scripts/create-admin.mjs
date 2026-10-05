import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import connectDB from '../lib/mongodb.js';
import User from '../models/User.js';

async function createAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@kickhomecare.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'KickAdmin2026!';
  const fullName = 'KICK Administrator';

  console.log(`Connecting to MongoDB to create verified admin (${adminEmail})...`);
  const db = await connectDB();
  if (!db) {
    console.error('Cannot connect to MongoDB. Ensure MONGODB_URI is set or local mongod is running.');
    process.exit(1);
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(adminPassword, salt);

  const admin = await User.findOneAndUpdate(
    { email: adminEmail.toLowerCase().trim() },
    {
      $set: {
        fullName,
        email: adminEmail.toLowerCase().trim(),
        passwordHash,
        role: 'admin',
        emailVerified: true,
        verificationCodeHash: null,
        verificationCodeExpiresAt: null,
        verificationAttempts: 0
      }
    },
    { upsert: true, new: true }
  );

  console.log('----------------------------------------------------');
  console.log('✓ Verified Admin User successfully provisioned:');
  console.log(`  ID:    ${admin._id}`);
  console.log(`  Name:  ${admin.fullName}`);
  console.log(`  Email: ${admin.email}`);
  console.log(`  Role:  ${admin.role}`);
  console.log(`  Verified: ${admin.emailVerified}`);
  console.log('----------------------------------------------------');
  process.exit(0);
}

createAdmin().catch((err) => {
  console.error('Failed to create admin user:', err.message);
  process.exit(1);
});
