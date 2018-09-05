const expect = require('chai').expect;
const sinon = require('sinon');
const PaymentMapper = require('../../src/mappers/Payment');

const csvtojson = require('csvtojson');

describe('Payment', () => {
	it('should map data to internal structure', (done) => {
		let tested = false;
		csvtojson()
			.fromFile('example/payments.csv')
			.on('json', (jsonObj) => {
				if (tested) {
					return;
				}

				tested = true;

				const supplier = PaymentMapper({}, jsonObj);
				expect(supplier).to.deep.equal({
					paymentNumber: '1',
					devaluation: true,
					dates: {
						paid: new Date('2017-08-12'),
					},
					sums: {
						tax: 123,
						total: 1234,
						currency: 'NOK',
					},
					meta: {
						invoiceNumber: '123-123',
						ocr: 'Message / ocr',
						paymentType: 'bg',
						source: 'direct',
					},
				});
			})
			.on('done', (error) => {
				done(error);
			});
	});
});
