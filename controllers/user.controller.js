const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const validateSession = require("../middleware/validate-session");

router.post("/sign-up", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (username.length === 0) {
      return res.status(422).json({ error: "Please input a username" });
    } else if (email.length === 0) {
      return res.status(422).json({ error: "Please input a email" });
    } else if (password.length === 0) {
      return res.status(422).json({ error: "Please input a password" });
    }
    const user = new User({
      username: username.toLowerCase(),
      displayName: username,
      email: email.toLowerCase(),
      password: bcrypt.hashSync(password, 12),
      sentFriendRequests: [],
      friendRequests: [],
      friends: [],
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
    if (!user) {
      return res.status(401).json({ error: "Incorrect username or email." });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Incorrect password." });
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

router.get("/view-all", validateSession, async (req, res) => {
  try {
    const users = await User.find();
    if (!users || users.length === 0) {
      throw new Error("Users not found");
    }

    res.json({
      message: "Viewing all successfully",
      users,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/edit-account/:id", validateSession, async (req, res) => {
  try {
    const authenticatedUserId = req.user.id;
    const targetUserId = req.params.id;

    if (authenticatedUserId !== targetUserId) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const updateData = {};
    const allowedFields = [
      "username",
      "displayName",
      "email",
      "password",
      "profilePicture",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined && req.body[field] !== "") {
        if (field === "password") {
          updateData[field] = bcrypt.hashSync(req.body[field], 12);
        } else {
          updateData[field] = req.body[field];
        }
      }
    });

    const conditions = { _id: targetUserId };
    const options = { new: true };

    const userUpdate = await User.findOneAndUpdate(
      conditions,
      updateData,
      options
    );

    if (!userUpdate) {
      throw new Error("User not found");
    }

    res.json({
      message: "Account Updated Successfully",
      user: userUpdate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
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

router.patch("/update-status/:id", validateSession, async (req, res) => {
  try {
    const userId = req.user.id;

    const { status } = req.body;

    if (status === undefined || status === "") {
      return res.status(422).json({ error: "Please provide a valid status" });
    }

    const conditions = { _id: userId };
    const updateData = { status };
    const options = { new: true };

    const userUpdate = await User.findOneAndUpdate(
      conditions,
      updateData,
      options
    );

    if (!userUpdate) {
      throw new Error("User not found");
    }

    res.json({
      message: "User Status Updated Successfully",
      user: userUpdate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/current-account", validateSession, async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);
    if (!user) {
      // Log the error and send a 404 response
      console.error("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "Account Viewing Successfully",
      user,
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error fetching user account:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
