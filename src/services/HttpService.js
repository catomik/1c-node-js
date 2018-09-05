const request = require('request');
const url = require('url');
const Common = require('@sixten/asteria-common');

const log = Common.Utils.logging;

class HttpService {
	constructor(config) {
		this.config = config;
	}

	delete(path, params, options) {
		return this.execute('DELETE', path, params, null, options);
	}

	get(path, params, options) {
		return this.execute('GET', path, params, null, options);
	}

	patch(path, params, data, options) {
		return this.execute('PATCH', path, params, data, options);
	}

	post(path, params, data, options) {
		return this.execute('POST', path, params, data, options);
	}

	put(path, params, data, options) {
		return this.execute('PUT', path, params, data, options);
	}

	execute(method, path, params, data, options) {
		const requestSetup = {
			method,
			url: url.resolve(this.config.uri, path),
		};

		if (params !== null) {
			requestSetup.qs = params;
		}

		if (data !== null) {
			requestSetup.json = data;
		}

		if (options) {
			const { headers = {} } = options;
			requestSetup.headers = headers;
		}

		log.info('HttpService::execute:', requestSetup);

		return new Promise((resolve, reject) => {
			request(
				requestSetup,
				(error, response, body) => {
					if (error) {
						return reject(error);
					}

					log.info(`HttpService::execute: Service responded with status ${response.statusCode}`);
					// TODO: Handle better for json / not json encoded data
					if (response.statusCode === 200 || response.statusCode === 201) {
						try {
							return resolve(JSON.parse(body));
						} catch (e) {
							return resolve(body);
						}
					}

					try {
						return reject(JSON.parse(body));
					} catch (e) {
						return reject(body);
					}
				}
			);
		});
	}
}

module.exports = HttpService;
