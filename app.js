require("dotenv").config();
let express = require('express');
var cors = require('cors');
let app = express();
let db = require('./db');


// to avoid CORS policy error
// app.use(require('./middleware/headers'));
app.use(cors());

// import controllers
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
.then(() =>  app.listen(process.env.PORT, () => {
    console.log(`[server]: App is listening on port ${process.env.PORT}`);
  })
)
.catch((e) => {
  console.log("[server]: Server Crashed");
  console.log(e);
});