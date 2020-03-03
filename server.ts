"use strict";

import express, { Application } from "express";
import bodyParser from "body-parser";
import expressSession from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import socketIo = require("socket.io");
import winston from "winston";
import expressWsinton from "express-winston";

import sharedSession = require("express-socket.io-session");
import http = require("http");
import sharedsession from "express-socket.io-session";
import { PORT } from "./config/constant";
import { startSocketServer } from "./core/userServerConnection";

const {
  env: { NODE_ENV, SESSION_SECRET, SERVER_GAME_PORT }
} = process;

const session = expressSession({
  secret: "$eCuRiTy",
  resave: true,
  saveUninitialized: false
});

function boot(app: Application, port: string | number) {
  const server = http.createServer(app);

  const io = socketIo.listen(server, {
    pingInterval: 2000,
    pingTimeout: 5000
  });

  io.use(
    sharedsession(session, {
      autoSave: true
    })
  );

  app.set("trust_proxy", 1);
  app.set("max_requests_per_ip", 20);
  app.use(cors());
  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  );
  app.use(
    bodyParser.json({
      limit: "50mb"
    })
  );
  app.use(session, cookieParser("$eCuRiTy"));

  //Log
  const fileLogger = new winston.transports.File({
    level: "info",
    filename: "wsServer.log",
    dirname: "./logs",
    maxsize: 100 * 1024 * 1024,
    maxFiles: 4,
    format: winston.format.combine(
      winston.format.timestamp({
        format: "YYYY-MM-DD hh:mm:ss A ZZ"
      }),
      winston.format.json()
    )
  });

  const Logger = winston.createLogger({
    transports: [fileLogger]
  });

  app.use(
    expressWsinton.logger({
      transports: [new winston.transports.Console()],
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
      )
    })
  );

  server.listen(port, () => {
    startSocketServer(io);
    console.log(`App Listening on port ${port}`);
  });
}

const app = express();
boot(app, PORT);
