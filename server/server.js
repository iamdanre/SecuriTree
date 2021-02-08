const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");

const app = express();

// this enables CORS
var corsOptions = {
  origin: "http://localhost:8081"
};
app.use(cors(corsOptions));

// use body-parser to parse requests of content-type - application/json
app.use(bodyParser.json());

// use body-parser to parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;
const User = db.user;
const AccessRule = db.access_rule;
const Area = db.area;
const Door = db.door;

// connect to MongoDB
db.mongoose
  .connect(`mongodb+srv://${dbConfig.USERNAME}:${dbConfig.PASSWORD}@cluster0.nwkkw.mongodb.net/${dbConfig.DB}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to database.");
    // if "setup" is passed in as program argument
    if (process.argv[2] === "setup") {
      setupDb();
    }
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "SecuriTree API server." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/access_rule.routes")(app);
require("./app/routes/area.routes")(app);
require("./app/routes/door.routes")(app);

// setting port to listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`SecuriTree API server is running on port ${PORT}.`);
});

// initial setup, populates the database with files from setup directory if program argument 'setup' is passed in
function setupDb() {
  var bcrypt = require("bcryptjs");
  const userData = require('./setup/registered_users');
  const systemData = require('./setup/system_data');

  console.log("Populating database...");
  // create user roles
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("Added 'admin' to roles collection");
      });

      new Role({
        name: "user"
      }).save((err,) => {
        if (err) {
          console.log("error", err);
        }
        console.log("Added 'user' to roles collection");
      });
    }
    else {
      console.log("There are already roles in the database");
    }
  }).then(() => {
    // register users
    Role.findOne({ name: "admin" }, (err, role) => {
      if (err) {
        console.log("error", err);
        return;
      }
      User.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
          userData.registered_users.forEach((element) => {
            let user = new User({
              username: element.username,
              first_name: element.first_name,
              surname: element.surname,
              roles: [role._id],
              password: bcrypt.hashSync(element.password, 8),
            });
            user.save();
            console.log("Registered user: ", element.username, " with role 'admin'");
          });
        }
        else {
          console.log("There are already users in the database");
        }
      });
    });
  });
  // add areas
  const areas = systemData.system_data.areas;
  Area.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      areas.forEach((element) => {
        let area = new Area({
          _id: element.id,
          name: element.name,
          parent_area: element.parent_area,
          child_area_ids: element.child_area_ids
        });
        area.save();
        console.log("Added area: ", element.name);
      });
    }
    else {
      console.log("There are already areas in the database");
    }
  })
  // add doors
  const doors = systemData.system_data.doors;
  Door.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      doors.forEach((element) => {
        let door = new Door({
          _id: element.id,
          name: element.name,
          parent_area: element.parent_area,
          status: element.status
        });
        door.save();
        console.log("Added door: ", element.name);
      });
    }
    else {
      console.log("There are already doors in the database");
    }
  })
  // add access rules
  const accessRules = systemData.system_data.access_rules;
  AccessRule.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      accessRules.forEach((element) => {
        let access_rule = new AccessRule({
          _id: element.id,
          name: element.name,
          doors: element.doors
        });
        access_rule.save();
        console.log("Added access rule: ", element.name);
      });
    }
    else {
      console.log("There are already access rules in the database");
    }
  })
}
