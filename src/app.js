const express = require("express");
const validator = require("validator");

const app = express();
const connectDb = require("./config/database");
const User = require("./models/user");
const { validateSingUpData } = require("../utils/authentication");
const bcrypt = require("bcrypt");
const cookieparser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieparser());

app.post("/signup", async (req, res) => {
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

app.post("/log", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!validator.isEmail(email)) {
      throw new Error("email not valid");
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("something not okay");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {

      const tokan =  jwt.sign({ _id: user._id }, "Siddh@patel$1407");

      res.cookie("tokan", tokan);
      res.send("succesefully login");
    } else {
      throw new Error("something not ");
    }
  } catch (err) {
    res.status(400).send("some error found" + "" + err.message);
  }
});

app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;
    const { tokan } = cookies;
    if (!tokan) {
      throw new Error("invalid token");
    }

    const decodedMessage = await jwt.verify(tokan, "Siddh@patel$1407");
    const { _id } = decodedMessage;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("user dose not found");
    }
    
    
    res.send(user);
  } catch (err) {
    res.status(400).send("some error found" + "" + err.message);
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      res.status(404).send("usernot found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("somthing went worang" + err.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(404).send("user not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("somthing went worang" + err.message);
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("user deleted");
  } catch (err) {
    res.status(400).send("somthing went worang" + err.message);
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const Allowed_Updated = ["userId", "age", " photoUrl", "about", "skill"];

    const isUpdateAllow = Object.keys(data).every((k) =>
      Allowed_Updated.includes(k)
    );
    if (!isUpdateAllow) {
      throw new Error("updated not allow");
    }

    // if (data?.skill.length > 10) {
    //   throw new Error("skill not more than 10");
    // }

    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    res.send("user updeted successfully");
  } catch (err) {
    res.status(400).send("somthing went worang" + "" + err.message);
  }
});

connectDb()
  .then(() => {
    console.log("connected");
    app.listen(3000, () => {
      console.log("hello");
    });
  })
  .catch((err) => {
    console.log("not connected");
  });
