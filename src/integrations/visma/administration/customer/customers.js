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
	}

	register(config) {
		this.queue.process(`${config.namespace}.visma.customer.info`, 1, (job, done) => this.import(job, done));
	}

	async import(job, done) {
		const {
			token = false,
			item = false,
		} = job.data;

		try {

			if (!item) {
				throw new Error('Missing Item Data');
			}

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

			done();
		} catch (e) {
			log.error(e);
			done(e);
		}
	}
}

module.exports = CustomerController;
