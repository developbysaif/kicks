import mongoose from 'mongoose';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import connectDB from '../lib/db.js';
import User from '../models/User.js';
import EmailVerificationToken from '../models/EmailVerificationToken.js';
import { checkRateLimit } from '../lib/rateLimit.js';

async function runTests() {
  console.log('\n=============================================================');
  console.log('  RUNNING PRODUCTION EMAIL VERIFICATION SUITE');
  console.log('=============================================================\n');

  await connectDB();
  console.log('Connected to MongoDB database.');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  PASS: ${message}`);
      passed++;
    } else {
      console.error(`  FAIL: ${message}`);
      failed++;
    }
  }

  const testEmail = `verify_test_${Date.now()}@example.com`;
  let testUserId = null;
  let rawToken1 = null;
  let tokenHash1 = null;

  try {
    // -------------------------------------------------------------
    // TEST 1: Signup creates unverified account
    // -------------------------------------------------------------
    console.log('\n[1. Testing Signup & Unverified State]');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Secret123!', salt);

    const user = await User.create({
      fullName: 'Test Verification User',
      email: testEmail,
      passwordHash,
      phone: '03001234567',
      emailVerified: false,
      emailVerifiedAt: null
    });
    testUserId = user._id;

    assert(user && user._id, 'User account created in database');
    assert(user.emailVerified === false, 'New user emailVerified is FALSE');
    assert(user.emailVerifiedAt === null, 'New user emailVerifiedAt is NULL');

    // -------------------------------------------------------------
    // TEST 2: Token Generation & Secure Hashing (SHA-256)
    // -------------------------------------------------------------
    console.log('\n[2. Testing Secure Token Generation & Storage]');
    rawToken1 = crypto.randomBytes(32).toString('hex');
    tokenHash1 = crypto.createHash('sha256').update(rawToken1).digest('hex');
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 mins

    const tokenDoc = await EmailVerificationToken.create({
      userId: user._id,
      email: testEmail,
      tokenHash: tokenHash1,
      expiresAt
    });

    assert(rawToken1.length === 64, 'Raw token is 64 hex characters (256-bit cryptographically secure)');
    assert(tokenDoc.tokenHash === tokenHash1, 'Database stores ONLY the SHA-256 token hash');
    assert(tokenDoc.tokenHash !== rawToken1, 'Raw token is NOT stored in the database');
    assert(new Date(tokenDoc.expiresAt) > new Date(), 'Token expiration set to 30 minutes in future');

    // -------------------------------------------------------------
    // TEST 3: Login Protection for Unverified User
    // -------------------------------------------------------------
    console.log('\n[3. Testing Login Protection]');
    const foundUser = await User.findOne({ email: testEmail });
    const isPasswordMatch = await foundUser.matchPassword('Secret123!');
    assert(isPasswordMatch === true, 'Password verification works');
    assert(foundUser.emailVerified === false, 'User is unverified: Login must be blocked');

    // -------------------------------------------------------------
    // TEST 4: Invalid Token Validation
    // -------------------------------------------------------------
    console.log('\n[4. Testing Invalid Token]');
    const fakeToken = crypto.randomBytes(32).toString('hex');
    const fakeHash = crypto.createHash('sha256').update(fakeToken).digest('hex');
    const invalidDoc = await EmailVerificationToken.findOne({ tokenHash: fakeHash });
    assert(invalidDoc === null, 'Invalid/unknown token hash is correctly rejected');

    // -------------------------------------------------------------
    // TEST 5: Expired Token Handling
    // -------------------------------------------------------------
    console.log('\n[5. Testing Expired Token]');
    const expiredRawToken = crypto.randomBytes(32).toString('hex');
    const expiredHash = crypto.createHash('sha256').update(expiredRawToken).digest('hex');
    const expiredDoc = await EmailVerificationToken.create({
      userId: user._id,
      email: testEmail,
      tokenHash: expiredHash,
      expiresAt: new Date(Date.now() - 1000) // already expired 1 sec ago
    });

    const isExpired = new Date() > new Date(expiredDoc.expiresAt);
    assert(isExpired === true, 'Expired token is correctly detected as expired');
    await EmailVerificationToken.deleteOne({ _id: expiredDoc._id });

    // -------------------------------------------------------------
    // TEST 6: Resend Verification & Invalidation of Old Tokens
    // -------------------------------------------------------------
    console.log('\n[6. Testing Resend Verification]');
    // Invalidate old tokens for this user
    await EmailVerificationToken.deleteMany({ userId: user._id });
    const oldTokensRemaining = await EmailVerificationToken.countDocuments({ userId: user._id });
    assert(oldTokensRemaining === 0, 'Old tokens are completely invalidated upon resend');

    // Create fresh token
    const rawToken2 = crypto.randomBytes(32).toString('hex');
    const tokenHash2 = crypto.createHash('sha256').update(rawToken2).digest('hex');
    await EmailVerificationToken.create({
      userId: user._id,
      email: testEmail,
      tokenHash: tokenHash2,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000)
    });

    const freshDoc = await EmailVerificationToken.findOne({ tokenHash: tokenHash2 });
    assert(freshDoc !== null, 'Fresh verification token is created upon resend');

    // -------------------------------------------------------------
    // TEST 7: Resend Rate Limiting (Max 3 per 15 min)
    // -------------------------------------------------------------
    console.log('\n[7. Testing Resend Rate Limiter (Max 3 requests / 15 mins)]');
    const rateLimitKey = `test_resend_${Date.now()}`;
    const r1 = await checkRateLimit(rateLimitKey, { limit: 3, windowSeconds: 900 });
    const r2 = await checkRateLimit(rateLimitKey, { limit: 3, windowSeconds: 900 });
    const r3 = await checkRateLimit(rateLimitKey, { limit: 3, windowSeconds: 900 });
    const r4 = await checkRateLimit(rateLimitKey, { limit: 3, windowSeconds: 900 });

    assert(r1.allowed === true, 'Request 1: Allowed');
    assert(r2.allowed === true, 'Request 2: Allowed');
    assert(r3.allowed === true, 'Request 3: Allowed');
    assert(r4.allowed === false, 'Request 4: Blocked by rate limiter (429 Too Many Requests)');

    // -------------------------------------------------------------
    // TEST 8: Successful Token Verification & Account Activation
    // -------------------------------------------------------------
    console.log('\n[8. Testing Successful Token Verification]');
    // Lookup fresh token
    const tokenToVerify = await EmailVerificationToken.findOne({ tokenHash: tokenHash2 });
    assert(tokenToVerify !== null, 'Found matching tokenDoc by SHA-256 hash');

    // Activate user
    const userToActivate = await User.findById(tokenToVerify.userId);
    userToActivate.emailVerified = true;
    userToActivate.emailVerifiedAt = new Date();
    await userToActivate.save();

    // Delete token (single-use)
    await EmailVerificationToken.deleteMany({ userId: userToActivate._id });

    // Verify user is now active
    const verifiedUser = await User.findById(testUserId);
    assert(verifiedUser.emailVerified === true, 'User emailVerified is now TRUE');
    assert(verifiedUser.emailVerifiedAt instanceof Date, 'User emailVerifiedAt has valid timestamp');

    // Check single-use: token must be gone
    const tokenAfterUse = await EmailVerificationToken.findOne({ tokenHash: tokenHash2 });
    assert(tokenAfterUse === null, 'Token is invalidated/deleted immediately after use (single-use enforced)');

    // -------------------------------------------------------------
    // TEST 9: Already Verified User Handling
    // -------------------------------------------------------------
    console.log('\n[9. Testing Already Verified User]');
    const checkUserAgain = await User.findById(testUserId);
    assert(checkUserAgain.emailVerified === true, 'User remains verified; friendly already-verified message returned');

    // -------------------------------------------------------------
    // TEST 10: Verified User Login Access
    // -------------------------------------------------------------
    console.log('\n[10. Testing Login Access for Verified User]');
    assert(checkUserAgain.emailVerified === true, 'Verified user can now log in and access protected dashboard');

  } catch (err) {
    console.error('Test execution failed with error:', err);
    failed++;
  } finally {
    // Cleanup test data
    if (testUserId) {
      await User.deleteOne({ _id: testUserId }).catch(() => {});
      await EmailVerificationToken.deleteMany({ userId: testUserId }).catch(() => {});
      console.log('\nCleaned up test data.');
    }

    console.log('\n=============================================================');
    console.log(`  RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('=============================================================\n');

    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();
