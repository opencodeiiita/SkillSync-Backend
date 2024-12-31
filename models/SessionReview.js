import mongoose from "mongoose";

const sessionReviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    description: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("SessionReview", sessionReviewSchema);
