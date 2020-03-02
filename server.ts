"use strict";

import express, { Application } from "express";
import bodyParser from "body-parser";
import expressSession from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import net from 'net';

import sharedSession = require("express-socket.io-session");
import http = require("http");
import socketIo = require("socket.io");
import sharedsession from "express-socket.io-session";
import { calcCodeFromHeaders, getclientIp } from "./utils";

const {
  env: { NODE_ENV, WS_PORT, SESSION_SECRET, SERVER_GAME_PORT }
} = process;

const session = expressSession({
  secret: "$eCuRiTy",
  resave: true,
  saveUninitialized: false
});

function boot(app: Application, port: number) {
  const server = http.createServer(app);
  const io = socketIo.listen(server, {
    pingInterval: 2000,
    pingTimeout: 5000
  });

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
  app.use(session, cookieParser(SESSION_SECRET));

  io.use(
    sharedsession(session, {
      autoSave: true
    })
  );

  io.on("connection", socket => {
    socket.on("loginrequest", () => {
      socket.emit("auth", '&!connmsg{"msg":"ready"}!');
    });
    socket.on("registration", () => {});
    socket.on("oob", msg => handleLoginUser(socket, msg));
    socket.on("disconnect", () => {
      // Connection close
    });
  });

  server.listen(port, () => {
    console.log(`App Listening on port ${port}`);
  });
}

function handleLoginUser(socket: socketIo.Socket, msg: any) {
  if (msg["itime"]) {
    let account_id = 0;
    let headers = socket.handshake.headers;
    let codeHeaders = calcCodeFromHeaders(headers);
    let client_ip = getclientIp(headers);
    let codeitime = msg["itime"];
    let clientCode = `${codeitime}-${codeHeaders}`;
  }
}

function connectToGameServer(
  WSocket: socketIo.Socket,
  ipaddress: string,
  itime: string,
  header: any,
  accountId: number
) {
  let port: any = SERVER_GAME_PORT || 7890;
  let tgconn = net.connect({
      port 
  });

  tgconn.on('close', () => {
      //
  })
  tgconn.on('error', () => {
      //
  })
  tgconn.on('end', () => {
      //
  })
  tgconn.on('timeout', () => {
      //
  })
}

// =================

const app = express();
const port = (WS_PORT && Number(WS_PORT)) || 3335;
boot(app, port);
