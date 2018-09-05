const ImportInvoice = require('./invoices');

module.exports = {};
module.exports.register = (queue, redis, config) => {
	(new ImportInvoice(queue, config)).register(config);
};
