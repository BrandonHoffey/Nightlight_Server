const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  displayName: {
    type: String,
    default: this.username,
    required: true,
  },
  profilePicture: {
    type: String,
    default: "https://i.ibb.co/0qJhTbq/blankpfp.jpg",
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  anonymous: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  edited_at: {
    type: Date,
    default: null,
  },
  sentFriendRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  friendRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
