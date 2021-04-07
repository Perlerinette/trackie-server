const { DataTypes } = require("sequelize");
const db = require("../db");

const Jobapp = db.define('jobapp', {
    jobTitle:{
        type: DataTypes.STRING(200),
        allowNull: false
    },
    companyName:{
        type: DataTypes.STRING(200),
        allowNull:false
    },
    applicationDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    jobDescription: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        allowNull:false
    }
});

module.exports = Jobapp;