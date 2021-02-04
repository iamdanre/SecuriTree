const db = require("../models");
const Door = db.door;

exports.findAll = (req, res) => {
  Door.find()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "An error occurred while retrieving doors."
      });
    });
};

// todo: put controllers for findOne and findOneAndUpdate here