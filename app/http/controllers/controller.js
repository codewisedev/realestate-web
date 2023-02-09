const autoBind = require('auto-bind');
const Recaptcha = require('express-recaptcha').RecaptchaV2;
const { validationResult } = require('express-validator');
const isMongoId = require('validator/lib/isMongoId');
const path = require('path');
const sharp = require('sharp');
const moment = require('moment-jalaali');
moment.loadPersian({ usePersianDigits: true });
const os = require('os');
const dns = require('dns');
const macaddress = require('macaddress');

//* Models
const ActiveCode = require('app/models/active-code');
const Advertising = require('app/models/advertising');
const AgentValid = require('app/models/agent-valid');
const Agent = require('app/models/agent');
const Alert = require('app/models/alert');
const Blog = require('app/models/blog');
const City = require('app/models/city');
const Comment = require('app/models/comment');
const Consultant = require('app/models/consultant');
const Contact = require('app/models/contact');
const Device = require('app/models/device');
const Location = require('app/models/location');
const Material = require('app/models/material');
const Message = require('app/models/message');
const Page = require('app/models/page');
const PasswordReset = require('app/models/password-reset');
const Permission = require('app/models/permission');
const Price = require('app/models/price');
const Property = require('app/models/property');
const Region = require('app/models/region');
const Response = require('app/models/response');
const Role = require('app/models/role');
const State = require('app/models/state');
const Team = require('app/models/team');
const Todo = require('app/models/todo');
const User = require('app/models/user');

