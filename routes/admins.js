const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const Admin = require('../models/admin');

// Endpoint untuk mendapatkan semua admin
router.get('/', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const admins = await Admin.findAll();
        res.json(admins);
    } catch (error) {
        console.error('Error fetching admins:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Endpoint untuk mendapatkan admin berdasarkan ID
router.get('/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const admin = await Admin.findByPk(req.params.id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.json(admin);
    } catch (error) {
        console.error('Error fetching admin:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Endpoint untuk menambahkan admin baru
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const { nama, email, username, password } = req.body;
        if (!nama || !email || !username || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const newAdmin = await Admin.create({ nama, email, username, password });
        res.status(201).json(newAdmin);
    } catch (error) {
        console.error('Error creating admin:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Endpoint untuk mengupdate admin berdasarkan ID
router.put('/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const { nama, email, username, password } = req.body;
        const admin = await Admin.findByPk(req.params.id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        const updatedAdmin = await admin.update({ nama, email, username, password });
        res.json(updatedAdmin);
    } catch (error) {
        console.error('Error updating admin:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Endpoint untuk menghapus admin berdasarkan ID
router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const admin = await Admin.findByPk(req.params.id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        await admin.destroy();
        res.json({ message: 'Admin deleted successfully' });
    } catch (error) {
        console.error('Error deleting admin:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
