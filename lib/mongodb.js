import mongoose from 'mongoose';

// Disable buffering globally so Mongoose operations fail immediately or connect cleanly instead of hanging for 10s
mongoose.set('bufferCommands', false);

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development and serverless execution in production.
 */
let cached = global.mongoose || global.mongooseCache;

if (!cached) {
  cached = { conn: null, promise: null };
  global.mongoose = cached;
  global.mongooseCache = cached;
}

export async function connectDB() {
  // 1. If connection is already established and active, return it immediately
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  const rawUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kickhomecare';
  // Normalize 'localhost' to '127.0.0.1' on Windows/Node to avoid IPv6 (::1) connection timeout
  const uri = rawUri.replace('mongodb://localhost:', 'mongodb://127.0.0.1:');
  const dbName = process.env.MONGODB_DB_NAME || 'kickhomecare';

  // 2. Guard against Vercel without cloud MONGODB_URI
  const isVercelLocalhost =
    process.env.VERCEL &&
    (!process.env.MONGODB_URI ||
      uri.includes('localhost') ||
      uri.includes('127.0.0.1'));

  if (isVercelLocalhost) {
    console.warn('MongoDB Warning: Vercel environment detected without production MONGODB_URI.');
    return null;
  }

  // 3. If currently in the middle of connecting (readyState === 2), wait for the active promise
  if (cached.promise && mongoose.connection.readyState === 2) {
    try {
      cached.conn = await cached.promise;
      return cached.conn;
    } catch (err) {
      cached.promise = null;
      cached.conn = null;
    }
  }

  // 4. If connection is disconnected (readyState === 0) or disconnecting (readyState === 3), reset and reconnect
  if (mongoose.connection.readyState !== 1) {
    cached.promise = null;
    cached.conn = null;

    const opts = {
      bufferCommands: false,
      dbName: dbName,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 30000,
      family: 4 // Force IPv4
    };

    cached.promise = mongoose
      .connect(uri, opts)
      .then((mongooseInstance) => {
        cached.conn = mongooseInstance;
        return mongooseInstance;
      })
      .catch((err) => {
        cached.promise = null;
        cached.conn = null;
        console.error('MongoDB Connection Error:', err.message);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    return null;
  }
}

export default connectDB;
