process.env.database = process.env.database || 'asteria-staging';
process.env.dbhost = process.env.dbhost || 'asteria-mongo';
process.env.MONGODB_BINDING = process.env.MONGODB_BINDING || '{}';
const mongoDBConfig = JSON.parse(process.env.MONGODB_BINDING);

module.exports = {
	port: process.env.PORT || 80,
	host: '0.0.0.0',
	services: {
		mongodb: {
			uri: mongoDBConfig.uri,
			ca_certificate_base64: mongoDBConfig.ca_certificate_base64,
			database: process.env.database,
		},
		redis: {
			uri: '',
		},
	},
};
