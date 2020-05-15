module.exports = {
  apps: [
    {
      name: "api-tg",
      script: "ts-node", // or locally "./node_modules/.bin/_ts-node"
      args: "api.ts",
      watch: true,
      ignore_watch: ["node_modules", "logs"],
      // new feature; increase restart delay each time after every crash or non reachable db per example
      exp_backoff_restart_delay: 1000,
      //combine multiple err/out logs in one file for each
      combine_logs: true,
      //calls combine logs
      merge_logs: true,
      //error log file path
      error_file: "logs/api_err.log", // better be /var/log
      //out log file path
      out_file: "logs/api_out.log",
      // use time in logs
      time: true,
      env: {
        API_PORT: 3336,
        NODE_ENV: "development",
        SERVER_GAME_HOST: "localhost",
        SERVER_GAME_PORT: 7890,
        WS_HOST: "0.0.0.0",
        WS_PORT: 3335,
        API_NODEMAILER_SMTP: "smtp.mailtrap.io",
        API_NODEMAILER_PORT: 2525,
      },
    },
    // {
    //   name: "server-tg",
    //   script: "ts-node", // or locally "./node_modules/.bin/_ts-node"
    //   args: "server.ts",
    //   watch: true,
    //   ignore_watch: ["node_modules", "logs"],
    //   // new feature; increase restart delay each time after every crash or non reachable db per example
    //   exp_backoff_restart_delay: 100,
    //   //combine multiple err/out logs in one file for each
    //   combine_logs: true,
    //   //calls combine logs
    //   merge_logs: true,
    //   //error log file path
    //   error_file: "logs/server_err.log", // better be /var/log
    //   //out log file path
    //   out_file: "logs/server_out.log",
    //   // use time in logs
    //   time: true,
    //   env: {
    //     API_PORT: 3336,
    //     NODE_ENV: "development",
    //   },
    // },
  ],
};
