const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const router = require("../controllers/user.controller");

const validateSession = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodedToken.id);

        if (!user) {
            throw new Error("User not found");
        }
        req.user = user;
        return next();
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

module.exports = validateSession