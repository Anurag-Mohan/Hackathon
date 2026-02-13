const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guestController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.post('/report', upload.single('media'), guestController.submitReport);
router.get('/search', guestController.searchHotels);
router.get('/hotels/:id', guestController.getHotelDetails);

module.exports = router;
