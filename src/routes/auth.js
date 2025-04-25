const express = require("express");
const validator = require("validator");
const authRouter = express.Router();
const User = require("../models/user");
const { validateSingUpData } = require("../utils/authentication");
const bcrypt = require("bcrypt");
const cookieparser = require("cookie-parser");
// const { userAuth } = require("./midelware/midelware");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSingUpData(req);

    const { firstName, lastName, email, password, age } = req.body;

    const passwordHase = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      age,
      password: passwordHase,
    });
    await user.save();
    res.send("complete");
  } catch (err) {
    res.status(400).send("some error found" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!validator.isEmail(email)) {
      throw new Error("email not valid");
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("something not okay");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const tokan = await user.getJWT();

      res.cookie("tokan", tokan, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send(user);
    } else {
      throw new Error("something not ");
    }
  } catch (err) {
    res.status(400).send("some error found" + " "+err.message );
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("tokan", null, { expires: new Date(Date.now()) });

  res.send("logout successfully!!!")
});

module.exports = authRouter;
