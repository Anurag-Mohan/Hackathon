const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const statsController = require('../controllers/statsController'); // Import Stats Controller
console.log('Admin Routes file loaded'); // DEBUG LOG
const authMiddleware = require('../middleware/authMiddleware');
const { uploadAchievement } = require('../config/upload');

// Validates that user is admin
const adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
    next();
};

router.use(authMiddleware, adminOnly);

router.get('/hotels', adminController.getHotels);

// Test Route to verify file is loaded and reachable
router.get('/test-route', (req, res) => {
    res.json({ message: 'Admin Routes are loaded and working!' });
});

router.put('/hotels/:id/approve', (req, res, next) => {
    console.log('Hit approve route for ID:', req.params.id);
    next();
}, adminController.approveHotel);
router.put('/hotels/:id/reject', adminController.rejectHotel);
router.delete('/hotels/:id', adminController.deleteHotel);
router.put('/hotels/:id/rating', adminController.updateHotelRating);
router.post('/fine', adminController.issueFine);
router.post('/memo', adminController.sendMemo);
router.get('/reports', adminController.getGuestReports);

// Achievement Management Routes
router.post('/achievements/upload', uploadAchievement.single('image'), adminController.uploadAchievement);
router.get('/achievements', adminController.getAllAchievements);
router.delete('/achievements/:id', adminController.deleteAchievement);

// Video Processing Route
const { uploadVideo } = require('../config/upload');
router.post('/videos/process', uploadVideo.single('video'), adminController.processHotelVideo);

// Get Violations for a specific hotel (used by Admin Dashboard Modal)
router.get('/hotels/:hotelId/violations', statsController.getHotelViolations);

// Download PDF Report
router.get('/hotels/:id/report', adminController.generateReport);

// Update Report Status (Admin Action)
router.put('/reports/:id/action', adminController.updateReportStatus);

module.exports = router;
