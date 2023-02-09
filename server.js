//TODO: Main Server File

require('app-module-path').addPath(__dirname);
require('dotenv').config();
global.config = require('config');
global.logger = require('log/logger');
const App = require('app');
new App();
