const { Sequelize } = require("sequelize");

let passcode = process.env.PASS_DB;

const db = new Sequelize("trackie", "postgres", passcode, {
  host: "localhost",
  dialect: "postgres",
});



module.exports = db;