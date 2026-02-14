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

        // Send Rich HTML Email
        try {
            const mailOptions = {
                from: '"RateMyKitchen Admin" <admin@ratemykitchen.com>',
                to: hotel.email,
                subject: '🎉 Welcome to RateMyKitchen - Registration Approved!',
                html: `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px; border-radius: 10px;">
                        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            <div style="text-align: center; margin-bottom: 20px;">
                                <h1 style="color: #2563eb; margin: 0;">RateMyKitchen</h1>
                                <p style="color: #6b7280; font-size: 14px; letter-spacing: 1px;">OFFICIAL COMMUNICATION</p>
                            </div>
                            
                            <h2 style="color: #111827; margin-top: 0;">Registration Approved! ✅</h2>
                            <p style="color: #374151; line-height: 1.6;">Dear <strong>${hotel.hotel_name}</strong> Team,</p>
                            
                            <p style="color: #374151; line-height: 1.6;">
                                We are thrilled to welcome you to the RateMyKitchen network. Your hotel registration has been carefully reviewed and <strong style="color: #059669;">successfully approved</strong> by our administration team.
                            </p>
                            
                            <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0;">
                                <p style="margin: 0; color: #1e3a8a; font-weight: 500;">What happens next?</p>
                                <ul style="color: #374151; margin-top: 10px; padding-left: 20px;">
                                    <li>Access your <strong>Hotel Dashboard</strong> to view real-time hygiene scores.</li>
                                    <li>Our AI system will begin monitoring your kitchen feeds for compliance.</li>
                                    <li>Maintain a high score to earn the coveted <strong>"Certified Clean"</strong> badge.</li>
                                </ul>
                            </div>

                            <div style="text-align: center; margin-top: 30px;">
                                <a href="http://localhost:3000/login" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Access Your Dashboard</a>
                            </div>
                            
                            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                            
                            <p style="color: #6b7280; font-size: 12px; text-align: center;">
                                This is an automated message. Please do not reply directly to this email.<br>
                                &copy; ${new Date().getFullYear()} RateMyKitchen. All rights reserved.
                            </p>
                        </div>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);
        } catch (emailErr) {
            console.error('Failed to send approval email:', emailErr);
            // We do not throw here, so the response still returns success for the approval
        }

        res.json({
            message: 'Hotel approved successfully' + (hotel.email ? '' : ' (Email failed to send)'),
            hotel
        });
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

exports.deleteHotel = async (req, res) => {
    try {
        const { id } = req.params;
        const hotel = await Hotel.findByPk(id);
        if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

        // Delete associated records manually if needed, or rely on cascading delete if set up in models
        // For safety, let's delete related records explicitly to avoid constraint errors if CASCADE isn't set
        await Violation.destroy({ where: { hotel_id: id } });
        await Fine.destroy({ where: { hotel_id: id } });
        await Memo.destroy({ where: { hotel_id: id } });
        // GuestReports might not have hotel_id linked directly yet strictly, but usually do. 
        // If report linking was added, we should clear those.
        // Assuming GuestReport doesn't have a direct FK constraint that blocks deletion or it is handled. 
        // Let's proceed with hotel deletion.

        await hotel.destroy();
        res.json({ message: 'Hotel deleted successfully' });
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
// Report Generation Professional
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
        const whereClause = { hotel_id: id };

        let dateRangeText = "All Time";

        if (startDate && endDate) {
            whereClause.detected_at = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
            dateRangeText = `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`;
        } else if (startDate) {
            whereClause.detected_at = { [Op.gte]: new Date(startDate) };
            dateRangeText = `Since ${new Date(startDate).toLocaleDateString()}`;
        }

        const violations = await Violation.findAll({
            where: whereClause,
            order: [['detected_at', 'DESC']]
        });

        // Fines date filter (optional, usually matches report period)
        const fineWhereClause = { hotel_id: id };
        if (startDate && endDate) {
            fineWhereClause.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
        }

        const fines = await Fine.findAll({
            where: fineWhereClause,
            order: [['createdAt', 'DESC']]
        });

        // Initialize PDF with margins
        const doc = new PDFDocument({ margin: 50 });
        const filename = `Compliance_Report_${hotel.hotel_name.replace(/ /g, '_')}_${Date.now()}.pdf`;

        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');

        doc.pipe(res);

        // --- Header Section ---
        doc.modal = true; // Use this to check if modal logic is needed? No, just visual.

        // Dynamic Header Height based on content? Fixed is fine.
        doc.rect(0, 0, 612, 130).fill('#1e3a8a'); // Dark Blue Header
        doc.fillColor('white').fontSize(28).text('RateMyKitchen', 50, 45, { align: 'left' });
        doc.fontSize(12).text('OFFICIAL COMPLIANCE AUDIT REPORT', 50, 80, { align: 'left', characterSpacing: 2 });

        // Date Range in Header
        doc.fontSize(10).text(`Period: ${dateRangeText}`, 50, 100, { align: 'left', color: '#cbd5e1' });

        doc.fillColor('white').fontSize(10).text(`Report ID: #${Date.now().toString().slice(-6)}`, 450, 50, { align: 'right' });
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 450, 65, { align: 'right' });

        doc.fillColor('black'); // Reset to black
        doc.moveDown(5);

        // --- Executive Summary Box ---
        doc.rect(50, 140, 512, 100).fill('#f3f4f6'); // Light Gray Box
        doc.fill('#1f2937').fontSize(16).text('Executive Summary', 70, 155);
        doc.moveTo(70, 175).lineTo(542, 175).strokeColor('#d1d5db').stroke();

        doc.fontSize(12).text(`Hotel: ${hotel.hotel_name}`, 70, 190);
        doc.text(`Status: ${hotel.hygiene_status || 'Pending Review'}`, 300, 190);
        doc.text(`Total Violations detected: ${violations.length}`, 70, 210);
        doc.text(`Total Fines Imposed: ${fines.length}`, 300, 210);

        doc.moveDown(3);

        // --- Detailed Violations Section ---
        doc.fontSize(18).fillColor('#1e3a8a').text('Detailed Violation Log', 50, 280, { underline: true });
        doc.moveDown(1);

        if (violations.length > 0) {
            // Table Header
            let yPos = 320;
            doc.rect(50, yPos, 512, 30).fill('#e0f2fe');
            doc.fillColor('#000000').fontSize(12).font('Helvetica-Bold');
            doc.text('Date & Time', 60, yPos + 8);
            doc.text('Violation Type', 220, yPos + 8);
            doc.text('Severity', 450, yPos + 8);

            yPos += 40;
            doc.font('Helvetica').fontSize(11);

            violations.forEach((v, i) => {
                if (yPos > 700) { // New Page check
                    doc.addPage();
                    yPos = 50;
                }

                const dateStr = new Date(v.detected_at).toLocaleString();
                const severityColor = v.severity === 'High' ? 'red' : (v.severity === 'Medium' ? 'orange' : 'black');

                // Row Background (Alternating)
                if (i % 2 === 0) doc.rect(50, yPos - 5, 512, 25).fill('#f9fafb');

                doc.fillColor('black').text(dateStr, 60, yPos);
                doc.text(v.violation_type, 220, yPos);
                doc.fillColor(severityColor).text(v.severity, 450, yPos);

                yPos += 30;
            });
        } else {
            doc.fontSize(12).fillColor('green').text('No violations found for the selected period. Excellent work!');
        }

        doc.moveDown(4);

        // --- Fines Section ---
        if (fines.length > 0) {
            if (doc.y > 600) doc.addPage();

            doc.fontSize(18).fillColor('#b91c1c').text('Financial Penalties', { underline: true });
            doc.moveDown(1);

            fines.forEach((f) => {
                doc.fontSize(12).fillColor('black').text(`• $${f.amount} - ${f.reason} (${new Date(f.createdAt).toLocaleDateString()})`);
                doc.moveDown(0.5);
            });
        }

        // --- Footer ---
        // Fix: Use bufferedPageRange correctly to avoid out of bounds error
        const range = doc.bufferedPageRange();
        for (let i = range.start; i < range.start + range.count; i++) {
            doc.switchToPage(i);
            doc.fontSize(10).fillColor('#9ca3af').text(
                'RateMyKitchen Official Audit • Confidential Document',
                50,
                doc.page.height - 50,
                { align: 'center', width: 512 }
            );
        }

        doc.end();

    } catch (err) {
        console.error(err);
        if (!res.headersSent) {
            res.status(500).json({ error: err.message });
        }
    }
};
