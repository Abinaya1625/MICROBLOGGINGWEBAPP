// models/RequestModel.js
import mongoose from "mongoose";

// Define the Request Schema
const requestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // ID of the user sending the request
      required: true,  // It is required for the sender to exist
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId, // ID of the user being requested (the recipient)
      required: true,  // It is required for the recipient to exist
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending", // The default status is "pending"
    },
  },
  { timestamps: true }  // Auto-generate createdAt and updatedAt fields
);

// Create the Request model based on the schema
const Request = mongoose.model("Request", requestSchema);

export default Request;
