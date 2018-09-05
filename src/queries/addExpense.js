module.exports = `
mutation AddExpense($input: ExpenseInput) {
	updateExpense(input: $input) {
		_id
		meta { reference }
	}
}
`;
