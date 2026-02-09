import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://gourinandhana028:gourinandhana@cluster0-shard-00-00.6lz2v.mongodb.net:27017,cluster0-shard-00-01.6lz2v.mongodb.net:27017,cluster0-shard-00-02.6lz2v.mongodb.net:27017/health-manager-db?ssl=true&authSource=admin&retryWrites=true&w=majority';

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = global.mongoose_v2;

if (!cached) {
    cached = global.mongoose_v2 = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        console.log('Using cached database connection');
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        console.log('Creating new database connection...');
        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log('Database connected successfully');
            return mongoose;
        }).catch((err) => {
            console.error('Database connection error:', err);
            throw err;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default dbConnect;
