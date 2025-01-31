const express = require("express");
const http = require("http"); // Import HTTP to use with Socket.io
const cors = require("cors");
const socketIo = require("socket.io"); // Import Socket.io
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const server = http.createServer(app); // Create an HTTP server instance
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins (change for production)
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// Store connected users
const usersOnline = new Map();

io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  socket.on("userConnected", (userId) => {
    usersOnline.set(userId, socket.id);
    console.log(`User ${userId} is online.`);
  });

  socket.on("sendFriendRequest", ({ senderId, receiverId }) => {
    const receiverSocketId = usersOnline.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newFriendRequest", { senderId });
    }
  });

  socket.on("disconnect", () => {
    usersOnline.forEach((value, key) => {
      if (value === socket.id) {
        usersOnline.delete(key);
      }
    });
    console.log("User disconnected:", socket.id);
  });
});

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const friendRoutes = require("./routes/friendRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/recommendations", recommendationRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
