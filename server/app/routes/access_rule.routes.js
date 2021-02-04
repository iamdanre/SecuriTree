module.exports = function (app) {
  const { authJwt } = require("../middleware");
  const accessrules = require("../controllers/accessrule.controller.js");
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/accessrules",
    [authJwt.verifyToken, authJwt.isAdmin],
    accessrules.findAll
  );
};