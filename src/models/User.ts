import Joi from "joi";
import jwt, { Secret } from "jsonwebtoken";
import { Document, Schema, model } from "mongoose";

interface User extends Document {
  username: string;
  email: string;
  password: string;
  verified: boolean;
  generateAuthToken(): string;
}

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET as Secret, {
    expiresIn: "5h",
  });
  return token;
};

export const User = model<User>("user", userSchema);

export const Validate = (user: {
  username: string;
  email: string;
  password: string;
}) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(255).required().label("username"),
    email: Joi.string().email().required().label("email"),
    password: Joi.string().min(6).required().label("password"),
  });

  return schema.validate(user);
};
