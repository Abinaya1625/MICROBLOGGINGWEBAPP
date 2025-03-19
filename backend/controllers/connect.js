import multer from "multer";
import User from "../models/UserModel.js";
import Request from "../models/connectModel.js";  // Import your Request model

const upload = multer();

export const createFollowRequest = [
    upload.none(),
    async (req, res) => {
        try {
            const { userId } = req.params;  // User ID is passed in the URL parameter
            const { recipientId } = req.body;  // Recipient ID is passed in the body (form data)

            // Validate if userId and recipientId are provided
            if (!recipientId) {
                return res.status(400).json({
                    success: false,
                    message: "Recipient ID is required.",
                });
            }

            // Validate that the user is not trying to request themselves
            if (userId === recipientId) {
                return res.status(400).json({
                    success: false,
                    message: "You cannot send a request to yourself.",
                });
            }

            // Check if the user exists (for example, you may want to check if both the requester and recipient exist)
            const userExist = await User.findById(userId);
            if (!userExist) {
                return res.status(400).json({
                    success: false,
                    message: "User not found.",
                });
            }

            const recipientExist = await User.findById(recipientId);
            if (!recipientExist) {
                return res.status(400).json({
                    success: false,
                    message: "Recipient not found.",
                });
            }

            // Check if a request already exists between these two users
            const existingRequest = await Request.findOne({
                userId: userId,
                recipientId: recipientId,
            });

            if (existingRequest) {
                return res.status(400).json({
                    success: false,
                    message: "A request has already been sent.",
                });
            }

            // Create a new follow request document
            const newRequest = new Request({
                userId,
                recipientId,
                status: "pending", // By default, set the status to "pending"
            });

            // Save the request to the database
            const savedRequest = await newRequest.save();

            return res.status(200).json({
                success: true,
                message: "Request Sent Successfully",
                data: savedRequest,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: `Internal Server Error: ${error.message}`,
            });
        }
    },
];

// Controller to accept a follow request
export const acceptFollowRequest = [
    upload.none(),
    async (req, res) => {
        try {
            const { userId } = req.params;  // User ID is passed in the URL parameter
            const { requestId } = req.body;  // Request ID is passed in the body (form data)

            // Validate if requestId is provided
            if (!requestId) {
                return res.status(400).json({
                    success: false,
                    message: "Request ID is required to accept the request.",
                });
            }

            // Find the request by its ID and ensure the user is the recipient
            const request = await Request.findById(requestId);

            if (!request) {
                return res.status(404).json({
                    success: false,
                    message: "Request not found.",
                });
            }

            // Ensure that the user accepting the request is the recipient
            if (request.recipientId.toString() !== userId) {
                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to accept this request.",
                });
            }

            // Ensure the request is still pending
            if (request.status !== "pending") {
                return res.status(400).json({
                    success: false,
                    message: `This request is already ${request.status}.`,
                });
            }

            // Update the status of the request to "accepted"
            request.status = "accepted";
            await request.save();

            return res.status(200).json({
                success: true,
                message: "Request Accepted Successfully",
                data: request,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: `Internal Server Error: ${error.message}`,
            });
        }
    },
];

// Controller to reject a follow request
export const rejectFollowRequest = [
    upload.none(),
    async (req, res) => {
        try {
            const { userId } = req.params;  // User rejecting the request
            const { requestId } = req.body;  // The request being rejected

            if (!requestId) {
                return res.status(400).json({ 
                    status: false, 
                    message: "Request ID is required." 
                });
            }

            const request = await Request.findById(requestId);
            if (!request) {
                return res.status(404).json({ 
                    status: false, 
                    message: "Request not found." 
                });
            }

            if (request.recipientId.toString() !== userId) {
                return res.status(403).json({ 
                    status: false, 
                    message: "You are not authorized to reject this request." 
                });
            }

            if (request.status !== "pending") {
                return res.status(400).json({ 
                    status: false, 
                    message: `This request is already ${request.status}.` 
                });
            }

            request.status = "rejected";
            await request.save();

            return res.status(200).json({ 
                status: true, 
                message: "Request Rejected Successfully", data: request 
            });
        } catch (error) {
            return res.status(500).json({ 
                status: false, error: `Internal Server Error: ${error.message}` });
        }
    },
];
// fetch accepted request by particular user
export const getAcceptedRequests = async (req, res) => {
    try {
        const { userId } = req.params; // User ID from URL

        // Find all requests where the given user was the sender and status is "accepted"
        const acceptedRequests = await Request.find({
            userId: userId,
            status: "accepted",
        });

        return res.status(200).json({
            status: true,
            message: "Accepted Requests Fetched Successfully",
            data: acceptedRequests,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            error: `Internal Server Error: ${error.message}`,
        });
    }
};
