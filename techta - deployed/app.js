var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  passportLocalMongoose = require("passport-local-mongoose"),
  User = require("./models/user"), // user model
  methodOverride = require("method-override");

const db_password = "techta123qwerty";
const db = "techta_user_db";
const ADMIN_CODE = "t3cht@_@DM!N";

/*
whenever there is a form, install body-parser package using npm install
and require it here
*/
var bodyParser = require("body-parser");

// tell you app to use bodyParser
app.use(bodyParser.urlencoded({ extended: true }));

const path = require('path');
const axios = require('axios');

// static assets, use all the static assets in methods-public folder
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

// var url = `mongodb+srv://techta:${db_password}@techta.a42z2.mongodb.net/${db}?retryWrites=true&w=majority`;
var url = `mongodb://techta:${db_password}@techta-shard-00-00.a42z2.mongodb.net:27017,techta-shard-00-01.a42z2.mongodb.net:27017,techta-shard-00-02.a42z2.mongodb.net:27017/${db}?ssl=true&replicaSet=atlas-ko607z-shard-0&authSource=admin&retryWrites=true&w=majority`;
mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to DB!");
  })
  .catch((err) => {
    console.log("ERROR:", err.message);
  });

app.use(methodOverride("_method"));

/*PASSPORT CONFIGURATION*/
app.use(
  require("express-session")({
    // options
    secret: "FIT2101 TechTa", // to encode and decode the session information
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  // res.locals - whatever is available inside our templates
  // this is a middleware that will run for every route
  res.locals.currentUser = req.user;
  res.locals.loginError = "";
  res.locals.signUpError = "";
  // then move to the actual next code
  next();
});

// main routes
app.get("/", (req, res) => {
  res.render("index", { showModal: false });
});

app.get("/adminDashboard", adminDashboardCheck, (req, res) => {
  User.find({}, function (err, allUsers) {
    if (err) {
      console.log(err);
    } else {
      let noOfVisitors = allUsers.length;
      let noOfVisits = 0;
      for (let i in allUsers) {
        noOfVisits += allUsers[i].visitsNo;
      }
      res.render("admin_dashboard", {
        noOfVisits: noOfVisits,
        noOfVisitors: noOfVisitors,
        allUsers: allUsers,
      });
    }
  });
});

app.put("/users/:user_id", function (req, res) {
  User.findByIdAndUpdate(
    req.params.user_id,
    [{ $set: { isAdmin: { $eq: [false, "$isAdmin"] } } }],
    function (err, user) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/adminDashboard");
      }
    }
  );
});

//  ===========
//  AUTH ROUTES
//  ===========

//handle sign up logic
app.post("/register", function (req, res) {
  if (req.body.password == req.body.confirmPassword) {
    if (req.body.password.length >= 6) {
      var newUser = new User({
        username: req.body.username,
        email: req.body.email,
        phoneNum: req.body.countryCode + req.body.phoneNum,
      });
      if (req.body.adminCode.length > 0) {
        if (req.body.adminCode === ADMIN_CODE) {
          newUser.isAdmin = true;
        } else {
          let error_message =
            "Invalid admin code - Please leave the admin code field blank if you are not the admin";
          res.render("index", { showModal: true, signUpError: error_message });
        }
      }
      User.register(newUser, req.body.password, function (err, user) {
        if (err) {
          let error_message = err.message;
          if (err.message.includes("email")) {
            error_message = "A user with the given email is already registered";
          }
          res.render("index", { showModal: true, signUpError: error_message });
        } else {
          passport.authenticate("local")(req, res, function () {
            res.redirect("/");
          });
        }
      });
    } else {
      res.render("index", {
        showModal: true,
        signUpError: "Password must be at least 6 characters long",
      });
    }
  } else {
    res.render("index", {
      showModal: true,
      signUpError: "Password and confirm password do not match",
    });
  }
});

// handling login logic
app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/",
  }),
  function (req, res) {
    User.findOneAndUpdate(
      { username: req.user.username },
      { $set: { lastLogin: Date.now() }, $inc: { visitsNo: 1 } },
      { new: true },
      (err, data) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully updated the lastLogin", data);
        }
        res.redirect("/");
      }
    );
  }
);

// logout route
app.get("/logout", function (req, res) {
  req.logout();
  // req.flash("success", "See you soon!");
  res.redirect("/");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.render("index", { showModal: true });
}

function adminDashboardCheck(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) {
      return next();
    }
  }
  res.redirect("/");
}

/**
 * COVID-19 Stats for a specific country for front-end to plot graph.
 * Usage: front-end query (HTTP GET) '/data/:countryName/:startDate/:endDate' and processed data will be returned as a JSON object.
 * JSON format please refer to google sheet.
 */
