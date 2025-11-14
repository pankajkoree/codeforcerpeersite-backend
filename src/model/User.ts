import mongoose, { Schema, Document, Types } from "mongoose";
import validator from "validator";

export interface InterfaceUser extends Document {
  _id: Types.ObjectId;
  name: string;
  cfusername: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  university: string;
  country: string;
  registeredOn: Date;
}

const userSchema: Schema<InterfaceUser> = new Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    trim: true,
    minLength: [2, "must be atleast 2 characters long"],
    validate: {
      validator: function (value: string) {
        return /^[a-zA-Z\s]+$/.test(value);
      },
      message: "only letters and spaces",
    },
  },
  cfusername: {
    type: String,
    required: [true, "codeforce username is required"],
    trim: true,
    minLength: [2, "must be atleast 2 characters long"],
    validate: {
      validator: function (value: string) {
        return /^[a-zA-Z0-9._-]+$/.test(value);
      },
      message: "letters,numbers and dot,underscore or hypen",
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
      validator: function (value: string): boolean {
        if (this.isModified("password") && !value.startsWith("$2b$")) {
          return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
            value
          );
        }
        return true;
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
  country: {
    type: String,
    required: [true, "must be a valid country"],
    trim: true,
    minLength: [4, "must be atleast 4 characters long"],
    validate: {
      validator: function (value: string) {
        return /^[a-zA-Z\s]+$/.test(value);
      },
      message: "only letters and spaces",
    },
  },
  registeredOn: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", userSchema);
