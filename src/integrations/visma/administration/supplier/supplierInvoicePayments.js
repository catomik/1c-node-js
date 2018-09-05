const Common = require('@sixten/asteria-common');
const Mappers = require('../mappers');

const {
	AddSupplierInvoicePayment,
} = require('../../../queries');

const log = Common.Utils.logging;

class SupplierInvoicePaymentsController {
	constructor(queue, config, fortnox, client) {
		this.queue = queue;
		this.fortnox = fortnox;
		this.client = client;
		this.config = config;
	}

	register(config) {
		this.queue.process(`${config.namespace}.fortnox.suppliers.payments.fetch`, 1, (job, done) => this.import(job, done));
		this.queue.process(`${config.namespace}.fortnox.suppliers.payment.fetch`, 1, (job, done) => this.fetchPayment(job, done));
	}

	async addSupplierInvoicePayment(item, token) {
		const payment = Mappers.Payment({}, item);
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

	async fetchPayment(job, done) {
		console.log('Fetching Supplier Invoice Payment');

		const {
			token = false,
			integration = false,
			itemUrl = false,
		} = job.data;

		try {
			if (!integration.server) {
				throw new Error('Missing AccessToken');
			}

			const response = await this.fortnox.fetchOne({
				entity: 'SupplierInvoicePayment',
				entityUrl: itemUrl,
				accessToken: integration.server.accessToken,
			});

			this.addSupplierInvoicePayment(response, token);

			done();
		} catch (e) {
			log.error(e);
			done(e);
		}
	}

	async import(job, done) {
		console.log('Fetching Supplier Invoice Payments');

		const {
			token = false,
			integration = false,
		} = job.data;

		try {
			if (!integration.server) {
				throw new Error('Missing AccessToken');
			}

			const response = await this.fortnox.fetchPages({
				entity: 'SupplierInvoicePayments',
				accessToken: integration.server.accessToken,
				latest: integration.lastSynchronized,
			}, (item) => {

				this.queue.create(
					`${this.config.namespace}.fortnox.suppliers.payment.fetch`,
					{
						token,
						integration,
						itemUrl: item['@url'],
					}
				)
					.attempts(10)
					.backoff({ delay: 60 * 1000, type: 'fixed' })
					.removeOnComplete(true)
					.save(() => {});
			});
			done();
		} catch (e) {
			log.error(e);
			done(e);
		}
	}
}

module.exports = SupplierInvoicePaymentsController;
