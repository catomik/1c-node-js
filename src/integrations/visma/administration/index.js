const Common = require('@sixten/asteria-common');

const CustomerImportInvoice = require('./customer/customerInvoices');
const CustomerInvoicePaymentsController = require('./customer/customerInvoicePayments');
const CustomerImport = require('./customer/customers');

const SupplierImportInvoice = require('./supplier/supplierInvoices');
const SupplierInvoicePaymentsController = require('./supplier/supplierInvoicePayments');
const SupplierImport = require('./supplier/suppliers');

const {
	GetCompany,
	UpdateIntegration,
} = require('../../../queries');

module.exports = {};
module.exports.register = (queue, redis, config) => {
	const client = new Common.Http.GraphQLClient({
		uri: config.services.invoiceService.uri,
	});

	(new CustomerImportInvoice(queue, config, client)).register(config);
	(new CustomerInvoicePaymentsController(queue, config, client)).register(config);
	(new CustomerImport(queue, config, client)).register(config);

	(new SupplierImportInvoice(queue, config, client)).register(config);
	(new SupplierInvoicePaymentsController(queue, config, client)).register(config);
	(new SupplierImport(queue, config, client)).register(config);
};
