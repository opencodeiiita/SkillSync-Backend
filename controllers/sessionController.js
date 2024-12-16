import Session from "../models/Session.js";

export const createSession = async (req, res) => {
  //duration in minutes
  const { userId, name, startTime, duration, sessionType } = req.body;

  if (!startTime || !duration) {
    return res.status(400).json({
      message: "Both startTime and duration are required",
    });
  }

  if (!name || !sessionType) {
    return res.status(400).json({
      message: "Both name and sessionType are required",
    });
  }

  try {
    const startDate = new Date(startTime);

    const endDate = new Date(startDate.getTime() + duration * 60000);

    const overlaps = await Session.find({
      $or: [
        { startTime: { $lt: startDate }, endTime: { $gt: startDate } },
        { startTime: { $lt: endDate }, endTime: { $gt: endDate } },
        { startTime: { $gt: startDate }, endTime: { $lt: endDate } }
      ],
      status: "scheduled"
    });
    if (overlaps.length != 0) {
      return res.status(400).json({
        message: "The session's schedule time is clashing with another session timing's.",
      });
    }

    const newSession = new Session({
      userId,
      sessionName: name,
      startTime: startDate,
      endTime: endDate,
      duration: duration, //why save it when we have start and end time ??
      status: "scheduled",
      sessionType: sessionType
    });

    await newSession.save();

    res.status(201).json({
      message: "Session created successfully",
      session: newSession,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error creating session",
      error: err.message,
    });
  }
};

export const rescheduleSession = async (req, res) => {
  const { id } = req.params;
  const { startTime, duration } = req.body;
  
  if (!id) {
    return res.status(400).json({
      message: "Session Id is required",
    });
  }

  if (!startTime || !duration) {
    return res.status(400).json({
      message: "Both startTime and duration are required",
    });
  }


  try {
    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    const startDate = new Date(startTime);
    const endDate = new Date(startDate.getTime() + duration * 60000);

    const overlaps = await Session.find({
      $or: [
        { startTime: { $lt: startDate }, endTime: { $gt: startDate } },
        { startTime: { $lt: endDate }, endTime: { $gt: endDate } },
        { startTime: { $gt: startDate }, endTime: { $lt: endDate } }
      ],
      status: "scheduled",
      _id: { $ne: id }
    });

    if (overlaps.length != 0) {
      return res.status(400).json({
        message: "The session's new schedule time is clashing with another session timing's.",
      });
    }

    session.startTime = new Date(startTime);
    session.duration = duration;

    session.endTime = new Date(
      new Date(session.startTime).getTime() + duration * 60 * 1000
    );

    await session.save();

    res.status(200).json({
      message: "Session rescheduled successfully",
      session,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error rescheduling session",
      error: err.message,
    });
  }
};

export const cancelSession = async (req, res) => {
  const { id } = req.params;

  try {
    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    session.status = "cancelled";
    await session.save();

    res.status(200).json({
      message: "Session cancelled successfully",
      session,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error cancelling session",
      error: err.message,
    });
  }
};
