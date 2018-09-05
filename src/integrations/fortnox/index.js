const Common = require('@sixten/asteria-common');

const CustomerImportInvoice = require('./customer/customerInvoices');
const CustomerInvoicePaymentsController = require('./customer/customerInvoicePayments');
const CustomerImport = require('./customer/customers');

const SupplierImportInvoice = require('./supplier/supplierInvoices');
const SupplierInvoicePaymentsController = require('./supplier/supplierInvoicePayments');
const SupplierImport = require('./supplier/suppliers');

const ExpenseImport = require('./expenses/expenses');

const RateLimiter = require('../../services/RateLimiter');
const FortnoxHttp = require('./fortnox');

const {
	GetCompany,
	UpdateIntegration,
} = require('../../queries');

class Fortnox {
	constructor(queue, config, fortnox, client) {
		this.queue = queue;
		this.config = config;
		this.fortnox = fortnox;
		this.client = client;
	}

	register(config) {
		this.queue.process(`${config.namespace}.fortnox.import`, 1, (job, done) => this.import(job, done));
		this.queue.process('fortnox.authenticate', 1, (job, done) => this.import(job, done));
	}

	async init(token) {
		const response = await this.client.execute(
			GetCompany,
			{},
			token
		);

		if (response.errors && response.errors.length > 0) {
			throw new Error(JSON.stringify(response.errors));
		}

		const {
			company: {
				integrations = [],
			} = {},
		} = response.data;

		const integration = integrations.find(item => item.key === 'fortnox');
		const {
			config: {
				server: {
					accessToken = false,
				} = {},
				client: {
					authorizationCode = false,
				} = {},
			} = {},
		} = integration;

		if (!accessToken && !authorizationCode) {
			throw new Error('Company missing fortnox configuration');
		}

		if (accessToken) {
			return integration;
		} else if (authorizationCode) {
			const newAccessToken = await this.authenticate(authorizationCode);

			if (!newAccessToken) {
				this.client.execute(
					UpdateIntegration,
					{
						input: {
							key: 'fortnox',
							config: {
								client: {
									authenticated: false,
								},
								server: {
									accessToken: '',
								},
							},
						},
					},
					token
				);

				throw new Error('Fortnox: Unable to authenticate company');
			}

			integration.config.server = {
				accessToken: newAccessToken,
			};

			this.client.execute(
				UpdateIntegration,
				{
					input: {
						key: 'fortnox',
						config: {
							client: {
								authenticated: true,
							},
							server: {
								accessToken: newAccessToken,
							},
						},
					},
				},
				token
			);

			return integration;
		}

		throw new Error('Company missing fortnox configuration');
	}

	async authenticate(authorizationCode) {
		const response = await this.fortnox.get('/3/', {}, {
			headers: {
				'Authorization-Code': authorizationCode,
				'Client-Secret': this.config.services.fortnox.clientSecret,
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		});

		const {
			Authorization: {
				AccessToken = false,
			} = {},
		} = response;

		return AccessToken;
	}

	sendJob(action, token, integration) {
		return this.queue.create(
			action,
			{
				token,
				integration,
			}
		)
			.attempts(1)
			.removeOnComplete(true)
			.attempts(10)
			.backoff({ delay: 60 * 1000, type: 'fixed' })
			.save(() => {});
	}

	async import(job, done) {
		const {
			token = false,
		} = job.data;

		try {
			const integration = await this.init(token);

			this.client.execute(
				UpdateIntegration,
				{
					input: {
						key: 'fortnox',
						config: {
							lastSynchronized: new Date(),
						},
					},
				},
				token
			);

			// this.sendJob(`${this.config.namespace}.fortnox.customers.invoices.fetch`, token, integration.config);
			// this.sendJob(`${this.config.namespace}.fortnox.customers.payments.fetch`, token, integration.config);
			// this.sendJob(`${this.config.namespace}.fortnox.customers.fetch`, token, integration.config);


			this.sendJob(`${this.config.namespace}.fortnox.suppliers.invoices.fetch`, token, integration.config);
			// this.sendJob(`${this.config.namespace}.fortnox.suppliers.payments.fetch`, token, integration.config);
			// this.sendJob(`${this.config.namespace}.fortnox.suppliers.fetch`, token, integration.config);

			// this.sendJob(`${this.config.namespace}.fortnox.expenses.fetch`, token, integration.config);

			done();
		} catch (e) {
			console.error(e);
			done(e);
		}
	}
}

module.exports = {};
module.exports.register = (queue, redis, config) => {
	const rateLimiter = new RateLimiter(config, redis);
	const fortnox = new FortnoxHttp(config, redis, rateLimiter);

	const client = new Common.Http.GraphQLClient({
		uri: config.services.invoiceService.uri,
	});

	(new CustomerImportInvoice(queue, config, fortnox, client)).register(config);
	(new CustomerInvoicePaymentsController(queue, config, fortnox, client)).register(config);
	(new CustomerImport(queue, config, fortnox, client)).register(config);

	(new SupplierImportInvoice(queue, config, fortnox, client)).register(config);
	(new SupplierInvoicePaymentsController(queue, config, fortnox, client)).register(config);
	(new SupplierImport(queue, config, fortnox, client)).register(config);

	(new ExpenseImport(queue, config, fortnox, client)).register(config);

	(new Fortnox(queue, config, fortnox, client)).register(config);
};
