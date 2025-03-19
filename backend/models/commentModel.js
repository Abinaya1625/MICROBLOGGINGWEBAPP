import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",  // Ensure "Post" matches your actual Post model name
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  // Ensure "User" matches your actual User model name
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true, // Removes extra spaces
    }
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
