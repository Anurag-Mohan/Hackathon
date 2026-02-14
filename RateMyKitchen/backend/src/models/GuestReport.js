const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GuestReport = sequelize.define('GuestReport', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    hotel_name_input: {
        type: DataTypes.STRING,
        comment: 'User input name, might not match registered hotel exactly'
    },
    google_maps_link: {
        type: DataTypes.STRING
    },
    media_url: {
        type: DataTypes.STRING, // Image or Video path
        allowNull: false
    },
    media_type: {
        type: DataTypes.ENUM('image', 'video'),
        defaultValue: 'image'
    },
    description: {
        type: DataTypes.TEXT
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Reviewed', 'Action Taken'),
        defaultValue: 'Pending'
    },
    submitted_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    ai_analysis: {
        type: DataTypes.JSON,
        comment: 'Stores detected violations from AI model'
    }
});

module.exports = GuestReport;
