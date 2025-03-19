import multer from "multer";
import User from "../models/UserModel.js";

const upload = multer();


export const create = [
    upload.none(),
    async (req, res) => {
        try {
            const { email, username, password } = req.body;

            if (!email || !username || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Email, username, and password are required.",
                });
            }

            const userExist = await User.findOne({ email });
            if (userExist) {
                return res.status(400).json({ success: false, message: "User already exists." });
            }

            const savedUser = new User({
                email,
                username,
                password,
            });

            await savedUser.save();

            return res.status(200).json({success: true, message: "User created successfully", data: savedUser});
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: `Internal Server Error: ${error.message}`,
            });
        }
    },
];


export const fetch = async (req, res) => {
    try {
   
        const users = await User.find();
        if (users.length === 0) {
            return res.status(404).json({success: false, message: "Users not found.", data: users });
        }
        return res.status(200).json({success: true, message: "User fetched successfully",data: users});
    } catch (error) {
        return res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
};

export const Login = [
    upload.none(),
    async (req, res) => {
        try {
            const { email, password } = req.body; 

            const userExist = await User.findOne({ email });
            if (!userExist) {
                return res.status(404).json({ success: false, message: "User does not exist." });
            }

            if (userExist.password !== password) {
                return res.status(401).json({ success: false, message: "Invalid password." });
            }

            return res.status(200).json({success: true, message: "Login successful.", data: userExist});
        } catch (error) {
            return res.status(500).json({success: false, error: `Internal Server Error: ${error.message}`});
        }
    },
];


export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        return res.status(200).json({
            success: true,
            message: "User fetched successfully.",
            data: user,
        });
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error." });
    }
};

