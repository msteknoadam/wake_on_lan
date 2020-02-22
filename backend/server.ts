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
			filename: "logs/wol-server.log",
			level: "error",
		}),
		new transports.File({filename: "logs/wol-server-combined.log"}),
	],
});

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.get("/on", (req, res) => {
	if (req.query.secret === process.env.SERVER_SECRET) {
		logger.log("info", `Got turn on request with correct secret key.`);
		res.send("Your request has been taken.");
		io.send("on");
	} else {
		res.sendStatus(403);
	}
});

app.get("*", (req, res) => {
	res.sendStatus(403);
});

app.listen(PORT, () => {
	console.log(`Started listening on :${PORT}`);
});
