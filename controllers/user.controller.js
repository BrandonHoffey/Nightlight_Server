const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Group = require("../models/group.model");
const validateSession = require("../middleware/validate-session");

router.post("/sign-up", async (req, res) => {
  try {
    const { username, displayName, email, password } = req.body;
    const user = new User({
      username,
      displayName,
      email,
      password: bcrypt.hashSync(password, 12),
    });
    const newUser = await user.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: 7 * 24 * 60 * 60,
    });
    res.json({
      message: "Created Account Successfully",
      createdAccount: newUser,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/sign-in", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { username }] });
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error("Password or Email is incorrect");
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: 7 * 24 * 60 * 60,
    });
    res.json({
      message: "Signed In Successfully",
      signedInAccount: user,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/view-all/accounts", validateSession, async (req, res) => {
  try {
    const users = await User.find();
    if (!users) throw new Error("Users not found");
    res.json({
      message: "Viewing all successfully",
      users,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/view-all/groups", validateSession, async (req, res) => {
  try {
    const id = req.user.id;
    const allGroups = await Group.find();
    const groups = allGroups.filter((group) => group.users.includes(id));
    res.json({
      message: "Viewing all successfully",
      groups,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/view-all/friends", validateSession, async (req, res) => {
  try {
    const id = req.user.id;
    const allGroups = await Group.find();
    const groups = allGroups.filter((group) => group.users.includes(id));
    res.json({
      message: "Viewing all successfully",
      groups,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/edit-account", validateSession, async (req, res) => {
  try {
    const id = req.user.id;
    const data = req.body;
    const conditions = { _id: id };
    const options = { new: true };
    const userUpdate = await User.findOneAndUpdate(conditions, data, options);
    if (!userUpdate) throw new Error("User not found");
    res.json({
      message: "Account Updated Successfully",
      user: userUpdate,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/delete-account", validateSession, async (req, res) => {
  try {
    const id = req.user.id;
    const data = req.body;
    const conditions = { _id: id };
    const options = { new: true };
    const userDelete = await User.findOneAndDelete(conditions, data, options);
    if (!userDelete) throw new Error("User not found");
    res.json({
      message: "Account Deleted Successfully",
      user: userDelete,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
