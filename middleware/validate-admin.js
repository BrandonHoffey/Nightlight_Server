const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const validateAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.id);
    if (user.admin == false) {
      throw new Error("User does not have admin privileges");
    }
    req.user = user;
    return next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = validateAdmin;