export const createProfileByUserId = async (req, res) => {
    try {
        const { id: userId } = req.params; 
        const { fullName, phoneNumber, country, gender } = req.body;

        if (!fullName || !phoneNumber || !country || !gender) {
            return res.status(400).json({
                success: false,
                message: "All fields (fullName, phoneNumber, country, gender) are required.",
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        const profileImagePath = req.file ? `uploads/profileImages/${req.file.filename}` : user.profileImage;

        user.fullName = fullName;
        user.phoneNumber = phoneNumber;
        user.country = country;
        user.gender = gender;
        user.profileImage = profileImagePath;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile created successfully.",
            data: {
                id: user._id,
                username: user.username,
                fullName: user.fullName,
                phoneNumber: user.phoneNumber,
                country: user.country,
                gender: user.gender,
                profileImage: user.profileImage,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Internal Server Error: ${error.message}`,
        });
    }
};
// profile updation
export const updateProfileByUserId = [
    upload.single("profileImage"),
    async (req, res) => {
        try {
            const { id: userId } = req.params;
            const { fullName, phoneNumber, country, gender } = req.body;

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    status: false,
                    message: "User not found.",
                });
            }

            // Update only the provided fields
            if (fullName) user.fullName = fullName;
            if (phoneNumber) user.phoneNumber = phoneNumber;
            if (country) user.country = country;
            if (gender) user.gender = gender;
            if (req.file) user.profileImage = `uploads/profileImages/${req.file.filename}`;

            await user.save();

            return res.status(200).json({
                status: true,
                message: "Profile updated successfully.",
                data: {
                    id: user._id,
                    username: user.username,
                    fullName: user.fullName,
                    phoneNumber: user.phoneNumber,
                    country: user.country,
                    gender: user.gender,
                    profileImage: user.profileImage,
                },
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: `Internal Server Error: ${error.message}`,
            });
        }
    },
];
// search user by username
//export const getUserByUsername = async (req, res) => {
    //try {
      //const { username } = req.params; // Get username from URL params
  
      // Find user by exact username
      //const user = await User.findOne({ username }).select("name username profilePic bio");
  
      //if (!user) {
        //return res.status(404).json({
          //status: false,
          //message: "User not found",
        //});
      //}
  
      //return res.status(200).json({
        //status: true,
        //message: "User retrieved successfully",
        //data: user,
      //});
    //} catch (error) {
      //return res.status(500).json({
        //status: false,
        //message: `Internal Server Error: ${error.message}`,
      //});
    //}
  //};
  export const togglePrivacy = async (req, res) => {
    try {
      const { userId } = req.params; // Get userId from URL params
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ status: false, message: "User not found." });
      }
  
      user.isPrivate = !user.isPrivate; // Toggle privacy setting
      await user.save();
  
      return res.status(200).json({
        status: true,
        message: `Account is now ${user.isPrivate ? "Private" : "Public"}.`,
        data: { isPrivate: user.isPrivate },
      });
    } catch (error) {
      return res.status(500).json({ status: false, message: `Error: ${error.message}` });
    }
  };

// ✅ Toggle Close Friend Status
export const toggleCloseFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.params;

    if (userId === friendId) {
      return res.status(400).json({ status: false, message: "You cannot add yourself as a close friend." });
    }

    // Find close friends list for the user, or create a new entry if not found
    let closeFriend = await CloseFriend.findOne({ userId });

    if (!closeFriend) {
      // If no entry exists, create a new one with an empty array
      closeFriend = new CloseFriend({ userId, closeFriends: [] });
    }

    // Ensure closeFriends is always an array before checking .includes()
    closeFriend.closeFriends = closeFriend.closeFriends || [];

    const isCloseFriend = closeFriend.closeFriends.includes(friendId);

    if (isCloseFriend) {
      // Remove friend from close friends
      closeFriend.closeFriends = closeFriend.closeFriends.filter(id => id.toString() !== friendId);
      await closeFriend.save();
      return res.status(200).json({ status: true, message: "User removed from close friends." });
    } else {
      // Add friend to close friends
      closeFriend.closeFriends.push(friendId);
      await closeFriend.save();
      return res.status(200).json({ status: true, message: "User added to close friends." });
    }
  } catch (error) {
    return res.status(500).json({ status: false, message: `Error: ${error.message}` });
  }
};

  // change password

export const changePassword = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from URL params
    const { oldPassword, newPassword } = req.body; // Get passwords from request body

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ status: false, message: "Both old and new passwords are required." });
    }

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found." });
    }

    // Directly compare old password (Not Secure)
    if (user.password !== oldPassword) {
      return res.status(400).json({ status: false, message: "Old password is incorrect." });
    }

    // Update password without hashing
    user.password = newPassword;
    await user.save();

    return res.status(200).json({ status: true, message: "Password changed successfully." });
  } catch (error) {
    return res.status(500).json({ status: false, message: `Error: ${error.message}` });
  }
};
// share profile
export const shareProfile = async (req, res) => {
  try {
    const { userId } = req.params; // Get user ID from request parameters

    const user = await User.findById(userId).select("fullName username profileImage isPrivate");

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // If the profile is private, restrict access
    if (user.isPrivate) {
      return res.status(403).json({ status: false, message: "This profile is private" });
    }

    // Construct profile sharing link (assuming a frontend URL structure)
    const profileLink = `https://yourapp.com/profile/${userId}`;

    return res.status(200).json({
      status: true,
      message: "Profile shared successfully",
      data: {
        fullName: user.fullName,
        username: user.username,
        profileImage: user.profileImage,
        profileLink
      },
    });

  } catch (error) {
    return res.status(500).json({ status: false, message: `Error: ${error.message}` });
  }
};
//get close friends list of particular user


// ✅ Get Close Friends List for a User
export const getCloseFriends = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ status: false, message: "Invalid user ID." });
    }

    // ✅ Find close friends document for the user
    const closeFriend = await CloseFriend.findOne({ userId }).populate({
      path: "closeFriends",
      select: "username profileImage",
    });

    if (!closeFriend || closeFriend.closeFriends.length === 0) {
      return res.status(200).json({ status: true, message: "No close friends found.", data: [] });
    }

    return res.status(200).json({
      status: true,
      message: "Close friends list retrieved successfully.",
      data: closeFriend.closeFriends, // Returns list of users with userId, username, profileImage
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: `Error: ${error.message}` });
  }
};


