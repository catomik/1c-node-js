module.exports = `
mutation AddInvoicePayment($input: InvoicePaymentInput) {
	addCustomerInvoicePayment(input: $input) {
		_id
		meta { invoiceNumber }
	}
}
`;
