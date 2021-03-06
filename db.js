const { Sequelize } = require("sequelize");

// let passcode = process.env.PASS_DB;

// const db = new Sequelize("trackie", "postgres", passcode, {
//   host: "localhost",
//   dialect: "postgres",
// });

const db = new Sequelize(process.env.DATABASE_URL ||
  `postgresql://postgres:${encodeURIComponent(process.env.PASS_DB)}@localhost/trackie`,
   {
  dialect: 'postgres',
  //comment below to test locally
  // dialectOptions: {
  //       ssl:{
  //           require:true,
  //           rejectUnauthorized: false,

  //       }
  //   }
});


module.exports = db;