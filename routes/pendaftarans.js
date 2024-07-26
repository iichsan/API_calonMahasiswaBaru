const express = require('express');
const router = express.Router();
const Pendaftaran = require('../models/Pendaftaran');
const CalonMahasiswaBaru = require('../models/CalonMahasiswaBaru');
const Dokumen = require('../models/Dokumen');
const { authenticate, authorize } = require('../middleware/auth');

// Endpoint untuk mendapatkan semua pendaftarans dengan relasi
router.get('/', authenticate, authorize(['admin']), async (req, res, next) => {
    try {
        const pendaftarans = await Pendaftaran.findAll({
            include: [
                { model: CalonMahasiswaBaru, attributes: ['id', 'nama', 'email'] }, // Menyertakan data CalonMahasiswaBaru
                { model: Dokumen, attributes: ['id', 'namaDokumen', 'jenisDokumen'] } // Menyertakan data Dokumen
            ]
        });
        res.json(pendaftarans);
    } catch (error) {
        console.error('Error fetching pendaftarans:', error); // Tambahkan logging untuk debugging
        next(error);
    }
});

// Endpoint untuk mendapatkan pendaftaran berdasarkan ID
router.get('/:id', authenticate, authorize(['admin']), async (req, res, next) => {
    try {
        const pendaftaran = await Pendaftaran.findByPk(req.params.id, {
            include: [
                { model: CalonMahasiswaBaru, attributes: ['id', 'nama', 'email'] },
                { model: Dokumen, attributes: ['id', 'namaDokumen', 'jenisDokumen'] }
            ]
        });

        if (!pendaftaran) {
            return res.status(404).json({ message: 'Pendaftaran not found' });
        }

        res.json(pendaftaran);
    } catch (error) {
        console.error('Error fetching pendaftaran:', error); // Tambahkan logging untuk debugging
        next(error);
    }
});

// Endpoint untuk menambahkan pendaftaran baru
router.post('/', authenticate, authorize(['admin']), async (req, res, next) => {
    try {
        const { tanggalPendaftaran, statusVerifikasi, calonMahasiswaId, dokumenId } = req.body;
        if (!tanggalPendaftaran || statusVerifikasi === undefined || !calonMahasiswaId || !dokumenId) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newPendaftaran = await Pendaftaran.create({
            tanggalPendaftaran,
            statusVerifikasi,
            calonMahasiswaId,
            dokumenId
        });

        res.status(201).json(newPendaftaran);
    } catch (error) {
        console.error('Error creating pendaftaran:', error); // Tambahkan logging untuk debugging
        next(error);
    }
});

// Endpoint untuk mengupdate pendaftaran berdasarkan ID
router.put('/:id', authenticate, authorize(['admin']), async (req, res, next) => {
    try {
        const { tanggalPendaftaran, statusVerifikasi, calonMahasiswaId, dokumenId } = req.body;
        const pendaftaran = await Pendaftaran.findByPk(req.params.id);

        if (!pendaftaran) {
            return res.status(404).json({ message: 'Pendaftaran not found' });
        }

        const updatedPendaftaran = await pendaftaran.update({
            tanggalPendaftaran,
            statusVerifikasi,
            calonMahasiswaId,
            dokumenId
        });

        res.json(updatedPendaftaran);
    } catch (error) {
        console.error('Error updating pendaftaran:', error); // Tambahkan logging untuk debugging
        next(error);
    }
});

// Endpoint untuk menghapus pendaftaran berdasarkan ID
router.delete('/:id', authenticate, authorize(['admin']), async (req, res, next) => {
    try {
        const pendaftaran = await Pendaftaran.findByPk(req.params.id);

        if (!pendaftaran) {
            return res.status(404).json({ message: 'Pendaftaran not found' });
        }

        await pendaftaran.destroy();
        res.json({ message: 'Pendaftaran deleted successfully' });
    } catch (error) {
        console.error('Error deleting pendaftaran:', error); // Tambahkan logging untuk debugging
        next(error);
    }
});

module.exports = router;
