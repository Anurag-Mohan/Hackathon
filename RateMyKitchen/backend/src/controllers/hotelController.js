const { Hotel, Violation, Fine, Memo } = require('../models');

exports.getProfile = async (req, res) => {
    try {
        console.log(`[getProfile] Fetching profile for user ID: ${req.user.id}`);
        const hotel = await Hotel.findByPk(req.user.id);
        if (!hotel) {
            console.log(`[getProfile] Hotel not found for ID: ${req.user.id}`);
            return res.status(404).json({ message: 'Hotel not found' });
        }
        console.log(`[getProfile] Profile found: ${hotel.hotel_name}, Score: ${hotel.hygiene_score}`);
        res.json(hotel);
    } catch (err) {
        console.error(`[getProfile] Error:`, err);
        res.status(500).json({ error: err.message });
    }
};

exports.getViolations = async (req, res) => {
    try {
        console.log(`[getViolations] Fetching violations for hotel ID: ${req.user.id}`);
        const violations = await Violation.findAll({ where: { hotel_id: req.user.id } });
        console.log(`[getViolations] Found ${violations.length} violations`);
        res.json(violations);
    } catch (err) {
        console.error(`[getViolations] Error:`, err);
        res.status(500).json({ error: err.message });
    }
};

exports.getFines = async (req, res) => {
    try {
        console.log(`[getFines] Fetching fines for hotel ID: ${req.user.id}`);
        const fines = await Fine.findAll({ where: { hotel_id: req.user.id } });
        console.log(`[getFines] Found ${fines.length} fines`);
        res.json(fines);
    } catch (err) {
        console.error(`[getFines] Error:`, err);
        res.status(500).json({ error: err.message });
    }
};
