import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post", // ✅ Ensure "Post" model exists
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ✅ Corrected to match the User model name
      required: true,
    },
  },
  { timestamps: true }
);

// Register the Like model
const Like = mongoose.model("Like", likeSchema);

export default Like;
