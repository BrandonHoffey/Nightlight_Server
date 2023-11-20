const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  groupPicture: {
    type: String,
    default:
      "https://plus.unsplash.com/premium_photo-1669905375079-5d7e074fc123?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVhcnxlbnwwfHwwfHx8MA%3D%3D",
  },
  users: {
    type: Array,
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

module.exports = mongoose.model("Group", GroupSchema);
