process.env.database = process.env.database || 'asteria';
process.env.dbhost = process.env.dbhost || 'localhost';

module.exports = {
	port: process.env.PORT || 7002,
	host: '0.0.0.0',
};
