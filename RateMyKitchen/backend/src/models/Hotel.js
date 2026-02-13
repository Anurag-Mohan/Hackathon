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
    hygiene_score: {
        type: DataTypes.INTEGER,
        defaultValue: null,
        validate: {
            min: 0,
            max: 100
        },
        comment: 'Official hygiene score set by admin (0-100)'
    },
    memo: {
        type: DataTypes.TEXT,
        defaultValue: null,
        comment: 'Admin notes and memos for the hotel'
    },
    fine_amount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        comment: 'Total fines imposed on the hotel'
    },
    last_inspection_date: {
        type: DataTypes.DATE,
        defaultValue: null,
        comment: 'Date of last admin inspection'
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
