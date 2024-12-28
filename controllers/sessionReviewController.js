import Session from "../models/Session.js";
import SessionReview from "../models/SessionReview.js";

export const addReview = async (req, res) => {
  const { userId, review } = req.body;
  const { sessionId } = req.params;

  if (!userId || !sessionId) {
    return res.status(400).json({
      message: "Both userId and sessionId are required",
    });
  }

  if (!review) {
    return res.status(400).json({
      message: "review is required",
    });
  }

  try {
    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    //TODO: Check if user is part of the session to allow him to write a review
    if(false){
      return res.status(400).json({
        message: "You need to be part of the session to write a review for it",
      });
    }

    const date = new Date();

    const newSessionReview = new SessionReview({
      userId,
      sessionId,
      review,
      date
    });

    await newSessionReview.save();

    res.status(201).json({
      message: "Session Review created successfully",
      session: newSessionReview,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error creating session review",
      error: err.message,
    });
  }
};

//returns all reviews of a session based on ascending date
export const getReviews = async (req, res) => {
  const { sessionId } = req.params;

  if (!sessionId) {
    return res.status(400).json({
      message: "sessionId is required",
    });
  }

  try {
    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    const reviews = await SessionReview.find({
      sessionId
    }).sort({ date: -1 });

    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({
      message: "Error getting reviews",
      error: err.message,
    });
  }
};