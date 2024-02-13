import mongoose, { Schema, Document, Model } from "mongoose";

interface IUserAction extends Document {
  userAction: string;
}

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
  mongoose.models.UserBehaviors ||
  mongoose.model<IUserAction>("UserBehaviors", userActionSchema);

export default UserActions;
