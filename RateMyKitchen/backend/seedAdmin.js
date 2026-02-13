const { Admin } = require('./src/models');
const bcrypt = require('bcrypt');
const sequelize = require('./src/config/database');

const seedAdmin = async () => {
    try {
        await sequelize.sync(); // Ensure DB is synced

        const email = 'admin@ratemykitchen.com';
        const password = 'admin123'; // Default password
        const name = 'Super Admin';

        // Check if admin exists
        const existingAdmin = await Admin.findOne({ where: { email } });
        if (existingAdmin) {
            console.log('Admin already exists');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await Admin.create({
            name,
            email,
            password: hashedPassword
        });

        console.log('Admin created successfully');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        process.exit(0);
    } catch (err) {
        console.error('Error seeding admin:', err);
        process.exit(1);
    }
};

seedAdmin();
