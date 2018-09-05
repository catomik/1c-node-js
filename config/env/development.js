process.env.database = 'asteria-dev';
process.env.dbhost = process.env.dbhost || 'mongodb';

module.exports = {
	port: process.env.PORT || 7002,
	host: '0.0.0.0',
	services: {
		mongodb: {
			uri: process.env.MONGODB_URI || `mongodb://${process.env.dbhost}:27017`,
			database: process.env.database,
		},
		redis: {
			uri: process.env.REDIS_URI || 'redis://redis',
		},
		invoiceService: {
			uri: 'http://192.168.10.130:6002/graphql',
		},
		fortnox: {
			uri: 'https://api.fortnox.se/',
			clientSecret: '',
			clientId: '',
		},
	},
};
