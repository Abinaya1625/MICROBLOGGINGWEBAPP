import express from 'express';
import News from '../models/NewsModel.js';
import User from '../models/UserModel.js';
import Request from '../models/connectModel.js'; 

const router = express.Router();

export const createNewsByUserID = async (req, res) => {
  try {
    const { id: userId } = req.params; 
    const { category, content } = req.body;

    if (!category) {
      return res.status(400).json({ 
        status: false, 
        message: "category is required." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        status: false, 
        message: "User not found." });
    }

    const newsImagePath = req.file ? `uploads/newsImages/${req.file.filename}` : "";

    if (!newsImagePath) {
      return res.status(400).json({ 
        status: false, 
        message: "News image is required." });
    }

    const newNews = new News({
      userId,
      category,
      content,
      newsImage: newsImagePath,
    });

    await newNews.save();

    return res.status(201).json({
      status: true,
      message: "News created successfully.",
      data: {
        _id: newNews._id,
      userId: newNews.userId,
      category: newNews.category,
      content: newNews.description,
      newsImage: newNews.postImage,
      createdAt: newNews.createdAt,
    },
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: `Internal Server Error: ${error.message}` });
  }
};

export const getAllNews = async (req, res) => {
  try {
    const news = await News.find().populate("userId", "name email").sort({ createdAt: -1 });

    return res.status(200).json({
      status: true,
      message: "News retrieved successfully.",
      data: news,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};
// Fetch news for a single user
export const getNewsByUserId = async (req, res) => {
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

    // Fetch news created by the specific user
    const userNews = await News.find({ userId }).sort({ createdAt: -1 });

    if (userNews.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No news found for this user.",
      });
    }

    return res.status(200).json({
      status: true,
      message: "User's news retrieved successfully.",
      data: userNews,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};
/*
export const fetchAcceptedUserNewsByUserID = async (req, res) => {
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
    const acceptedUserPosts = await News.find({ userId: acceptedUserId }).sort({ createdAt: -1 });

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
};*/



export const fetchAcceptedUserNewsByUserID = async (req, res) => {
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
    const acceptedUserPosts = await News.find({ userId: acceptedUserId }).sort({ createdAt: -1 });

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



export default router;
