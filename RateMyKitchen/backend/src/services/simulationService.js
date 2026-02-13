const { Hotel, Violation } = require('../models');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const POLLING_INTERVAL = 30000; // Check every 30 seconds

const runSimulation = () => {
    console.log('Running AI Simulation...');

    Hotel.findAll({ where: { is_verified: 1 } }).then(hotels => {
        hotels.forEach(hotel => {
            const videoPath = path.join(__dirname, `../../uploads/cctv_feeds/${hotel.id}/video.mp4`);

            // In a real app, we check if video exists. 
            // Here we just pretend to call the python script for every approved hotel.

            const pythonProcess = spawn('python', [
                path.join(__dirname, '../../yolo_model/inference.py'),
                videoPath
            ]);

            pythonProcess.stdout.on('data', (data) => {
                try {
                    const result = JSON.parse(data.toString());
                    if (result.violation) {
                        Violation.create({
                            hotel_id: hotel.id,
                            violation_type: result.type,
                            snapshot_url: result.snapshot,
                            severity: result.severity
                        }).then(() => {
                            console.log(`Violation detected for hotel ${hotel.hotel_name}: ${result.type}`);

                            // Update violation count
                            hotel.increment('violation_count');
                        });
                    }
                } catch (e) {
                    console.error('Error parsing Python output:', e);
                }
            });

            pythonProcess.stderr.on('data', (data) => {
                console.error(`Python Error: ${data}`);
            });
        });
    });
};

// Start the simulation loop
setInterval(runSimulation, POLLING_INTERVAL);

module.exports = { runSimulation };
