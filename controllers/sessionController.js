import Session from "../models/Session.js";

export const createSession = async (req, res) => {
  const { userId, name, startTime, duration } = req.body;

  if (!startTime || !duration) {
    return res.status(400).json({
      message: "Both startTime and duration are required",
    });
  }

  try {
    const startDate = new Date(startTime);

    const endDate = new Date(startDate.getTime() + duration * 60000);

    const newSession = new Session({
      userId,
      name,
      startTime: startDate,
      endTime: endDate,
      duration: duration, // Minutes
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

  try {
    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
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
