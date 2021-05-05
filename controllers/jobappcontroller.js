const router = require("express").Router();
const { Jobapp } = require("../models");


var sequelize = require("../db");
let validateJobseekerSession = (require('../middleware/validateJobseekerSession'));

router.post("/test",validateJobseekerSession, function (req, res) {
  res.send("Jobapp endpoint works");
});

/*
ENDPOINTS:

http://localhost:3000/jobapplication/create           -  POST > create new job application
http://localhost:3000/jobapplication/getAll           -  GET  > get all applications of a jobseeker
http://localhost:3000/jobapplication/getOne/:id       -  GET  > get one specific application of a jobseeker
http://localhost:3000/jobapplication/countAll         -  GET  > count all applications of a jobseeker
http://localhost:3000/jobapplication/getData/:group   -  GET  > Get a set of similar data from all the job applications of a jobseeker (e.g: only dates of applications)
http://localhost:3000/jobapplication/edit/:id         -  PUT  > edit/update a specific application of a jobseeker
http://localhost:3000/jobapplication/delete/:id       -  DELETE  > delete a specific application of a jobseeker

*/

/***************************
 * JOBAPPLICATION - CREATE *
 **************************/
 router.post("/create", validateJobseekerSession, function(req, res){
  Jobapp.create({
      jobtitle: req.body.jobapp.jobtitle,
      company: req.body.jobapp.company,
      applicationdate: req.body.jobapp.applicationdate,
      jobdescription: req.body.jobapp.jobdescription,
      location: req.body.jobapp.location,
      status: req.body.jobapp.status,
      jobseekerid: req.jobseeker.id
  })
  .then((jobapp) => {
      res.status(200).json({
          jobapp: jobapp,
          message: "New job application created."
      })
  })
  .catch((err) => res.status(500).json({ error: err }));
})


/****************************
 * JOBAPPLICATION - getAll  *
 ***************************/
 router.get('/getAll', validateJobseekerSession, (req,res) => {
  Jobapp.findAll({
      where: { jobseekerid: req.jobseeker.id }
  })
  .then(jobapps => res.status(200).json(jobapps))
  .catch(err => res.status(500).json({error: err}))
})


/****************************
 * JOBAPPLICATION - getOne  *
 ***************************/
 router.get('/getOne/:id', validateJobseekerSession, (req,res) => {
  Jobapp.findOne({
      where: { id: req.params.id, jobseekerid: req.jobseeker.id }
  })
  .then(jobapp => res.status(200).json(jobapp))
  .catch(err => res.status(500).json({error: err}))
})


/******************************
 * JOBAPPLICATION - countAll  *
 *****************************/
 router.get('/countAll', validateJobseekerSession, (req,res) => {
  Jobapp.count({
    where: { jobseekerid: req.jobseeker.id }
  })
  .then(nbJobapp => res.status(200).json(nbJobapp))
  .catch(err => res.status(500).json({error: err}))
})



/****************************
 * JOBAPPLICATION - getData  *
 ***************************/
 router.get('/getData/:group', validateJobseekerSession, (req,res) => {
   let group = req.params.group;

  Jobapp.findOne({
    where: { jobseekerid: req.jobseeker.id }
  })
  .then(jobapps => {
    console.log(jobapps.group);
    sequelize
        .query(
          `SELECT jobapps.${group} 
          FROM jobapps 
          WHERE jobapps.jobseekerid = '${req.jobseeker.id}'`
        )
        .then(
          ([results, metadata]) => {
            console.log(results);
            res.status(200).json(results);
          },
          function findAllError(err) {
            res.send(500, err);
          }
        );
    })
  .catch(err => res.status(500).json({error: err}))
})


/******************************
 * JOBAPPLICATION - edit  *
 *****************************/
 router.put('/edit/:id', validateJobseekerSession, (req,res) => {
  const updateJobApp = {
    jobtitle: req.body.jobapp.jobtitle,
    company: req.body.jobapp.company,
    applicationdate: req.body.jobapp.applicationdate,
    jobdescription: req.body.jobapp.jobdescription,
    location: req.body.jobapp.location,
    status: req.body.jobapp.status
};

const query = { where: { id: req.params.id, jobseekerid: req.jobseeker.id} };

Jobapp.update(updateJobApp, query)
.then((application) => res.status(200).json({
    message: application > 0? "Job application updated" : "Couldn't update this job application"})
)
.catch((err) => res.status(500).json({error: err}));
})



/****************************
 * JOBAPPLICATION - delete  *
 ***************************/
 router.delete('/delete/:id', validateJobseekerSession, (req,res) => {
  const query = { where: { id: req.params.id, jobseekerid: req.jobseeker.id} };

  Jobapp.destroy(query)
  .then((response) => res.status(200).json({ message: response > 0 ?  " Job application Removed": "Removing application failed."}))
  .catch((err) => res.status(500).json({error: err}));
});


/****************************
 * JOBAPPLICATION - export  *
 ***************************/
// const fastcsv = require("fast-csv");
// const fs = require("fs");


//  router.get('/export, validateJobseekerSession, (req,res) => {

//   const fileName = req.params.filename;
//   console.log(fileName);
//   const ws = fs.createWriteStream(fileName);

//   Jobapp.findAll({
//       where: { jobseekerid: req.jobseeker.id }
//   })
//   .then(jobapps => {
//     // console.log(jobapps);
//     sequelize.connectionManager.getConnection()
//     .then((connection) => {
//         connection.query(
//           `SELECT jobapps.id, jobapps.jobtitle, jobapps.company, jobapps.applicationdate, jobapps.jobdescription, jobapps.location, jobapps.status
//             FROM jobapps 
//             WHERE jobapps.jobseekerid = '${req.jobseeker.id}'`
//         )
//         .then(
//           ([results, metadata]) => {
//             console.log("My job apps ", results);
//             fastcsv
//                 .write(results, { headers: true })
//                 .on("finish", function() {
//                   console.log(`Write to ${fileName} successfully!`);
//                 })
//                 .pipe(ws);
//             res.status(200).json(results);
//             sequelize.connectionManager.releaseConnection(connection);
            
//           },
//           function findAllError(err) {
//             res.send(500).json({error: err});
//           }
//         );
//       })
//   })
//   .catch(err => res.status(500).json({error: err}))
// })


module.exports = router;