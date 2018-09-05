module.exports = `
mutation AddInvoice($input: CustomerInvoiceInputType) {
	updateCustomerInvoice(input: $input) {
		_id
		meta { invoiceNumber }
	}
}
`;
