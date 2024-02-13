import mongoose from "mongoose";

const connectMongoDB = async () => {
  const MONGO_URL =
    "mongodb+srv://ylinux96:yousef96111@cluster1.hftwajy.mongodb.net/useractions_db";
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,

    } as mongoose.ConnectOptions);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectMongoDB;
