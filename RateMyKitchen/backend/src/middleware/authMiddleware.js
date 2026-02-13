const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        console.log('Auth Middleware: No token provided');
        return res.status(401).json({ message: 'Access Denied' });
    }

    try {
        const verified = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET || 'secretkey');
        req.user = verified;
        console.log('Auth Middleware: Token verified for user:', verified.id);
        next();
    } catch (err) {
        console.log('Auth Middleware: Invalid Token', err.message);
        res.status(400).json({ message: 'Invalid Token' });
    }
};
