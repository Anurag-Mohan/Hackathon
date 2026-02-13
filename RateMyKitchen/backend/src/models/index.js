const sequelize = require('../config/database');
const Admin = require('./Admin');
const Hotel = require('./Hotel');
const Violation = require('./Violation');
const Fine = require('./Fine');
const Memo = require('./Memo');
const GuestReport = require('./GuestReport');
const Achievement = require('./Achievement');

// Associations
Hotel.hasMany(Violation, { foreignKey: 'hotel_id' });
Violation.belongsTo(Hotel, { foreignKey: 'hotel_id' });

Hotel.hasMany(Fine, { foreignKey: 'hotel_id' });
Fine.belongsTo(Hotel, { foreignKey: 'hotel_id' });

Hotel.hasMany(Memo, { foreignKey: 'hotel_id' });
Memo.belongsTo(Hotel, { foreignKey: 'hotel_id' });

// Export all
module.exports = {
    sequelize,
    Admin,
    Hotel,
    Violation,
    Fine,
    Memo,
    GuestReport,
    Achievement
};