// ✅ Toggle Block (Block or Unblock a user)
export const toggleBlockUser = async (req, res) => {
  try {
    const { userId, blockId } = req.body;

    if (userId === blockId) {
      return res.status(400).json({ success: false, message: "You cannot block yourself." });
    }

    let blockEntry = await BlockedUser.findOne({ userId });

    // If no block entry exists, create a new one
    if (!blockEntry) {
      blockEntry = new BlockedUser({ userId, blockedUsers: [] });
    }

    // Ensure blockedUsers is an array
    blockEntry.blockedUsers = blockEntry.blockedUsers || [];

    const isBlocked = blockEntry.blockedUsers.some(id => id.toString() === blockId);

    if (isBlocked) {
      // Unblock the user
      blockEntry.blockedUsers = blockEntry.blockedUsers.filter(id => id.toString() !== blockId);
      await blockEntry.save();
      return res.status(200).json({ success: true, message: "User unblocked successfully." });
    } else {
      // Block the user
      blockEntry.blockedUsers.push(blockId);
      await blockEntry.save();
      return res.status(200).json({ success: true, message: "User blocked successfully." });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: `Error: ${error.message}` });
  }
};

//get block list by user id
export const getBlockedUsers = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ status: false, message: "Invalid user ID." });
    }

    // ✅ Find blocked users document for the user
    const blockedUser = await BlockedUser.findOne({ userId }).populate({
      path: "blockedUsers",
      select: "username profileImage",
    });

    if (!blockedUser || blockedUser.blockedUsers.length === 0) {
      return res.status(200).json({ status: true, message: "No blocked users found.", data: [] });
    }

    return res.status(200).json({
      status: true,
      message: "Blocked users list retrieved successfully.",
      data: blockedUser.blockedUsers, // Returns list of users with userId, username, profileImage
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: `Error: ${error.message}` });
  }
};
//get user profile
export const viewUserProfile = async (req, res) => {
  try {
    const { userId } = req.params; // Profile being viewed
    const { viewerId } = req.query; // User trying to view the profile

    // Fetch the user profile
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // If the profile is public, allow access
    if (!user.isPrivate) {
      return res.status(200).json({
        status: true,
        message: "Profile fetched successfully.",
        data: user,
      });
    }

    // Check if the viewer is the owner of the profile
    if (viewerId === userId) {
      return res.status(200).json({
        status: true,
        message: "Profile fetched successfully.",
        data: user,
      });
    }

    // Check if follow request is accepted
    const followRequest = await Request.findOne({
      userId: viewerId,
      recipientId: userId,
      status: "accepted",
    });

    if (!followRequest) {
      return res.status(403).json({
        status: false,
        message: "This profile is private. Follow request must be accepted.",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Profile fetched successfully.",
      data: user,
    });

  } catch (error) {
    return res.status(500).json({ status: false, message: `Error: ${error.message}` });
  }
};
//accepted user list
export const getAcceptedFollowers = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from request params

    // Find all accepted follow requests where the recipient is the user
    const acceptedRequests = await Request.find({ 
      recipientId: userId, 
      status: "accepted" 
    }).select("userId");

    if (!acceptedRequests.length) {
      return res.status(200).json({
        status: true,
        message: "No accepted followers found.",
        data: [],
      });
    }

    // Extract follower IDs
    const followerIds = acceptedRequests.map(req => req.userId);

    // Fetch user details of the accepted followers
    const followers = await User.find({ _id: { $in: followerIds } })
      .select("fullName username profileImage");

    return res.status(200).json({
      status: true,
      message: "Accepted followers fetched successfully.",
      data: followers,
    });

  } catch (error) {
    return res.status(500).json({ status: false, message: `Error: ${error.message}` });
  }
};
// pending and rejected list for particular user
export const getPendingRejectedFollowers = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from request params

    // Find all follow requests that are pending or rejected where the recipient is the user
    const requests = await Request.find({ 
      recipientId: userId, 
      status: { $in: ["pending", "rejected"] }
    }).select("userId status");

    if (!requests.length) {
      return res.status(200).json({
        status: true,
        message: "No pending or rejected follow requests found.",
        data: [],
      });
    }

    // Extract follower IDs
    const followerIds = requests.map(req => req.userId);

    // Fetch user details of the pending/rejected followers
    const followers = await User.find({ _id: { $in: followerIds } })
      .select("fullName username profileImage");

    // Attach status to each user
    const result = followers.map(user => {
      const request = requests.find(req => req.userId.toString() === user._id.toString());
      return { ...user._doc, status: request.status };
    });

    return res.status(200).json({
      status: true,
      message: "Pending and rejected follow requests fetched successfully.",
      data: result,
    });

  } catch (error) {
    return res.status(500).json({ status: false, message: `Error: ${error.message}` });
  }
};
//count accepted list
export const getAcceptedFollowersCount = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from request params

    // Count the number of accepted follow requests where the recipient is the user
    const acceptedCount = await Request.countDocuments({ 
      recipientId: userId, 
      status: "accepted" 
    });

    return res.status(200).json({
      status: true,
      message: "Accepted followers count fetched successfully.",
      data: { userId, acceptedCount },
    });

  } catch (error) {
    return res.status(500).json({ status: false, message: `Error: ${error.message}` });
  }
};
//rejected or pending count
export const getPendingRejectedFollowersCount = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from request params

    // Count pending follow requests
    const pendingCount = await Request.countDocuments({ 
      recipientId: userId, 
      status: "pending" 
    });

    // Count rejected follow requests
    const rejectedCount = await Request.countDocuments({ 
      recipientId: userId, 
      status: "rejected" 
    });

    return res.status(200).json({
      status: true,
      message: "Pending and rejected followers count fetched successfully.",
      data: {
        userId,
        pendingCount,
        rejectedCount
      }
    });

  } catch (error) {
    return res.status(500).json({ status: false, message: `Error: ${error.message}` });
  }
};
// search user
export const searchUser = async (req, res) => {
  try {
    const { searcherId } = req.params; // The user who is searching
    const { searchedUsername } = req.body; // The username being searched

    if (!searchedUsername) {
      return res.status(400).json({ status: false, message: "Searched username is required." });
    }

    // Check if the searched user exists
    const searchedUser = await User.findOne({ username: searchedUsername });

    if (!searchedUser) {
      return res.status(404).json({ status: false, message: "User not found." });
    }

    // Save search history (Prevent duplicate entries for the same searcher)
    const existingSearch = await SearchHistory.findOne({
      searcherId,
      searchedUserId: searchedUser._id
    });

    if (!existingSearch) {
      await SearchHistory.create({ searcherId, searchedUserId: searchedUser._id });
    }

    return res.status(200).json({
      status: true,
      message: "Search recorded successfully.",
      data: {
        _id: searchedUser._id,
        fullName: searchedUser.fullName,
        username: searchedUser.username,
        profileImage: searchedUser.profileImage
      }
    });

  } catch (error) {
    return res.status(500).json({ status: false, message: `Error: ${error.message}` });
  }
};
//search history
export const getSearchHistory = async (req, res) => {
  try {
    const { searcherId } = req.params;

    // Fetch search history and populate user details
    const history = await SearchHistory.find({ searcherId })
      .populate("searchedUserId", "fullName username profileImage")
      .sort({ createdAt: -1 });

    if (history.length === 0) {
      return res.status(404).json({ status: false, message: "No search history found." });
    }

    return res.status(200).json({
      status: true,
      message: "Search history fetched successfully.",
      data: history.map((entry) => ({
        _id: entry.searchedUserId._id,
        fullName: entry.searchedUserId.fullName,
        username: entry.searchedUserId.username,
        profileImage: entry.searchedUserId.profileImage,
        searchedAt: entry.createdAt
      }))
    });

  } catch (error) {
    return res.status(500).json({ status: false, message: `Error: ${error.message}` });
  }
};
//save search history
export const saveSearchHistory = async (req, res) => {
  try {
    const { searcherId, searchedUserId } = req.body; // Extracting IDs from request body

    if (!searcherId || !searchedUserId) {
      return res.status(400).json({ status: false, message: "Both searcherId and searchedUserId are required." });
    }

    // Ensure both users exist
    const searcherExists = await User.findById(searcherId);
    const searchedUserExists = await User.findById(searchedUserId);

    if (!searcherExists || !searchedUserExists) {
      return res.status(404).json({ status: false, message: "One or both users not found." });
    }

    // Check if the search entry already exists
    const existingSearch = await SearchHistory.findOne({ searcherId, searchedUserId });

    if (!existingSearch) {
      await SearchHistory.create({ searcherId, searchedUserId });
    } else {
      existingSearch.searchedAt = new Date(); // Update search timestamp
      await existingSearch.save();
    }

    return res.status(200).json({ status: true, message: "Search history saved successfully." });

  } catch (error) {
    return res.status(500).json({ status: false, message: `Error: ${error.message}` });
  }
};
// get savesearch history
export const getSavedSearchHistory = async (req, res) => {
  try {
    const { searcherId } = req.params; // User who performed the search

    if (!searcherId) {
      return res.status(400).json({ status: false, message: "Searcher ID is required." });
    }

    // Check if the searcher user exists
    const searcherExists = await User.findById(searcherId);
    if (!searcherExists) {
      return res.status(404).json({ status: false, message: "Searcher user not found." });
    }

    // Retrieve search history, populate searched user details, and sort by latest search
    const searchHistory = await SearchHistory.find({ searcherId })
      .populate("searchedUserId", "fullName username profileImage")
      .sort({ createdAt: -1 });

    if (searchHistory.length === 0) {
      return res.status(404).json({ status: false, message: "No saved search history found." });
    }

    return res.status(200).json({
      status: true,
      message: "Saved search history fetched successfully.",
      data: searchHistory.map((entry) => ({
        _id: entry.searchedUserId._id,
        fullName: entry.searchedUserId.fullName,
        username: entry.searchedUserId.username,
        profileImage: entry.searchedUserId.profileImage,
        searchedAt: entry.createdAt
      }))
    });

  } catch (error) {
    return res.status(500).json({ status: false, message: `Error: ${error.message}` });
  }
};
// delete search
export const deleteSearchHistory = async (req, res) => {
  try {
    const { searcherId, searchedUserId } = req.params; // User who searched & the searched user

    if (!searcherId || !searchedUserId) {
      return res.status(400).json({ status: false, message: "Both searcherId and searchedUserId are required." });
    }

    // Find and delete the search history entry
    const deletedEntry = await SearchHistory.findOneAndDelete({ searcherId, searchedUserId });

    if (!deletedEntry) {
      return res.status(404).json({ status: false, message: "Search history entry not found." });
    }

    return res.status(200).json({
      status: true,
      message: "Search history entry deleted successfully."
    });

  } catch (error) {
    return res.status(500).json({ status: false, message: `Error: ${error.message}` });
  }
};


