const { Sequelize } = require("sequelize");

const db = new Sequelize("trackie", "postgres", "password", {
  host: "localhost",
  dialect: "postgres",
});



module.exports = db;