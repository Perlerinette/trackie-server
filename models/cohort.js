const { DataTypes } = require("sequelize");
const db = require("../db");

const Cohort = db.define('cohort', {
    cohort:{
        type: DataTypes.STRING(200),
        unique: true,
        allowNull: false,
    },
    invitcode:{
        type: DataTypes.STRING(200),
        allowNull:false
    },
    schoolid:{
        type: DataTypes.INTEGER
    }
});

module.exports = Cohort;