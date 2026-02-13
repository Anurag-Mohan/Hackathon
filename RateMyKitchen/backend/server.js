const app = require('./src/app');
const sequelize = require('./src/config/database');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5001;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Sync Database and Start Server
sequelize.sync({ force: false }) // Set force: true to reset DB during dev if needed
    .then(() => {
        console.log('Database connected');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });
