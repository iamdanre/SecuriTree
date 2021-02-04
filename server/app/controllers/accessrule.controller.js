const db = require("../models");
const AccessRule = db.access_rule;

exports.findAll = (req, res) => {
  AccessRule.find()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "An error occurred while retrieving access rules."
      });
    });
};