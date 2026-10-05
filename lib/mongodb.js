import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kickhomecare';
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'kickhomecare';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development and serverless execution in production.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // If running on Vercel without cloud MONGODB_URI configured, guard against hanging
  const isVercelLocalhost =
    process.env.VERCEL &&
    (!process.env.MONGODB_URI ||
      MONGODB_URI.includes('localhost') ||
      MONGODB_URI.includes('127.0.0.1'));

  if (isVercelLocalhost) {
    console.warn('MongoDB Warning: Vercel environment detected without production MONGODB_URI.');
    return null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: MONGODB_DB_NAME,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        return mongooseInstance;
      })
      .catch((err) => {
        cached.promise = null;
        console.error('MongoDB Connection Error:', err.message);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    return null;
  }
}

export default connectDB;
