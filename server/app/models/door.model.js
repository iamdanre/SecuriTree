const mongoose = require("mongoose");

const Door = mongoose.model(
  "Door",
  new mongoose.Schema({
    _id: String,
    name: String,
    parent_area: String,
    status: String
  })
);

module.exports = Door;