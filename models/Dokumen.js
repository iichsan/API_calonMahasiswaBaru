const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Dokumen = sequelize.define('Dokumen', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    namaDokumen: {
        type: DataTypes.STRING,
        allowNull: false
    },
    jenisDokumen: {
        type: DataTypes.STRING
    },
    filePath: {
        type: DataTypes.STRING
    }
});

module.exports = Dokumen;
