import {createPostByUserID , getAccepetedUserPosts, getAllPosts,getHomepagePosts,removeSavedPost,getPostsByUserId, fetchAcceptedUserPostByUserID,toggleLikePost, getAllLikes, checkIfUserLikedPost, countLikesForPost, addComment, updateComment, getCommentsByPostId,deleteComment,toggleSavePost,getSavedPostsByUser,getPostCount} from "../controllers/PostController.js";
import express from "express";
import multer from "multer";


const route=express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/postImages");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); 
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);  
    } else {
      cb(new Error('Unsupported file type. Only image files are allowed.'), false); 
    }
  };

const uploadImage = multer({ storage: storage, fileFilter });

route.post("/createPost/:id", uploadImage.single('postImage'), createPostByUserID);
route.get("/posts", getAllPosts);
route.get("/posts/user/:id", getPostsByUserId)
route.get("/posts/:id", getAccepetedUserPosts);
route.get('/posts/accepted/:id/:acceptedUserId', fetchAcceptedUserPostByUserID);

route.post("/posts/like", uploadImage.none(), toggleLikePost);

//route.post("/posts/like",toggleLikePost);
route.get("/:postId/likes", getAllLikes);
route.get("/check/:userId/:postId", checkIfUserLikedPost);
route.get("/count/:postId", countLikesForPost);
route.post("/add/:postId",uploadImage.none(),addComment);
route.put("/comments/:commentId", updateComment);
route.get("/:postId", getCommentsByPostId);
route.delete("/comments/:commentId", deleteComment);
route.post("/save-post/:postId", toggleSavePost);
route.get("/saved-posts/:userId", getSavedPostsByUser);
route.get("/:userId/post-count", getPostCount);
route.delete("/:userId/saved-posts/:postId", removeSavedPost);
route.post("/homepage", uploadImage.none(),getHomepagePosts);


export default route;