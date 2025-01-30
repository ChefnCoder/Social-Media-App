const User = require("../models/User");

const getFriendRecommendations = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id).populate("friends");

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentFriends = currentUser.friends.map((friend) => friend._id.toString());
    const pendingRequests = currentUser.friendRequests.map((request) => request.toString());

    const potentialFriends = await User.find({
      _id: { $ne: req.user.id, $nin: [...currentFriends, ...pendingRequests] },
    }).populate("friends");

    const recommendations = potentialFriends
      .map((user) => {
        const mutualFriends = user.friends.filter((friend) => currentFriends.includes(friend._id.toString()));
        return {
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          mutualFriendsCount: mutualFriends.length,
        };
      })
      .filter((user) => user.mutualFriendsCount > 0) 
      .sort((a, b) => b.mutualFriendsCount - a.mutualFriendsCount);

    res.status(200).json(recommendations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching friend recommendations", error });
  }
};

module.exports = { getFriendRecommendations };
