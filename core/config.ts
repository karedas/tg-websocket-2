import dotenv from 'dotenv';
dotenv.config();

export const config = {
    ws_host: process.env.WS_HOST,
    ws_port: process.env.WS_PORT,
}