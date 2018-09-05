module.exports = {
	namespace: 'erp',
	port: process.env.PORT || 7002,
	host: '0.0.0.0',
	services: {
		mongodb: {
			uri: process.env.MONGODB_URI || `mongodb://${process.env.dbhost}:27017`,
			database: process.env.database,
		},
	},
};
