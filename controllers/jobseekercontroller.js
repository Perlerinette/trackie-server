const router = require("express").Router();
const { Jobseeker } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

let validateJobseekerSession = (require('../middleware/validateJobseekerSession'));

router.post("/test", function (req, res) {
  res.send("Jobseeker endpoint works");
});

/*
ENDPOINTS:

http://localhost:3000/jobseeker/create      -  POST
http://localhost:3000/jobseeker/login       -  POST
http://localhost:3000/jobseeker/countAll            -  GET  > nb of jobseekers account

*/

/**********************
 * JOBSEEKER - CREATE *
 *********************/
 router.post("/create", function(req, res){
    Jobseeker.create({
        firstname: req.body.jobseeker.firstname,
        lastname: req.body.jobseeker.lastname,
        email: req.body.jobseeker.email,
        password: bcrypt.hashSync(req.body.jobseeker.password, 13),
        sharedata: req.body.jobseeker.sharedata,
        invitcode: req.body.jobseeker.invitcode
    })
    .then((jobseeker) => {
        //token
        let jobseekerToken = jwt.sign({id: jobseeker.id}, process.env.JWT_JOBSEEKER_SECRET, {expiresIn: 60*60*24});

        res.status(200).json({
            jobseeker: jobseeker,
            message: "New job seeker created.",
            sessionJobseekerToken: jobseekerToken
        })
    })
    .catch((err) => res.status(500).json({ error: err }));
})


/**********************
 * JOBSEEKER - LOGIN  *
 *********************/
 router.post("/login", function(req, res){
    Jobseeker.findOne({
        where: { email:req.body.jobseeker.email}
    })
    .then((jobseeker) => {
        if(jobseeker) {
            bcrypt.compare(req.body.jobseeker.password, jobseeker.password, function(err, matches) {
                if(matches){
                    let jobseekerToken = jwt.sign({id: jobseeker.id}, process.env.JWT_JOBSEEKER_SECRET, {expiresIn: 60*60*24});

                    res.status(200).json({
                        jobseeker: jobseeker,
                        message: "Job seeker successfully logged in.",
                        sessionJobseekerToken: jobseekerToken
                    })
                } else {
                    res.status(502).send({error: "Login failed"});
                }
        });
        } else {
            res.status(500).json({ error: "Job seeker does not exist" })
        }
    })
    .catch((err) => res.status(500).json({ error: err }));
})


/****************************
 * JOBSEEKER - GET Profile  *
 ***************************/
 router.get('/getProfile', validateJobseekerSession, (req,res) => {
    Jobseeker.findOne({
        where: { id: req.jobseeker.id }
    })
    .then(profile => res.status(200).json(profile))
    .catch(err => res.status(500).json({error: err}))
})



/*******************************
 * JOBSEEKER - change sharing  *
 ******************************/
 router.patch('/changeSharing', validateJobseekerSession, (req,res) => {
    const updateProfile = {
        sharedata: req.body.jobseeker.sharedata
  };
  
  const query = { where: { id: req.jobseeker.id} };
  
  Jobseeker.update(updateProfile, query)
  .then((profile) => res.status(200).json({
      message: profile > 0? "Sharing option updated!" : "Sharing option could not be updated."})
  )
  .catch((err) => res.status(500).json({error: err}));
  })

/*******************************
 * JOBSEEKER - change email  *
 ******************************/
 router.patch('/changeEmail', validateJobseekerSession, (req,res) => {
    const updateProfile = {
        email: req.body.jobseeker.email
  };
  
  const query = { where: { id: req.jobseeker.id} };
  
  Jobseeker.update(updateProfile, query)
  .then((profile) => res.status(200).json({
      message: profile > 0? "Email updated!" : "Email could not be updated."})
  )
  .catch((err) => res.status(500).json({error: err}));
  })

/********************************
 * JOBSEEKER - modify password  *
 *******************************/
 router.patch('/changePwd', validateJobseekerSession, (req,res) => {
    const updateProfile = {
        password: bcrypt.hashSync(req.body.jobseeker.password, 13)
  };
  
  const query = { where: { id: req.jobseeker.id} };
  
  Jobseeker.update(updateProfile, query)
  .then((profile) => res.status(200).json({
      message: profile > 0? "Password updated!" : "Password could not be updated."})
  )
  .catch((err) => res.status(500).json({error: err}));
  })


/********************
 * JOBSEEKER - All  *
 *******************/
 router.get('/countAll', (req,res) => {
    Jobseeker.count()
    .then(nbSeeker => res.status(200).json(nbSeeker))
    .catch(err => res.status(500).json({error: err}))
})



module.exports = router;