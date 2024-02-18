import mongoose, { Schema, Document, Model } from "mongoose";

interface IUserAction extends Document {
  userAction: string;
}

// Define the schema for the UserAction document
const userActionSchema: Schema<IUserAction> = new Schema(
  {
    userAction: String,
  },
  {
    timestamps: true,
  }
);

// Check if the model already exists
const UserActions: Model<IUserAction> =
  mongoose.models.TestInteraction ||
  mongoose.model<IUserAction>("TestInteraction", userActionSchema);

export default UserActions;
