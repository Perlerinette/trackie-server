const { DataTypes } = require("sequelize");
const db = require("../db");

const School = db.define('school', {
    schoolname:{
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = School;