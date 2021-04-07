const { DataTypes } = require("sequelize");
const db = require("../db");

const School = db.define('school', {
    schoolName:{
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    cohort:{
        type: DataTypes.STRING(200),
        allowNull:false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = School;