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

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use(user);
app.use("/admin", admin);

// Create an HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Replace with your frontend URL in production
    methods: ["GET", "POST"],
  },
});

// Socket.IO logic
io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);

  // Listen for new messages
  socket.on("send_message", (data) => {
    console.log("Message received:", data);

    // Emit the message to all connected clients (or specific room)
    io.emit("receive_message", data); // Broadcast to all users
  });

  // Disconnect event
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

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
