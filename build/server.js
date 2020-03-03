"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var express_session_1 = __importDefault(require("express-session"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var cors_1 = __importDefault(require("cors"));
var socketIo = require("socket.io");
var http = require("http");
var express_socket_io_session_1 = __importDefault(require("express-socket.io-session"));
var constant_1 = require("./config/constant");
var userServerConnection_1 = require("./core/userServerConnection");
var _a = process.env, NODE_ENV = _a.NODE_ENV, SESSION_SECRET = _a.SESSION_SECRET, SERVER_GAME_PORT = _a.SERVER_GAME_PORT;
var session = express_session_1.default({
    secret: "$eCuRiTy",
    resave: true,
    saveUninitialized: false
});
function boot(app, port) {
    var server = http.createServer(app);
    var io = socketIo.listen(server, {
        pingInterval: 2000,
        pingTimeout: 5000
    });
    io.use(express_socket_io_session_1.default(session, {
        autoSave: true
    }));
    app.set("trust_proxy", 1);
    app.set("max_requests_per_ip", 20);
    app.use(cors_1.default());
    app.use(body_parser_1.default.urlencoded({
        extended: true
    }));
    app.use(body_parser_1.default.json({
        limit: "50mb"
    }));
    app.use(session, cookie_parser_1.default('$eCuRiTy'));
    userServerConnection_1.startSocketServer(io);
    server.listen(port, function () {
        console.log("App Listening on port " + port);
    });
}
// =================
var app = express_1.default();
boot(app, constant_1.PORT);
//# sourceMappingURL=server.js.map