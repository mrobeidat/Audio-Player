import mongoose, { Schema, Document, Model } from "mongoose";

interface IUserAction extends Document {
  userAction: string;
  songTitle: string;
}

// Define the schema for the UserAction document
const userActionSchema: Schema<IUserAction> = new Schema(
  {
    userAction: String,
    songTitle: String,
  },
  {
    timestamps: true,
  }
);

// Check if the model already exists
const UserActions: Model<IUserAction> =
  mongoose.models.UserInteractions ||
  mongoose.model<IUserAction>("UserInteractions", userActionSchema);

export default UserActions;
