import Post from "../models/PostModel.js";
import User from "../models/UserModel.js";
import Like from "../models/likeModel.js";
import Comment from "../models/commentModel.js";
import Request from "../models/connectModel.js";
import SavedPost from "../models/savepostModel.js";
import Home from "../models/homeModel.js";


export const createPostByUserID = async (req, res) => {
  try {
    const { id: userId } = req.params; 
    const { category, description } = req.body;

    if (!category) {
      return res.status(400).json({success: false, message: "Category is required." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({success: false, message: "User not found."});
    }

    const postImagePath = req.file ? `uploads/postImages/${req.file.filename}` : "";

    if (!postImagePath) {
      return res.status(400).json({success: false, message: "Post image is required." });
    }

    const newPost = new Post({
      userId,
      category,
      description,
      postImage: postImagePath,
    });

    await newPost.save();

    return res.status(201).json({
      success: true,
      message: "Post created successfully.",
      data: {
        _id: newPost._id,
        userId: newPost.userId,
        category: newPost.category,
        description: newPost.description,
        postImage: newPost.postImage,
        createdAt: newPost.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({success: false, error: `Internal Server Error: ${error.message}`});
  }
};



export const toggleLikePost = async (req, res) => {
  try {
    const { postId ,userId } = req.body;  // Make sure this gets data from form-data

    if (!userId) {
      return res.status(400).json({ 
        status: false,
        message: "User ID is required" });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ 
      status: false,
      message: "Post not found" });

    const existingLike = await Like.findOne({ postId, userId });

    if (existingLike) {
      await Like.deleteOne({ postId, userId });
      return res.status(200).json({ status: true, message: "Like removed" });
    } else {
      const newLike = new Like({ postId, userId });
      await newLike.save();
      return res.status(201).json({ status: true, message: "Post liked", data: newLike });
    }
  } catch (error) {
    return res.status(500).json({ status: false, message: `Error: ${error.message}` });
  }
};

// Fetch all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("userId", "name email").sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Posts retrieved successfully.",
      data: posts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};
// fetch post for single user
export const getPostsByUserId = async (req, res) => {
  try {
    const { id: userId } = req.params;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found.",
      });
    }

    // Fetch posts of the specific user
    const userPosts = await Post.find({ userId }).sort({ createdAt: -1 });

    if (userPosts.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No posts found for this user.",
      });
    }

    return res.status(200).json({
      status: true,
      message: "User's posts retrieved successfully.",
      data: userPosts,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

// Fetch posts for a single user, only if the request has been accepted
export const getAccepetedUserPosts = async (req, res) => {
  try {
    const { id: userId } = req.params;

    // Step 1: Check if the request has been accepted by the user
    const request = await Request.findOne({ requester: userId, status: 'accepted' });

    if (!request) {
      return res.status(403).json({
        status: false,
        message: "Request has not been accepted by the user.",
      });
    }

    // Step 2: Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found.",
      });
    }

    // Step 3: Fetch posts for the accepted user
    const userPosts = await Post.find({ userId }).sort({ createdAt: -1 });

    if (userPosts.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No posts found for this user.",
      });
    }

    return res.status(200).json({
      status: true,
      message: "User's posts retrieved successfully.",
      data: userPosts,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

export const fetchAcceptedUserPostByUserID = async (req, res) => {
  try {
    const { id: userId, acceptedUserId } = req.params;

    // Check if the request between the user and accepted user exists and is accepted
    const request = await Request.findOne({
      userId: userId,
      recipientId: acceptedUserId,
      status: 'accepted',
    });

    if (!request) {
      return res.status(403).json({
        status: false,
        message: 'No accepted request found between these users.',
      });
    }

    // Check if the accepted user exists
    const user = await User.findById(acceptedUserId);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'Accepted user not found.',
      });
    }

    // Fetch posts of the accepted user
    const acceptedUserPosts = await Post.find({ userId: acceptedUserId }).sort({ createdAt: -1 });

    if (acceptedUserPosts.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'No posts found for the accepted user.',
      });
    }

    return res.status(200).json({
      status: true,
      message: "Accepted user's posts retrieved successfully.",
      data: acceptedUserPosts,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

//get all likes for post

export const getAllLikes = async (req, res) => {
  try {
    const { postId } = req.params;  

    // Populate both username and profileImage
    const likes = await Like.find({ postId }).populate('userId', 'username profileImage');  

    if (!likes || likes.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'No likes found for this post.',
      });
    }

    return res.status(200).json({
      status: true,
      likes: likes.map(like => ({
        userId: like.userId?._id,                // Ensure userId is present
        profileImage: like.userId?.profileImage || "default.png",  // ✅ Provide default image if missing
        userName: like.userId?.username,         // Ensure username is present
        likedAt: like.createdAt,                 
      })),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: `Error: ${error.message}`,
    });
  }
};


