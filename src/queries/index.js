const AddCustomer = require('./addCustomer');
const AddCustomerInvoice = require('./addCustomerInvoice');
const AddCustomerInvoicePayment = require('./addCustomerInvoicePayment');

const AddSupplier = require('./addSupplier');
const AddSupplierInvoice = require('./addSupplierInvoice');
const AddSupplierInvoicePayment = require('./addSupplierInvoicePayment');

const AddExpense = require('./addExpense');

const GetCompany = require('./getCompany');
const UpdateIntegration = require('./updateIntegration');

module.exports = {
	AddCustomer,
	AddCustomerInvoice,
	AddCustomerInvoicePayment,
	AddSupplier,
	AddSupplierInvoice,
	AddSupplierInvoicePayment,
	AddExpense,
	GetCompany,
	UpdateIntegration,
};
