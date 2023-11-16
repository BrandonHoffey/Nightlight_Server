const mongoose = require("mongoose");

const FriendSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  friend: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "sent",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Friend", FriendSchema);
