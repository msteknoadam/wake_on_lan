import * as io from "socket.io-client";
import * as wol from "wakeonlan";
import { createLogger, format, transports } from "winston";

require("dotenv").config();
const logger = createLogger({
	level: "info",
	format: format.combine(
		format.timestamp({
			format: "YYYY-MM-DD HH:mm:ss",
		}),
		format.errors({ stack: true }),
		format.splat(),
		format.json()
	),
	defaultMeta: { service: "WOL-Client" },
	transports: [
		//
		// - Write to all logs with level `info` and below to `quick-start-combined.log`.
		// - Write all logs error (and below) to `quick-start-error.log`.
		//
		new transports.File({
			filename: "logs/wol-client.log",
			level: "error",
		}),
		new transports.File({ filename: "logs/wol-client-combined.log" }),
	],
});

const debugMessages = {
	connnected: "Connected to the server.",
	disconnected: "Disconnected from the server, trying to reconnect. Reason for disconnect was:",
};

let upMessageSendInterval;

const socket = io(`${process.env.SERVER_ADDRESS}`, { reconnection: true });
socket.on("connect", () => {
	console.log(debugMessages.connnected);
	logger.info(debugMessages.connnected);
	upMessageSendInterval = setInterval(() => {
		socket.send(3);
	}, 15e3);
});
socket.on("disconnect", (reason) => {
	console.log(`${debugMessages.disconnected} ${reason}`);
	logger.warn(`${debugMessages.disconnected} ${reason}`);
	clearInterval(upMessageSendInterval);
	socket.connect();
});
socket.on("on", () => {
	logger.info("Got request from socket to turn on the computer.");
	wol(process.env.MAC_ADDRESS);
});
