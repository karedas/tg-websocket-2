import net from "net";
import { calcCodeFromHeaders, getclientIp } from "../utils";
import socketIo = require("socket.io");
import { PORT, SERVER_PORT } from "../config/constant";

export const startSocketServer = (io: socketIo.Server) => {
  io.on("connection", userConnection);
};

export const userConnection = (socket: socketIo.Socket) => {
  socket.on("loginrequest", _ => {
    socket.emit("auth", '&!connmsg{"msg":"ready"}!');
  });
  socket.on("registration", () => {}); //todo
  socket.on("oob", (socket, msg) => handleLoginRequest);
};

export const handleLoginRequest = (socket: socketIo.Socket, msg: any) => {
  if (msg["itime"]) {
    const account_id = 0;
    const headers = socket.handshake.headers;
    const codeHeaders = calcCodeFromHeaders(headers);
    const clientIpAddress = getclientIp(headers);
    const codeitime = msg["itime"];
    const clientCode = `${codeitime}-${codeHeaders}`;

    const tgconn = connectToGameServer(
      socket,
      account_id,
      codeHeaders,
      clientIpAddress,
      codeitime,
      clientCode
    );

    socket.on("disconnect", () => {
      tgconn.destroy();
    });
  }
};


export const connectToGameServer = (
  socket: socketIo.Socket,
  accountId: number,
  codeHeaders: any,
  clientIpAddress: string,
  codeitime: string,
  clientCode: string
): net.Socket => {
  const tgconn = net.connect(SERVER_PORT);

  tgconn.on("close", () => {
    socket.disconnect();
  });
  tgconn.on("error", () => {
    sendToClient('&!connmsg{"msg":"serverdown"}!');
    socket.disconnect();
  });
  tgconn.on("end", () => {
    socket.disconnect();
  });
  tgconn.on("timeout", () => {
    socket.disconnect();
  });

  const handshake = (msg: string) => {
    if (msg.toString().indexOf("Vuoi i codici ANSI") !== -1) {
      tgconn.removeListener("data", handshake);
      tgconn.on("data", sendToClient);
      socket.on("data", sendToServer);

      /** Authorization string client-server to auth character **/
      sendToServer(
        `WEBCLIENT(${clientIpAddress},${codeitime}-${codeHeaders},${accountId})\n`
      );
    } else {
      sendToClient(msg);
    }
  };

  const sendToClientLoggedIn = (msg: string) => {
    socket.emit("data", msg.toString());
  };

  const sendToClient = (msg: string) => {
	if (msg.toString().indexOf('loginok') != -1) {
		tgconn.removeListener('data', sendToClient);
		tgconn.on('data', sendToClientLoggedIn);
		socket.emit('auth', msg.toString());
	} else {
		socket.emit('data', msg.toString());
	}
  };

  const sendToServer = (msg: string) => {
	  tgconn.write(msg + '\n');
  };

  const closeConnection = () => {
	  socket.disconnect();
  }

  tgconn.on("data", handshake);
  return tgconn;
};
//   return tgconn;

// export const handshake = () => {
// tgconn.on('data', (data: string) => {
// if(data.toString().indexOf("Vuoi i codici ANSI") !== -1) {
// }
// })

// }

// export const destroyServerConnection = () => {};
// export const  userServerConnection = (socket: SocketIO.Adapter) => {
//     socket.on("loginrequest", () => {
//         socket.emit("auth", '&!connmsg{"msg":"ready"}!');
//       });
//       socket.on("registration", () => {});
//       socket.on("oob", msg => handleLoginUser(socket, msg));
//       socket.on("disconnect", () => {
//         // Connection close
//       });
// }

// this.socket = socketIo.listen()
//   io.on("connection", socket => {
//     userServerConnection(socket);
//   });

// setSocketEvents () {
//     socket.on("loginrequest", () => {
//         socket.emit("auth", '&!connmsg{"msg":"ready"}!');
//       });
//       socket.on("registration", () => {});
//       socket.on("oob", msg => handleLoginUser(socket, msg));
//       socket.on("disconnect", () => {
//         // Connection close
//       });
// }
// }

// function handleLoginUser(socket: , msg: any) {
//     if (msg["itime"]) {
//       let account_id = 0;
//       let headers = socket.handshake.headers;
//       let codeHeaders = calcCodeFromHeaders(headers);
//       let client_ip = getclientIp(headers);
//       let codeitime = msg["itime"];
//       let clientCode = `${codeitime}-${codeHeaders}`;
//     }
//   }

//   function connectToGameServer(
//   ) {
//     let port: any = SERVER_GAME_PORT || 7890;
//     let tgconn = net.connect({
//         port
//     });

//     tgconn.on('close', () => {
//         //
//     })
//     tgconn.on('error', () => {
//         //
//     })
//     tgconn.on('end', () => {
//         //
//     })
//     tgconn.on('timeout', () => {
//         //
//     })
//   }
