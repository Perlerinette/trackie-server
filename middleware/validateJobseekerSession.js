const jwt = require('jsonwebtoken');
const { Jobseeker } = require("../models");

const validateJobseekerSession = (req, res, next) => {
    const token = req.headers.authorization;
    // console.log('jobseeker token --> ', token);
    if(!token) {
        return res.status(403).send({auth: false, message:"No token provided"})
    } else {
        jwt.verify(token, process.env.JWT_JOBSEEKER_SECRET, (err,decodeToken) => {
            // console.log('decodeToken -->', decodeToken);
            if(!err && decodeToken) {
                Jobseeker.findOne({
                    where: {
                        id: decodeToken.id
                    }
                })
                .then(jobseeker => {
                    // console.log('jobseeker --> ', jobseeker);
                    if (!jobseeker) throw err;
                    // console.log('req --> ', req);
                    req.jobseeker = jobseeker;
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

module.exports = validateJobseekerSession;