const db = require("../models");
const Area = db.area;

exports.findAll = (req, res) => {
  Area.find()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "An error occurred while retrieving areas."
      });
    });
};