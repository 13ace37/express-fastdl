
const fs = require("fs");
const { join } = require('path');

class fastDL {

	constructor(port, path) {

		console.log(path);

		this.app = require("express")();
		if (!port) console.log("[WARNING] Invlaid port provided! Using '36949' instead!");
		this.port = Number(port) || 36949
		if (!path || !fs.existsSync(path)) throw new Error("No or invalid path provided!\nUsage: ./script [port] [absolute fastdl path]");
		this.path = path;

		this.app.listen(this.port);
		console.log(`[LOG] FastDL running on port '${this.port}'`);

		this.app.get("/dl", (req, res) => {
			
			log(req);

			if (!req.headers["user-agent"].startsWith("Half-Life")) {
				console.log("[LOG] Ignored non hl game request!");
				return res.sendStatus(400);
			}

			let file = join(String(this.path), String(req.query.file));
			if (fs.existsSync(file)) {
				console.log(`[LOG] File '${file}' found! Sending file to client.`);
				return res.download(file);
			} 
			else {
				console.log(`[LOG] File '${file}' not found!`);
				return res.sendStatus(404);
			}
		});

		this.app.use(function(req, res){
       		res.sendStatus(404);
   		});

	}

}

function log(req) {
	console.log(`[REQUEST] ${req.connection.remoteAddress} on ${req.headers.host} - ${JSON.stringify(req.query, false)}`);
}

new fastDL(Number (process.argv.slice(2)[0]) || false, process.argv.slice(2)[1] || false);