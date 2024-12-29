import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sessionName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
    sessionType: {
      type: String,
      required: true,
      default: "NA",
    },
    duration: {
      type: Number,  // duration in minutes
      required: true,
    },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  }
);

sessionSchema.statics.checkConflict = async function (
  userId,
  startTime,
  endTime,
  objectId,
) {
  const conflictingSession = await this.findOne({
    userId,
    status: "scheduled",
    _id: { $ne: objectId },
    $or: [
      {
        startTime: { $lte: endTime, $gte: startTime }, // case 1
      },
      {
        endTime: { $lte: endTime, $gte: startTime }, // case 2
      },
      {
        startTime: { $lte: startTime }, // case 3
        endTime: { $gte: endTime },
      },
    ],
  });
  return conflictingSession;
};

sessionSchema.pre("save", async function (next) {
  try {
    if (this.isModified("startTime") || this.isModified("duration")) {
      this.endTime = new Date(
        this.startTime.getTime() + this.duration * 60 * 1000
      );

      const conflictingSession = await this.constructor.checkConflict(
        this.userId,
        this.startTime,
        this.endTime,
        this._id,
      );

      if (conflictingSession) {
        const error = new Error(
          "The session conflicts with an existing session."
        );
        error.status = 400;
        return next(error);
      }
    }

    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model("Session", sessionSchema);
