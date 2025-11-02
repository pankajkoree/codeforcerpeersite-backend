import mongoose, { Schema, Document } from "mongoose";

export interface InterfaceUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  university: string;
}

const userSchema: Schema<InterfaceUser> = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    required: true,
  },
  university: {
    type: String,
    required: true,
  },
});

export default mongoose.model("User", userSchema);
