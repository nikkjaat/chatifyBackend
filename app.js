const express = require("express");
require("dotenv").config();
const port = 4000;
const cors = require("cors");
const db = require("./database/db");
const corsOptions = require("./config/cors");
const path = require("path");
const user = require("./routes/user");
const admin = require("./routes/admin");
const http = require("http");
const InitializeSocketIO = require("./socket.io/socket");

const app = express();
const server = http.createServer(app);

// Static Files
app.use(
  "/uploads/images",
  express.static(path.join(__dirname, "uploads", "images"))
);

//Initialize Socket.IO
InitializeSocketIO(server);

// Middleware
app.use(express.json());
app.use(cors(corsOptions));

// Routes
app.use(user);
app.use("/admin", admin);

// Start the server
db()
  .then(() => {
    server.listen(port, () => {
      console.log(`Backend is listening on Port ${port}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
