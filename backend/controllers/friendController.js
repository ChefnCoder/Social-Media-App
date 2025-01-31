const User = require("../models/User");

const sendFriendRequest = async (req, res) => {
  try {
    const { userId } = req.body; //the person whom to send

    if (req.user.id === userId) { //match sending and recieving user
      return res.status(400).json({ message: "You cannot send a request to yourself" });
    }

    //we find both ids 
    const userToRequest = await User.findById(userId);
    const currentUser = await User.findById(req.user.id);

    //if not exist
    if (!userToRequest || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    //if already friends
    if (currentUser.friends.includes(userId)) {
      return res.status(400).json({ message: "You are already friends" });
    }

    //if friend req already sent before
    if (userToRequest.friendRequests.includes(req.user.id)) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    //if none , then we finally push
    userToRequest.friendRequests.push(req.user.id);
    await userToRequest.save();

    res.status(200).json({ message: "Friend request sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending friend request", error });
  }
};
//similarly all 
const acceptFriendRequest = async (req, res) => {
  try {
    const { userId } = req.body; 

    const currentUser = await User.findById(req.user.id);
    const requestSender = await User.findById(userId);

    if (!currentUser || !requestSender) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!currentUser.friendRequests.includes(userId)) {
      return res.status(400).json({ message: "No friend request from this user" });
    }

    // Add to each other's friends list
    currentUser.friends.push(userId);
    requestSender.friends.push(req.user.id);

    // Remove request from friendRequests list
    currentUser.friendRequests = currentUser.friendRequests.filter(
      (id) => id.toString() !== userId.toString()
    );

    await currentUser.save();
    await requestSender.save();

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    res.status(500).json({ message: "Error accepting friend request", error });
  }
};

// Reject Friend Request
const rejectFriendRequest = async (req, res) => {
  try {
    const { userId } = req.body; // ID of the user whose request is being rejected

    const currentUser = await User.findById(req.user.id);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    currentUser.friendRequests = currentUser.friendRequests.filter(
      (id) => id.toString() !== userId.toString()
    );

    await currentUser.save();

    res.status(200).json({ message: "Friend request rejected" });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting friend request", error });
  }
};

const getFriendRequests = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id).populate("friendRequests", "name username email");

    res.status(200).json(currentUser.friendRequests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching friend requests", error });
  }
};

const unfriendUser = async (req, res) => {
  try {
    const { userId } = req.body; // ID of the user to unfriend

    const currentUser = await User.findById(req.user.id);
    const friendToRemove = await User.findById(userId);

    if (!currentUser || !friendToRemove) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove each other from friends list
    currentUser.friends = currentUser.friends.filter((id) => id.toString() !== userId);
    friendToRemove.friends = friendToRemove.friends.filter((id) => id.toString() !== req.user.id);

    await currentUser.save();
    await friendToRemove.save();

    res.status(200).json({ message: "Friend removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing friend", error });
  }
};

module.exports = { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, getFriendRequests, unfriendUser };
