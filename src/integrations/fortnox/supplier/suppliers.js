const Common = require('@sixten/asteria-common');
const Mappers = require('../mappers');

const {
	AddSupplier,
} = require('../../../queries');

const log = Common.Utils.logging;

class SupplierController {
	constructor(queue, config, fortnox, client) {
		this.queue = queue;
		this.fortnox = fortnox;
		this.client = client;
		this.config = config;
	}

	register(config) {
		this.queue.process(`${config.namespace}.fortnox.suppliers.fetch`, 1, (job, done) => this.import(job, done));
	}

	async addSupplier(item, token) {
		const supplier = Mappers.Supplier({}, item);
		const response = await this.client.execute(
			AddSupplier,
			{
				input: supplier,
			},
			token
		);

		if (response.errors && response.errors.length > 0) {
			throw new Error(JSON.stringify(response.errors));
		}

		log.info(`Imported Supplier ${response.data.updateSupplier.meta.supplierNumber} and assigned it UUID : ${response.data.updateSupplier._id}`);

		return response;
	}

	async import(job, done) {
		log.log('Fetching Suppliers');

		const {
			token = false,
			integration = false,
		} = job.data;
		try {
			if (!integration.server) {
				throw new Error('Missing AccessToken');
			}

			await this.fortnox.fetchPages({
				entity: 'Suppliers',
				accessToken: integration.server.accessToken,
				latest: integration.lastSynchronized,
			}, (item) => {
				this.addSupplier(item, token);
			});

			done();
		} catch (e) {
			log.error(e);
			done(e);
		}
	}
}

module.exports = SupplierController;
