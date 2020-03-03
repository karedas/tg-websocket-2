"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var net_1 = __importDefault(require("net"));
var utils_1 = require("../utils");
var constant_1 = require("../config/constant");
exports.startSocketServer = function (io) {
    io.on("connection", exports.userConnection);
};
exports.userConnection = function (socket) {
    socket.on("loginrequest", function (_) {
        socket.emit("auth", '&!connmsg{"msg":"ready"}!');
    });
    socket.on("registration", function () { }); //todo
    socket.on("oob", function (socket, msg) { return exports.handleLoginRequest; });
};
exports.handleLoginRequest = function (socket, msg) {
    if (msg["itime"]) {
        var account_id = 0;
        var headers = socket.handshake.headers;
        var codeHeaders = utils_1.calcCodeFromHeaders(headers);
        var clientIpAddress = utils_1.getclientIp(headers);
        var codeitime = msg["itime"];
        var clientCode = codeitime + "-" + codeHeaders;
        var tgconn_1 = exports.connectToGameServer(socket, account_id, codeHeaders, clientIpAddress, codeitime, clientCode);
        socket.on("disconnect", function () {
            tgconn_1.destroy();
        });
    }
};
exports.connectToGameServer = function (socket, accountId, codeHeaders, clientIpAddress, codeitime, clientCode) {
    var tgconn = net_1.default.connect(constant_1.SERVER_PORT);
    tgconn.on("close", function () {
        socket.disconnect();
    });
    tgconn.on("error", function () {
        sendToClient('&!connmsg{"msg":"serverdown"}!');
        socket.disconnect();
    });
    tgconn.on("end", function () {
        socket.disconnect();
    });
    tgconn.on("timeout", function () {
        socket.disconnect();
    });
    var handshake = function (msg) {
        if (msg.toString().indexOf("Vuoi i codici ANSI") !== -1) {
            tgconn.removeListener("data", handshake);
            tgconn.on("data", sendToClient);
            socket.on("data", sendToServer);
            /** Authorization string client-server to auth character **/
            sendToServer("WEBCLIENT(" + clientIpAddress + "," + codeitime + "-" + codeHeaders + "," + accountId + ")\n");
        }
        else {
            sendToClient(msg);
        }
    };
    var sendToClientLoggedIn = function (msg) {
        socket.emit("data", msg.toString());
    };
    var sendToClient = function (msg) {
        if (msg.toString().indexOf('loginok') != -1) {
            tgconn.removeListener('data', sendToClient);
            tgconn.on('data', sendToClientLoggedIn);
            socket.emit('auth', msg.toString());
        }
        else {
            socket.emit('data', msg.toString());
        }
    };
    var sendToServer = function (msg) {
        tgconn.write(msg + '\n');
    };
    var closeConnection = function () {
        socket.disconnect();
    };
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
//# sourceMappingURL=userServerConnection.js.map