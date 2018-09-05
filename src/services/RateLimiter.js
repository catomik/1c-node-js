const sleep = time => new Promise(resolve => setTimeout(resolve, time));

class RateLimiter {
	constructor(config, redis) {
		this.config = config;
		this.redis = redis;
	}

	async limit(key, limit = 1000) {
		let response = await this.redis.get(`rate.${key}`);

		if (!response) {
			response = '{}';
		}

		const rate = JSON.parse(response);
		let {
			ticks = 0,
			modified = new Date(),
		} = rate;

		const {
			pause = false,
		} = rate;

		ticks += 1;

		if (ticks > limit) {
			this.redis.set(`rate.${key}`, JSON.stringify({ ticks, modified, pause: true }));
			await sleep(1000);

			ticks = 0;
			modified = new Date();
			await this.redis.set(`rate.${key}`, JSON.stringify({ ticks, modified, pause: false }));
			return this.limit(key, limit);
		} else if (pause === true) {
			await sleep(1000);
			return this.limit(key, limit);
		}

		this.redis.set(`rate.${key}`, JSON.stringify({ ticks, modified }));

		return true;
	}
}

module.exports = RateLimiter;
