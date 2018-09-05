const Common = require('@sixten/asteria-common');
const InvoiceMapper = require('./Invoice.js');

module.exports = Common.Utils.Mapper([
	{ src: 'Booked', dest: 'active', type: 'boolean' },
	{ src: 'invoiceType', dest: 'type', default: 'invoice', required: true },
	{ src: 'Cancelled', dest: 'canceled', default: false, type: 'boolean' },
	{ src: 'DocumentNumber', dest: 'meta.invoiceNumber', required: true },
	{ src: 'TermsOfPayment', dest: 'meta.termsOfPayment', default: '30' },
	{ src: 'OCR', dest: 'meta.message' },
	{ src: 'InvoiceDate', dest: 'dates.invoiceSent', type: 'date' },
	{ src: 'DueDate', dest: 'dates.invoiceDue', type: 'date' },
	{ src: 'TotalVAT', dest: 'sums.tax', type: 'float' },
	{ src: 'Total', dest: 'sums.invoiceTotal', type: 'float', required: true },
	{ src: 'Currency', dest: 'sums.currency', default: 'SEK' },
	{ src: 'CreditInvoiceReference', dest: 'credits[0]' },
	{ src: 'CustomerNumber', dest: 'meta.customerNumber' },
	{ src: 'YourReference', dest: 'contact.internal.name' },
	{ src: 'OurReference', dest: 'contact.general.name' },
	{ src: 'DeliveryName', dest: 'contact.shipping.name' },
	{ src: 'DeliveryAddress1', dest: 'contact.shipping.street' },
	{ src: 'DeliveryAddress2', dest: 'contact.shipping.street2' },
	{ src: 'DeliveryCity', dest: 'contact.shipping.city' },
	{ src: 'DeliveryZipCode', dest: 'contact.shipping.zipcode' },
	{ src: 'DeliveryCountry', dest: 'contact.shipping.country' },
]);
