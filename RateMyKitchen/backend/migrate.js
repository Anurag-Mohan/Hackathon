const sequelize = require('./src/config/database');
const { Hotel } = require('./src/models');

async function migrate() {
    try {
        console.log('Starting database migration...');

        // Use alter: true to add new columns without dropping existing data
        await sequelize.sync({ alter: true });

        console.log('✅ Database migration completed successfully!');
        console.log('New columns added to Hotels table:');
        console.log('  - hygiene_score (INTEGER)');
        console.log('  - memo (TEXT)');
        console.log('  - fine_amount (DECIMAL)');
        console.log('  - last_inspection_date (DATE)');

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

migrate();
