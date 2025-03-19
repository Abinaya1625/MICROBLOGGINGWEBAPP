import mongoose from "mongoose";

const HomeSchema = new mongoose.Schema(
    {
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            default: null 
        }, // NULL for default posts
        username: { 
            type: String, 
            required: true 
        }, // Username (default posts will have "admin")
        profileImage: { 
            type: String, 
            required: true 
        }, // Profile picture URL
        postImage: { 
            type: String, 
            required: true 
        }, // Post image URL
        caption: { 
            type: String, 
            default: "" 
        }, // Post caption
        likes: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User" 
        }], // Users who liked the post
        comments: [
            {
                userId: { 
                    type: mongoose.Schema.Types.ObjectId, 
                    ref: "User",
                    default: null
                }, // Commenting user
                username: { 
                    type: String 
                }, // Username for quick access
                text: { 
                    type: String, 
                    required: true 
                }, // Comment text
                createdAt: { 
                    type: Date, 
                    default: Date.now 
                } // Comment timestamp
            }
        ], // Comments array
        favorites: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User" 
        }], // Users who favorited the post
        createdAt: { 
            type: Date, 
            default: Date.now 
        } // Post creation timestamp
    },
    { timestamps: true } // Adds `createdAt` & `updatedAt` fields
);

export default mongoose.model("Home", HomeSchema);
