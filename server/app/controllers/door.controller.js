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
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Update data can't be empty"
    });
  }
  const _id = req.params.id;
  Door.findByIdAndUpdate(_id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update door [id = ${id}`
        });
      } else res.send({ message: "Door updated successfully" });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating door [id = " + id + "]"
      });
    });
};