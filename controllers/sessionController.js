import Session from "../models/Session.js";
import User from "../models/User.js";

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


// Utility function to get available time slots in a given interval
export const getAvailableSlotsInInterval = async (userId, startTime, endTime) => {
  const startInterval = new Date(startTime);
  const endInterval = new Date(endTime);

  const sessions = await Session.find({
    userId,
    $or: [
      { startTime: { $lt: endInterval, $gte: startInterval } },
      { endTime: { $gt: startInterval, $lte: endInterval } },
      { startTime: { $lte: startInterval }, endTime: { $gte: endInterval } },
    ],
    status: "scheduled",
  }).sort({ startTime: 1 });

  const slots = [];
  let currentTime = startInterval;

  for (const session of sessions) {
    if (currentTime < session.startTime) {
      slots.push({
        start: new Date(currentTime),
        end: new Date(session.startTime),
      });
    }
    currentTime = new Date(session.endTime);
  }

  if (currentTime < endInterval) {
    slots.push({
      start: currentTime,
      end: endInterval,
    });
  }

  return slots;
};

// Endpoint to get available time slots in a given interval
export const getSessionAvailability = async (req, res) => {
  const { userId, startTime, endTime } = req.body;

  if (!userId || !startTime || !endTime) {
    return res.status(400).json({
      message: "userId, startTime, and endTime are required",
    });
  }

  try {
    const availableSlots = await getAvailableSlotsInInterval(userId, startTime, endTime);

    res.status(200).json({
      message: "Available time slots retrieved successfully",
      availableSlots,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error retrieving available time slots",
      error: err.message,
    });
  }
};


// Enroll Users into session
export const enrollUserIntoSession = async(req,res) => {

  const {userId, sessionId} = req.body;
  if(!userId || !sessionId){
    return res.status(400).json({
      message: "Both userId and sessionId are required",
    });
  }

  try {

    const user = await User.findById(userId);
    const session = await Session.findById(sessionId);
    if(!user || !session){
      return res.status(404).json({
        message: "User or session not found",
      });
    }

    user.sessionsEnrolled.push(sessionId); // Add the session ID to the user's sessionsEnrolled array
    await user.save();

    session.participants.push(userId); // Add the user ID to the session's participants array
    await session.save();

    return res.status(200).json({
      message: "User enrolled into session successfully",
    });

  }catch(err){
    return res.status(500).json({
      message: "Error enrolling user into session",
      error: err.message,
    });
  }

}

// Remove Users from session
export const removeUserFromSession = async(req,res) => {

  const {userId, sessionId} = req.body;
  if(!userId || !sessionId){
    return res.status(400).json({
      message: "Both userId and sessionId are required",
    });
  }

  try {

    const user = await User.findById(userId);
    const session = await Session.findById(sessionId);
    if(!user || !session){
      return res.status(404).json({
        message: "User or session not found",
      });
    }

    user.sessionsEnrolled.pull(sessionId); // Remove the session ID from the user's sessionsEnrolled array
    await user.save();

    session.participants.pull(userId); // Remove the user ID from the session's participants array
    await session.save();

    return res.status(200).json({
      message: "User removed from session successfully",
    });

  }catch(err){
    return res.status(500).json({
      message: "Error removing user from session",
      error: err.message,
    });
  }

}