const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');
const authMiddleware = require('../middleware/authMiddleware');

const hotelOnly = (req, res, next) => {
    if (req.user.role !== 'hotel') return res.status(403).json({ message: 'Hotel access required' });
    next();
};

router.use(authMiddleware, hotelOnly);

router.get('/profile', hotelController.getProfile);
router.get('/violations', hotelController.getViolations);
router.get('/fines', hotelController.getFines);

module.exports = router;
