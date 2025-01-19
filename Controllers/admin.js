const User = require("../model/user");
const Message = require("../model/messages");
const Conversation = require("../model/conversation");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.getAllChats = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getData = async (req, res, next) => {
  try {
    const user = await User.findById(req.query.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      if (!Array.isArray(conversation.messages)) {
        conversation.messages = [];
      }
      conversation.messages.push(newMessage._id);
    }

    await Promise.all([conversation.save(), newMessage.save()]);

    return res
      .status(200)
      .json({ message: "Message Sent successfully", newMessage });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getUserChats = async (req, res, next) => {
  const { receiverId } = req.query;
  const senderId = req.user._id;

  try {
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");

    if (!conversation || !conversation.messages.length) {
      return res.status(404).json({ message: "No messages found" });
    }

    const senderMessages = [];
    const receiverMessages = [];

    conversation.messages.forEach((msg) => {
      if (msg.senderId.toString() === senderId.toString()) {
        senderMessages.push(msg);
      } else {
        receiverMessages.push(msg);
      }
    });

    return res.status(200).json({
      senderMessages,
      receiverMessages,
      conversation,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// exports.getLoginUserData = async (req, res, next) => {
//   try {
//     return await res.status(200).json(req.user);
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

exports.getLoginUserData = async (req, res, next) => {
  try {
    const { resources } = await cloudinary.search
      .expression("folder:ChatifyData/profiles")
      .sort_by("created_at", "desc")
      .max_results(1)
      .execute();

    // Get only the first image if it exists
    const latestImage = resources.length > 0 ? resources[0] : null;

    res.status(200).json({
      image: latestImage, // Send only the latest image instead of entire resources array
      user: req.user,
    });
  } catch (error) {
    console.error("Error fetching images from Cloudinary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getOnlineUsers = async (req, res, next) => {
  try {
    const onlineUsers = await User.find({ isOnline: true }).select(
      "name username isOnline"
    );
    res.status(200).json({ onlineUsers });
  } catch (err) {
    console.error("Error fetching online users:", err);
    res.status(500).json({ error: "Failed to fetch online users" });
  }
};
