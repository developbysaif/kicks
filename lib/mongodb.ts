import mongoose from 'mongoose';
import connectDBDefault, { connectDB as connectDBNamed } from './mongodb.js';

export const connectDB = connectDBNamed as () => Promise<typeof mongoose | null>;
export default connectDBDefault as () => Promise<typeof mongoose | null>;

