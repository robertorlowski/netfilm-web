"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const crmRoutes_1 = require("./routes/crmRoutes");
const cors = require("cors");
class App {
    constructor() {
        this.routes = new crmRoutes_1.Routes();
        this.mongodb_url = "mongodb://mfilm:Proste123!@ds229438.mlab.com:29438/mfilm";
        this.express = express();
        this.config().then(() => this.routes.routes(this.express, this.client.db()));
    }
    closeConnection() {
        this.client.close();
    }
    config() {
        return __awaiter(this, void 0, void 0, function* () {
            // support application/json type post data
            this.express.use(bodyParser.json());
            //CORS
            this.express.use(cors());
            //support application/x-www-form-urlencoded post data
            this.express.use(bodyParser.urlencoded({ extended: false }));
            this.express.use(function (req, res, next) {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, API-Key");
                next();
            });
            this.express.use((req, res, next) => {
                const API_KEY = "6fdf6ffc-ed77-94fa-407e-a7b86ed9e59d";
                const apiKey = req.get("API-Key");
                if (!apiKey || apiKey !== API_KEY) {
                    res.status(401).json({ error: "unauthorised" });
                    //next();
                }
                else {
                    next();
                }
            });
            var MongoClient = require("mongodb").MongoClient;
            // Initialize connection once
            const options = {
                useNewUrlParser: true,
                //reconnectTries: 60,
                //reconnectInterval: 1000,
                poolSize: 10,
                bufferMaxEntries: 0,
                useUnifiedTopology: true,
            };
            this.client = yield MongoClient.connect(this.mongodb_url, options);
        });
    }
}
exports.default = new App();
//# sourceMappingURL=app.js.map