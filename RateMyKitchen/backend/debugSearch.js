const { Sequelize, DataTypes, Op } = require('sequelize');
const path = require('path');
const dbPath = path.join(__dirname, 'database.sqlite');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: false
});

const Hotel = sequelize.define('Hotel', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    hotel_name: { type: DataTypes.STRING, allowNull: false },
    is_verified: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
    tableName: 'Hotels',
    timestamps: true
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        console.log('\n--- ALL HOTELS ---');
        const allHotels = await Hotel.findAll();
        allHotels.forEach(h => {
            console.log(`ID: ${h.id}, Name: "${h.hotel_name}", Verified: ${h.is_verified}`);
        });

        console.log('\n--- TEST SEARCH: "hilton" ---');
        const query = "hilton";
        const results = await Hotel.findAll({
            where: {
                [Op.and]: [
                    sequelize.where(
                        sequelize.fn('LOWER', sequelize.col('hotel_name')),
                        'LIKE',
                        '%' + query.toLowerCase() + '%'
                    ),
                    { is_verified: 1 }
                ]
            }
        });
        console.log(`Found ${results.length} verified results.`);
        results.forEach(h => console.log(` - ${h.hotel_name}`));

        console.log('\n--- TEST SEARCH: "hilton" (unverified allowed) ---');
        const unverifiedResults = await Hotel.findAll({
            where: {
                [Op.and]: [
                    sequelize.where(
                        sequelize.fn('LOWER', sequelize.col('hotel_name')),
                        'LIKE',
                        '%' + query.toLowerCase() + '%'
                    )
                ]
            }
        });
        console.log(`Found ${unverifiedResults.length} TOTAL results.`);
        unverifiedResults.forEach(h => console.log(` - ${h.hotel_name} (Verified: ${h.is_verified})`));

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
})();
