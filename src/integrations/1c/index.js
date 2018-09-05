const Import1c = require('./1c');

module.exports = {};
module.exports.register = (queue, redis, config) => {
	(new Import1c(queue, config).register(config));
};
