import mongoose, { Schema, Document, Types } from "mongoose";
import validator from "validator";

export interface InterfaceUser extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  university: string;
}

const userSchema: Schema<InterfaceUser> = new Schema({
  firstName: {
    type: String,
    required: [true, "firstname is required"],
    trim: true,
    minLength: [2, "must be atleast 2 characters long"],
    validate: {
      validator: function (value: string) {
        return /^[a-zA-Z\s]+$/.test(value);
      },
      message: "only letters and spaces",
    },
  },
  lastName: {
    type: String,
    trim: true,
    validate: {
      validator: function (value: string) {
        return /^[a-zA-Z\s]+$/.test(value);
      },
      message: "only letters and spaces",
    },
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "please enter a valid email address"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minLength: [8, "must be 8 characters long"],
    validate: {
      validator: function (value: string) {
        return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          value
        );
      },
      message:
        "Password must contain at least one uppercase letter, one number, and one special character",
    },
  },
  gender: {
    type: String,
    required: [true, "gender is required"],
    validate: {
      validator: function (value: string) {
        return value === "male" || value === "female";
      },
      message: "gender must be either male or female",
    },
  },
  university: {
    type: String,
    required: [true, "university is required"],
    trim: true,
    minlength: [2, "must be atleast 2 characters long"],
    validate: {
      validator: function (value: string) {
        return /^[a-zA-Z\s]+$/.test(value);
      },
      message: "only letters and spaces",
    },
  },
});

export default mongoose.model("User", userSchema);
