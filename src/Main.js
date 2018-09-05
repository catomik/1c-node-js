const config = require('../config/config');
const Common = require('@sixten/asteria-common');
const kue = require('kue');
const cluster = require('cluster');
const http = require('http');
const Redis = require('ioredis');
const fs = require('fs');

const Integrations = require('./integrations');

const log = Common.Utils.logging;


const redis = new Redis(config.services.redis.uri);
const queue = kue.createQueue({
	redis: config.services.redis.uri,
});

const clusterWorkerSize = 1;// require('os').cpus().length;

if (cluster.isMaster) {
	for (let i = 0; i < clusterWorkerSize; i += 1) {
		cluster.fork();
	}

	queue.on('error', (err) => {
		log.log('Oops... ', err);
	});

	queue.inactive((err, ids) => { // others are active, complete, failed, delayed
		log.log(`Jobs Waiting: ${ids.length}`);
	});

	queue.delayed((err, ids) => { // others are active, complete, failed, delayed
		log.log(`Jobs delayed: ${ids.length}`);
	});

	queue.failed((err, ids) => { // others are active, complete, failed, delayed
		log.log(`Jobs failed: ${ids.length}`);
	});

	queue.active((err, ids) => { // others are active, complete, failed, delayed
		log.log(`Jobs Active: ${ids.length}`);
	});

	const requestHandler = (request, response) => {
		response.end('Welcome to Bank Integrations');
	};

	const server = http.createServer(requestHandler);

	server.listen(config.port, (err) => {
		if (err) {
			log.error('something bad happened', err);
			throw err;
		}

		log.log(`server is listening on ${config.port}`);
	});
	/*
	queue.create(
		'erp.fortnox.import',
		{
			token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjU4YTc1OTgxMzhjMzE3MDAzZDJiYTI1ZCIsImNvbXBhbnlJZCI6IjU4ZGQxNDc1MGY4Yzg0MDUxNTg5ZWNlYyIsInVzZXJuYW1lIjoic2l4dGVuQGdyZXZlc211aGwuc2UiLCJmdWxsbmFtZSI6IlNpeHRlbiBHcmV2ZXNtdWhsIiwicm9sZSI6InVzZXIifSwiaWF0IjoxNTEyMDU2NjU3LCJleHAiOjE1MTIwNjAyNTd9.AHv-SadBKIF6WHLoPEzv7J0aBq6810mEXsvO6Vce89o',
		}
	)
		.attempts(1)
		.removeOnComplete(true)
		.save(() => {});
	*/
	/*
	queue.create(
		'erp.fortnox.import',
		{
			token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjU4YTc1OTgxMzhjMzE3MDAzZDJiYTI1ZCIsImNvbXBhbnlJZCI6IjU4ZGQxNDc1MGY4Yzg0MDUxNTg5ZWNlYyIsInVzZXJuYW1lIjoic2l4dGVuQGdyZXZlc211aGwuc2UiLCJmdWxsbmFtZSI6IlNpeHRlbiBHcmV2ZXNtdWhsIiwicm9sZSI6InVzZXIifSwiaWF0IjoxNTExMzkwNTkwLCJleHAiOjE1MTEzOTQxOTB9.hbFmgi9rHWNe-QOx_nFIY2l1MnfZm-CY4Pe4WL3mITU',
		}
	)
		.attempts(1)
		.removeOnComplete(true)
		.on('error', (e) => {
			console.log(e);
		})
		.save(() => {});
	*/
	/*
	fs.readFile('./example/1cImportXML.XML', (err, data) => {
		if (err) {
			log.error(err);
			return;
		}
		queue.create(
			'erp.1c.import',
			{
				payload: {
					data: data.toString('base64'),
				},
				token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjVhMjE4ZTQyYWJlM2RhMDAwMTU3MjQ4ZiIsImZ1bGxuYW1lIjoiVGVzdCIsInVzZXJuYW1lIjoicmZpdGVzdEBhc3RlcmlhaW5jLnNlIiwiY29tcGFueUlkIjoiNWEyMThlNDJhYmUzZGEwMDAxNTcyNDhlIiwiY3JlYXRlZCI6IjIwMTctMTItMDFUMTc6MTU6NDYuOTQwWiIsIm1vZGlmaWVkIjoiMjAxNy0xMi0wMVQxNzoxNTo0Ni45NDBaIn0sImlhdCI6MTUxMzE2OTIxOSwiZXhwIjoxNTEzMTcyODE5fQ.JLe5gTEraCbE0e7wvflnAH7a-um7jv1xqNrTiTx329g',
			}
		)
			.attempts(1)
			.removeOnComplete(true)
			.save(() => {});
	});
	*/
	/*
	fs.readFile('./example/1cImportJson.XML', (err, data) => {
		if (err) {
			log.error(err);
			return;
		}
		queue.create(
			'erp.1c.import',
			{
				payload: {
					data: data.toString('base64'),
				},
				token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjU4YTc1OTgxMzhjMzE3MDAzZDJiYTI1ZCIsImNvbXBhbnlJZCI6IjU4ZGQxNDc1MGY4Yzg0MDUxNTg5ZWNlYyIsInVzZXJuYW1lIjoic2l4dGVuQGdyZXZlc211aGwuc2UiLCJmdWxsbmFtZSI6IlNpeHRlbiBHcmV2ZXNtdWhsIiwicm9sZSI6InVzZXIifSwiaWF0IjoxNTEwMzI0Mjg2LCJleHAiOjE1MTAzMjc4ODZ9.RhRkSRQG_ZHrewKPVvnocWyVDHEllMZvTNA39JADNvU',
			}
		)
			.attempts(1)
			.removeOnComplete(true)
			.save(() => {});
	});
	*/
	/* fs.readFile('./example/data.xlsx', (err, data) => {
		if (err) {
			log.error(err);
			return;
		}
		queue.create(
			'erp.excel.import',
			{
				payload: {
					data: data.toString('base64'),
				},
				token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjU4YTc1OTgxMzhjMzE3MDAzZDJiYTI1ZCIsImNvbXBhbnlJZCI6IjU4ZGQxNDc1MGY4Yzg0MDUxNTg5ZWNlYyIsInVzZXJuYW1lIjoic2l4dGVuQGdyZXZlc211aGwuc2UiLCJmdWxsbmFtZSI6IlNpeHRlbiBHcmV2ZXNtdWhsIiwicm9sZSI6InVzZXIifSwiaWF0IjoxNTEwMzI0Mjg2LCJleHAiOjE1MTAzMjc4ODZ9.RhRkSRQG_ZHrewKPVvnocWyVDHEllMZvTNA39JADNvU',
			}
		)
			.attempts(1)
			.removeOnComplete(true)
			.save(() => {});
	}); */
} else {
	log.info(`Starting ERP File Worker: ${process.pid}`);

	queue.on('error', (err) => {
		log.error('Oops... ', err);
	});

	queue.watchStuckJobs(1000);

	Integrations.register(queue, redis, config);
}

process.once('SIGTERM', () => {
	queue.shutdown(5000, (err) => {
		log.log('Kue shutdown: ', err || '');
		process.exit(0);
	});
});
