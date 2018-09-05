const Common = require('@sixten/asteria-common');

module.exports = Common.Utils.Mapper([
	{ src: 'Number', dest: 'paymentNumber' },
	{ src: 'InvoiceNumber', dest: 'invoiceNumber' },
	{ src: 'PaymentDate', dest: 'dates.paid', type: 'date' },
	{ src: 'Amount', dest: 'sums.total', type: 'float' },
	{ src: 'Currency', dest: 'sums.currency' },
	{ src: 'Source', dest: 'meta.source' },
]);
