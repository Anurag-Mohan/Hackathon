const { Hotel, Violation, Fine, Memo } = require('../models');

exports.getProfile = async (req, res) => {
    try {
        const hotel = await Hotel.findByPk(req.user.id);
        res.json(hotel);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getViolations = async (req, res) => {
    try {
        const violations = await Violation.findAll({ where: { hotel_id: req.user.id } });
        res.json(violations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getFines = async (req, res) => {
    try {
        const fines = await Fine.findAll({ where: { hotel_id: req.user.id } });
        res.json(fines);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
