const express = require('express');
const router = express.Router();
const Dokumen = require('../models/Dokumen');
const { authenticate, authorize } = require('../middleware/auth');

// Endpoint untuk mendapatkan semua dokumen (hanya admin yang bisa mengakses)
router.get('/', authenticate, authorize(['admin']), async function(req, res, next) {
    try {
        // Mencari semua dokumen dalam database
        const dokumens = await Dokumen.findAll();
        // Mengirimkan data dokumen dalam bentuk JSON sebagai respon
        res.json(dokumens);
    } catch (error) {
        // Jika terjadi kesalahan, lempar ke middleware error handler
        next(error);
    }
});

// Endpoint untuk membuat dokumen baru (admin dan user bisa mengakses)
router.post('/', authenticate, authorize(['admin', 'user']), async function(req, res, next) {
    try {
        // Membuat dokumen baru dengan data yang diberikan dalam permintaan
        const newDokumen = await Dokumen.create(req.body);
        // Mengirimkan dokumen baru yang dibuat dalam bentuk JSON sebagai respon
        res.json(newDokumen);
    } catch (error) {
        // Jika terjadi kesalahan, lempar ke middleware error handler
        next(error);
    }
});

// Endpoint untuk mengedit dokumen berdasarkan ID (hanya admin yang bisa mengakses)
router.put('/:id', authenticate, authorize(['admin']), async function(req, res, next) {
    try {
        // Mengupdate dokumen yang ada dengan data yang diberikan dalam permintaan berdasarkan ID
        await Dokumen.update(req.body, { where: { id: req.params.id } });
        // Mencari dokumen yang baru diupdate berdasarkan ID
        const updatedDokumen = await Dokumen.findByPk(req.params.id);
        // Mengirimkan dokumen yang diupdate dalam bentuk JSON sebagai respon
        res.json(updatedDokumen);
    } catch (error) {
        // Jika terjadi kesalahan, lempar ke middleware error handler
        next(error);
    }
});

// Endpoint untuk menghapus dokumen berdasarkan ID (hanya admin yang bisa mengakses)
router.delete('/:id', authenticate, authorize(['admin']), async function(req, res, next) {
    try {
        // Menghapus dokumen berdasarkan ID
        await Dokumen.destroy({ where: { id: req.params.id } });
        // Mengirimkan pesan bahwa dokumen berhasil dihapus
        res.json({ message: 'Dokumen deleted successfully' });
    } catch (error) {
        // Jika terjadi kesalahan, lempar ke middleware error handler
        next(error);
    }
});

module.exports = router;
