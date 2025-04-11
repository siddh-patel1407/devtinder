const express = require("express");
const { userAuth } = require("../midelware/midelware");

const requestsRoute = express.Router();
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestsRoute.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params?.toUserId;
      const status = req.params?.status;

      const isAllowStatus = ["interested", "rejected"];
      if (!isAllowStatus.includes(status)) {
        return ReadableByteStreamController.status(400).json({
          message: "invalid status type" + status,
        });
      }

      if(fromUserId == toUserId){
        throw new Error("you can not send request to your self")
      };

      const isToUserId = await User.findById(toUserId);
      if (!isToUserId) {
        return res.status(400).json({ message: "user dose not exist" });
      }

      const existConnectionrequest = await connectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existConnectionrequest) {
        throw new Error("request alrady present");
      }

      const request = new connectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await request.save();

      res.json({
        message: req.user.firstName + " is "+ status + " in " + isToUserId.firstName,
        data,
      });
    } catch (err) {
      res.status(400).send("somethin went woarng " + err.message);
    }
  }
);

module.exports = requestsRoute;
