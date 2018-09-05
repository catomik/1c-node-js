/* eslint global-require: "off", import/no-dynamic-require: "off" */

const Common = require('@sixten/asteria-common');
const _ = require('lodash');

const logger = Common.Utils.logging;

if (!process.env.NODE_ENV) {
	process.env.NODE_ENV = 'development';
}

logger.log('info', 'Creating configuration for environment', process.env.NODE_ENV);

/**
* Load environment configuration
*/
let config = {};
try {
	config = _.merge(
		require('./env/all.js'),
		require(`./env/${process.env.NODE_ENV}.js`) || {}
	);
} catch (e) {
	logger.log('error', 'Failed merging configuration files', e);
}


/**
* Check for local config file, and load
*/
try {
	config = _.merge(
		config,
		require('./env/local.js') || {}
	);
} catch (e) {
	logger.log('info', 'No local configuration file found');
}

logger.log('info', 'Resulting config ', config);

module.exports = config;
