const User = require("../models/User");

// Fetch all users (excluding the logged-in user)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// Fetch the logged-in user's friends list
const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("friends", "-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.friends);
  } catch (error) {
    res.status(500).json({ message: "Error fetching friends", error });
  }
};

module.exports = { getAllUsers, getFriends };
