const Common = require('@sixten/asteria-common');
const xml2js = require('xml2js');

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

const Mappers = require('./mappers');

class Imorter1c {
	constructor(queue, config) {
		this.queue = queue;
		this.client = new Common.Http.GraphQLClient({
			uri: config.services.invoiceService.uri,
		});
	}

	register(config) {
		this.queue.process(`${config.namespace}.1c.import`, 1, (job, done) => this.importData(job, done));
	}

	addClient(item, token) {
		let response;
		let record;
		if (item.type === 'customer') {
			record = Mappers.Customer({}, item);
			response = this.client.execute(
				AddCustomer,
				{
					input: record,
				},
				token
			);
		} else if (item.type === 'supplier') {
			record = Mappers.Supplier({}, item);
			response = this.client.execute(
				AddSupplier,
				{
					input: record,
				},
				token
			);
		} else {
			log.error(`Unknown client type. Token: ${token}`);
			return;
		}

		if (response.errors && response.errors.length > 0) {
			throw new Error(JSON.stringify(response.errors));
		}
		// console.log("Client record:" + JSON.stringify(record));
	}

	addInvoice(item, token) {
		let response;
		let record;
		if (item.type === 'customerInvoice') {
			record = Mappers.CustomerInvoice({}, item);
			response = this.client.execute(
				AddCustomerInvoice,
				{
					input: record,
				},
				token
			);
		} else if (item.type === 'supplierInvoice') {
			record = Mappers.SupplierInvoice({}, item);
			response = this.client.execute(
				AddSupplierInvoice,
				{
					input: record,
				},
				token
			);
		} else {
			log.error(`Unknown invoice type. Token: ${token}`);
			return;
		}
		if (response.errors && response.errors.length > 0) {
			throw new Error(JSON.stringify(response.errors));
		}
		// console.log("Invoice record:" + JSON.stringify(record));
	}

	addPayment(item, token) {
		let response;
		const record = Mappers.Payment({}, item);
		if (item.type === 'customerInvoicePayment') {
			response = this.client.execute(
				AddCustomerInvoicePayment,
				{
					input: record,
				},
				token
			);
		} else if (item.type === 'supplierInvoicePayment') {
			response = this.client.execute(
				AddSupplierInvoicePayment,
				{
					input: record,
				},
				token
			);
		} else {
			log.error(`Unknown payment type. Token: ${token}`);
			return;
		}
		if (response.errors && response.errors.length > 0) {
			throw new Error(JSON.stringify(response.errors));
		}
		console.log(`Payment record:${JSON.stringify(record)}`);
	}

	addExpense(item, token) {
		const record = Mappers.Expense({}, item);
		const response = this.client.execute(
			AddExpense,
			{
				input: record,
			},
			token
		);

		if (response.errors && response.errors.length > 0) {
			throw new Error(JSON.stringify(response.errors));
		}

		console.log(`Expense record:${JSON.stringify(record)}`);
	}

	async importData(job, done) {
		const {
			token = false,
			payload,
		} = job.data;

		const dump = (new Buffer(payload.data,'base64').toString('utf8'));
		// console.log('XML DATA:'+dump);
		const parser = new xml2js.Parser({ explicitArray: false });
		try {
			log.info(`Start 1c import. Token: ${token}`);
			await parser.parseString(dump, async (err, data) => {
				if (err) {
					throw new Error(err);
				}
				// console.log(JSON.stringify(data));
				if (data.head.type === 'JSON') {
					data.head.content[0] = JSON.parse(data.head.content[0]);
				} else if (data.head.type !== 'XML') {
					throw new Error(`Unknown type of data. Token: ${token}`);
				}

				// console.log(JSON.stringify(data.head.content[0]));
				if (data.head.type === 'XML') {
					if (data.head.content.TableClients) {
						data.head.content.TableClients.RowClients.forEach(async (item) => {
							this.addClient(item, token);
						});
					}

					if (data.head.content.TableInvoices) {
						data.head.content.TableInvoices.RowInvoices.forEach(async (item) => {
							this.addInvoice(item, token);
						});
					}

					if (data.head.content.TablePayments) {
						data.head.content.TablePayments.RowPayments.forEach(async (item) => {
							this.addPayment(item, token);
						});
					}
					if (data.head.content.TableExpenses) {
						data.head.content.TableExpenses.RowExpenses.forEach(async (item) => {
							this.addExpense(item, token);
						});
					}

				} else {
					if (data.head.content[0].Tables.TableClients) {
						data.head.content[0].Tables.TableClients.forEach(async (item) => {
							this.addClient(item, token);
						});
					}
					if (data.head.content[0].Tables.TableInvoices) {
						data.head.content[0].Tables.TableInvoices.forEach(async (item) => {
							this.addInvoice(item, token);
						});
					}

					if (data.head.content[0].Tables.TablePayments) {
						data.head.content[0].Tables.TablePayments.forEach(async (item) => {
							this.addPayment(item, token);
						});
					}
					if (data.head.content[0].Tables.TableExpenses) {
						data.head.content[0].Tables.TableExpenses.forEach(async (item) => {
							this.addExpense(item, token);
						});
					}

				}
			});
			log.info(`End 1c import. Token: ${token}`);
			done();
		} catch (e) {
			log.error(e);
			done(e);
		}
	}
}

module.exports = Imorter1c;
