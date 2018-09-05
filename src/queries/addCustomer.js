module.exports = `
mutation AddClient($input: CustomerInputType) {
	updateCustomer(input: $input) {
		_id
		meta { customerNumber }
	}
}
`;
