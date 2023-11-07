const router = require("express").Router();
const Friend = require("../models/friend.model");
const validaSession = require("../middleware/validate-session");
const User = require("../models/user.model");
const validateSession = require("../middleware/validate-session");

router.post("/add", validateSession, async (req, res)=>{
    try {
        console.log(req.user.id);
        const {friend} = req.body;

        const id = req.user.id
        const newfriend = new Friend({
            user: id,
            friend
        })

        const newFriend = await newfriend.save();
        res.json({message:"successfully added friend", newFriend})

    } catch (error) {
        res.status(500).json({
        message: error.message,
        });
    }
});

router.get("/view-all", validaSession, async (req, res)=>{
    try {
        const id = req.user.id;
        const conditions = { $and: [{ status: "accepted" }, {$or:[{friend: id}, {user: id}]}]};
        const friend = await Friend.find(conditions);
        res.json({message:"viewing all friends", friend});
    } catch (error) {
        res.status(500).json({
        message: error.message,
        });
    }
});

router.delete("/delete/:id", validaSession, async (req, res)=>{
    try {
        const id = req.params.id;
        const user = req.user.id;
        const conditions = 
            { $and: [{_id: id}, {$or:[{friend: user}, {user}]}]};
        
        const friend = await Friend.deleteOne(conditions)
        res.json({message: friend.deletedCount === 1
            ?"successfully deleted friend"
            :"failed to delete friend", friend
        });
    } catch (error) {
        res.status(500).json({
        message: error.message,
        });
    }
});

module.exports = router;

