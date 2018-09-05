const Common = require('@sixten/asteria-common');
const InvoiceMapper = require('./Invoice.js');

module.exports = Common.Utils.Mapper([
	{ src: 'Booked', dest: 'active', type: 'boolean' },
	{ src: 'invoiceType', dest: 'type', default: 'invoice', required: true },
	{ src: 'Cancelled', dest: 'canceled', default: false, type: 'boolean' },
	{ src: 'InvoiceNumber', dest: 'meta.invoiceNumber', required: true },
	{ src: 'GivenNumber', dest: 'meta.serialNumber' },
	{ src: 'OCR', dest: 'meta.message' },
	{ src: 'InvoiceDate', dest: 'dates.invoiceSent', type: 'date' },
	{ src: 'DueDate', dest: 'dates.invoiceDue', type: 'date' },
	{ src: 'VAT', dest: 'sums.tax', type: 'float' },
	{ src: 'Total', dest: 'sums.invoiceTotal', type: 'float', required: true },
	{ src: 'Currency', dest: 'sums.currency', default: 'SEK' },
	{ src: 'CreditReference', dest: 'credits[0]' },
	{ src: 'SupplierNumber', dest: 'meta.supplierNumber' },
	{ src: 'YourReference', dest: 'contact.internal.name' },
	{ src: 'OurReference', dest: 'contact.general.name' },
]);