// user profile page api

export const getUserProfile  = async (req, res) => {
    try {
        const { userId } = req.params; // Extract userId from request parameters

        // ✅ Fetch User Details
        const user = await User.findById(userId).select("fullName username bio profileImage");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // ✅ Fetch User Posts (Status Removed)
        const userPosts = await Post.find({ userId })
            .select("postImage caption category createdAt")
            .lean();

        // ✅ Fetch Likes & Comments for Each Post
        for (let post of userPosts) {
            post.likes = await Like.countDocuments({ postId: post._id });
            post.comments = await Comment.countDocuments({ postId: post._id });
        }

        // ✅ Fetch User's News Articles
        const userNews = await News.find({ userId })
            .select("title content category createdAt")
            .lean();

        // ✅ Fetch Likes & Comments for Each News Article
        for (let news of userNews) {
            news.likes = await Like.countDocuments({ newsId: news._id });
            news.comments = await Comment.countDocuments({ newsId: news._id });
        }

        // ✅ Generate Share Profile Link (Modify base URL as needed)
        const shareProfileLink = `https://sparfie.com/profile/${userId}`;

        return res.status(200).json({
            success: true,
            profile: {
                fullName: user.fullName,
                username: user.username,
                bio: user.bio || "No bio available",
                profileImage: user.profileImage || "uploads/profileImages/default_user.jpeg",
                totalPosts: userPosts.length,
                shareProfileLink
            },
            posts: userPosts.map(post => ({
                postId: post._id,
                postImage: post.postImage,
                caption: post.caption,
                category: post.category, // 🆕 Category added
                likes: post.likes, // 🆕 Like count
                comments: post.comments, // 🆕 Comment count
                createdAt: post.createdAt
            })),
            news: userNews.map(news => ({
                newsId: news._id,
                title: news.title,
                content: news.content,
                category: news.category, // 🆕 Category added
                likes: news.likes, // 🆕 Like count
                comments: news.comments, // 🆕 Comment count
                createdAt: news.createdAt
            }))
        });

    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
