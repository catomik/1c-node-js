const expect = require('chai').expect;
const sinon = require('sinon');
const CustomerMapper = require('../src/mappers/Customer');

const csvtojson = require('csvtojson');

describe('Test', () => {
	it('should throw error', (done) => {
		csvtojson()
			.fromFile('example/customers.csv')
			.on('json', (jsonObj) => {
				const customer = CustomerMapper({}, jsonObj);
				//console.log(customer);
			})
			.on('done', (error) => {
				done();
			});
	});
});
