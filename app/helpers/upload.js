//TODO: Upload Images & File With Multer

const multer = require('multer');
const mkdirp = require('mkdirp');
const fs = require('fs');

const getDir = () => {
	let year = new Date().getFullYear();
	let month = new Date().getMonth() + 1;
	let day = new Date().getDay();
	return `./public/uploads/${year}/${month}/${day}`;
};

//* Config Multer
const Storage = multer.diskStorage({
	destination: (req, file, cb) => {
		let dir = getDir();
		mkdirp(dir).then(() => {
			cb(null, dir);
		});
	},
	filename: (req, file, cb) => {
		let filePath = getDir() + '/' + file.originalname;
		if (!fs.existsSync(filePath)) cb(null, file.originalname);
		else cb(null, Date.now() + '-' + file.originalname);
	},
});

const upload = multer({
	storage: Storage,
	limits: {
		//! Limit up to 2MB
		fileSize: 1024 * 1024 * 2,
	},
});

module.exports = upload;
