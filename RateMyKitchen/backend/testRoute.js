const axios = require('axios');

async function testRoute() {
    try {
        console.log('Testing PUT http://localhost:5000/api/admin/hotels/1/approve');
        // Login first to get token (assuming admin exists from seed)
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@ratemykitchen.com',
            password: 'admin123',
            role: 'admin'
        });

        const token = loginRes.data.token;
        console.log('Got valid token');

        const res = await axios.put('http://localhost:5000/api/admin/hotels/1/approve', {}, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Response Status:', res.status);
        console.log('Response Data:', res.data);
    } catch (err) {
        if (err.response) {
            console.error('Error Status:', err.response.status);
            console.error('Error Data:', err.response.data);
            console.error('Error Headers:', err.response.headers);
        } else {
            console.error('Error:', err.message);
        }
    }
}

testRoute();
