const Common = require('@sixten/asteria-common');
const Mappers = require('../mappers');

const {
	AddCustomer,
} = require('../../../queries');

const log = Common.Utils.logging;

class CustomerController {
	constructor(queue, config, fortnox, client) {
		this.queue = queue;
		this.fortnox = fortnox;
		this.client = client;
		this.config = config;
	}

	register(config) {
		this.queue.process(`${config.namespace}.fortnox.customers.fetch`, 1, (job, done) => this.import(job, done));
	}

	async addCustomer(item, token) {
		const customer = Mappers.Customer({}, item);

		const response = await this.client.execute(
			AddCustomer,
			{
				input: customer,
			},
			token
		);

		if (response.errors && response.errors.length > 0) {
			log.error(response);
			throw new Error(JSON.stringify(response.errors));
		}

		log.info(`Imported Customer ${response.data.updateCustomer.meta.customerNumber} and assigned it UUID : ${response.data.updateCustomer._id}`);

		return response;
	}

	async import(job, done) {
		log.log('Fetching Customers');

		const {
			token = false,
			integration = false,
		} = job.data;

		try {
			if (!integration.server) {
				throw new Error('Missing AccessToken');
			}
			await this.fortnox.fetchPages({
				entity: 'Customers',
				accessToken: integration.server.accessToken,
				latest: integration.lastSynchronized,
			}, async (item) => {
				try {
					await this.addCustomer(item, token);
				} catch (e) {
					log.error(e);
				}

				return true;
			});

			done();
		} catch (e) {
			log.error(e);
			done(e);
		}
	}
}

module.exports = CustomerController;
