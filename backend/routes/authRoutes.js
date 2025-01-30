const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");

const router = express.Router();

//if came at this route, we would implement those fn 
router.post("/register", registerUser); 
router.post("/login", loginUser); 

module.exports = router;
