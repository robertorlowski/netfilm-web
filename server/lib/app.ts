import * as express from "express";
import * as bodyParser from "body-parser";
import { Routes } from "./routes/crmRoutes";
import * as cors from "cors";

class App {
  public express: express.Application;
  public routes: Routes = new Routes();
  public db: any;
  private client: any;

  private mongodb_url: String =
    "mongodb://mfilm:Proste123!@ds229438.mlab.com:29438/mfilm";

  constructor() {
    this.express = express();
    this.config().then(() =>
      this.routes.routes(this.express, this.client.db())
    );
  }

  public closeConnection(): void {
    this.client.close();
  }

  private async config() {
    // support application/json type post data
    this.express.use(bodyParser.json());
    //CORS
    this.express.use(cors());
    //support application/x-www-form-urlencoded post data
    this.express.use(bodyParser.urlencoded({ extended: false }));

    this.express.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, API-Key"
      );
      next();
    });

    this.express.use((req, res, next) => {
      const API_KEY: string = "6fdf6ffc-ed77-94fa-407e-a7b86ed9e59d";
      const apiKey = req.get("API-Key");
      if (!apiKey || apiKey !== API_KEY) {
        res.status(401).json({ error: "unauthorised" });
      } else {
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
    this.client = await MongoClient.connect(this.mongodb_url, options);
  }
}

export default new App();
