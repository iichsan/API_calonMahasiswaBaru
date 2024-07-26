const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const CalonMahasiswaBaru = sequelize.define('CalonMahasiswaBaru', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nama: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    alamat: {
        type: DataTypes.STRING
    },
    tanggalLahir: {
        type: DataTypes.DATE
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = CalonMahasiswaBaru;
