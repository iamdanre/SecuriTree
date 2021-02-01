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

// connect to MongoDB
db.mongoose
  .connect(`mongodb+srv://${dbConfig.USERNAME}:${dbConfig.PASSWORD}@cluster0.nwkkw.mongodb.net/${dbConfig.DB}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to database.");
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

// setting port to listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API server is running on port ${PORT}.`);
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
    else{
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
            //console.log(element)
            let user = new User({
              username: element.username,
              first_name: element.first_name,
              surname: element.surname,
              roles: [role._id],
              password: bcrypt.hashSync(element.password, 8),
            });
            user.save();
            console.log("Registered user: ", element.username);
          });
        }
        else{
          console.log("There are already users in the database");
        }
      })
    });
  });
}
