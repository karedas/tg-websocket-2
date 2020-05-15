"use strict";

import { config } from "./core/config";

import express, { Application } from "express";
import bodyParser from "body-parser";
import expressSession from "express-session";
import cors from "cors";
import winston from "winston";
import express_socket_io_session from "express-socket.io-session";
import compression from "compression";

import http = require("http");
import socketIo = require("socket.io");
import { SocketConnection } from "./helpers/socketConnection";
import sharedsession = require("express-socket.io-session");

const session = expressSession({
  secret: "$eCuRiTy",
  resave: true,
  saveUninitialized: false,
});

const consoleLogger = new winston.transports.Console({
  level: "debug",
});

const fileLogger = new winston.transports.File({
  level: "info",
  filename: "tg-access.log",
  dirname: "logs",
  maxsize: 100 * 1024 * 1024,
  maxFiles: 4,
});

const transports =
  process.env.NODE_ENV === "development"
    ? [consoleLogger, fileLogger]
    : [fileLogger];

export const Logger = winston.createLogger({
  transports: transports,
});

const boot = (app: Application, port: string | number) => {
  const server = http.createServer(app);

  const io = socketIo.listen(server, {
    pingInterval: 2000,
    pingTimeout: 5000,
  });

  io.use(
    sharedsession(session, {
      autoSave: true
    })
  );

  app.set("trust_proxy", 1);
  app.set("max_requests_per_ip", 20);
  app.use(cors());
  app.use(compression());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );

  app.use(
    bodyParser.json({
      limit: "50mb",
    })
  );

  socketIo.listen(server, {
    pingInterval: 2000,
    pingTimeout: 5000,
  });

  io.use(
    express_socket_io_session(session, {
      autoSave: true,
    })
  );

  io.on("connection", (socket) => {
    const socketConnection = new SocketConnection(server, socket);
    socketConnection.init();
  });

  server.listen(port, () => {
    console.log(`App Listening on port ${port.toString()}`);
  });
}
// =================

const app = express();
const port = (config.ws_port && Number(config.ws_port)) || 3335;
boot(app, port);
