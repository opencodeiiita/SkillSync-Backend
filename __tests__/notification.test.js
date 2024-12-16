import mongoose from "mongoose";
import moment from "moment";
import { notification } from "../socket";
import Session from "../models/Session";

const userSockets = {
  userId1: { emit: jest.fn() },
  userId2: { emit: jest.fn() },
};

// Mock the Session model
jest.mock("../models/Session");

describe("Notification Function", () => {
  let consoleLogSpy;
  let consoleErrorSpy;

  beforeEach(() => {
    jest.clearAllMocks(); // Clear all mocks before each test to ensure isolation
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore(); // Restore original implementation after each test
    consoleErrorSpy.mockRestore();
  });

  afterAll(async () => {
    jest.clearAllMocks(); // Clear mocks after all tests
    await mongoose.disconnect(); // Ensure database connection is properly closed
  });

  it("should return early if there are no upcoming sessions", async () => {
    Session.find.mockResolvedValue([]); // Mock no upcoming sessions

    await notification(userSockets);

    // Ensure no emit calls are made
    expect(userSockets["userId1"].emit).not.toHaveBeenCalled();
    expect(userSockets["userId2"].emit).not.toHaveBeenCalled();

    // Ensure log indicates no sessions
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "No upcoming sessions found within the next 24 hours."
    );
  });

  it("should send notifications for upcoming sessions when users are connected", async () => {
    const mockSessions = [
      {
        userId: "userId1",
        startTime: moment().add(10, "hours").toDate(),
        name: "Session 1",
        _id: "sessionId1",
      },
      {
        userId: "userId2",
        startTime: moment().add(20, "hours").toDate(),
        name: "Session 2",
        _id: "sessionId2",
      },
    ];

    Session.find.mockResolvedValue(mockSessions);

    await notification(userSockets);

    // Ensure emit is called for connected users
    expect(userSockets["userId1"].emit).toHaveBeenCalledWith(
      "sessionNotification",
      expect.objectContaining({
        message: expect.stringContaining("Session 1"),
        sessionId: "sessionId1",
      })
    );
    expect(userSockets["userId2"].emit).toHaveBeenCalledWith(
      "sessionNotification",
      expect.objectContaining({
        message: expect.stringContaining("Session 2"),
        sessionId: "sessionId2",
      })
    );
  });

  it("should log a message if users are not connected", async () => {
    const mockSessions = [
      {
        userId: "userId3",
        startTime: moment().add(10, "hours").toDate(),
        name: "Session 3",
        _id: "sessionId3",
      },
    ];

    Session.find.mockResolvedValue(mockSessions);

    await notification(userSockets);

    // Ensure log indicates disconnected user
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "User userId3 is not connected."
    );
  });

  it("should handle errors gracefully", async () => {
    Session.find.mockRejectedValue(new Error("Database error"));

    await notification(userSockets);

    // Ensure error is logged
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error while fetching upcoming sessions:",
      expect.any(Error)
    );
  });
});
