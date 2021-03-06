//Initialize server application.
const app = require('./global-functions/setup-application');

console.log("building..");

//setup Socket.
app.io = require('./socket/socket-controller')
app.io.connect(app.db)

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`);
});
