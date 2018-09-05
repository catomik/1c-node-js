const Common = require('@sixten/asteria-common');
const Mappers = require('../mappers');

const {
	AddCustomerInvoicePayment,
} = require('../../../queries');

const log = Common.Utils.logging;

class CustomerInvoicePaymentsController {
	constructor(queue, config, fortnox, client) {
		this.queue = queue;
		this.fortnox = fortnox;
		this.client = client;
		this.config = config;
	}

	register(config) {
		this.queue.process(`${config.namespace}.fortnox.customers.payments.fetch`, 1, (job, done) => this.import(job, done));
	}

	async addCustomerInvoicePayment(item, token) {
		const payment = Mappers.Payment({}, item);
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

	async import(job, done) {
		log.log('Fetching Customer Invoice Payments');

		const {
			token = false,
			integration = false,
		} = job.data;

		try {
			if (!integration.server) {
				throw new Error('Missing AccessToken');
			}

			await this.fortnox.fetchPages({
				entity: 'InvoicePayments',
				accessToken: integration.server.accessToken,
				latest: integration.lastSynchronized,
			}, (item) => {
				this.addCustomerInvoicePayment(item, token);
			});

			done();
		} catch (e) {
			log.error(e);
			done(e);
		}
	}
}

module.exports = CustomerInvoicePaymentsController;
