import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: false,
  },
  newsImage: {
    type: String,
    required: false, // Optional image field
  },
}, 
{ timestamps: true });

export default mongoose.model("news", newsSchema);
