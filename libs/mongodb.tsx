import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);
    console.log("Connected to MongoDB");

    // Create indexes for userAction and songTitle fields
    await mongoose.connection.collection("userActions").createIndex(
      { userAction: 1, songTitle: 1 },
      { background: true } 
    );
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectMongoDB;
