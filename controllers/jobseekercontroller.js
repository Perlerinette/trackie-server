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

http://localhost:3000/jobseeker/create          -  POST  > creates new account
http://localhost:3000/jobseeker/login           -  POST  > log into account
http://localhost:3000/jobseeker/getProfile      -  GET   > view profile
http://localhost:3000/jobseeker/addCode         -  PATCH > add an invitation code after sign-up or modify it.
http://localhost:3000/jobseeker/changeSharing   -  PATCH > option to share or not job app information
http://localhost:3000/jobseeker/changeEmail     -  PATCH > update email
http://localhost:3000/jobseeker/changePwd       -  PATCH > update password
http://localhost:3000/jobseeker/countAll        -  GET   > nb of jobseekers accounts
http://localhost:3000/jobseeker/delete          -  DELETE   > delete job seeker account

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


/*************************
 * JOBSEEKER - add code  *
 ************************/
 router.patch('/addCode', validateJobseekerSession, (req,res) => {
    const addCode = {
        invitcode: req.body.jobseeker.invitcode
  };
  
  const query = { where: { id: req.jobseeker.id} };
  
  Jobseeker.update(addCode, query)
  .then((profile) => res.status(200).json({
      message: profile > 0? "New code entered!" : "Code could not be saved."})
  )
  .catch((err) => res.status(500).json({error: err}));
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


/********************************
 * JOBSEEKER - confirm password *
 *******************************/
 router.post('/comparePwd', validateJobseekerSession, (req,res) => {
    Jobseeker.findOne({
        where: { id: req.jobseeker.id }
    })
    .then((jobseeker) => {
        if(jobseeker) {
            bcrypt.compare(req.body.jobseeker.password, jobseeker.password, function(err, matches) {
                if(matches){
                    res.status(200).json({
                        message: "Passwords matched"
                    })
                } else {
                    res.status(502).send({error: "Wrong password"});
                }
        });
        } else {
            res.status(500).json({ error: "Job seeker does not exist" })
        }
    })
    .catch((err) => res.status(500).json({ error: err }));
})


/********************
 * JOBSEEKER - All  *
 *******************/
 router.get('/countAll', (req,res) => {
    Jobseeker.count()
    .then(nbSeeker => res.status(200).json(nbSeeker))
    .catch(err => res.status(500).json({error: err}))
})


/***********************
 * JOBSEEKER - Delete  *
 **********************/
 router.delete('/delete', validateJobseekerSession, (req,res) => {
    const query = { where: { id: req.jobseeker.id } };
  
    Jobseeker.destroy(query)
    .then((response) => res.status(200).json({ message: response > 0 ?  " Account deleted": "Deletion account failed."}))
    .catch((err) => res.status(500).json({error: err}));
  });



module.exports = router;