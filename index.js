
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
			let file = join(String(this.path), String(req.query.file));
			if (fs.existsSync(file)) {
				console.log(`[LOG] File '${file}' found! Sending file to client.`);
				res.download(file);
			} 
			else {
				console.log(`[LOG] File '${file}' not found!`);
				res.status(404).send("file not found!");
			}
		});

	}

}

function log(req) {
	console.log(`[REQUEST] ${req.connection.remoteAddress} - ${JSON.stringify(req.query, false)}`);
}

new fastDL(Number (process.argv.slice(2)[0]) || false, process.argv.slice(2)[1] || false);