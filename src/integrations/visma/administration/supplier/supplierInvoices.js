const Common = require('@sixten/asteria-common');
const Mappers = require('../mappers');

const {
	AddSupplierInvoice,
} = require('../../../queries');

const log = Common.Utils.logging;

class InvoiceController {
	constructor(queue, config, fortnox, client) {
		this.queue = queue;
		this.fortnox = fortnox;
		this.client = client;
		this.config = config;
	}

	register(config) {
		this.queue.process(`${config.namespace}.fortnox.suppliers.invoices.fetch`, 1, (job, done) => this.import(job, done));
		this.queue.process(`${config.namespace}.fortnox.suppliers.invoice.fetch`, 1, (job, done) => this.fetchInvoice(job, done));
	}

	async addInvoice(item, token) {
		const invoice = Mappers.SupplierInvoice({}, item);

		if (item.Credit === 'true') {
			invoice.type = 'credit';
		} else {
			invoice.credits = [];
		}

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

	async fetchInvoice(job, done) {
		console.log('Fetching Supplier Invoice');

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
				entity: 'SupplierInvoice',
				entityUrl: itemUrl,
				accessToken: integration.server.accessToken,
			});

			this.addInvoice(response, token);

			done();
		} catch (e) {
			log.error(e);
			done(e);
		}
	}

	async import(job, done) {
		console.log('Fetching Invoices');

		const {
			token = false,
			integration = false,
		} = job.data;

		try {
			if (!integration.server) {
				throw new Error('Missing AccessToken');
			}


			const response = await this.fortnox.fetchPages({
				entity: 'SupplierInvoices',
				accessToken: integration.server.accessToken,
				latest: integration.lastSynchronized,
			}, (item) => {
				this.queue.create(
					`${this.config.namespace}.fortnox.suppliers.invoice.fetch`,
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

module.exports = InvoiceController;
