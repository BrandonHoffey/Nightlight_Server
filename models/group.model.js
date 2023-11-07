const mongoose = require("mongoose")

const GroupSchema = new mongoose.Schema ({
    name: {
        type: String,
        require: true,
    },
    users: {
        type: Array,
    },
    created_at: {
        type: Date.now(),
    }
})

module.exports = mongoose.model("Group", GroupSchema)