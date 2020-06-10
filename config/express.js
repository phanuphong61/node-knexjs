const express = require("express");
const bodypaarser = require("body-parser");
const SocketIO = require("socket.io");
const port = 8080;
module.exports = function () {
  const app = express();
  app.use(bodypaarser.urlencoded({ extended: false }));
  app.use(bodypaarser.json());
  // allow cors
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "*");
    next();
  });
  // allow file
  app.use('/assets/upload/user', express.static('assets/upload/user'))
  // get routes
  require("../app/routes/user.routes")(app);
  require("../app/routes/auth.routes")(app);
  require("../app/routes/assesscontrol.routes")(app);
  require("../app/routes/profile.routes")(app);
  require("../app/routes/role.routes")(app);
  require("../app/routes/groupmenu.routes")(app);
  require("../app/routes/menu.routes")(app);
  require("../app/routes/systemlog.routes")(app);
  require("../app/routes/log.routes")(app);

  const server = app.listen(port, function () {
    console.log('running in port http://localhost:' + port)
  })
  const io = SocketIO.listen(server)
  io.on('connection', function (socket) {
    // connected io success
    console.log('connected : ID =>', socket.id)
    // disconnect
    socket.on('disconnect', function () {
      console.log(' disconnect : ID => ' + socket.id);
    })
    socket.on('sendMessage', (data) => {
      socket.broadcast.emit('sendMessage', data)
    })
  })
  return app;
};
