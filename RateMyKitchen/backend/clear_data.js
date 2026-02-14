const sequelize = require('./src/config/database');
const { Hotel, GuestReport, Violation, Fine, Memo } = require('./src/models');

async function clearData() {
    try {
        console.log('🧹 Starting Fresh Start Clean-up...');

        // 1. Delete Transactional Data
        console.log('Deleting Violations...');
        await Violation.destroy({ where: {}, truncate: false });

        console.log('Deleting Guest Reports...');
        await GuestReport.destroy({ where: {}, truncate: false });

        console.log('Deleting Fines...');
        await Fine.destroy({ where: {}, truncate: false });

        console.log('Deleting Memos...');
        await Memo.destroy({ where: {}, truncate: false });

        // 2. Reset Hotel Stats
        console.log('Resetting Hotel Statistics...');
        await Hotel.update({
            violation_count: 0,
            fine_amount: 0,
            hygiene_score: null, // or 100? Let's set to null or 100. Let's do 100 for a fresh start.
            hygiene_status: 'Pending', // Back to neutral
            last_inspection_date: null
        }, {
            where: {}
        });

        console.log('✅ Fresh Start Complete! All violations and reports cleared.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to clear data:', error);
        process.exit(1);
    }
}

clearData();
