module.exports = function (app) {
  const { authJwt } = require("../middleware");
  const areas = require("../controllers/area.controller.js");
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/areas",
    [authJwt.verifyToken, authJwt.isAdmin],
    areas.findAll
  );
};