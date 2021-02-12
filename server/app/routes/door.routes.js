module.exports = function (app) {
  const { authJwt } = require("../middleware");
  const doors = require("../controllers/door.controller.js");
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/doors",
    [authJwt.verifyToken, authJwt.isAdmin],
    doors.findAll
  );

  app.put(
    "/api/door/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    doors.update
  );
};