const { Hotel, Violation } = require('../models');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const POLLING_INTERVAL = 30000; // Check every 30 seconds for continuous monitoring

const runSimulation = () => {
    console.log(`[${new Date().toLocaleTimeString()}] Running AI Simulation...`);

    Hotel.findAll({ where: { is_verified: 1 } }).then(hotels => {
        if (hotels.length === 0) {
            console.log('No verified hotels found for monitoring.');
            return;
        }

        hotels.forEach(hotel => {
            const videoDir = path.join(__dirname, `../../uploads/cctv_feeds/hotel_${hotel.id}`);

            // Check if directory exists
            if (!fs.existsSync(videoDir)) {
                console.log(`No CCTV feed directory found for hotel ${hotel.hotel_name} (ID: ${hotel.id})`);
                return;
            }

            // Find the first .mp4 file in the directory
            const files = fs.readdirSync(videoDir);
            const videoFile = files.find(file => file.toLowerCase().endsWith('.mp4'));

            if (!videoFile) {
                console.log(`No video file found for hotel ${hotel.hotel_name} (ID: ${hotel.id})`);
                return;
            }

            const videoPath = path.join(videoDir, videoFile);
            console.log(`Processing video for hotel: ${hotel.hotel_name} - ${videoFile}`);

            const pythonProcess = spawn('python', [
                path.join(__dirname, '../../yolo_model/inference.py'),
                videoPath
            ]);

            let outputData = '';

            pythonProcess.stdout.on('data', (data) => {
                outputData += data.toString();
            });

            pythonProcess.stdout.on('end', () => {
                try {
                    const results = JSON.parse(outputData);

                    // Handle array of violations
                    if (Array.isArray(results)) {
                        results.forEach(result => {
                            if (result.violation) {
                                Violation.create({
                                    hotel_id: hotel.id,
                                    violation_type: result.type,
                                    snapshot_url: result.snapshot,
                                    severity: result.severity
                                }).then(() => {
                                    console.log(`✓ Violation detected for ${hotel.hotel_name}: ${result.type} (${result.severity})`);
                                    hotel.increment('violation_count');
                                });
                            }
                        });
                    }
                } catch (e) {
                    console.error(`Error parsing Python output for hotel ${hotel.hotel_name}:`, e.message);
                }
            });

            pythonProcess.stderr.on('data', (data) => {
                console.error(`Python Error for ${hotel.hotel_name}: ${data}`);
            });

            pythonProcess.on('close', (code) => {
                if (code !== 0) {
                    console.error(`Python process exited with code ${code} for hotel ${hotel.hotel_name}`);
                }
            });
        });
    }).catch(err => {
        console.error('Error fetching hotels:', err);
    });
};

// Start the simulation loop - runs continuously
console.log('Starting CCTV Simulation Service...');
console.log(`Monitoring interval: ${POLLING_INTERVAL / 1000} seconds`);
setInterval(runSimulation, POLLING_INTERVAL);

// Run immediately on startup
runSimulation();

module.exports = { runSimulation };
