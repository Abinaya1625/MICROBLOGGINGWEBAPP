// routes/requestRoutes.js
import express from "express";
import { createFollowRequest, acceptFollowRequest, rejectFollowRequest, getAcceptedRequests} from "../controllers/connect.js"; // Import the controller
const route = express.Router();

// POST request to send a follow request (userId is in the URL, recipientId is in the form data)
route.post("/:userId", createFollowRequest);
route.post("/:userId/accept", acceptFollowRequest);
route.post("/:userId/reject", rejectFollowRequest);
route.get("/:userId/accepted", getAcceptedRequests);

export default route;