export const checkIfUserLikedPost = async (req, res) => {
  try {
    const { userId, postId } = req.params;

    console.log("Checking like status for:", { userId, postId });

    // Ensure IDs are in correct format
    if (!userId || !postId) {
      return res.status(400).json({
        status: false,
        message: "User ID and Post ID are required.",
      });
    }

    // Find the like entry in the database
    const like = await Like.findOne({ userId, postId });

    console.log("Database response:", like);

    if (!like) {
      return res.status(200).json({
        status: false,
        message: "User has not liked this post.",
        liked: false,
      });
    }

    return res.status(200).json({
      status: true,
      message: "User has already liked this post.",
      liked: true,
      likedAt: like.createdAt,
    });
  } catch (error) {
    console.error("Error checking like status:", error);
    return res.status(500).json({
      status: false,
      message: `Error: ${error.message}`,
    });
  }
};
//count the likes

export const countLikesForPost = async (req, res) => {
  try {
    const { postId } = req.params;

    console.log("Counting likes for post:", postId);

    // Ensure postId is provided
    if (!postId) {
      return res.status(400).json({
        status: false,
        message: "Post ID is required.",
      });
    }

    // Count the number of likes for the given post
    const likeCount = await Like.countDocuments({ postId });

    return res.status(200).json({
      status: true,
      postId,
      totalLikes: likeCount,
    });
  } catch (error) {
    console.error("Error counting likes:", error);
    return res.status(500).json({
      status: false,
      message: `Error: ${error.message}`,
    });
  }
};

// create a comment for the post
export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, text } = req.body;
    console.log(req.body)
    // Validate inputs
    if (!userId) {
      return res.status(400).json({ status: false, message: "User ID is required." });
    }
    if (!text || text.trim() === "") {
      return res.status(400).json({ status: false, message: "Comment text is required." });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ status: false, message: "Post not found." });
    }

    // Create and save the new comment
    const newComment = new Comment({ postId, userId, text });
    await newComment.save();

    return res.status(201).json({
      status: true,
      message: "Comment added successfully.",
      data: newComment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    return res.status(500).json({ status: false, message: `Error: ${error.message}` });
  }
};
//update comment
export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId, text } = req.body;

    console.log("Request Body:", req.body); // Debugging line

    if (!text) {
      return res.status(400).json({ 
        status: false, 
        message: "Comment text is required." 
      });
    }

    // Find and update comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ status: false, message: "Comment not found." });
    }

    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ status: false, message: "Unauthorized to update this comment." });
    }

    comment.text = text;
    await comment.save();

    return res.status(200).json({
      status: true,
      message: "Comment updated successfully.",
      data: comment,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: `Error: ${error.message}` });
  }
};
//get comment by post id
export const getCommentsByPostId = async (req, res) => { 
  try {
    const { postId } = req.params;

    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        status: false,
        message: "Post not found.",
      });
    }

    // Fetch all comments for the given postId, only populating the user's name
    const comments = await Comment.find({ postId }).populate("userId", 'username profileImage');

    return res.status(200).json({
      status: true,
      message: "Comments retrieved successfully.",
      data: comments,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};
// delete comment
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params; // Get commentId from URL params

    // Find the comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        status: false,
        message: "Comment not found.",
      });
    }

    // Delete the comment
    await Comment.findByIdAndDelete(commentId);

    return res.status(200).json({
      status: true,
      message: "Comment deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};
//save post
export const toggleSavePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ status: false, message: "User ID is required." });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ status: false, message: "Post not found." });
    }

    // Check if post is already saved
    const existingSave = await SavedPost.findOne({ userId, postId });

    if (existingSave) {
      await SavedPost.deleteOne({ userId, postId });
      return res.status(200).json({ status: true, message: "Post unsaved." });
    } else {
      const newSave = new SavedPost({ userId, postId });
      await newSave.save();
      return res.status(201).json({ status: true, message: "Post saved.", data: newSave });
    }
  } catch (error) {
    return res.status(500).json({ status: false, message: `Error: ${error.message}` });
  }
};
//fetch saved post by particular user
export const getSavedPostsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ status: false, message: "User ID is required." });
    }

    // Fetch saved posts along with post details
    const savedPosts = await SavedPost.find({ userId }).populate("postId");

    if (!savedPosts.length) {
      return res.status(404).json({ status: false, message: "No saved posts found for this user." });
    }

    return res.status(200).json({
      status: true,
      message: "Saved posts retrieved successfully.",
      data: savedPosts,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: `Error: ${error.message}` });
  }
};
//get post count
export const getPostCount = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from request params

    // Count the number of posts by the user
    const postCount = await Post.countDocuments({ userId });

    return res.status(200).json({
      status: true,
      message: "Post count fetched successfully.",
      data: { userId, postCount },
    });

  } catch (error) {
    return res.status(500).json({ status: false, message: `Error: ${error.message}` });
  }
};
//remove post from saved
export const removeSavedPost = async (req, res) => {
  try {
    const { userId, postId } = req.params; // Get userId and postId from request params

    // Check if the saved post exists
    const savedPost = await SavedPost.findOne({ userId, postId });

    if (!savedPost) {
      return res.status(404).json({ status: false, message: "Saved post not found." });
    }

    // Remove the saved post
    await SavedPost.deleteOne({ userId, postId });

    return res.status(200).json({
      status: true,
      message: "Post removed from saved successfully.",
    });

  } catch (error) {
    return res.status(500).json({ status: false, message: `Error: ${error.message}` });
  }
};
// no user exist default post


