const mongoose = require("mongoose");

const AccessRule = mongoose.model(
  "AccessRule",
  new mongoose.Schema({
    _id: String,
    name: String,
    doors: [String]
  })
);

module.exports = AccessRule;