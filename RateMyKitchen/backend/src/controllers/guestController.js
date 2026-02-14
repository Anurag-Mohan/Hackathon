const { GuestReport, Hotel, Violation } = require('../models');
const { Op } = require('sequelize');

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

exports.submitReport = async (req, res) => {
    try {
        const { hotel_name_input, google_maps_link, description } = req.body;
        const media_url = req.file ? `/uploads/${req.file.filename}` : null;

        if (!media_url) {
            return res.status(400).json({ message: 'Image or video proof is required' });
        }

        let ai_analysis = null;

        // Run AI Analysis if it's an image
        if (req.file && req.file.mimetype.startsWith('image')) {
            const imagePath = path.join(__dirname, '../../uploads', req.file.filename);
            const scriptPath = path.join(__dirname, '../../yolo_model/analyze_image.py');

            try {
                const pythonProcess = spawn('python', [scriptPath, imagePath]);

                const result = await new Promise((resolve, reject) => {
                    let dataString = '';
                    pythonProcess.stdout.on('data', (data) => dataString += data.toString());
                    pythonProcess.stderr.on('data', (data) => console.error(`AI Error: ${data}`));

                    pythonProcess.on('close', (code) => {
                        if (code === 0) {
                            try {
                                resolve(JSON.parse(dataString));
                            } catch (e) {
                                console.error("Failed to parse AI output", e);
                                resolve(null);
                            }
                        } else {
                            resolve(null);
                        }
                    });
                });

                if (result && !result.error) {
                    ai_analysis = result;
                }
            } catch (aiError) {
                console.error("AI Analysis failed:", aiError);
            }
        }

        const report = await GuestReport.create({
            hotel_name_input,
            google_maps_link,
            media_url,
            media_type: req.file.mimetype.startsWith('video') ? 'video' : 'image',
            description,
            ai_analysis
        });

        res.status(201).json({ message: 'Report submitted successfully', report });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Search hotels by name (public endpoint)
exports.searchHotels = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.trim().length < 2) {
            return res.status(400).json({ message: 'Search query must be at least 2 characters' });
        }

        const hotels = await Hotel.findAll({
            where: {
                hotel_name: {
                    [Op.like]: `%${query}%`
                },
                is_verified: 1 // Only show verified hotels
            },
            attributes: ['id', 'hotel_name', 'address', 'contact', 'hygiene_score', 'hygiene_status', 'violation_count', 'fine_amount', 'last_inspection_date'],
            limit: 10
        });

        res.json(hotels);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get hotel details with violations (public endpoint)
exports.getHotelDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const hotel = await Hotel.findOne({
            where: { id, is_verified: 1 },
            attributes: ['id', 'hotel_name', 'address', 'contact', 'hygiene_score', 'hygiene_status', 'violation_count', 'fine_amount', 'last_inspection_date', 'memo']
        });

        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        // Get last 10 violations
        const violations = await Violation.findAll({
            where: { hotel_id: id },
            order: [['detected_at', 'DESC']],
            limit: 10,
            attributes: ['id', 'violation_type', 'severity', 'detected_at', 'snapshot_url']
        });

        res.json({ hotel, violations });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

