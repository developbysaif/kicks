import mongoose, { ConnectOptions } from 'mongoose';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kickhomecare';
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'kickhomecare';

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectDB(): Promise<typeof mongoose | null> {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

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
    const opts: any = {
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
      .catch((err: Error) => {
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
