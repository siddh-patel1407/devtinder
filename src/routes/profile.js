const express = require("express");
const profileRoute = express.Router();
const { userAuth } = require("../midelware/midelware");
const {
  validateUpdate,
  validateUpdatepassword,
} = require("../utils/authentication");
const validator = require("validator");
const bcrypt = require("bcrypt");

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
    const { password } = req.body;

    if (!password) {
      throw new Error("Password is required");
    }

    if (!validator.isStrongPassword(password)) {
      throw new Error("Not a strong password");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const loginuser = req.user;

    loginuser.password = passwordHash;

    await loginuser.save();

    res.send("Password updated successfully");
  } catch (err) {
    res.status(400).send("Something went wrong: " + err.message);
  }
});

module.exports = profileRoute;
