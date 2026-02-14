const { Hotel, Violation, Achievement } = require('../models');

// Get statistics summary
exports.getStatsSummary = async (req, res) => {
    try {
        const totalHotels = await Hotel.count({ where: { is_verified: 1 } });
        const totalViolations = await Violation.count();
        const activeMonitoring = await Hotel.count({ where: { is_verified: 1 } });

        // Calculate detection accuracy (mock for now, can be enhanced)
        const detectionAccuracy = '99%';

        res.json({
            totalHotels,
            totalViolations,
            detectionAccuracy,
            activeMonitoring
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get latest achievements for landing page (limit 3)
exports.getLatestAchievements = async (req, res) => {
    try {
        const achievements = await Achievement.findAll({
            order: [['created_at', 'DESC']],
            limit: 3
        });
        res.json(achievements);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all achievements for modal
exports.getAllAchievements = async (req, res) => {
    try {
        const achievements = await Achievement.findAll({
            order: [['created_at', 'DESC']]
        });
        res.json(achievements);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get violations for a specific hotel
exports.getHotelViolations = async (req, res) => {
    try {
        const { hotelId } = req.params;
        const violations = await Violation.findAll({
            where: { hotel_id: hotelId },
            order: [['detected_at', 'DESC']]
        });
        res.json(violations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = exports;
