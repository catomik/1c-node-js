module.exports = `
mutation AddInvoicePayment($input: InvoicePaymentInput) {
	addSupplierInvoicePayment(input: $input) {
		_id
		meta { serialNumber }
	}
}
`;
