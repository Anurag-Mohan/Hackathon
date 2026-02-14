const sequelize = require('./src/config/database');

async function addAiColumn() {
    try {
        console.log('Adding ai_analysis column to GuestReports...');

        await sequelize.query('ALTER TABLE GuestReports ADD COLUMN ai_analysis JSON;');

        console.log('✅ Column added successfully!');
        process.exit(0);
    } catch (error) {
        if (error.message.includes('duplicate column name')) {
            console.log('⚠️ Column already exists.');
            process.exit(0);
        }
        console.error('❌ Failed:', error);
        process.exit(1);
    }
}

addAiColumn();
