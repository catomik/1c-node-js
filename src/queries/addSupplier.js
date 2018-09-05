module.exports = `
mutation AddClient($input: SupplierInputType) {
	updateSupplier(input: $input) {
		_id
		meta { supplierNumber }
	}
}
`;
