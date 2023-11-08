const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  sender: {
    type: String,
    require: true,
  },
  receiver: {
    type: String,
    require: true,
  },
  content: {
    type: String,
    require: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  edited_at: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model("Message", MessageSchema);
