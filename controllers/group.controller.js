const router = require(`express`).Router();

const Group = require("../models/group.model");

// const validaSession = require("../middleware/validate-session");

/* 
Route: localhost:4000/group/add
Request Type: POST
Description: Create a new group chat with multiple users
*/

router.post("/add", async (req, res) => {
    try {
        console.log("req.user", req.user)
        const {name, users, created_at} = req.body;

        const group = new Group({
            name: name,
            users: users,
        });

        const newGroup = await group.save();

        res.json({message: "success from add", group: newGroup});
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});

/* 
Route: localhost:4000/group/delete/:id
Type: DELETE
Description: Delete a group from the database by it's id
*/

router.delete("/delete/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const conditions = {
            _id: id,
        };
        const group = await Group.deleteOne(conditions);
        console.log(group);
        res.json({message:
            group.deletedCount === 1
            ? "Successfully deleted group"
            : "Error, group not found",
        });
    } catch (error) {
        res.status(500),json({
            message: error.message,
        });
    }
});

/* 
Route: localhost:4000/group/viewAll
Type: GET
Description: View all current rooms in the database
*/

router.get("/viewAll", async (req, res) => {
    try {
        const groups = await Group.find().populate("name", "users");
        res.json({message: "Showing all groups", groups: groups});
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});

router.patch("/update/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const conditions = {_id: id,};
        const data = req.body;
        const options = {new: true};

        const group = await Group.findOneAndUpdate(conditions, data, options);

        if (!group) {
            throw new Error("Group not found");
        }
        res.json({
            message: "Successfully updated group",
            group: group,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});

module.exports = router