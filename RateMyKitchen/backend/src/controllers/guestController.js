const { GuestReport } = require('../models');

exports.submitReport = async (req, res) => {
    try {
        const { hotel_name_input, google_maps_link, description } = req.body;
        const media_url = req.file ? `/uploads/${req.file.filename}` : null;

        if (!media_url) {
            return res.status(400).json({ message: 'Image or video proof is required' });
        }

        const report = await GuestReport.create({
            hotel_name_input,
            google_maps_link,
            media_url,
            media_type: req.file.mimetype.startsWith('video') ? 'video' : 'image',
            description
        });

        res.status(201).json({ message: 'Report submitted successfully', report });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
