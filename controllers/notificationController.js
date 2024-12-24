const sendNotifications = require('../services/notificationService');

const triggerNotifications = async (req, res) => {
    try {
        await sendNotifications();
        res.status(200).send('Notifications triggered.');
    } catch (error) {
        res.status(500).send({ error: 'Error triggering notifications' });
    }
};

module.exports = { triggerNotifications };
