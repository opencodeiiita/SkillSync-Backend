const Session = require('../models/sessionModel');
const sendEmail = require('./emailService');

const sendNotifications = async () => {
    const now = new Date();
    const upcomingTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const sessions = await Session.find({
        sessionTime: { $gte: now, $lte: upcomingTime },
        notified: false,
    }).populate('userId');

    for (const session of sessions) {
        const { userId } = session;
        // Example notification
        await sendEmail(userId.email, 'Upcoming Session Reminder', 'You have a session scheduled soon.');
        session.notified = true;
        await session.save();
    }
};

module.exports = sendNotifications;
