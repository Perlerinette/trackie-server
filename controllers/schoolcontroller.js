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

http://localhost:3000/school/create         -  POST > Sign up a new school
http://localhost:3000/school/login          -  POST > Log in a school
http://localhost:3000/school/all            -  GET  > nb of school accounts


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



module.exports = router;