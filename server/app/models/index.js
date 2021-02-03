const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.access_rule = require("./access_rule.model");
db.area = require("./area.model");
db.door = require("./door.model");

db.ROLES = ["admin", "user"];

module.exports = db;