const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const Schema = mongoose.Schema;

const UserSchema = Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      default: "customer", // 2types: customer, admin
    },
  },
  { timestamps: true }
);

UserSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.password;
  delete obj.__v;
  return obj;
};

UserSchema.methods.generateToken = function () {
  const token = jwt.sign({ _id: this._id }, JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  return token;
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
