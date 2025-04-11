const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["ignore", "interested", "accepted", "rejected"],
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.index({ fromUserId: 1 , toUserId : 1 });

const connectionRequest = new mongoose.model(
  "connectionRequest",
  connectionRequestSchema
);

module.exports = connectionRequest;
