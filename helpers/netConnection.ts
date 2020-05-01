import { calcCodeFromHeaders } from "build/utils";

export class NetConnection {
    cosntructor() {}

    connect() {
        this.setConnection();
    }

    setConnection() {
        const sessionID = 0;
        const ipaddress = '';
        const itime =  { itime: (new Date().getTime()).toString(16) };
        const codeHeader = calcCodeFromHeaders()
    }
}