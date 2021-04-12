const router = require("express").Router();
const { Cohort } = require("../models");

var sequelize = require("../db");
let validateSchoolSession = (require('../middleware/validateSchoolSession'));

router.post("/test", validateSchoolSession, function (req, res) {
  res.send("Cohort endpoint works");
});

/*
ENDPOINTS:

http://localhost:3000/cohort/create             -  POST > creates new cohort and generates associated unique code
http://localhost:3000/cohort/delete             -  DELETE > deletes a cohort for a logged school
http://localhost:3000/cohort/getCode/:cohort    -  GET > code for a specific cohort for a logged school
http://localhost:3000/cohort/getCohort          -  GET > get all cohorts for a logged school
http://localhost:3000/cohort/getData            -  GET > Get job applications data by cohort from jobseekers agreed to share with their school

*/


/********************
 * COHORT - Create  *
 *******************/
router.post("/create", validateSchoolSession, function(req, res){
    //invit code
    let invitcode = generateCode();

    Cohort.create({
        cohort: req.body.cohort,
        invitcode: invitcode,
        schoolid: req.school.id
    })
    .then((cohort) => {
        res.status(200).json({
            cohort: cohort,
            message: "New cohort created."
        })
    })
.catch((err) => res.status(500).json({ error: err }));
})

// Generate invitation code when school registers
// this will be used by jobseekers and cohort tables
function generateCode(){
    // var crypto = require("crypto");
    // var code = crypto.randomBytes(3).toString("hex").toUpperCase();

    var code = Math.random().toString(36).replace('0.', '').substr(0,6).toUpperCase();
    return code;
}

/********************
 * COHORT - Delete  *
 *******************/
router.delete('/delete/:id', validateSchoolSession, (req,res) => {
    const query = { where: { id: req.params.id, schoolid: req.school.id} };
  
    Cohort.destroy(query)
    .then((response) => res.status(200).json({ message: response > 0 ?  " Cohort Removed": "Removing cohort failed."}))
    .catch((err) => res.status(500).json({error: err}));
  });


/**********************
 * COHORT - Get code  *
 *********************/
 router.get('/getCode/:cohort', validateSchoolSession, function(req,res) {
    let cohort = req.params.cohort;

    Cohort.findOne({
        where: { cohort: cohort, schoolid: req.school.id}
    })
    .then(cohorts => {
        sequelize
        .query(
          `SELECT cohorts.invitcode FROM cohorts WHERE cohorts.cohort = '${cohorts.cohort}'`
        )
        .then(
          ([results, metadata]) => {
            res.status(200).json(results);
          },
          function findAllError(err) {
            res.send(500, err);
          }
        );
    }, function (err){res.send(500, err)})
    .catch(err => res.status(500).json({error: err}))
});


/***************************
 * COHORT - Get cohort  *
 **************************/
 router.get('/getCohort', validateSchoolSession, (req,res) => {
    Cohort.findAll({
        where: {schoolid: req.school.id}
    })
    .then(cohorts => res.status(200).json(cohorts))
    .catch(err => res.status(500).json({error: err}))
})


// /**********************
//  * COHORT - Get data  *
//  *********************/
router.get('/getData/:cohort', validateSchoolSession, function(req,res) {
    let cohort = req.params.cohort;

    Cohort.findOne({
        where: { cohort: cohort, schoolid: req.school.id}
    })
    .then(cohorts => {
        sequelize
        .query(
          `SELECT jobapps.jobtitle, jobapps.company, jobapps.status, jobapps.location 
          FROM jobapps 
          INNER JOIN jobseekers
              on (jobapps.jobseekerid = jobseekers.id) 
          INNER JOIN cohorts
              on (cohorts.invitcode = jobseekers.invitcode) where (cohorts.invitcode = '${cohorts.invitcode}' AND jobseekers.sharedata = true)`
        )
        .then(
          ([results, metadata]) => {
            res.status(200).json(results);
          },
          function findAllError(err) {
            res.send(500, err);
          }
        );
    }, function (err){res.send(500, err)})
    .catch(err => res.status(500).json({error: err}))
});


module.exports = router;

