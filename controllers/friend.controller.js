const router = require("express").Router();
const Friend = require("../models/friend.model");

const validateSession = require("../middleware/validate-session");
const User = require("../models/user.model");
const { request } = require("express");

router.post("/add", validateSession, async (req, res) => {
  const { currentUserId, selectedUserId } = req.body;
  try {
    //update the recepient's friendRequestArray!
    await User.findByIdAndUpdate(
      { _id: selectedUserId },
      { $push: { friendRequests: currentUserId } }
    );

    //update the sender's sentFriendRequest array!
    await User.findByIdAndUpdate(
      { _id: currentUserId },
      { $push: { sentFriendRequests: selectedUserId } }
    );

    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/view-all", validateSession, async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);
    const friends = user.friends;
    res.json({ message: "viewing all friends", friends });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/view-all-details", validateSession, async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);
    const friendsList = user.friends;
    const projection = {
      username: 1,
      displayName: 1,
      profilePicture: 1,
    };
    const friends = await User.find({ _id: { $in: friendsList } }, projection);
    res.json({ message: "Viewing friends profiles", friends });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/friend-requests/:userId", validateSession, async (req, res) => {
  try {
    const { userId } = req.params;

    //fetch the user document based on the User Id
    const user = await User.findById(userId)
      .populate("friendRequests", "username profilePicture")
      .lean();
    const friendRequests = user.friendRequests;
    res.json({ message: "Viewing all requests", friendRequests });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.delete("/delete/:id", validateSession, async (req, res) => {
  try {
    const id = req.params.id;
    const user = req.user.id;
    const conditions = {
      $and: [{ _id: id }, { $or: [{ friend: user }, { user }] }],
    };

    const friend = await Friend.deleteOne(conditions);
    res.json({
      message:
        friend.deletedCount === 1
          ? "successfully deleted friend"
          : "failed to delete friend",
      friend,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.post("/friend-request/accept", validateSession, async (req, res) => {
  try {
    const { senderId, recipientId } = req.body;

    //retrieve the documents of sender and the recipient
    const sender = await User.findById(senderId);
    const recipient = await User.findById(recipientId);

    sender.friends.push(recipientId);
    recipient.friends.push(senderId);

    recipient.friendRequests = recipient.friendRequests.filter(
      (request) => request.toString() !== senderId.toString()
    );

    sender.sentFriendRequests = sender.sentFriendRequests.filter(
      (request) => request.toString() !== recipientId.toString()
    );

    await sender.save();
    await recipient.save();

    res.status(200).json({ message: "Friend Request Accepted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
