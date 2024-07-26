// models/Pendaftaran.js
const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const CalonMahasiswaBaru = require('./CalonMahasiswaBaru');
const Dokumen = require('./Dokumen');

const Pendaftaran = sequelize.define('Pendaftaran', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    tanggalPendaftaran: {
        type: DataTypes.DATE,
        allowNull: false
    },
    statusVerifikasi: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    calonMahasiswaId: {
        type: DataTypes.INTEGER,
        references: {
            model: CalonMahasiswaBaru,
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    dokumenId: {
        type: DataTypes.INTEGER,
        references: {
            model: Dokumen,
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
});

// Define relationships
Pendaftaran.belongsTo(CalonMahasiswaBaru, { foreignKey: 'calonMahasiswaId' });
Pendaftaran.belongsTo(Dokumen, { foreignKey: 'dokumenId' });

CalonMahasiswaBaru.hasMany(Pendaftaran, { foreignKey: 'calonMahasiswaId' });
Dokumen.hasMany(Pendaftaran, { foreignKey: 'dokumenId' });

module.exports = Pendaftaran;
