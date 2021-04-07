const { DataTypes } = require("sequelize");
const db = require("../db");

const Cohort = db.define('cohort', {
    cohortName:{
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    invitCode:{
        type: DataTypes.STRING(200),
        allowNull:false
    }
});

module.exports = Cohort;