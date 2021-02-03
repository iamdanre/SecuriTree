const mongoose = require("mongoose");

const Area = mongoose.model(
  "Area",
  new mongoose.Schema({
    id: String,
    name: String,
    parent_area: String,
    child_area_ids: [String]
  })
);

module.exports = Area;