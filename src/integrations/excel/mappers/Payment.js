const Common = require('@sixten/asteria-common');

module.exports = Common.Utils.Mapper([
	{ src: 'number', dest: 'paymentNumber' },
	{ src: 'invoiceNumber', dest: 'invoiceNumber' },
	{ src: 'date', dest: 'dates.paid', type: 'date' },
	{ src: 'total', dest: 'sums.total', type: 'float' },
	{ src: 'tax', dest: 'sums.tax', type: 'float' },
	{ src: 'currency', dest: 'sums.currency' },
	{ src: 'reference', dest: 'meta.reference' },
	{ src: 'message', dest: 'meta.message' },
	{ src: 'source', dest: 'meta.source' },
]);