export const getHomepagePosts = async (req, res) => {
    try {
        const { userId } = req.body; // Extract userId from request
        let isFirstTimeUser = false;

        // ✅ Check if userId is valid
        let userExists = null;
        if (userId) {
            userExists = await User.findById(userId);
            if (!userExists) {
                return res.status(400).json({ success: false, message: "Invalid userId." });
            }
        } else {
            isFirstTimeUser = true; // If no userId, treat as first-time user
        }

        // ✅ Fetch user-specific posts
        let userPosts = [];
        if (userId) {
            userPosts = await Home.find({ userId })
                .populate("userId", "username profileImage")
                .sort({ createdAt: -1 })
                .limit(10);
        }

        // ✅ Fetch all posts if the user has no personal posts
        let allPosts = [];
        if (userPosts.length === 0) {
            allPosts = await Home.find({})
                .populate("userId", "username profileImage")
                .sort({ createdAt: -1 })
                .limit(10);
        }

        // ✅ Log data for debugging

        // ✅ Return posts (User posts first, otherwise all posts, otherwise default)
        let postsToReturn = userPosts.length > 0 ? userPosts : allPosts.length > 0 ? allPosts : getDefaultPosts();

        return res.status(200).json({
            success: true,
            isFirstTimeUser,
            posts: postsToReturn.map(post => ({
                postId: post._id,
                username: post.userId?.username || post.username || "admin",
                profileImage: post.userId?.profileImage || post.profileImage || "uploads/profileImages/default_admin.jpeg",
                postImage: post.postImage,
                caption: post.caption,
                likes: post.likes.length,
                comments: post.comments.length,
                favorites: post.favorites.length,
                isFavorited: userId ? (Array.isArray(post.favorites) && post.favorites.includes(userId)) : false
            }))
        });

    } catch (error) {
        console.error("Error fetching homepage posts:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Function to return default sample posts
const getDefaultPosts = () => [
    {
        postId: "default1",
        username: "admin",
        profileImage: "uploads/profileImages/default_admin.jpeg",
        postImage: "uploads/postImages/default1.jpeg",
        caption: "Welcome to Sparfie! Start sharing your moments 📷",
        likes: 0,
        comments: 0,
        favorites: 0,
        isFavorited: false
    },
    {
        postId: "default2",
        username: "admin",
        profileImage: "uploads/profileImages/default_admin.jpeg",
        postImage: "uploads/postImages/default2.jpeg",
        caption: "Discover amazing content from creators 🎨",
        likes: 0,
        comments: 0,
        favorites: 0,
        isFavorited: false
    }
];
