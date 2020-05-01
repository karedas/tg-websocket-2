import dotenv from "dotenv";
dotenv.config();

const result = dotenv.config();
if (result.error) {
  throw result.error;
}

export const config = {
  game_host: process.env.SERVER_GAME_HOST,
  game_port: process.env.SERVER_GAME_PORT,
  ws_host: process.env.WS_HOST,
  ws_port: process.env.WS_PORT,
  api_port: process.env.API_PORT,
  mailserver: {
    host: process.env.MAILSERVER_HOST,
    port: process.env.PORT,
    auth: {
      user: process.env.MAILSERVER_USER,
      pass: process.env.MAILSERVER_PWD,
    },
    debug: process.env.NODE_ENV ? true : false,
    logger: process.env.NODE_ENV ? true : false
  },
};
