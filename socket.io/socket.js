const { Server } = require("socket.io");

let io;
const socketUsers = {}; // To keep track of connected users by their ids

const InitializeSocketIO = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL, // React app's URL
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Store the socket ID for the user
    socket.on("register", (userId) => {
      socketUsers[userId] = socket.id; // Store socket id with userId
      console.log(`User ${userId} connected with socket ID ${socket.id}`);
    });

    // Example message event
    socket.on("message", (data) => {
      const { senderId, receiverId, content } = data;
      console.log(data);
      // Send the message to the receiver
      if (socketUsers[receiverId]) {
        io.to(socketUsers[receiverId]).emit("receive_message", {
          senderId,
          message: content,
          createdAt: new Date(),
        });
        console.log("Message sent to:", receiverId);
      } else {
        console.log("Receiver not connected");
      }
    });

    socket.on("disconnect", () => {
      // Clean up when a user disconnects
      for (const userId in socketUsers) {
        if (socketUsers[userId] === socket.id) {
          delete socketUsers[userId];
          break;
        }
      }
      console.log("A user disconnected:", socket.id);
    });
  });
};

module.exports = InitializeSocketIO;
