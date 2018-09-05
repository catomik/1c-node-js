const config = require('./config');

module.exports = {
	server: {
		debug: {
			log: ['info'],
		},
		app: {
			slogan: 'Asteria Fortnox API',
		},
	},
	connections: [
		{
			port: config.port,
			address: config.host,
			labels: ['api'],
		},
	],
	registrations: [
		{
			plugin: 'inert',
		},
		{
			plugin: 'vision',
		},
		{
			plugin: {
				register: 'hapi-swagger',
				options: {
					info: {
						title: 'Fortnox API Documentation',
						version: '0.0.1',
					},
					expanded: 'none',
					pathPrefixSize: 2,
					pathReplacements: [{
						replaceIn: 'groups',
						pattern: /\{.*\}/,
						replacement: '',
					}],
					securityDefinitions: {
						api_key: {
							type: 'apiKey',
							name: 'Authorization',
							in: 'header',
						},
					},
					security: ['api_key'],
				},
			},
			options: {
				select: ['api'],
			},
		},
		{
			plugin: '../node_modules/@sixten/asteria-common/src/controllers/auth',
			options: {
				select: ['api'],
			},
		},
		{
			plugin: './controllers/FortnoxHttpController',
			options: {
				select: ['api'],
				routes: {
					prefix: '/fortnox/',
				},
			},
		},
	],
};
