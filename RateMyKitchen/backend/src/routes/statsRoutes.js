const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

// Public routes (no authentication required)
router.get('/summary', statsController.getStatsSummary);
router.get('/achievements/latest', statsController.getLatestAchievements);

// Hotel violations (can be accessed by admin or hotel owner)
router.get('/hotels/:hotelId/violations', statsController.getHotelViolations);

module.exports = router;
