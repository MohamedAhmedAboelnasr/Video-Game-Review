const router = require("express").Router();
const User = require("../models/User");

// Signup
router.post("/signup", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json(user);
});

// Login
router.post("/login", async (req, res) => {
  const { identifier, password } = req.body;

  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }],
    password,
  });

  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  res.json(user);
});

module.exports = router;