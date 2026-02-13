const { Hotel, Violation, Fine, Memo, GuestReport, Achievement } = require('../models');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Mock Transport for email (Replace with real credentials in .env)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'anuragmohan79@gmail.com',
        pass: 'ydjiietmkphcimau'
    }
});

exports.getHotels = async (req, res) => {
    try {
        const hotels = await Hotel.findAll();
        res.json(hotels);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.approveHotel = async (req, res) => {
    try {
        const { id } = req.params;
        const hotel = await Hotel.findByPk(id);
        if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

        hotel.is_verified = 1;
        hotel.verified_at = new Date();
        await hotel.save();

        // Send Email
        await transporter.sendMail({
            from: '"RateMyKitchen Admin" <admin@ratemykitchen.com>',
            to: hotel.email,
            subject: 'Hotel Registration Approved',
            text: `Congratulations! Your hotel ${hotel.hotel_name} has been approved.`
        });

        res.json({ message: 'Hotel approved', hotel });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.rejectHotel = async (req, res) => {
    try {
        const { id } = req.params;
        const hotel = await Hotel.findByPk(id);
        if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

        hotel.is_verified = 2;
        await hotel.save();

        res.json({ message: 'Hotel rejected', hotel });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.issueFine = async (req, res) => {
    try {
        const { hotel_id, amount, reason } = req.body;
        const fine = await Fine.create({ hotel_id, amount, reason });
        res.status(201).json({ message: 'Fine issued', fine });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.sendMemo = async (req, res) => {
    try {
        const { hotel_id, message } = req.body;
        const memo = await Memo.create({ hotel_id, message });
        res.status(201).json({ message: 'Memo sent', memo });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getGuestReports = async (req, res) => {
    try {
        const reports = await GuestReport.findAll();
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Achievement Management
exports.uploadAchievement = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file uploaded' });
        }

        const { title, description, year } = req.body;
        const image_path = `/uploads/achievements/${req.file.filename}`;

        const achievement = await Achievement.create({
            title,
            description,
            image_path,
            year: year || new Date().getFullYear()
        });

        res.status(201).json({ message: 'Achievement uploaded successfully', achievement });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

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

exports.deleteAchievement = async (req, res) => {
    try {
        const { id } = req.params;
        const achievement = await Achievement.findByPk(id);

        if (!achievement) {
            return res.status(404).json({ message: 'Achievement not found' });
        }

        // Delete image file
        const imagePath = path.join(__dirname, '../../', achievement.image_path);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        await achievement.destroy();
        res.json({ message: 'Achievement deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
