const router = require("express").Router();
const { School } = require("../models");
const jwt = require("jsonwebtoken");

router.post("/test", function (req, res) {
  res.send("School endpoint works");
});


/*
ENDPOINTS:

http://localhost:3000/school/create   -  POST
http://localhost:3000/school/login   -  POST

*/

/*******************
 * SCHOOL - CREATE *
 ******************/
router.post("/create", function(req, res){
    School.create({
        schoolName: req.body.school.schoolName,
        cohort: req.body.school.cohort,
        email: req.body.school.email,
        password: req.body.school.password
    })
    .then((school) => {
        let invitCode = generateCode();
        res.status(200).json({
            school: school,
            message: "New school created.",
            invitCode: invitCode
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
            res.status(200).json({
                school: school,
                message: "School successfully logged in."
            })
        } else {
            res.status(500).json({ error: "School does not exist" })
        }
    })
    .catch((err) => res.status(500).json({ error: err }));
})


// Generate invitation code when school registers
// this will be used by jobseekers and cohort tables
function generateCode(){
    var crypto = require("crypto");
    var code = crypto.randomBytes(3).toString("hex").toUpperCase();

    console.log("invit code: ", code);

    return code;
}




module.exports = router;