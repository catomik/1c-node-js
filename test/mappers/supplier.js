const expect = require('chai').expect;
const sinon = require('sinon');
const SupplierMapper = require('../../src/mappers/Supplier');

const csvtojson = require('csvtojson');

describe('Supplier', () => {
	it('should map data to internal structure', (done) => {
		let tested = false;
		csvtojson()
			.fromFile('example/suppliers.csv')
			.on('json', (jsonObj) => {
				if (tested) {
					return;
				}

				tested = true;

				const supplier = SupplierMapper({}, jsonObj);
				expect(supplier).to.deep.equal({
					name: 'Test 1',
					info: {
						orgnumber: '1234',
						vatNumber: '4321',
					},
					meta: {
						supplierNumber: '1',
						termsOfPayment: '30',
						account: {
							BG: '78236-23',
							PG: '90823-234',
							bank: 'Nordea',
							bankAccountNumber: '123456789',
							bic: '2342234',
							clearingNumber: '6543',
							iban: '23423412534',
						},
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
					},
				});
			})
			.on('done', (error) => {
				done(error);
			});
	});
});
