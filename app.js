require("dotenv").config();
let express = require('express');
let app = express();
let db = require('./db');

let cohort = require('./controllers/cohortcontroller');
let school = require('./controllers/schoolcontroller');
let jobseeker = require('./controllers/jobseekercontroller');
let jobapp = require('./controllers/jobappcontroller');

// Parse the body of all requests as JSON
app.use(express.json());

app.use('/school', school);
app.use('/jobseeker', jobseeker);

// Protected routes
app.use('/jobapplication', jobapp);
app.use('/cohort', cohort);


db.authenticate()
// .then(() => db.sync({force: true}))
.then(() => db.sync())
.then(() =>  app.listen(3000, () => {
    console.log(`[server]: App is listening on localhost:3000`);
  })
)
.catch((e) => {
  console.log("[server]: Server Crashed");
  console.log(e);
});