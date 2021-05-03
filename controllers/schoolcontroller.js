const router = require("express").Router();
const { School, Cohort } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

let validateSchoolSession = (require('../middleware/validateSchoolSession'));

router.post("/test", function (req, res) {
  res.send("School endpoint works");
});


/*
ENDPOINTS:

http://localhost:3000/school/create         -  POST     > Sign up a new school
http://localhost:3000/school/login          -  POST     > Log into an existing school account
http://localhost:3000/school/countAll       -  GET      > nb of school accounts
http://localhost:3000/school/delete         -  DELETE   > delete school
http://localhost:3000/school/changeEmail    -  PATCH    > update email
http://localhost:3000/school/changePwd      -  PATCH    > update password
http://localhost:3000/school/comparePwd     -  POST     > checked password in file and password entered by school to verify identity.
http://localhost:3000/school/getProfile     -  GET      > view profile


*/

/*******************
 * SCHOOL - CREATE *
 ******************/
router.post("/create", function(req, res){
    School.create({
        schoolname: req.body.school.schoolname,
        email: req.body.school.email,
        password: bcrypt.hashSync(req.body.school.password, 13)
    })
    .then((school) => {
        //token
        let schoolToken = jwt.sign({id: school.id}, process.env.JWT_SCHOOL_SECRET, {expiresIn: 60*60*24});

        res.status(200).json({
            school: school,
            message: "School account created.",
            sessionSchoolToken: schoolToken
        })
        
    })
    .catch((err) => res.status(500).json({ error: err }));    
})


/*******************
 * SCHOOL - LOGIN  *
 ******************/
 router.post("/login", function(req, res){
    School.findOne({
        where: { email:req.body.school.email}
    })
    .then((school) => {
        if(school) {
            bcrypt.compare(req.body.school.password, school.password, function(err, matches) {
                if(matches){
                    let schoolToken = jwt.sign({id: school.id}, process.env.JWT_SCHOOL_SECRET, {expiresIn: 60*60*24});

                    res.status(200).json({
                        school: school,
                        message: "School successfully logged in.",
                        sessionSchoolToken: schoolToken
                    })
                } else {
                    res.status(502).send({error: "Login failed"});
                }
        });
        } else {
            res.status(500).json({ error: "School does not exist" })
        }
    })
    .catch((err) => res.status(500).json({ error: err }));
})




/*****************
 * SCHOOL - All  *
 ****************/
 router.get('/countAll', (req,res) => {
    School.count()
    .then(nbSchool => res.status(200).json(nbSchool))
    .catch(err => res.status(500).json({error: err}))
})


/********************
 * SCHOOL - Delete  *
 *******************/
 router.delete('/delete', validateSchoolSession, (req,res) => {
    const query = { where: { id: req.school.id } };
  
    School.destroy(query)
    .then((response) => res.status(200).json({ message: response > 0 ?  " School account deleted": "Deletion school failed."}))
    .catch((err) => res.status(500).json({error: err}));
  });


 /*******************************
 * SCHOOL - Change email  *
 ******************************/
 router.patch('/changeEmail', validateSchoolSession, (req,res) => {
    const updateProfile = {
        email: req.body.school.email
  };
  
  const query = { where: { id: req.school.id} };
  
  School.update(updateProfile, query)
  .then((profile) => res.status(200).json({
      message: profile > 0? "Email updated!" : "Email could not be updated."})
  )
  .catch((err) => res.status(500).json({error: err}));
  })


 /********************************
 * SCHOOL - modify password  *
 *******************************/
 router.patch('/changePwd', validateSchoolSession, (req,res) => {
    const updateProfile = {
          password: bcrypt.hashSync(req.body.school.password, 13)
    };
    
    const query = { where: { id: req.school.id} };
    
    School.update(updateProfile, query)
    .then((profile) => res.status(200).json({
        message: profile > 0? "Password updated!" : "Password could not be updated."})
    )
    .catch((err) => res.status(500).json({error: err}));
    })

 /********************************
 * SCHOOL - confirm password    *
 *******************************/
 router.post('/comparePwd', validateSchoolSession, (req,res) => {
    School.findOne({
        where: { id: req.school.id }
    })
    .then((school) => {
        if(school) {
            bcrypt.compare(req.body.school.password, school.password, function(err, matches) {
                if(matches){
                    res.status(200).json({
                        message: "Passwords matched"
                    })
                } else {
                    res.status(502).send({error: "Wrong password"});
                }
        });
        } else {
            res.status(500).json({ error: "School does not exist" })
        }
    })
    .catch((err) => res.status(500).json({ error: err }));
})


/****************************
 * SCHOOL - GET Profile  *
 ***************************/
 router.get('/getProfile', validateSchoolSession, (req,res) => {
    School.findOne({
        where: { id: req.school.id }
    })
    .then(profile => res.status(200).json(profile))
    .catch(err => res.status(500).json({error: err}))
})

module.exports = router;