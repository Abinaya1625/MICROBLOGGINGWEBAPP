import mongoose from "mongoose";

const CloseFriendSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    closeFriends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of close friend IDs
  },
  { timestamps: true }
);

export default mongoose.model("CloseFriend", CloseFriendSchema);
