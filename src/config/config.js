const dotenv = require("dotenv");

dotenv.config();

export const CLIENTS = process.env.CLIENTS.split(",");
export const TOKEN_SECRET = process.env.TOKEN_SECRET;
