const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { tokan } = req.cookies;
    if (!tokan) {
      throw new Error("tokan not found");
    }

    const decodeObj = await jwt.verify(tokan, "Siddh@patel$1407");
    const { _id } = decodeObj;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("user not found");
    }
    req.user = user;
    next();
  } catch(err) {
    res.status(400).send("somethin went woarng " + err.message);
  }
};

module.exports = { userAuth };
