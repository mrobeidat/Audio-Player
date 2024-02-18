import mongoose from "mongoose";

// connect to MongoDB database using Mongoose.
const connectMongoDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || process.env.MONGODB_URI_TEST,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as mongoose.ConnectOptions
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectMongoDB;
