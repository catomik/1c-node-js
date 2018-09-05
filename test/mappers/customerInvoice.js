const expect = require('chai').expect;
const sinon = require('sinon');
const CustomerMapper = require('../../src/mappers/CustomerInvoice.js');

const csvtojson = require('csvtojson');

describe('Customer Invoice', () => {
	it('should map data to internal structure', (done) => {
		let tested = false;
		csvtojson()
			.fromFile('example/customerInvoices.csv')
			.on('json', (jsonObj) => {
				if (tested) {
					return;
				}

				tested = true;

				const customer = CustomerMapper({}, jsonObj);
				expect(customer).to.deep.equal({
					canceled: true,
					type: 'invoice',
					meta: {
						invoiceNumber: '2178-2',
						customerNumber: '1',
						termsOfPayment: '30',
					},
					dates: {
						invoiceSent: new Date('2017-07-23'),
						invoiceDue: new Date('2017-08-20'),
					},
					sums: {
						tax: 716,
						invoiceTotal: 8276,
						currency: 'NOK',
					},
					credits: ['2'],
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
