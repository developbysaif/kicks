import mongoose from 'mongoose';
import connectDBDefault, { connectDB as connectDBNamed, isDbConnected as isDbConnectedNamed } from './mongodb.js';

export const connectDB = connectDBNamed as () => Promise<typeof mongoose | null>;
export const isDbConnected = isDbConnectedNamed as () => boolean;
export default connectDBDefault as () => Promise<typeof mongoose | null>;

