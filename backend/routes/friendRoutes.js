const express = require("express");
const {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,unfriendUser
} = require("../controllers/friendController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/send", protect, sendFriendRequest);
router.post("/accept", protect, acceptFriendRequest);
router.post("/reject", protect, rejectFriendRequest);
router.get("/requests", protect, getFriendRequests);
router.post("/remove", protect, unfriendUser);

module.exports = router;
