import express from 'express';
import { createNewsByUserID,getAllNews, getNewsByUserId, fetchAcceptedUserNewsByUserID} from '../controllers/NewsController.js';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/newsImages');
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

router.post('/news/create/:id', uploadImage.single('newsImage'), createNewsByUserID);
router.get('/news', getAllNews);
router.get('/news/user/:id', getNewsByUserId);
router.get('/news/accepted/:id/:acceptedUserId', fetchAcceptedUserNewsByUserID);

export default router;
