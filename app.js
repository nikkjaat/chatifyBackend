const express = require("express");
require("dotenv").config();
const app = express();
const port = 4000;
const cors = require("cors");
const { createServer } = require("http"); // For HTTP server
const { Server } = require("socket.io"); // Import Socket.IO
const user = require("./routes/user");
const admin = require("./routes/admin");
const db = require("./database/db");
const corsOptions = require("./config/cors");

// Middleware
app.use(express.json());
app.use(cors(corsOptions));

// Routes
app.use(user);
app.use("/admin", admin);

// Create an HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3000",
        "https://mychatifyapp.netlify.app",
      ]; // Update with your actual frontend URLs
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
  },
});

// Store online users
const onlineUsers = new Map();

// Socket.IO logic
io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);
  const userId = socket.handshake.query.userId;

  if (userId) {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} is online`);
  } else {
    console.log("User ID is undefined");
  }

  // Listen for new messages
  socket.on("send_message", async (data) => {
    const { senderId, receiverId, content } = data;

    console.log("Message received:", data);

    // Check if the recipient is online
    const receiverSocketId = onlineUsers.get(receiverId);

    if (receiverSocketId) {
      // Emit the message to the recipient
      io.to(receiverSocketId).emit("receive_message", data);

      // Notify the sender about delivery
      io.to(socket.id).emit("message_delivered", {
        messageId: data.messageId,
        status: "delivered",
      });

      console.log(`Message delivered to user ${receiverId}`);
    } else {
      // Save the message to the database for later delivery
      // Example database logic (adjust according to your schema)
      try {
        await saveMessageToDB({
          senderId,
          receiverId,
          content,
          status: "pending",
          timestamp: new Date(),
        });
        console.log(`User ${receiverId} is offline. Message saved.`);
      } catch (err) {
        console.error("Error saving message:", err);
      }
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    onlineUsers.forEach((value, key) => {
      if (value === socket.id) {
        onlineUsers.delete(key);
        console.log(`User ${key} is now offline`);
      }
    });
  });
});

// Mock function for saving messages to the database
async function saveMessageToDB(message) {
  // Replace with your database saving logic
  console.log("Saving message to database:", message);
  return Promise.resolve();
}

// Start the server
db()
  .then(() => {
    httpServer.listen(port, () => {
      console.log(`Backend is listening on Port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