module.exports = class controller {
	constructor() {
		autoBind(this);
		this.model = {
			ActiveCode,
			Advertising,
			AgentValid,
			Agent,
			Alert,
			Blog,
			City,
			Comment,
			Consultant,
			Contact,
			Device,
			Location,
			Material,
			Message,
			Page,
			PasswordReset,
			Permission,
			Price,
			Property,
			Region,
			Response,
			Role,
			State,
			Team,
			Todo,
			User,
		};
		this.recaptchaConfig();
	}

	recaptchaConfig() {
		this.recaptcha = new Recaptcha(
			config.service.recaptcha.client_key,
			config.service.recaptcha.secret_key,
			{ ...config.service.recaptcha.options },
		);
	}

	recaptchaValidation(req, res) {
		return new Promise((resolve) => {
			this.recaptcha.verify(req, (err) => {
				if (err) {
					req.flash('errors', 'شناسایی ربات به درستی انجام نشده است.');
					this.back(req, res);
				} else resolve(true);
			});
		});
	}

	async validationData(req) {
		const result = validationResult(req);
		if (!result.isEmpty()) {
			const errors = result.array();
			const messages = [];
			errors.forEach((err) => messages.push(err.msg));
			req.flash('errors', messages);
			return false;
		}
		return true;
	}

	async loginDevice(req, res, user) {
		await dns.lookup(os.hostname(), async (err, ip) => {
			if (err) throw err;
			let device = await this.model.Device.findOne({
				ip,
				user: user._id,
			});
			if (!device) {
				let host = os.hostname() + '-' + os.platform();
				let title = req.device.type.toUpperCase();
				await macaddress.one((err, mac) => {
					if (err) throw err;
					new this.model.Device({
						ip,
						title,
						host,
						mac,
						user: user._id,
					}).save();
					this.notification(
						user._id,
						'گزارش ورود',
						`کاربری با آدرس ${ip} در تاریخ ${this.date(Date.now()).format(
							'jYYYY/jMM/jDD',
						)} و ساعت ${this.date(Date.now()).format(
							'HH:mm:ss',
						)} وارد سامانه شما شده است. در صورت ورود غیر مجاز آن را درمنوی گزارش ورود به پنل مسدود نمایید.`,
						config.alert.warning,
					);
				});
			} else if (!device.status) {
				this.alert(req, {
					title: 'اخطار',
					text: 'شما اجازه ی دسترسی به این پروفایل را ندارید',
					icon: 'error',
					button: 'بستن',
				});
				req.logout();
				res.clearCookie('remember_token');
				this.back(req, res);
			} else await this.model.Device.updateOne({ $set: { time: Date.now() } });
			await user.updateOne({ $set: { currentIp: ip } });
		});
	}

	async registerDevice(req, res, user) {
		await dns.lookup(os.hostname(), async (err, ip) => {
			if (err) throw err;
			let host = os.hostname() + '-' + os.platform();
			let mac = macaddress.one((err, mac) => {
				if (err) throw err;
				return mac;
			});
			let title = req.device.type.toUpperCase();
			let newDevice = new this.model.Device({
				user: user._id,
				title,
				host,
				ip,
				mac,
			});
			newDevice.save().then(async (device) => {
				await user.updateOne({ $set: { firstDevice: device } });
			});
		});
	}

	date(time) {
		return moment(time).locale('fa');
	}

	async notification(user, title, text, icon) {
		new Alert({
			user,
			title,
			text,
			icon,
		}).save();
	}

	back(req, res) {
		req.flash('formData', req.body);
		return res.redirect(req.header('Referer') || '/');
	}

	showValidationErrors(req, res) {
		let errors = req.validationErrors();
		if (errors) {
			res.status(422).json({
				message: errors.map((error) => {
					return {
						field: error.param,
						message: error.msg,
					};
				}),
			});
			return true;
		}
		return false;
	}

	escapeAndTrim(req, items) {
		items.split(',').forEach((item) => {
			req.sanitize(item).escape();
			req.sanitize(item).trim();
		});
	}

	isMongoId(paramId) {
		if (!isMongoId(paramId)) {
			this.error('شناسه وارد شده صحیح نمی باشد', 404);
		}
	}

	error(message, status = 500) {
		let error = new Error(message);
		error.status = status;
		throw error;
	}

	alert(req, data) {
		let title = data.title || '',
			text = data.text || '',
			icon = data.icon || 'info',
			button = data.button || null,
			timer = data.timer || 2000;
		req.flash('sweetalert', { title, text, icon, button, timer });
	}

	toast(req, data) {
		let text = data.text || '',
			iconClass = data.iconClass || 'toast-error';
		req.flash('toast', {
			text,
			iconClass,
		});
	}

	alertAndBack(req, res, data) {
		this.alert(req, data);
		this.back(req, res);
	}

	imageResize(image, size, original) {
		const imageInfo = path.parse(image.path);
		let addresImages = {};
		if (original) {
			addresImages['original'] = this.getUrlImage(
				`${image.destination}/${image.filename}`,
			);
		}
		const resize = (size) => {
			let imageName = `${imageInfo.name}-${size}${imageInfo.ext}`;
			addresImages[size] = this.getUrlImage(
				`${image.destination}/${imageName}`,
			);
			sharp(image.path)
				.resize(size, null)
				.toFile(`${image.destination}/${imageName}`);
		};
		size.map(resize);
		return addresImages;
	}

	getImageAddress(image) {
		const imageInfo = path.parse(image.path);
		let addressImages;
		let imageName = `${imageInfo.name}${imageInfo.ext}`;
		addressImages = this.getUrlImage(`${image.destination}/${imageName}`);
		return addressImages;
	}

	getUrlImage(dir) {
		return dir.substring(8);
	}

	slug(title) {
		return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g, '-');
	}

	getFileAddress(file) {
		const fileInfo = path.parse(file.path);
		let addressFile;
		let fileName = `${fileInfo.name}${fileInfo.ext}`;
		addressFile = this.getUrlFile(`${file.destination}/${fileName}`);
		return addressFile;
	}

	getUrlFile(dir) {
		return dir.substring(8);
	}

	trimSpace(str) {
		// eslint-disable-next-line no-useless-escape
		return str.replace(/(\s|\_)/g, '');
	}
};
