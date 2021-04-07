const { DataTypes } = require("sequelize");
const db = require("../db");

const Jobseeker = db.define('jobseeker', {
    firstName:{
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    lastName:{
        type: DataTypes.STRING(50),
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
    shareData: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    invitCode: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = Jobseeker;