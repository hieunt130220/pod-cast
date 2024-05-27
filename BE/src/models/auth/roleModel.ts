import mongoose from "mongoose";

const RoleModel = new mongoose.Schema(
  {
    roleName: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", RoleModel);
