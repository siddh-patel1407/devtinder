const express = require("express");
const { userAuth } = require("../midelware/midelware");

const requestsRoute = express.Router();
const connectionRequest = require("../models/connectionRequest");

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
        message: "connection request send succsesfully",
        data,
      });
    } catch (err) {
      res.status(400).send("somethin went woarng " + err.message);
    }
  }
);

module.exports = requestsRoute;
