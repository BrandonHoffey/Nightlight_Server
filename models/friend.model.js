const mongoose = require("mongoose")

const FriendSchema = new mongoose.Schema ({
    user: {
        type: String,
        require: true,
    },
    friend: {
        type: String,
        require: true,
    },
    status: {
        type: String,
        default: "sent"
    },
    created_at: {
        type: Date.now(),
    }
})

module.exports = mongoose.model("Friend", FriendSchema)