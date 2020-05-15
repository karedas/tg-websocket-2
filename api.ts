import expressSession from "express-session";
import winston from "winston";
import expressWinston from "express-winston";
import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";

import { config } from "./core/config";
import router from "./routes";
import path from "path";

const session = expressSession({
  secret: "$eCuRiTy",
  resave: true,
  saveUninitialized: false,
});

/**
 * Logging configuration.
 */
const fileLogger = new winston.transports.File({
  level: "info",
  filename: "thegateway-api",
  dirname: "./logs",
  maxsize: 100 * 1024 * 1024,
  maxFiles: 4,
});

abstract class ApiServer {
  static get port(): number {
    return Number(process.env.API_PORT);
  }

  static boot(): void {
    const app = express();
    const server = http.createServer(app);

    app.use(cors());
    app.set("port", process.env.API_PORT);
    app.set("max_requests_per_ip", 20);
    app.use(
      expressWinston.logger({
        transports: [fileLogger],
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.json()
        ),
        meta: true,
        msg: "HTTP {{res.statusCode}} {{req.method}} {{req.url}}",
        colorize: false,
        expressFormat: true,
      })
    );
    app.use(bodyParser.json());
    app.set("view engine", "ejs");
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use("/api", router);
    app.use(express.static(path.join(__dirname, "public")));

    const clientErrorHandler = (err: any, req: any, res: any, next: any) => {
      if (req.xhr) {
        res.status(500).send({ error: "Something failed!" });
      } else {
        next(err);
      }
    };

    app.use(clientErrorHandler);

    // Start the HTTP server
    server.listen(config.api_port, () => {
      console.log("API server listening on port %d", config.api_port);
    });
  }
}

ApiServer.boot();
