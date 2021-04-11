const { DataTypes } = require("sequelize");
const db = require("../db");

const Jobapp = db.define('jobapp', {
    jobtitle:{
        type: DataTypes.STRING(200),
        allowNull: false
    },
    company:{
        type: DataTypes.STRING(200),
        allowNull:false
    },
    applicationdate: {
        type: DataTypes.STRING,
        allowNull: false
    },
    jobdescription: {
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
    },
    jobseekerid: {
        type: DataTypes.INTEGER
    }
});

module.exports = Jobapp;