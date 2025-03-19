import mongoose from "mongoose";

const searchHistorySchema = new mongoose.Schema(
  {
    searcherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    searchedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    searchedAt: { 
      type: Date,
       default: Date.now
       }
  },
  { timestamps: true }
);

export default mongoose.model("SearchHistory",searchHistorySchema)
