import { calcCodeFromHeaders, getclientIp } from "../utils";
import { Logger } from "../server";
import * as net from "net";
import { NetConnection } from "./netConnection";

const {
  env: { SERVER_GAME_PORT },
} = process;

export class SocketConnection extends NetConnection {
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
    super();
    this.inGame = false;
    this.user = "";
    this.socket = socket;
    this.userNetInfo = {
      ipAddress: "",
      iTime: null,
      codeHeader: null,
      accountId: 0,
    };
  }

  init() {
    this.socket.emit("auth", '&!connmsg{"msg":"ready"}!');

    this.socket.on("disconnect", this.tgConn.destroy);

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
        this.tgConn.destroy();
      }
    });
  }

  connectToGameServer = () => {
    if (this.tgConn) {
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
    }
  };

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
}
