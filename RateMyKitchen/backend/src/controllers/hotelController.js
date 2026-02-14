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
        const violations = await Violation.findAll({
            where: { hotel_id: req.user.id },
            order: [['detected_at', 'DESC']]
        });
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

// Report Generation (Hotel Side)
const PDFDocument = require('pdfkit');
const { Op } = require('sequelize');

exports.generateReport = async (req, res) => {
    try {
        const id = req.user.id; // Get ID from authenticated user, not params
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

        // Initialize PDF with margins
        const doc = new PDFDocument({ margin: 50 });
        const filename = `Compliance_Report_${hotel.hotel_name.replace(/ /g, '_')}_${Date.now()}.pdf`;

        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');

        doc.pipe(res);

        // --- Header Section ---
        doc.rect(0, 0, 612, 120).fill('#1e3a8a'); // Dark Blue Header
        doc.fillColor('white').fontSize(28).text('RateMyKitchen', 50, 45, { align: 'left' });
        doc.fontSize(12).text('OFFICIAL COMPLIANCE AUDIT REPORT', 50, 80, { align: 'left', characterSpacing: 2 });

        doc.fillColor('white').fontSize(10).text(`Report ID: #${Date.now().toString().slice(-6)}`, 450, 50, { align: 'right' });
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 450, 65, { align: 'right' });

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
        const pageCount = doc.bufferedPageRange().count;
        for (let i = 0; i < pageCount; i++) {
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
