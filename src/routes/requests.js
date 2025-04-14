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

      if (fromUserId == toUserId) {
        throw new Error("you can not send request to your self");
      }

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
        message:
          req.user.firstName + " is " + status + " in " + isToUserId.firstName,
        data,
      });
    } catch (err) {
      res.status(400).send("somethin went woarng " + err.message);
    }
  }
);

requestsRoute.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      // Only allow "accepted" or "rejected"
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status type: " + status,
        });
      }

      // Check if the request exists and belongs to the user
      const existingRequest = await connectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!existingRequest) {
        return res.status(400).json({ message: "Request does not exist" });
      }

      // Update the status
      existingRequest.status = status;
      const data = await existingRequest.save();

      res
        .status(200)
        .json({ message: "Request status updated to " + status, data });
    } catch (err) {
      res.status(400).send("Something went wrong: " + err.message);
    }
  }
);

module.exports = requestsRoute;
