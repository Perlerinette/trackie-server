const jwt = require('jsonwebtoken');
const { School } = require("../models");

const validateSchoolSession = (req, res, next) => {
    const token = req.headers.authorization;
    // console.log('school token --> ', token);
    if(!token) {
        return res.status(403).send({auth: false, message:"No token provided"})
    } else {
        jwt.verify(token, process.env.JWT_SCHOOL_SECRET, (err,decodeToken) => {
            // console.log('decodeToken -->', decodeToken);
            if(!err && decodeToken) {
                School.findOne({
                    where: {
                        id: decodeToken.id
                    }
                })
                .then(school => {
                    // console.log('school --> ', school);
                    if (!school) throw err;
                    // console.log('req --> ', req);
                    req.school = school;
                    return next();
                })
                .catch(err => next(err));
            } else {
                req.errors = err;
                return res.status(500).send('Not Authorized');
            }
        });
    }
};

module.exports = validateSchoolSession;