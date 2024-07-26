const express = require('express');
const router = express.Router();
const CalonMahasiswaBaru = require('../models/CalonMahasiswaBaru');
const { authenticate, authorize } = require('../middleware/auth');

// Endpoint untuk pendaftaran online calon mahasiswa baru
router.post('/register', authenticate, async (req, res, next) => {
    try {
        // Validasi input dan dokumen yang diperlukan
        const { nama, alamat, email, tanggalLahir, username, password } = req.body;
        if (!nama || !alamat || !email || !tanggalLahir || !username || !password) {
            return res.status(400).json({ message: 'Semua field harus diisi' });
        }

        // Validasi format tanggal (YYYY-MM-DD)
        if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggalLahir)) {
            return res.status(400).json({ message: 'Format tanggal tidak valid' });
        }

        const newCalonMahasiswaBaru = await CalonMahasiswaBaru.create(req.body);
        res.status(201).json(newCalonMahasiswaBaru);
    } catch (error) {
        next(error);
    }
});

// Endpoint untuk mendapatkan semua data calon mahasiswa baru (hanya untuk admin)
router.get('/', authenticate, authorize('admin'), async (req, res, next) => {
    try {
        const calonMahasiswaBaru = await CalonMahasiswaBaru.findAll();
        res.status(200).json(calonMahasiswaBaru);
    } catch (error) {
        next(error);
    }
});

// Endpoint untuk mendapatkan data calon mahasiswa baru berdasarkan ID (hanya untuk admin)
router.get('/:id', authenticate, authorize('admin'), async (req, res, next) => {
    try {
        const calonMahasiswaBaru = await CalonMahasiswaBaru.findByPk(req.params.id);
        if (!calonMahasiswaBaru) {
            return res.status(404).json({ message: 'Data tidak ditemukan' });
        }
        res.status(200).json(calonMahasiswaBaru);
    } catch (error) {
        next(error);
    }
});

// Endpoint untuk mengupdate data calon mahasiswa baru berdasarkan ID (hanya untuk admin)
router.put('/:id', authenticate, authorize('admin'), async (req, res, next) => {
    try {
        const updatedCalonMahasiswaBaru = await CalonMahasiswaBaru.update(req.body, {
            where: { id: req.params.id }
        });
        if (updatedCalonMahasiswaBaru[0] === 0) {
            return res.status(404).json({ message: 'Data tidak ditemukan' });
        }
        const updatedData = await CalonMahasiswaBaru.findByPk(req.params.id);
        res.status(200).json(updatedData);
    } catch (error) {
        next(error);
    }
});

// Endpoint untuk menghapus data calon mahasiswa baru berdasarkan ID (hanya untuk admin)
router.delete('/:id', authenticate, authorize('admin'), async (req, res, next) => {
    try {
        const deleted = await CalonMahasiswaBaru.destroy({
            where: { id: req.params.id }
        });
        if (!deleted) {
            return res.status(404).json({ message: 'Data tidak ditemukan' });
        }
        res.status(200).json({ message: 'Data berhasil dihapus' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
