import * as express from "express";
import * as socketio from "socket.io";
import * as http from "http";
import {createLogger, format, transports} from "winston";
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const logger = createLogger({
	level: "info",
	format: format.combine(
		format.timestamp({
			format: "YYYY-MM-DD HH:mm:ss",
		}),
		format.errors({stack: true}),
		format.splat(),
		format.json()
	),
	defaultMeta: {service: "WOL-Server"},
	transports: [
		//
		// - Write to all logs with level `info` and below to `quick-start-combined.log`.
		// - Write all logs error (and below) to `quick-start-error.log`.
		//
		new transports.File({
			filename: "logs/wol-server-error.log",
			level: "error",
		}),
		new transports.File({filename: "logs/wol-server-combined.log"}),
	],
});

const initializeServer = async () => {
	const app = express();
	const server = http.createServer(app);
	const io = socketio(server);

	app.get("/on", (req, res) => {
		if (req.query.secret && req.query.secret === process.env.SERVER_SECRET) {
			logger.info(`Got request to turn on the computer.`);
			io.emit("on");
			res.send(`Your request is now being processed.`);
		} else {
			res.sendStatus(403);
		}
	});

	app.get("*", (req, res) => {
		res.sendStatus(403);
	});

	server.listen(PORT, async () => {
		console.log(`Started listening on *:${PORT}`);
		logger.info(`Started listening on *:${PORT}`);
	});

	io.on("connection", socket => {
		logger.info(`User #${socket.id} connected.`);
		socket.on("disconnect", () => {
			logger.info(`User #${socket.id} disconnected.`);
		});
	});
};

console.log("Starting to initialize server.");
logger.info("Starting to initialize server.");
initializeServer();