app.get('/data/:countryName/:startDate/:endDate', (req, res) => {
  // data for a specific country (returns confirmed, death cases for each day in input time series)
  // Assumption : start & end date in form yyyy-mm-dd; caseType is one of : confirmed, deaths ("recovered" not working)
  const { countryName, startDate, endDate }  = req.params
  const countryISO2 = getCountryISO2(countryName);
  const startDateObj = parseDateYYYYMMDD(startDate);
  const endDateObj = parseDateYYYYMMDD(endDate);
  const previousDayStr = dateObjToStr(getPreviousDay(startDateObj));
  const REQUEST_URL = `https://disease.sh/v3/covid-19/historical/${countryISO2}?lastdays=all`;

  axios.get(REQUEST_URL)
  .then(function (resp) {
    const timeline = resp.data["timeline"];
    let confirmedDate = [], confirmedCases = [], deathDate = [], deathCases = [];

    function getResultByCaseType(caseType, bufferArrayKey, bufferArrayValue) {
      // caseType is one of : "cases", "deaths"
      // append to bufferArray the number of cases by each day
      let previousDayTotalCases = timeline[caseType][previousDayStr];
      let currentDate = new Date(startDateObj.getTime());
      
      while (currentDate <= endDateObj) {
        let key = dateObjToStr(currentDate);
        // [ [date1, cases1], [date2, cases2] ... ]
        bufferArrayKey.push(key);
        bufferArrayValue.push(timeline[caseType][key] - previousDayTotalCases);
        previousDayTotalCases = timeline[caseType][key];
        currentDate = getNextDay(currentDate);
      }
    }

    // retrieving confirmed cases
    getResultByCaseType("cases", confirmedDate, confirmedCases);

    // retrieving death cases
    getResultByCaseType("deaths", deathDate, deathCases);

    let resultObj = {"Country":countryName, 
                     "Confirmed":[confirmedDate, confirmedCases],
                     "Deaths":[deathDate, deathCases]};
    return resultObj;
  })
  .then((resultObj) => {
    const REQUEST_URL = `https://disease.sh/v3/covid-19/vaccine/coverage/countries/${countryISO2}?lastdays=all&fullData=false`;
    
    axios.get(REQUEST_URL)
    .then(resp => {
      const timeline = resp.data["timeline"];
      let vaccinationDate = [], vaccination = [];
      let currentDate = new Date(startDateObj.getTime());

      while (currentDate <= endDateObj) {
        let key = dateObjToStr(currentDate);
        vaccination.push(timeline[key]);  // vaccination = 1 dose number + 2 dose number
        vaccinationDate.push(key);
        currentDate = getNextDay(currentDate);
      }

      resultObj["Vaccination"] = [vaccinationDate, vaccination];
      res.json(resultObj);
    })
    .catch(err => {
      console.log(err);
    });
  })
  .catch(function (err) {
    console.log(err);
    res.send("something went wrong");
  })
})

/**
 * COVID-19 Stats by continent for front-end to plot graph.
 * Usage: front-end query (HTTP GET) 'localhost:5000/data/continents' and processed data will be returned as a JSON object.
 * JSON format please refer to google sheet.
 */
app.get('/data/continents', (req, res) => {
  const REQUEST_URL = "https://disease.sh/v3/covid-19/continents"
  axios.get(REQUEST_URL)
  .then(function (resp) {
    let totalTested = [], totalCases = [], totalDeath = [], totalRecovered = [];
    let totalActive = [], totalCritical = [], deathPerMillion = [], recoveredPerMillion = [];
    let continents = [];

    const RESULT_DATA_ORDER = ["North America", "Australia-Oceania", "South America", "Europe", "Africa", "Asia"];
    const NUMBER_OF_CONTINENTS = RESULT_DATA_ORDER.length;
    let pushedCount = 0;
    while (pushedCount < NUMBER_OF_CONTINENTS) {
      for (let i = 0; i < resp.data.length; i++) {
        const continentData = resp.data[i];
        if (continentData["continent"] === RESULT_DATA_ORDER[pushedCount]) {
          // must follow the order (by continent) of return data (defined above)
          continents.push(continentData["continent"]);
          totalTested.push(continentData["tests"]);
          totalCases.push(continentData["cases"]);
          totalDeath.push(continentData["deaths"]);
          totalRecovered.push(continentData["recovered"]);
          totalActive.push(continentData["active"]);
          totalCritical.push(continentData["critical"]);
          deathPerMillion.push(continentData["deathsPerOneMillion"]);
          recoveredPerMillion.push(continentData["recoveredPerOneMillion"]);

          pushedCount++;
        }
      }
    }

    let resultObj = {
      "continents":continents,
      "totalTested":totalTested,
      "totalCases":totalCases,
      "totalDeath":totalDeath,
      "totalRecovered":totalRecovered,
      "totalActive":totalActive,
      "totalCritical":totalCritical,
      "deathPerMillion":deathPerMillion,
      "recoveredPerMillion":recoveredPerMillion
    };
    
    res.json(resultObj);
  })
  .catch(function (err) {
    console.log(err);
    res.send("something went wrong");
  })
})

