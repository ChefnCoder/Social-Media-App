const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    try {
      const { name, username, email, password } = req.body;
  
      // 1st i check if username or email already exists
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return res.status(400).json({ message: "Username or email already exists" });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Creating new user
      const newUser = new User({ name, username, email, password: hashedPassword });
      await newUser.save();
  
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error registering user", error });
    }
  };
  
  const loginUser = async (req, res) => {
    try {
      //took from body
      const { email, password } = req.body;
  
      // Finding user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      // Generate JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
  
      res.status(200).json({ 
        message: "Login successful", 
        token, 
        user: {
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Error logging in", error });
    }
  };
  module.exports = { registerUser, loginUser };
