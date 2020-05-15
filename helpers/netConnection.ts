import { calcCodeFromHeaders, getclientIp } from "../utils";
import * as net from "net";
import { config } from "../core/config";
import { IncomingHttpHeaders } from "http";
import { rejects } from "assert";

export class NetConnection {
  sessionId: any;
  itime: string;
  clientHeader: any;
  clientIpAddress: string;
  clientCode: string;
  _tgconnection: net.Socket | null;

  constructor() {
    this._tgconnection = null;
    this.itime = new Date().getTime().toString(16);
    this.sessionId = null;
    this.clientIpAddress = null;
    this.clientHeader = null;
  }

  get tgconn(): net.Socket {
    return this._tgconnection;
  }

  set tgconn(connection: net.Socket) {
    this._tgconnection = connection;
  }

  async connect(clientHeader?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.sessionId = 0;
      this.clientHeader = clientHeader;
      this.clientIpAddress = getclientIp(clientHeader);
      this.clientCode = this.itime + "-" + calcCodeFromHeaders(clientHeader);

      if (!this._tgconnection) {
        this.tgconn = net.connect(<net.NetConnectOpts>{
          host: <any>config.game_host,
          port: <any>config.game_port,
        });
      }

      this.tgconn.on("close", (err) => reject());
      this.tgconn.on("end", (err) => reject("Connection ends by peer"));
      this.tgconn.on("timeout", (err) => reject(err));
      this.tgconn.on("error", (err) => reject(err));

      this.tgconn.once("data", (data) => {
        if (data.toString().indexOf("Vuoi i codici ANSI") != -1) {
          this.tgconn.removeListener("data", this.startHandshake);
          // console.log("qui arrivo");
          this.tgconn.on("data", (data) => resolve(data));
          this.sendToServer(
            `WEBCLIENT(${this.clientIpAddress},${this.itime}+${this.clientCode}, ${this.sessionId})\n`
          );
        } else {
          reject();
        }
      });
    });
  }

  async handshake(): Promise<any> {
    await new Promise((resolve, reject) => {
      this.tgconn.once("data", (data) => {
        if (data.toString().indexOf("Vuoi i codici ANSI") != -1) {
          this.tgconn.removeListener("data", this.startHandshake);
          // console.log("qui arrivo");
          // this.tgconn.on("data", (data) => resolve(data));
          this.sendToServer(
            `WEBCLIENT(${this.clientIpAddress},${this.itime}+${this.clientCode}, ${this.sessionId})\n`
          );
          resolve(data);
        }
      });
    });
  }

  disconnect(): void {
    if (this._tgconnection) {
      this._tgconnection.destroy();
    }
  }

  sendToServer(data: any): void {
    this._tgconnection.write(data + "\n");
  }

  private startHandshake(data: any) {}
}
