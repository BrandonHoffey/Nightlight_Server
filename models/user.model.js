const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    unique: true,
  },
  displayName: {
    type: String,
    require: true,
  },
  profilePicture: {
    type: String,
    default:
      "https://plus.unsplash.com/premium_photo-1669905375079-5d7e074fc123?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVhcnxlbnwwfHwwfHx8MA%3D%3D",
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
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
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
