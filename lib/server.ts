import app from "./app";

const PORT = 9000;
var fs = require("fs");
var path = require("path");
var https = require("https");
var http = require("http");

console.log(__dirname);
/*
var server = https
  .createServer(
    {
      key: fs.readFileSync(path.join(__dirname, "server.key")),
      cert: fs.readFileSync(path.join(__dirname, "server.cert")),
    },

    app.express
  )
  .listen(PORT, () => {
    console.log("Express server listening on port " + PORT);
  });
*/
var server = http.createServer(app.express).listen(PORT, () => {
  console.log("Express server listening on port " + PORT);
});

process.on("SIGTERM", () => {
  console.info("SIGTERM signal received.");
  console.log("Closing http server.");
  server.close(() => {
    app.closeConnection();
  });
});
