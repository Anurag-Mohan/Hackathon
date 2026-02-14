const { Hotel, Violation, Fine, Memo, GuestReport, Achievement } = require('../models');
const sequelize = require('sequelize');
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

// Update Hotel Hygiene Rating
exports.updateHotelRating = async (req, res) => {
    try {
        const { id } = req.params;
        const { hygiene_score, hygiene_status, memo, fine_amount } = req.body;

        const hotel = await Hotel.findByPk(id);
        if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

        // Update fields
        if (hygiene_score !== undefined) {
            if (hygiene_score < 0 || hygiene_score > 100) {
                return res.status(400).json({ message: 'Hygiene score must be between 0 and 100' });
            }
            hotel.hygiene_score = hygiene_score;
        }

        if (hygiene_status) {
            hotel.hygiene_status = hygiene_status;
        }

        if (memo !== undefined) {
            hotel.memo = memo;
        }

        if (fine_amount !== undefined) {
            hotel.fine_amount = fine_amount;
        }

        hotel.last_inspection_date = new Date();
        await hotel.save();

        res.json({ message: 'Hotel rating updated successfully', hotel });
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
        const reports = await GuestReport.findAll({
            order: [['submitted_at', 'DESC']]
        });
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateReportStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'Reviewed', 'Action Taken', 'Rejected'

        const report = await GuestReport.findByPk(id);
        if (!report) return res.status(404).json({ message: 'Report not found' });

        // If action is taken, try to link to a hotel and create a violation
        let hotelLinked = false;
        if (status === 'Action Taken' && report.status !== 'Action Taken') {
            // Try exact match first, then case-insensitive
            const hotel = await Hotel.findOne({
                where: sequelize.where(
                    sequelize.fn('lower', sequelize.col('hotel_name')),
                    sequelize.fn('lower', report.hotel_name_input)
                )
            });

            if (hotel) {
                hotelLinked = true;
                // Create Stats
                await Violation.create({
                    hotel_id: hotel.id,
                    violation_type: 'Reported by Guest',
                    severity: 'High',
                    snapshot_url: report.media_url,
                    detected_at: new Date()
                });

                // Update Counters
                await hotel.increment('violation_count');

                // Recalculate Hygiene Score (Simple Logic: -10 per violation)
                if (hotel.hygiene_score > 0) {
                    hotel.hygiene_score = Math.max(0, hotel.hygiene_score - 10);
                }
                await hotel.save();
            }
        }

        report.status = status;
        await report.save();

        res.json({
            message: hotelLinked ? 'Report validated & stats updated!' : 'Report status updated (Hotel not found in DB)',
            report,
            hotelLinked
        });
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

// Video Processing & AI Violation Detection
const { spawn } = require('child_process');

exports.processHotelVideo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No video file uploaded' });
        }

        const { hotel_id } = req.body;
        if (!hotel_id) {
            return res.status(400).json({ error: 'Hotel ID is required' });
        }

        const videoPath = path.join(__dirname, '../../', req.file.path);
        const scriptPath = path.join(__dirname, '../../yolo_model/inference.py');

        // Verify script exists
        if (!fs.existsSync(scriptPath)) {
            return res.status(500).json({ error: 'Inference script not found' });
        }

        // Spawn Python process
        const pythonProcess = spawn('python', [scriptPath, videoPath]);

        let dataString = '';
        let errorString = '';

        pythonProcess.stdout.on('data', (data) => {
            dataString += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorString += data.toString();
        });

        pythonProcess.on('close', async (code) => {
            // Delete video file after processing to save space (optional)
            // fs.unlinkSync(videoPath);

            if (code !== 0) {
                console.error(`Python script exited with code ${code}: ${errorString}`);
                return res.status(500).json({ error: 'Video processing failed', details: errorString });
            }

            try {
                // Parse JSON output from Python script
                const violationsData = JSON.parse(dataString);

                if (violationsData.error) {
                    return res.status(400).json({ error: violationsData.error });
                }

                // Save violations to database
                const createdViolations = [];
                for (const v of violationsData) {
                    if (v.violation) {
                        const newViolation = await Violation.create({
                            hotel_id,
                            violation_type: v.type,
                            severity: v.severity,
                            snapshot_url: v.snapshot,
                            detected_at: new Date()
                        });
                        createdViolations.push(newViolation);
                    }
                }

                res.json({
                    message: 'Video processed successfully',
                    violations_detected: createdViolations.length,
                    violations: createdViolations
                });

            } catch (parseError) {
                console.error('JSON Parse Error:', parseError);
                console.error('Raw Output:', dataString); // Log raw output for debugging
                res.status(500).json({ error: 'Failed to parse processing results', details: parseError.message });
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// Report Generation
const PDFDocument = require('pdfkit');
const { Op } = require('sequelize');

exports.generateReport = async (req, res) => {
    try {
        const { id } = req.params;
        const { startDate, endDate } = req.query;

        const hotel = await Hotel.findByPk(id);
        if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

        // Date Filter
        const dateFilter = {};
        if (startDate && endDate) {
            dateFilter.detected_at = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        } else if (startDate) {
            dateFilter.detected_at = { [Op.gte]: new Date(startDate) };
        }

        const violations = await Violation.findAll({
            where: { hotel_id: id, ...dateFilter },
            order: [['detected_at', 'DESC']]
        });

        const fines = await Fine.findAll({
            where: { hotel_id: id },
            order: [['createdAt', 'DESC']]
        });

        // Initialize PDF
        const doc = new PDFDocument();
        const filename = `Report_${hotel.hotel_name.replace(/ /g, '_')}_${Date.now()}.pdf`;

        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');

        doc.pipe(res);

        // Header
        doc.fontSize(25).text('RateMyKitchen - Hotel Report', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
        doc.moveDown();
        doc.moveTo(50, 100).lineTo(550, 100).stroke();

        // Hotel Details
        doc.moveDown();
        doc.fontSize(16).text(`Hotel: ${hotel.hotel_name}`);
        doc.fontSize(12).text(`Email: ${hotel.email}`);
        doc.text(`Address: ${hotel.address}`);
        doc.text(`Contact: ${hotel.contact}`);
        doc.text(`Current Hygiene Status: ${hotel.hygiene_status || 'N/A'}`);
        doc.moveDown();

        // Summary Stats
        doc.fontSize(18).text('Summary Statistics', { underline: true });
        doc.moveDown();
        doc.fontSize(12).text(`Total Violations (Selected Period): ${violations.length}`);
        doc.text(`Total Fines Issued: ${fines.length}`);
        doc.moveDown();

        // Violations List
        if (violations.length > 0) {
            doc.fontSize(18).text('Violation Details', { underline: true });
            doc.moveDown();

            violations.forEach((v, i) => {
                doc.fontSize(14).text(`${i + 1}. ${v.violation_type} (${v.severity})`);
                doc.fontSize(10).text(`Detected At: ${new Date(v.detected_at).toLocaleString()}`);
                doc.moveDown(0.5);
            });
        } else {
            doc.fontSize(14).text('No violations found for this period.');
        }

        // Fines List
        if (fines.length > 0) {
            doc.addPage();
            doc.fontSize(18).text('Fines History', { underline: true });
            doc.moveDown();

            fines.forEach((f, i) => {
                doc.fontSize(12).text(`${i + 1}. Amount: $${f.amount}`);
                doc.text(`Reason: ${f.reason}`);
                doc.text(`Date: ${new Date(f.createdAt).toLocaleString()}`);
                doc.moveDown(0.5);
            });
        }

        doc.end();

    } catch (err) {
        console.error(err);
        if (!res.headersSent) {
            res.status(500).json({ error: err.message });
        }
    }
};
