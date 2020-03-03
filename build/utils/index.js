"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = __importDefault(require("crypto"));
exports.getclientIp = function (headers) {
    var ipAddress;
    var forwardedIpsStr = headers["x-forwarded-for"];
    if (forwardedIpsStr) {
        var forwardedIps = forwardedIpsStr.split(",");
        ipAddress = forwardedIps[0];
    }
    if (!ipAddress) {
        ipAddress = headers["x-real-ip"];
    }
    if (!ipAddress) {
        ipAddress = "unknown";
    }
    return ipAddress;
};
// Calculate a code from headers
exports.calcCodeFromHeaders = function (headers) {
    var hash = crypto_1.default.createHash("md5");
    if (headers["user-agent"])
        hash.update(headers["user-agent"]);
    if (headers["accept"])
        hash.update(headers["accept"]);
    if (headers["accept-language"])
        hash.update(headers["accept-language"]);
    if (headers["accept-encoding"])
        hash.update(headers["accept-encoding"]);
    return hash.digest("hex");
};
//# sourceMappingURL=index.js.map