import mongoose from "mongoose";

// One connection per serverless instance, reused across invocations and hot reloads.
const g = globalThis as unknown as { _mongo?: Promise<typeof mongoose> };

const connectMongoDB = () => {
  if (!g._mongo) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is not set");
    g._mongo = mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 }).catch((err) => {
      g._mongo = undefined; // let the next request retry instead of caching a dead promise
      throw err;
    });
  }
  return g._mongo;
};

export default connectMongoDB;
