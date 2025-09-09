import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId; // 👈 ensures _id is typed
  name: string;
  email: string;
  password: string;
  role: "user" | "admin" | "vendor";
  resetPasswordToken?: string;   // 👈 added
  resetPasswordExpires?: Date;   // 👈 added
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin", "vendor"],
      default: "user",
    },
    resetPasswordToken: { type: String },  // 👈 added
    resetPasswordExpires: { type: Date },  // 👈 added
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);
export default User;
