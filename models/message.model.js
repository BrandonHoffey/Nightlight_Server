const mongoose=require("mongoose")

const MessageSchema = new mongoose.Schema ({
    sender: {
        type: String,
        require: true,
    },
    reciever: {
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
    }
})

module.exports = mongoose.model("Message", MessageSchema)