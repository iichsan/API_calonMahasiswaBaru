const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || '12345';

// Middleware untuk memverifikasi JWT
const authenticate = (req, res, next) => {
    const authHeader = req.header('Authorization');
    console.log('Authorization Header:', authHeader); // Menambahkan log untuk debugging

    if (!authHeader) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Extracted Token:', token); // Menambahkan log untuk debugging

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    try {
        const decoded = jwt.verify(token, secretKey);
        console.log('Secret Key:', secretKey);

        req.user = decoded;
        next();
    } catch (err) {
        console.error('Token Verification Error:', err); // Logging error untuk debugging
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Middleware untuk mengotorisasi pengguna berdasarkan peran
const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'anda tidak mempunyai akses' });
        }
        next();
    };
};

module.exports = { authenticate, authorize };
