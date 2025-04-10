const express = require("express");
const profileRoute = express.Router();
const { userAuth } = require("../midelware/midelware");
const {
  validateUpdate,
  validateUpdatepassword,
} = require("../utils/authentication");
const validator = require("validator");

profileRoute.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("some error found" + "" + err.message);
  }
});

profileRoute.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateUpdate) {
      throw new Error("somethin was not a good");
    }

    const loginuser = req.user;

    Object.keys(req.body).forEach((key) => (loginuser[key] = req.body[key]));
    await loginuser.save();

    res.json({ message: "you are updated succsesfully", data: loginuser });
  } catch (err) {
    res.status(400).send("somthing went worang " + err.message);
  }
});

profileRoute.patch("/profile/forgotpassword", userAuth, async (req, res) => {
  try {
    if (!validateUpdatepassword) {
      throw new Error("updated not possible");
    }

    const { password } = req.body;
    if (!validator.isStrongPassword(password)) {
      throw new Error("not a stong password");
    }
    const loginuser = req.user;

    Object.keys(req.body).forEach((key) => (loginuser[key] = req.body[key]));
    await loginuser.save();

    res.send("updated succsesfully")

  } catch (err) {
    res.status(400).send("somthing went worang " + err.message);
  }
});

module.exports = profileRoute;
