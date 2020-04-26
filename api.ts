import expressSession from "express-session";
import winston from "winston";
import express, { Application } from "express";



const {
  env: { NODE_ENV, API_PORT, SESSION_SECRET }
} = process;

console.log(API_PORT)


const session = expressSession({
  secret: "$eCuRiTy",
  resave: true,
  saveUninitialized: false
});

/**
 * Logging configuration.
 */
const fileLogger = new winston.transports.File({
  level: 'info',
  filename: 'thegateway-api',
  dirname: './logs',
  maxsize: 100 * 1024 * 1024,
  maxFiles: 4,
});

function boot(app: Application, port: number) {
  app.set('port', process.env.API_PORT);
  app.set('max_requests_per_ip', 20);
  app.set('client_url', process.env.CLIENT_URL);
}

// =================
const app = express();
const port = (API_PORT && Number(API_PORT)) || 3335;
boot(app, port);
