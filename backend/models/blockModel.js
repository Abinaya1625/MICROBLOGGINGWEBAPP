import mongoose from "mongoose";

const BlockedUserSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  blockedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]
}, { timestamps: true });

export default mongoose.model("BlockedUser", BlockedUserSchema);
