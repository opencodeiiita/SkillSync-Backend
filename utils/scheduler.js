const cron = require('node-cron');
const sendNotifications = require('../services/notificationService');

const scheduleNotifications = () => {
    cron.schedule('0 * * * *', async () => {
        console.log('Running notification scheduler...');
        await sendNotifications();
    });
};

module.exports = scheduleNotifications;
