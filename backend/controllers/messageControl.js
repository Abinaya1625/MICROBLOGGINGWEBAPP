import Message from "../models/messageModel.js";

// ✅ Send a message
export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;

    if (!senderId || !receiverId || !text) {
      console.log(req.body);
      console.log(senderId, receiverId, text);
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const message = new Message({ senderId, receiverId, text });
    await message.save();

    // Emit the message using socket.io
    req.io?.to(receiverId).emit("newMessage", message);

    return res.status(201).json({ success: true, message: "Message sent successfully", data: message });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get conversation between two users
export const getConversation = async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 }
      ]
    }).sort({ createdAt: 1 });

    return res.status(200).json({ success: true, messages });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get all messages for a user (Inbox)
export const getUserMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    })
      .sort({ createdAt: -1 })
      .populate("senderId", "username profileImage")
      .populate("receiverId", "username profileImage");

    return res.status(200).json({ success: true, messages });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
