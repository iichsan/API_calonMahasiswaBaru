const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { authenticate, authorize } = require('../middleware/auth');

// Endpoint untuk mendapatkan semua data pengguna (hanya untuk admin)
router.get('/', authenticate, authorize('admin'), async (req, res, next) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
});

// Endpoint untuk mendapatkan data pengguna berdasarkan ID (hanya untuk admin)
router.get('/:id', authenticate, authorize('admin'), async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});

// Endpoint untuk mengupdate data pengguna berdasarkan ID (hanya untuk admin)
router.put('/:id', authenticate, authorize('admin'), async (req, res, next) => {
    try {
        const [updated] = await User.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated === 0) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
        }
        const updatedUser = await User.findByPk(req.params.id);
        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
});

// Endpoint untuk menghapus data pengguna berdasarkan ID (hanya untuk admin)
router.delete('/:id', authenticate, authorize('admin'), async (req, res, next) => {
    try {
        const deleted = await User.destroy({
            where: { id: req.params.id }
        });
        if (!deleted) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
        }
        res.status(200).json({ message: 'Pengguna berhasil dihapus' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
