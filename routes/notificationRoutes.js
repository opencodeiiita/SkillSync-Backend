const express = require('express');
const { triggerNotifications } = require('../controllers/notificationController');
const router = express.Router();

router.post('/trigger', triggerNotifications);

module.exports = router;
