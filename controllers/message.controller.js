const router = require("express").Router();
const Message = require("../models/message.model");
const User = require("../models/user.model");
const Group = require("../models/group.model");
const validateSession = require("../middleware/validate-session");

router.get("/:id/view", validateSession, async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    const group = await Group.findById(id);
    const user = await User.findById(id);
    if (!group && !user) {
      throw new Error("No Group Or User Found");
    }
    const conditions = {
      $or: [
        { $and: [{ receiver: id, sender: userId }] },
        { $and: [{ receiver: userId, sender: id }] },
      ],
    };
    const message = await Message.find(conditions);
    res.json({
      message: "Viewing Messages Successfully",
      messages: message,
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

router.post("/create", validateSession, async (req, res) => {
  try {
    const { receiver, content } = req.body;
    const message = new Message({
      sender: req.user.id,
      receiver,
      content,
    });
    const newMessage = await message.save();
    res.json({
      message: "Created Message Successfully",
      newMessage,
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

router.patch("/:id/update", validateSession, async (req, res) => {
  try {
    const id = req.params.id;
    const { content } = req.body;
    const currentDate = new Date().toLocaleString();
    const data = {
      content,
      edited_at: currentDate,
    };
    const options = { new: true };
    const updateMessage = await Message.findByIdAndUpdate(id, data, options);
    res.json({
      message: "Updated Message Successfully",
      updatedMessage: updateMessage,
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

router.delete("/:id/delete", validateSession, async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    const conditions = { sender: userId };
    const deleteMessage = await Message.findByIdAndDelete(id, conditions);
    deleteMessage.deletedCount === 0
      ? res.json({ message: "Deleted Message Unsuccessfully" })
      : res.json({ message: "Deleted Message Successfully" });
  } catch (error) {
    res.json({ error: error.message });
  }
});

router.get("/:id/latest", validateSession, async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    const conditions = {
      $or: [
        { $and: [{ receiver: id, sender: userId }] },
        { $and: [{ receiver: userId, sender: id }] },
      ],
    };
    const latestMessage = await Message.find(conditions)
      .sort({ created_at: -1 })
      .limit(1);
    res.json({
      message: "Latest Message Viewing Unsuccessfully",
      latestMessage,
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

module.exports = router;
