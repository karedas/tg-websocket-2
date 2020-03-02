import crypto from "crypto";

export const getclientIp = (headers: any)  => {
  let ipAddress;
  let forwardedIpsStr = headers["x-forwarded-for"];
  if (forwardedIpsStr) {
    let forwardedIps = forwardedIpsStr.split(",");
    ipAddress = forwardedIps[0];
  }
  if (!ipAddress) {
    ipAddress = headers["x-real-ip"];
  }
  if (!ipAddress) {
    ipAddress = "unknown";
  }
  return ipAddress;
}

// Calculate a code from headers
export const calcCodeFromHeaders = (headers: any) => {
  let hash = crypto.createHash("md5");
  if (headers["user-agent"]) hash.update(headers["user-agent"]);
  if (headers["accept"]) hash.update(headers["accept"]);
  if (headers["accept-language"]) hash.update(headers["accept-language"]);

  if (headers["accept-encoding"]) hash.update(headers["accept-encoding"]);

  return hash.digest("hex");
}
