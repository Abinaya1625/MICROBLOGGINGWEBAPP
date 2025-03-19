import {fetch, create,Login, getUserById, createProfileByUserId,getBlockedUsers,getCloseFriends,toggleBlockUser,getUserProfile,toggleCloseFriend,togglePrivacy,getSearchHistory,updateProfileByUserId,changePassword,shareProfile,viewUserProfile,getAcceptedFollowers,getPendingRejectedFollowers,getAcceptedFollowersCount,getPendingRejectedFollowersCount,searchUser,saveSearchHistory,getSavedSearchHistory,deleteSearchHistory} from "../controllers/UserController.js";
import express from "express";
import multer from "multer";


const route=express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/profileImages");
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


route.post("/create", create);
route.get("/getAllUsers",fetch);
route.post("/login",Login);
route.get("/getUserByID/:id",getUserById);
route.post("/createProfile/:id", uploadImage.single('profileImage'), createProfileByUserId);
route.put('/profile/:id', updateProfileByUserId);
//route.get("/users/:username", getUserByUsername);
route.put("/:userId/privacy", togglePrivacy);
route.put("/:userId/close-friend/:friendId", toggleCloseFriend);
route.put("/change-password/:userId", changePassword);
route.get("/share-profile/:userId", shareProfile);
route.get("/:userId/close-friends", getCloseFriends);
route.post("/accounts/toggle-block",uploadImage.none() ,toggleBlockUser);
route.get("/accounts/blocked/:userId", getBlockedUsers);
route.get("/:userId/profile", viewUserProfile);
route.get("/:userId/accepted-followers", getAcceptedFollowers);
route.get("/:userId/pending-rejected-followers", getPendingRejectedFollowers);
route.get("/:userId/accepted-followers-count", getAcceptedFollowersCount);
route.get("/:userId/pending-rejected-followers-count", getPendingRejectedFollowersCount);
route.post("/:searcherId/search", uploadImage.none(),searchUser);
route.get("/:searcherId/search-history", getSearchHistory);
route.post("/save", uploadImage.none(),saveSearchHistory); 
route.get("/:searcherId/history", getSavedSearchHistory);
route.delete("/:searcherId/history/:searchedUserId", deleteSearchHistory);
route.get("/profile/:userId",uploadImage.none(),getUserProfile);



export default route;