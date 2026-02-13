const { Admin, Hotel } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'secretkey';

exports.registerHotel = async (req, res) => {
    try {
        const { hotel_name, email, password, address, contact } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const hotel = await Hotel.create({
            hotel_name, email, password: hashedPassword, address, contact
        });
        res.status(201).json({ message: 'Hotel registered successfully. Waiting for approval.', hotelId: hotel.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password, role } = req.body; // role: 'admin' or 'hotel'
        let user;

        if (role === 'admin') {
            user = await Admin.findOne({ where: { email } });
        } else {
            user = await Hotel.findOne({ where: { email } });
        }

        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        if (role === 'hotel' && user.is_verified !== 1) {
            return res.status(403).json({ message: 'Hotel not approved yet' });
        }

        const token = jwt.sign({ id: user.id, role }, secret, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, name: user.name || user.hotel_name, email: user.email, role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await Admin.create({ name, email, password: hashedPassword });
        res.status(201).json({ message: 'Admin created' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
