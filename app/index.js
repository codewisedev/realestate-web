//TODO: Main App Source

const express = require('express'),
	app = express(),
	http = require('http').createServer(app),
	cluster = require('cluster'),
	numCPUs = require('os').cpus().length,
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	flash = require('connect-flash'),
	passport = require('passport'),
	methodOverride = require('method-override'),
	device = require('express-device'),
	gate = require('app/helpers/gate'),
	cors = require('cors'),
	helmet = require('helmet'),
	Helpers = require('app/helpers'),
	rememberLogin = require('app/http/middlewares/rememberLogin'),
	activeUser = require('app/http/middlewares/activeUser'),
	ejs = require('ejs'),
	LRU = require('lru-cache');

module.exports = class Application {
	constructor() {
		this.setupExpress();
		this.setMongoConnection();
		this.setConfig();
		this.setRouter();
	}

	//* Setup Express
	setupExpress() {
		if (cluster.isMaster) this.masterProcess();
		else this.childProcess();
	}

	masterProcess() {
		console.log(`Master ${process.pid} is running on port ${config.port}...`);
		for (let i = 0; i < numCPUs; i++) cluster.fork();
		cluster.on('exit', (worker) =>
			console.log(`worker ${worker.process.pid} died`),
		);
	}

	childProcess() {
		http.listen(config.port, function (err) {
			console.log(`Worker ${process.pid}`);
			if (err) throw console.log(err);
		});
	}

	//* Mongo Connect
	setMongoConnection() {
		mongoose.Promise = global.Promise;
		mongoose
			.connect(config.database.url, {
				useNewUrlParser: true,
				useFindAndModify: false,
				useCreateIndex: true,
				useUnifiedTopology: true,
			})
			.then(() => console.log('DB Connected'))
			.catch((err) => console.log(`DB Connection Error: ${err}`));
	}

	//* Express Config
	setConfig() {
		app.enable('trust proxy');
		app.use(
			helmet({
				contentSecurityPolicy: false,
				referrerPolicy: { policy: ['origin', 'unsafe-url'] },
			}),
		);
		app.use(cors(config.cors));
		require('app/passports/passport-local');
		require('app/passports/passport-google');
		app.use(express.static(config.layout.public_dir));
		app.use(device.capture());
		app.set('view engine', config.layout.view_engine);
		app.set('views', config.layout.view_dir);
		app.use(config.layout.ejs.expressLayouts);
		app.set('layout extractScripts', config.layout.ejs.extractScripts);
		app.set('layout extractStyles', config.layout.ejs.extractStyles);
		app.set('layout', config.layout.ejs.master);
		ejs.cache = new LRU(config.cache);
		ejs.cache.reset();
		app.use(bodyParser.json({ limit: '50mb' }));
		app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
		app.use(methodOverride('_method'));
		app.use(session({ ...config.session }));
		app.use(cookieParser(config.cookie_secretkey));
		app.use(flash());
		app.use(passport.initialize());
		app.use(passport.session());
		app.use(rememberLogin.handle);
		app.use(gate.middleware());
		app.use((req, res, next) => {
			app.locals = new Helpers(req, res).getObjects();
			next();
		});
	}

	setRouter() {
		app.use(activeUser.handle);
		app.use(require('app/routes/api'));
		app.use(require('app/routes/web'));
	}
};
