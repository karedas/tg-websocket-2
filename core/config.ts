// import dotenv from "dotenv";
// dotenv.config();

// const result = dotenv.config();
// if (result.error) {
//   throw result.error;
// }

export const config = {
  game_host: process.env.SERVER_GAME_HOST,
  game_port: process.env.SERVER_GAME_PORT,
  ws_host: process.env.WS_HOST,
  ws_port: process.env.WS_PORT,
  api_port: process.env.API_PORT,
  mailserver: {
    from: "staff@thegatemud.it",
    host: process.env.API_NODEMAILER_SMTP,
    port: +process.env.API_NODEMAILER_PORT,
    auth: {
      user: process.env.API_NODEMAILER_USER,
      pass: process.env.API_NODEMAILER_PASS,
    },
    debug: process.env.NODE_ENV ? true : false,
    logger: process.env.NODE_ENV ? true : false,
  },
};
