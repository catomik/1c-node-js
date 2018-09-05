const Common = require('@sixten/asteria-common');
const InvoiceMapper = require('./Invoice.js');

module.exports = Common.Utils.Mapper([
	{ src: 'clientNumber', dest: 'meta.customerNumber', required: true },
	{ src: 'termsOfPayment', dest: 'meta.termsOfPayment', required: true },
	{ src: 'canceled', dest: 'active', type: 'boolean' },
	{ src: 'invoiceType', dest: 'type', default: 'invoice' },
	{ src: 'invoiceNumber', dest: 'meta.invoiceNumber', required: true },
	{ src: 'serialNumber', dest: 'meta.serialNumber' },
	{ src: 'credits', dest: 'credits[0]' },
	{ src: 'sent', dest: 'dates.invoiceSent', type: 'date' },
	{ src: 'due', dest: 'dates.invoiceDue', type: 'date', required: true },
	{ src: 'total', dest: 'sums.invoiceTotal', type: 'float', required: true },
	{ src: 'tax', dest: 'sums.tax', type: 'float' },
	{ src: 'currency', dest: 'sums.currency', required: true },
	{ src: 'contact_internal_name', dest: 'contact.internal.name' },
	{ src: 'contact_internal_email', dest: 'contact.internal.email' },
	{ src: 'contact_internal_phone', dest: 'contact.internal.phone' },
	{ src: 'contact_name', dest: 'contact.general.name' },
	{ src: 'contact_email', dest: 'contact.general.email' },
	{ src: 'contact_streett', dest: 'contact.general.street' },
	{ src: 'contact_street_2', dest: 'contact.general.street2' },
	{ src: 'contact_city', dest: 'contact.general.city' },
	{ src: 'contact_zipcode', dest: 'contact.general.zipcode' },
	{ src: 'contact_phone', dest: 'contact.general.phone' },
	{ src: 'contact_country', dest: 'contact.general.country' },
	{ src: 'shipping_name', dest: 'contact.shipping.name' },
	{ src: 'shipping_street', dest: 'contact.shipping.street' },
	{ src: 'shipping_street_2', dest: 'contact.shipping.street2' },
	{ src: 'shipping_city', dest: 'contact.shipping.city' },
	{ src: 'shipping_zipcode', dest: 'contact.shipping.zipcode' },
	{ src: 'shipping_country', dest: 'contact.shipping.country' },
]);