/**
 * COVID-19 Stats for all countries for front-end to plot graph.
 * Usage: front-end query (HTTP GET) 'localhost:5000/data/global' and processed data will be returned as a JSON object.
 * JSON format please refer to google sheet.
 */
app.get('/data/global', (req, res) => {
  const REQUEST_URL = "https://disease.sh/v3/covid-19/countries";
  let countryName = [], lngLat = [], totalCases = [], totalRecovered = [], totalDeath = [];

  axios.get(REQUEST_URL)
  .then(resp => {
    for (const countryData of resp.data) {
      countryName.push(countryData["country"]);
      lngLat.push([countryData["countryInfo"]["long"], countryData["countryInfo"]["lat"]]);
      totalCases.push(countryData["cases"]);
      totalRecovered.push(countryData["recovered"]);
      totalDeath.push(countryData["deaths"]);
    }

    let resultObj = {
      "countryName":countryName,
      "lngLat":lngLat,
      "totalCases":totalCases,
      "totalRecovered":totalRecovered,
      "totalDeath":totalDeath
    };

    res.json(resultObj);
  })
  .catch(function (err) {
    console.log(err);
    res.send("something went wrong");
  })
})

/**
 * Return the top five countries by total covid-19 cases.
 * Usage: front-end query (HTTP GET) 'localhost:5000/data/top5' and processed data will be returned as a JSON object.
 * JSON format please refer to google sheet.
 */
app.get('/data/top5', (req, res) => {
  const REQUEST_URL = "https://disease.sh/v3/covid-19/countries";
  const HOW_MANY_COUNTRIES = 5;
  let topFiveCountriesByCases = new Array(HOW_MANY_COUNTRIES), topFiveCases = new Array(HOW_MANY_COUNTRIES);
  
  // initialise both arrays with placholder values
  topFiveCountriesByCases.fill("placeholder_countries");
  topFiveCases.fill(-1);

  axios.get(REQUEST_URL)
  .then(resp => {
    for (const countryData of resp.data) {
      for (let i = 0; i < HOW_MANY_COUNTRIES; i++) {
        if (countryData["cases"] > topFiveCases[i]) {
          topFiveCases.pop();
          topFiveCountriesByCases.pop();
          topFiveCases.splice(i, 0, countryData["cases"]);
          topFiveCountriesByCases.splice(i, 0, countryData["country"]);
          break;
        }
      }
    }

    let resultObj = [topFiveCountriesByCases, topFiveCases]
    res.json(resultObj);
  })
  .catch((err) => {
    console.log(err);
    res.send("something went wrong");
  })
})

app.get('/datasets/covid19', isLoggedIn, (req, res) => {
    res.render("new_analytics", {countriesDataList: countriesDataList});
})

function getCountryISO2(countryName) {
  countryName = countryName.toUpperCase();

  for (let i = 0; i < countriesData.length; i++) {
    if (countriesData[i]["name"].toUpperCase() === countryName) {
      return countriesData[i]["Iso2"];
    } 
  }
  return;
}

function parseDateYYYYMMDD(dateStr){
  // Assume dateStr in the form : yyyy-mm-dd
  let firstDashIndex = dateStr.indexOf("-");
  let secondDashIndex = dateStr.indexOf("-", firstDashIndex + 1);
  // Date constructor (year, month, day)
  return new Date(parseInt(dateStr.slice(0, firstDashIndex)), 
                  parseInt(dateStr.slice(firstDashIndex + 1, secondDashIndex)) - 1, parseInt(dateStr.slice(secondDashIndex + 1, dateStr.length)));
}

function getPreviousDay(dateObj) {
  // given a date, return the previous day
  let newDateObj = new Date(dateObj.getTime());  // avoid privacy leak, clone an object
  newDateObj.setDate(dateObj.getDate() - 1);
  return newDateObj;
}

function getNextDay(dateObj) {
  // given a date, return the next day
  let newDateObj = new Date(dateObj.getTime());  // avoid privacy leak, clone an object
  newDateObj.setDate(dateObj.getDate() + 1);
  return newDateObj;
}

function dateObjToStr(dateObj) {
  // dateObj is an input of type Date().
  // Convert dateObj to its string representation : mm/dd/yy
  return "".concat((dateObj.getMonth() + 1).toString(), 
                    "/", dateObj.getDate().toString(), "/", dateObj.getFullYear().toString().slice(2, 4))
}

// execute the code below when this app.js file is first loaded on server
let countriesData;
let countriesDataList = [];
axios.get("https://countriesnow.space/api/v0.1/countries/iso")
.then(resp => {
  countriesData = resp.data["data"];

  option = "";
  for(let i = 0; i < countriesData.length; i++){
    countriesDataList.push(countriesData[i]["name"]);
  }
})
.catch(err => {
  console.log(err);
})

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log("Server is listening on port 5000....");
});