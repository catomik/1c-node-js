process.env.database = process.env.database || 'asteria-test';
process.env.dbhost = process.env.dbhost || 'asteria-mongo';

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
	},
};

