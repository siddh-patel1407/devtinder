const express = require("express");
const { userAuth } = require("../midelware/midelware");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userInfo = express.Router();

userInfo.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const logingUser = req.user;

    const connectionRequestReceived = await connectionRequest
      .find({
        toUserId: logingUser._id,
        status: "interested",
      })
      .populate("fromUserId", "firstName lastName  photoUrl age gender about");

    // if(!connectionRequestReceived){
    //     return res.status(400).json({
    //         message : "requests not fount"
    //     })
    // }

    res.json({
      message: "Data fatch succsesfully",
      data: connectionRequestReceived,
    });
  } catch (err) {
    res.status(400).send("somethin went woarng " + err.message);
  }
});

userInfo.get("/user/connection", userAuth, async (req, res) => {
  try {
    const logingUser = req.user;
    const request = await connectionRequest
      .find({
        $or: [
          { fromUserId: logingUser._id, status: "accepted" },
          { toUserId: logingUser._id, status: "accepted" },
        ],
      })
      .populate("fromUserId", "firstName lastName  photoUrl age gender about")
      .populate("toUserId", "firstName lastName  photoUrl age gender about");

    const data = request.map((row) => {
      if (row.fromUserId._id.toString() === logingUser._id.toString()) {
        return row.toUserId;
      }

      return row.fromUserId;
    });

    res.json({
      data,
    });
  } catch (err) {
    res.status(400).send("somethin went woarng " + err.message);
  }
});

userInfo.get("/user/feed", userAuth, async (req, res) => {
  try {
    const logingUser = req.user;

    const request = await connectionRequest
      .find({
        $or: [{ fromUserId: logingUser._id }, { toUserId: logingUser._id }],
      })
      .select("fromUserId toUserId");

    const hideUserFromFeed = new Set();

    request.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: logingUser._id } },
      ],
    }).select("firstName lastName photoUrl age gender about");
    res.send(users);
  } catch (err) {
    res.status(400).send("something went wrong " + err.message);
  }
});

module.exports = userInfo;
