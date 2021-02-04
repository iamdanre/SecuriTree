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

  // todo: put route for doors/_id here (get)
  // todo: put route for update here (fetch/put)
};