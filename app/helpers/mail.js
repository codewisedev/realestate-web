//TODO: Mailtrap SFTP Server for Nodemailer service

const nodemailer = require('nodemailer');

//* Config Nodemailer
let transporter = nodemailer.createTransport({
	host: 'smtp.mailtrap.io',
	port: 2525,
	secure: false,
	auth: {
		user: '1cdb4c6b32d644',
		pass: '1007ba52cf6185',
	},
});

module.exports = transporter;
