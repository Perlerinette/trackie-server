const Jobseeker = require("./jobseeker");
const Jobapp = require("./jobapp");
const School = require("./school");
const Cohort = require("./cohort");


// Setup Associations
// Jobseeker.hasOne(Cohort);
// Cohort.belongsTo(Jobseeker);

// School.hasMany(Cohort);
// Cohort.belongsTo(School);

// Jobseeker.hasMany(Jobapp);
// Jobapp.belongsTo(Jobseeker);


module.exports = {
    Jobseeker,
    Jobapp,
    School,
    Cohort
  };