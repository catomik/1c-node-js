module.exports = `
mutation AddInvoice($input: SupplierInvoiceInputType) {
	updateSupplierInvoice(input: $input) {
		_id
		meta { invoiceNumber }
	}
}
`;
