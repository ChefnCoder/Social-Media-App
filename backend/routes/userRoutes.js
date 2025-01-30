const express = require("express");
const { getAllUsers, getFriends } = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getAllUsers);
router.get("/friends", protect, getFriends);

module.exports = router;
