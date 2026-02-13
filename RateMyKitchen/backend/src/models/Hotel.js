const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Hotel = sequelize.define('Hotel', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    hotel_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contact: {
        type: DataTypes.STRING
    },
    address: {
        type: DataTypes.STRING
    },
    is_verified: {
        type: DataTypes.INTEGER,
        defaultValue: 0, // 0: Pending, 1: Approved, 2: Rejected
        comment: '0: Pending, 1: Verified, 2: Rejected'
    },
    hygiene_status: {
        type: DataTypes.ENUM('Pending', 'Clean', 'Moderately Clean', 'Dirty'),
        defaultValue: 'Pending'
    },
    violation_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    certificate_generated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    verified_at: {
        type: DataTypes.DATE
    }
});

module.exports = Hotel;
