const Common = require('@sixten/asteria-common');

module.exports = Common.Utils.Mapper([
	{ src: 'number', dest: 'paymentNumber', required: true },
	{ src: 'invoiceNumber', dest: 'invoiceNumber', required: true },
	{ src: 'date', dest: 'dates.paid', type: 'date', required: true },
	{ src: 'total', dest: 'sums.total', type: 'float', required: true },
	{ src: 'tax', dest: 'sums.tax', type: 'float' },
	{ src: 'currency', dest: 'sums.currency'},
	{ src: 'message', dest: 'meta.message' },
	{ src: 'source', dest: 'meta.source' },
]);
