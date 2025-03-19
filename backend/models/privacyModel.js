import mongoose from "mongoose";

const PrivacySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    isPrivate: { type: Boolean, default: false }, // ✅ Public or Private Account Setting
  },
  { timestamps: true }
);

export default mongoose.model("Privacy", PrivacySchema);
