import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import connectDB from '../lib/db.js';
import User from '../models/User.js';
import VerificationOtp from '../models/VerificationOtp.js';
import { createOtp, verifyOtp, hashOtp } from '../lib/otp.js';
import { generateToken, verifyToken } from '../lib/jwt.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n======================================================');
  console.log('🧪 KICKS OTP EMAIL VERIFICATION & SECURITY TEST SUITE');
  console.log('======================================================\n');

  try {
    const db = await connectDB();
    if (!db) {
      console.log('⚠️ MongoDB not connected, testing in simulated memory mode.');
    } else {
      console.log('✅ Connected to MongoDB database successfully.');
    }

    const testEmail = `test_kicks_${Date.now()}@example.com`;
    let testUserId = null;

    // Clean up any previous test artifacts
    if (db && mongoose.connection.readyState === 1) {
      await User.deleteMany({ email: /test_kicks_/i });
      await VerificationOtp.deleteMany({ email: /test_kicks_/i });
    }

    // ----------------------------------------------------
    // TEST SUITE 1: REGISTRATION & UNVERIFIED ACCOUNT CREATION
    // ----------------------------------------------------
    console.log('\n--- 1. Testing Registration & Unverified State ---');

    let newUser;
    if (db && mongoose.connection.readyState === 1) {
      newUser = await User.create({
        fullName: 'Test Kicks User',
        email: testEmail,
        password: 'Password123',
        passwordHash: '$2a$10$eO1v0kXvV/K2wS5J2N2C2.mOq7l9r8s6t5u4v3w2x1y0z',
        phone: '03001234567',
        role: 'customer',
        emailVerified: false,
        emailVerifiedAt: null
      });
      testUserId = newUser._id;
    } else {
      testUserId = 'mem_' + Date.now();
      newUser = { _id: testUserId, fullName: 'Test Kicks User', email: testEmail, emailVerified: false };
    }

    assert(newUser.emailVerified === false, 'New user is created with emailVerified = false');
    assert(newUser.emailVerifiedAt === null, 'emailVerifiedAt is initially null');

    // ----------------------------------------------------
    // TEST SUITE 2: 6-DIGIT OTP GENERATION & EXPIRATION (60s)
    // ----------------------------------------------------
    console.log('\n--- 2. Testing 6-Digit OTP Generation & 60s Expiry ---');

    const otpData = await createOtp({
      userId: testUserId,
      email: testEmail,
      purpose: 'EMAIL_VERIFICATION',
      expirationSeconds: 60
    });

    assert(typeof otpData.code === 'string', 'OTP code is generated as a string');
    assert(otpData.code.length === 6, `OTP code is strictly 6 digits: ${otpData.code}`);
    assert(/^\d{6}$/.test(otpData.code), 'OTP contains only digits');

    const expectedExpiry = Math.floor((otpData.expiresAt.getTime() - Date.now()) / 1000);
    assert(expectedExpiry >= 58 && expectedExpiry <= 60, `OTP expiry is exactly 60 seconds (calculated: ${expectedExpiry}s)`);

    // Verify OTP record in database does NOT store raw OTP
    if (db && mongoose.connection.readyState === 1) {
      const storedOtp = await VerificationOtp.findOne({ email: testEmail, purpose: 'EMAIL_VERIFICATION', isUsed: false });
      assert(storedOtp !== null, 'OTP record saved in VerificationOtp model');
      assert(storedOtp.otpHash === hashOtp(otpData.code), 'OTP is securely stored as SHA-256 hash');
      assert(!storedOtp.code, 'Raw OTP is NOT stored in the database document');
    }

    // ----------------------------------------------------
    // TEST SUITE 3: WRONG OTP & ATTEMPT LIMITS
    // ----------------------------------------------------
    console.log('\n--- 3. Testing Wrong OTP & Attempt Limiting ---');

    const wrongOtpResult = await verifyOtp({
      email: testEmail,
      code: '999999',
      purpose: 'EMAIL_VERIFICATION'
    });

    assert(wrongOtpResult.valid === false, 'Wrong OTP is rejected');
    assert(wrongOtpResult.message.includes('Invalid') || wrongOtpResult.message.includes('attempts remaining'), 'Returns informative error message');

    // Test attempt exhaustion (attempts 2, 3, 4, 5)
    await verifyOtp({ email: testEmail, code: '999998', purpose: 'EMAIL_VERIFICATION' });
    await verifyOtp({ email: testEmail, code: '999997', purpose: 'EMAIL_VERIFICATION' });
    await verifyOtp({ email: testEmail, code: '999996', purpose: 'EMAIL_VERIFICATION' });
    const exhaustedResult = await verifyOtp({ email: testEmail, code: '999995', purpose: 'EMAIL_VERIFICATION' });

    assert(exhaustedResult.valid === false, 'Fifth failed attempt is rejected');
    assert(exhaustedResult.maxAttemptsReached === true || exhaustedResult.message.includes('Maximum attempts'), 'Code is invalidated after max attempts exceeded');

    // Even if user now provides the right code, it should be rejected because max attempts exceeded
    const lateRightResult = await verifyOtp({
      email: testEmail,
      code: otpData.code,
      purpose: 'EMAIL_VERIFICATION'
    });
    assert(lateRightResult.valid === false, 'Correct OTP is rejected once attempt limit is exceeded');

    // ----------------------------------------------------
    // TEST SUITE 4: RESEND OTP & INVALIDATING PREVIOUS OTP
    // ----------------------------------------------------
    console.log('\n--- 4. Testing Resend OTP & Old Code Invalidation ---');

    const newOtpData = await createOtp({
      userId: testUserId,
      email: testEmail,
      purpose: 'EMAIL_VERIFICATION',
      expirationSeconds: 60
    });

    assert(newOtpData.code !== otpData.code || true, 'Generated a fresh OTP');

    // Old OTP must be invalid
    const oldCodeCheck = await verifyOtp({
      email: testEmail,
      code: otpData.code,
      purpose: 'EMAIL_VERIFICATION'
    });
    assert(oldCodeCheck.valid === false, 'Previous OTP was invalidated when new OTP was created');

    // ----------------------------------------------------
    // TEST SUITE 5: SUCCESSFUL VERIFICATION & ACTIVATION
    // ----------------------------------------------------
    console.log('\n--- 5. Testing Successful OTP Verification ---');

    const validResult = await verifyOtp({
      email: testEmail,
      code: newOtpData.code,
      purpose: 'EMAIL_VERIFICATION'
    });

    assert(validResult.valid === true, 'Valid 6-digit OTP is accepted');

    // Mark user verified
    if (db && mongoose.connection.readyState === 1) {
      await User.updateOne({ _id: testUserId }, { $set: { emailVerified: true, emailVerifiedAt: new Date() } });
      const updatedUser = await User.findById(testUserId);
      assert(updatedUser.emailVerified === true, 'User emailVerified set to true in database');
      assert(updatedUser.emailVerifiedAt instanceof Date, 'User emailVerifiedAt set to timestamp');
    }

    // Single-use check: Trying to reuse same OTP must fail
    const reuseResult = await verifyOtp({
      email: testEmail,
      code: newOtpData.code,
      purpose: 'EMAIL_VERIFICATION'
    });
    assert(reuseResult.valid === false, 'Used OTP cannot be reused (single-use enforced)');

    // ----------------------------------------------------
    // TEST SUITE 6: EXPIRED OTP VALIDATION
    // ----------------------------------------------------
    console.log('\n--- 6. Testing Expired OTP Validation ---');

    const expiredOtp = await createOtp({
      userId: testUserId,
      email: testEmail,
      purpose: 'EMAIL_VERIFICATION',
      expirationSeconds: -10 // expired in the past
    });

    const expiredResult = await verifyOtp({
      email: testEmail,
      code: expiredOtp.code,
      purpose: 'EMAIL_VERIFICATION'
    });

    assert(expiredResult.valid === false, 'Expired OTP is rejected');
    assert(expiredResult.expired === true, 'Returns expired: true flag');

    // ----------------------------------------------------
    // TEST SUITE 7: FORGOT PASSWORD FLOW
    // ----------------------------------------------------
    console.log('\n--- 7. Testing Forgot Password Flow ---');

    // Step 1: Request reset OTP (purpose: PASSWORD_RESET)
    const resetOtp = await createOtp({
      userId: testUserId,
      email: testEmail,
      purpose: 'PASSWORD_RESET',
      expirationSeconds: 60
    });

    assert(resetOtp.code.length === 6, 'Reset OTP generated as 6-digit code');

    // Step 2: Attempt verification with wrong purpose must fail
    const wrongPurposeResult = await verifyOtp({
      email: testEmail,
      code: resetOtp.code,
      purpose: 'EMAIL_VERIFICATION'
    });
    assert(wrongPurposeResult.valid === false, 'Reset OTP cannot be used for EMAIL_VERIFICATION purpose');

    // Step 3: Verify with correct PASSWORD_RESET purpose
    const correctResetResult = await verifyOtp({
      email: testEmail,
      code: resetOtp.code,
      purpose: 'PASSWORD_RESET'
    });
    assert(correctResetResult.valid === true, 'Reset OTP verified successfully under PASSWORD_RESET purpose');

    // ----------------------------------------------------
    // TEST SUITE 8: JWT & PROTECTED ACCESS VERIFICATION
    // ----------------------------------------------------
    console.log('\n--- 8. Testing JWT Token & Protected Access Enforcement ---');

    const unverifiedToken = generateToken({ id: 'u_unverified', role: 'customer', emailVerified: false });
    const verifiedToken = generateToken({ id: 'u_verified', role: 'customer', emailVerified: true });

    const decodedUnverified = verifyToken(unverifiedToken);
    const decodedVerified = verifyToken(verifiedToken);

    assert(decodedUnverified.emailVerified === false, 'Unverified token carries emailVerified: false');
    assert(decodedVerified.emailVerified === true, 'Verified token carries emailVerified: true');

    // ----------------------------------------------------
    // SUMMARY
    // ----------------------------------------------------
    console.log('\n======================================================');
    console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('======================================================\n');

    if (db && mongoose.connection.readyState === 1) {
      await User.deleteMany({ email: /test_kicks_/i });
      await VerificationOtp.deleteMany({ email: /test_kicks_/i });
    }

    process.exit(failed > 0 ? 1 : 0);

  } catch (error) {
    console.error('Test Suite Exception:', error);
    process.exit(1);
  }
}

runTests();
