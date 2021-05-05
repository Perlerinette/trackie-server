const { DataTypes } = require("sequelize");
const db = require("../db");

const Jobseeker = db.define('jobseeker', {
    firstname:{
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    lastname:{
        type: DataTypes.STRING(100),
        allowNull:false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sharedata: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    invitcode: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = Jobseeker;