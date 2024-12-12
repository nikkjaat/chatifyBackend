const User = require("../model/user");
const Message = require("../model/messages");
const Conversation = require("../model/conversation");

exports.getAllChats = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

exports.getData = async (req, res, next) => {
  try {
    const user = await User.findById(req.query.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

exports.sendMessage = async (req, res, next) => {
  // console.log(req.params);
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
      conversation.messages.push(newMessage._id);
    }
    await Promise.all([conversation.save(), newMessage.save()]);
    return res
      .status(200)
      .json({ message: "Message Sent successfully", newMessage });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

exports.getUserChats = async (req, res, next) => {
  const { receiverId } = req.query;
  const senderId = req.user._id;

  try {
    // Find the conversation between sender and receiver
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages"); // Assuming 'messages' is a ref array

    // Check if the conversation exists
    if (!conversation || !conversation.messages.length) {
      return res.status(404).json({ message: "No messages found" });
    }

    // Separate messages sent by sender and receiver
    const senderMessages = [];
    const receiverMessages = [];

    conversation.messages.forEach((msg) => {
      if (msg.senderId.toString() === senderId.toString()) {
        senderMessages.push(msg);
      } else {
        receiverMessages.push(msg);
      }
    });

    // Send response
    return res.status(200).json({
      senderMessages,
      receiverMessages,
      conversation,
    });
  } catch (error) {
    // Handle errors
    // console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
