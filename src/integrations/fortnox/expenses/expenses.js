const Common = require('@sixten/asteria-common');
const Mappers = require('../mappers');

const {
	AddExpense,
} = require('../../../queries');

const log = Common.Utils.logging;

class ExpensesController {
	constructor(queue, config, fortnox, client) {
		this.queue = queue;
		this.fortnox = fortnox;
		this.client = client;
		this.config = config;
	}

	register(config) {
		this.queue.process(`${config.namespace}.fortnox.expenses.fetch`, 1, (job, done) => this.import(job, done));
		this.queue.process(`${config.namespace}.fortnox.expense.fetch`, 1, (job, done) => this.fetchExpense(job, done));
	}

	async insertExpense(expense, token) {
		const response = await this.client.execute(
			AddExpense,
			{
				input: expense,
			},
			token
		);

		if (response.errors && response.errors.length > 0) {
			log.error(response);
			throw new Error(JSON.stringify(response.errors));
		}

		log.info(`Imported Expense ${response.data.updateExpense.meta.reference} and assigned it UUID : ${response.data.updateExpense._id}`);
	}

	async addExpense(item, token) {
		const expenses = Mappers.Expense(item, null);

		await Promise.all(expenses.map(expense => this.insertExpense(expense, token)));

		return true;
	}

	async import(job, done) {
		log.log('Fetching Expenses');

		const {
			token = false,
			integration = false,
		} = job.data;

		try {
			if (!integration.server) {
				throw new Error('Missing AccessToken');
			}
			await this.fortnox.fetchPages({
				entity: 'Vouchers',
				accessToken: integration.server.accessToken,
				latest: integration.lastSynchronized,
			}, (item) => {
				this.queue.create(
					`${this.config.namespace}.fortnox.expense.fetch`,
					{
						token,
						integration,
						itemUrl: item['@url'],
					}
				)
					.attempts(1)
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

	async fetchExpense(job, done) {
		log.log('Fetching Expense');

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
				entity: 'Voucher',
				entityUrl: itemUrl,
				accessToken: integration.server.accessToken,
			});

			this.addExpense(response, token);

			done();
		} catch (e) {
			log.error(e);
			done(e);
		}
	}
}

module.exports = ExpensesController;
