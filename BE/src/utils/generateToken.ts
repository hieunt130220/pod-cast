import { ObjectId } from "mongoose";
const jwt = require("jsonwebtoken");

const generateToken = (id: ObjectId) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

module.exports = generateToken;
