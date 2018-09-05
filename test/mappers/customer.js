const expect = require('chai').expect;
const sinon = require('sinon');
const CustomerMapper = require('../../src/mappers/Customer');

const csvtojson = require('csvtojson');

describe('Customer', () => {
	it('should map data to internal structure', (done) => {
		let tested = false;
		csvtojson()
			.fromFile('example/customers.csv')
			.on('json', (jsonObj) => {
				if (tested) {
					return;
				}

				tested = true;

				const customer = CustomerMapper({}, jsonObj);
				expect(customer).to.deep.equal({
					name: 'Test 1',
					info: {
						orgnumber: '1234',
						vatNumber: '4321',
					},
					meta: {
						customerNumber: '1',
						termsOfPayment: '30',
					},
					contact: {
						internal: {
							name: 'Internal contact',
							email: 'Internal email',
							phone: 'Internal phone',
						},
						general: {
							name: 'person',
							email: 'test@test.se',
							street: 'street',
							street2: 'Street 2',
							city: 'city',
							zipcode: 'zipcode',
							phone: 'phone',
							country: 'SE',
						},
						shipping: {
							name: 's contact',
							email: 's email',
							street: 's street',
							street2: 's street2',
							city: 's city',
							zipcode: 's zipcode',
							phone: 's phone',
							country: 'SSE',
						},
					},
				});
			})
			.on('done', (error) => {
				done(error);
			});
	});
});
