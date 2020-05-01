import { calcCodeFromHeaders, getclientIp } from "../utils";
import { Logger } from "../server";
import * as net from "net";
import { config } from "../core/config";

const {
  env: { SERVER_GAME_PORT },
} = process;

export class SocketConnection {
  inGame: boolean;
  user: string;
  socket: SocketIO.Socket;
  tgConn: net.Socket | null;
  userNetInfo: {
    ipAddress: string;
    iTime: string | null;
    codeHeader: string;
    accountId: number;
  };

  constructor(server: any, socket: SocketIO.Socket) {
    this.inGame = false;
    this.user = "";
    this.socket = socket;
    this.tgConn = null;
    this.userNetInfo = {
      ipAddress: "",
      iTime: null,
      codeHeader: null,
      accountId: 0,
    };
  }

  init() {
    this.socket.emit("auth", '&!connmsg{"msg":"ready"}!');

    this.socket.on("disconnect", this.closeServerConnection);

    this.socket.on("oob", (when) => {
      if (when["itime"]) {
        this.userNetInfo.accountId = 0;
        this.userNetInfo.ipAddress = getclientIp(this.socket.handshake.headers);
        this.userNetInfo.iTime = when["itime"];
        this.userNetInfo.codeHeader = calcCodeFromHeaders(
          this.socket.handshake.headers
        );
        this.connectToGameServer();
	  } else {
		  this.closeServerConnection();
	  }
    });
  }

  connectToGameServer = () => {
    this.tgConn = net.connect(<net.NetConnectOpts>{
      host: <any>config.game_host,
      port: <any>config.game_port,
    });

    this.tgConn.on("close", () => {
      this.socket.disconnect();
    });

    this.tgConn.on("error", () => {
      this.sendToClient('&!connmsg{"msg":"serverdown"}!');
      this.socket.disconnect();
    });

    this.tgConn.on("end", () => {
      this.socket.disconnect();
    });

    this.tgConn.on("timeout", () => {
      this.socket.disconnect();
    });

    this.tgConn.on("data", this.handshake.bind(this));
  };

  closeServerConnection() {
    if (this.tgConn) {
      this.tgConn.destroy();
    }
  }

  handshake = (data?: Buffer) => {
    if (data.toString().indexOf("Vuoi i codici ANSI") !== -1) {
      this.tgConn.removeListener("data", this.handshake);
      // this.tgConn.on("data", (data) => {
      //   console.log(data.toString());
      // });
      this.socket.once("login", (auth: { name: string; pwd: string }) => {
        Logger.info(`Tentativo di login effettuato per ${auth.name}`);
        this.user = auth.name;
        this.sendToServer(`login:${auth.name}, ${auth.pwd}`);
      });

      this.socket.on("data", this.sendToServer.bind(this));
      //--------- Send credentials event phase ----------- //
      const { ipAddress, iTime, codeHeader, accountId } = this.userNetInfo;
      this.sendToServer(
        `WEBCLIENT(${ipAddress},${iTime}+${codeHeader}, ${accountId})\n`
      );
    } else {
      this.sendToClient(data);
    }
  };

  sendToClient = (data: Buffer | string) => {
    if (data.toString().indexOf("loginok") !== -1) {
      this.inGame = true;
      this.tgConn.removeListener("data", this.sendToClient);
      this.socket.emit("data", data.toString());
    } else {
      this.socket.emit("auth", data.toString());
    }
  };

  sendToServer = (data: any) => {
    this.tgConn.write(data + "\n");
  };
}
