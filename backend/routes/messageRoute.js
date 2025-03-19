import express from "express";
import multer from 'multer';
import { sendMessage, getConversation, getUserMessages } from "../controllers/messageControl.js";

const router = express.Router();

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

router.post("/send" ,uploadImage.none(),sendMessage);
router.get("/conversation/:user1/:user2", getConversation);
router.get("/:userId", getUserMessages);

export default router;
