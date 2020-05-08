import app from "./app";

const PORT_HTTPS = 9000;
const PORT_HTTP = 9001;

var fs = require("fs");
var path = require("path");
var https = require("https");
var http = require("http");

console.log(__dirname);

http.createServer(app.express).listen(PORT_HTTP, () => {
  console.log("Express server listening on port " + PORT_HTTP);
});

var server = https
  .createServer(
    {
      key: fs.readFileSync(path.join(__dirname, "server.key")),
      cert: fs.readFileSync(path.join(__dirname, "server.cert")),
    },

    app.express
  )
  .listen(PORT_HTTPS, () => {
    console.log("Express server listening on port " + PORT_HTTPS);
  });

process.on("SIGTERM", () => {
  console.info("SIGTERM signal received.");
  console.log("Closing http server.");
  server.close(() => {
    app.closeConnection();
  });
});
