const Excel = require('./excel');
const Fortnox = require('./fortnox');
const _1c = require('./1c');

module.exports = {};
module.exports.register = (queue, redis, config) => {
	Excel.register(queue, redis, config);
	Fortnox.register(queue, redis, config);
	_1c.register(queue, redis, config);
};
