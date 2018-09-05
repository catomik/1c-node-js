const Common = require('@sixten/asteria-common');
const XLSX = require('xlsx');
const Mappers = require('./mappers');

const log = Common.Utils.logging;

const {
	AddCustomer,
	AddCustomerInvoice,
	AddCustomerInvoicePayment,
	AddSupplier,
	AddSupplierInvoice,
	AddSupplierInvoicePayment,
	AddExpense,
} = require('../../queries');

class InvoiceController {
	constructor(queue, config) {
		this.queue = queue;
		this.client = new Common.Http.GraphQLClient({
			uri: config.services.invoiceService.uri,
		});
	}

	register(config) {
		this.queue.process(`${config.namespace}.excel.import`, 1, (job, done) => this.import(job, done));
	}

	async addCustomer(data, token) {
		const entity = Mappers.Customer({}, data);

		const response = await this.client.execute(
			AddCustomer,
			{
				input: entity,
			},
			token
		);

		if (response.errors && response.errors.length > 0) {
			throw new Error(JSON.stringify(response.errors));
		}

		log.info(`Imported Customer with number ${response.data.updateCustomer.meta.customerNumber} and assigned it UUID : ${response.data.updateCustomer._id}`);

		return response;
	}

	async addCustomerInvoice(data, token) {
		const invoice = Mappers.CustomerInvoice({}, data);

		const response = await this.client.execute(
			AddCustomerInvoice,
			{
				input: invoice,
			},
			token
		);

		if (response.errors && response.errors.length > 0) {
			throw new Error(JSON.stringify(response.errors));
		}

		log.info(`Imported Customer invoice ${response.data.updateCustomerInvoice.meta.invoiceNumber} and assigned it UUID : ${response.data.updateCustomerInvoice._id}`);

		return response;
	}

	async addCustomerInvoicePayment(data, token) {
		const payment = Mappers.Payment({}, data);

		const response = await this.client.execute(
			AddCustomerInvoicePayment,
			{
				input: payment,
			},
			token
		);

		if (response.errors && response.errors.length > 0) {
			throw new Error(JSON.stringify(response.errors));
		}

		log.info(`Imported Customer invoice payment ${response.data.addCustomerInvoicePayment.meta.invoiceNumber} and assigned it UUID : ${response.data.addCustomerInvoicePayment._id}`);

		return response;
	}

	async addSupplier(data, token) {
		const entity = Mappers.Supplier({}, data);

		const response = await this.client.execute(
			AddSupplier,
			{
				input: entity,
			},
			token
		);

		if (response.errors && response.errors.length > 0) {
			throw new Error(JSON.stringify(response.errors));
		}

		log.info(`Imported Supplier with number ${response.data.updateSupplier.meta.supplierNumber} and assigned it UUID : ${response.data.updateSupplier._id}`);

		return response;
	}

	async addSupplierInvoice(data, token) {
		const invoice = Mappers.SupplierInvoice({}, data);

		const response = await this.client.execute(
			AddSupplierInvoice,
			{
				input: invoice,
			},
			token
		);

		if (response.errors && response.errors.length > 0) {
			throw new Error(JSON.stringify(response.errors));
		}

		log.info(`Imported Supplier invoice ${response.data.updateSupplierInvoice.meta.invoiceNumber} and assigned it UUID : ${response.data.updateSupplierInvoice._id}`);

		return response;
	}

	async addSupplierInvoicePayment(data, token) {
		const payment = Mappers.Payment({}, data);

		const response = await this.client.execute(
			AddSupplierInvoicePayment,
			{
				input: payment,
			},
			token
		);

		if (response.errors && response.errors.length > 0) {
			throw new Error(JSON.stringify(response.errors));
		}

		log.info(`Imported Supplier invoice payment ${response.data.addSupplierInvoicePayment.meta.serialNumber} and assigned it UUID : ${response.data.addSupplierInvoicePayment._id}`);

		return response;
	}

	async addExpense(data, token) {
		const expense = Mappers.Expense({}, data);

		console.log(expense);

		const response = await this.client.execute(
			AddExpense,
			{
				input: expense,
			},
			token
		);

		if (response.errors && response.errors.length > 0) {
			throw new Error(JSON.stringify(response.errors));
		}

		log.info(`Imported expense ${response.data.updateExpense.meta.serialNumber} and assigned it UUID : ${response.data.updateExpense._id}`);

		return response;
	}

	async import(job, done) {
		const {
			token = false,
			payload,
		} = job.data;

		const {
			data = '',
		} = payload;

		const workbook = XLSX.read(Buffer.from(data, 'base64'), { type: 'buffer' });

		try {
			await Promise.all(workbook.SheetNames.map(async (sheetName) => {
				const worksheet = workbook.Sheets[sheetName];
				const json = XLSX.utils.sheet_to_json(worksheet);

				return Promise.all(json.map(async (row) => {
					let response = null;
					if (row.type === 'supplier') {
						response = await this.addSupplier(row, token);
					} else if (row.type === 'supplierInvoice') {
						response = this.addSupplierInvoice(row, token);
					} else if (row.type === 'supplierInvoicePayment') {
						response = this.addSupplierInvoicePayment(row, token);
					} else if (row.type === 'customer') {
						response = this.addCustomer(row, token);
					} else if (row.type === 'customerInvoice') {
						response = this.addCustomerInvoice(row, token);
					} else if (row.type === 'customerInvoicePayment') {
						response = this.addCustomerInvoicePayment(row, token);
					} else if (row.type.indexOf('expenses.') !== -1) {
						response = this.addExpense(row, token);
					}

					return response;
				}));
			}));

			done();
		} catch (e) {
			log.error(e);
			done(e);
		}
	}
}

module.exports = InvoiceController;
