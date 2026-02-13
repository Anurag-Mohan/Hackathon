const { Hotel, Violation, Fine, Memo } = require('./src/models');
const sequelize = require('./src/config/database');

async function checkData() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        const hotels = await Hotel.findAll();
        console.log(`Total Hotels: ${hotels.length}`);
        hotels.forEach(h => {
            console.log(`Hotel ID: ${h.id}, Name: ${h.hotel_name}, Score: ${h.hygiene_score}, Status: ${h.hygiene_status}, Memo: ${h.memo ? 'Yes' : 'No'}, Fines: ${h.fine_amount}`);
        });

        const violations = await Violation.findAll();
        console.log(`Total Violations: ${violations.length}`);
        if (violations.length > 0) {
            console.log('Sample Violation:', JSON.stringify(violations[0], null, 2));
        }

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
}

checkData();
