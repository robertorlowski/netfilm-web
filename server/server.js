"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const PORT = 9000;
var fs = require("fs");
var path = require("path");
var https = require("https");
console.log(__dirname);
var server = https
    .createServer({
    key: fs.readFileSync(path.join(__dirname, "server.key")),
    cert: fs.readFileSync(path.join(__dirname, "server.cert")),
}, app_1.default.express)
    .listen(PORT, () => {
    console.log("Express server listening on port " + PORT);
});
process.on("SIGTERM", () => {
    console.info("SIGTERM signal received.");
    console.log("Closing http server.");
    server.close(() => {
        app_1.default.closeConnection();
    });
});
//# sourceMappingURL=server.js.map