const Common = require('@sixten/asteria-common');

const verificationMapper = [
	{
		accounts: ['7010', '7210', '7220', '7082', '7285', '7286', '7083', '7283', '7284'],
		process: (transaction, sums) => {
			let result = sums[transaction.TransactionDate];
			if (!result) {
				result = {
					number: transaction.TransactionDate + '_' + transaction.VoucherSeries + '_' + transaction.VoucherNumber,
					desc: transaction.Description,
				};
			}

			if (!result.salary) {
				result.salary = {
					salary: 0,
					sick: 0,
					vacation: 0,
					parental: 0,
					misc: 0,
					total: 0,
				};
			}

			for (let i = 0; i < transaction.VoucherRows.length; i++) {
				const line = transaction.VoucherRows[i];
				const sum = line.Debit - line.Credit;
				if (line.Account.toString() >= '7300' && line.Account.toString() < '7400') {
					result.salary.misc += Math.round(sum);
					result.salary.total += sum;
					continue;
				}

				switch (line.Account.toString()) {
					case '1382':
						result.salary.misc += Math.round(sum);
						result.salary.total += sum;
						break;
					case '2710':
						result.salary.salary += Math.round(sum);
						result.salary.total += sum;
						break;
					case '2790':
						result.salary.misc += Math.round(sum);
						result.salary.total += sum;
						break;
					case '7010':
					case '7210':
					case '7220':
						result.salary.salary += Math.round(sum);
						result.salary.total += sum;
						break;
					case '7081':
					case '7281':
						result.salary.sick += Math.round(sum);
						result.salary.total += sum;
						break;
					case '7082':
					case '7285':
					case '7286':
						result.salary.vacation += Math.round(sum);
						result.salary.total += sum;
						break;
					case '7083':
					case '7283':
					case '7284':
						result.salary.parental += Math.round(sum);
						result.salary.total += sum;
						break;
					case '3740':
						result.salary.total -= sum;
						break;
					default:
						break;

				}
			}

			if (result.salary.total !== 0) {
				sums[transaction.TransactionDate] = result;
			}

			return sums;
		},
	},
	{
		accounts: ['1630'],
		process: (transaction, sums) => {
			let result = sums[transaction.TransactionDate];
			if (!result) {
				result = {
					number: transaction.TransactionDate + '_' + transaction.VoucherSeries + '_' + transaction.VoucherNumber,
					desc: transaction.Description,
				};
			}

			if (!result.taxes) {
				result.taxes = {
					salary: 0,
					social: 0,
					vat: 0,
					taxes: 0,
					misc: 0,
					total: 0,
				};
			}

			for (let i = 0; i < transaction.VoucherRows.length; i++) {
				const line = transaction.VoucherRows[i];
				const sum = line.Debit - line.Credit;
				switch (line.Account.toString()) {
					case '2510':
						if (sum < 0) {
							break;
						}

						result.taxes.taxes += Math.round(sum);
						result.taxes.misc -= sum;
						break;
					case '2650':
						if (sum < 0) {
							break;
						}

						result.taxes.vat += Math.round(sum);
						result.taxes.misc -= sum;
						break;
					case '2710':
						if (sum < 0) {
							break;
						}

						result.taxes.salary += Math.round(sum);
						result.taxes.misc -= sum;
						break;
					case '2731':
						if (sum < 0) {
							break;
						}

						result.taxes.social += Math.round(sum);
						result.taxes.misc -= sum;
						break;
					case '1930':
						result.taxes.misc -= sum;
						result.taxes.total -= sum;
						break;
					case '3740':
						result.taxes.misc -= sum;
						break;
					default:
						break;
				}
			}

			if (result.taxes.total !== 0) {
				sums[transaction.TransactionDate] = result;
			}

			return sums;
		}
	}
];

module.exports = (item) => {
	const processed = {};
	const result = {};

	for (let j = 0; j < item.VoucherRows.length; j++) {
		for (let k = 0; k < verificationMapper.length; k++) {
			const processor = verificationMapper[k];

			if (!processed[item.VoucherRows[j].Account] && processor.accounts.indexOf(item.VoucherRows[j].Account.toString()) !== -1) {
				processor.accounts.reduce((map, account) => {
					map[account] = true;

					return map;
				}, processed);

				processor.process(item, result);
			}
		}
	}

	const expenses = [];
	const keys = Object.keys(result);
	for (let i = 0; i < keys.length; i += 1) {
		const data = result[keys[i]];

		if (data.taxes) {
			const amount = data.taxes.total;

			const trans = {
				meta: {
					//lines: [],
					reference: data.number,
					description: data.desc,
				},
				type: 'expenses.tax',
				dates: {
					created: new Date(keys[i]),
					due: new Date(keys[i]),
					paid: new Date(keys[i]),
				},
				sums: {
					tax: 0,
					total: amount,
					currency: 'SEK',
				},
			};

			/*
			if (data.taxes.salary > 0) {
				trans.meta.lines.push({
					type: 'expenses.tax.salary',
					tax: 0,
					total: data.taxes.salary,
					currency: 'SEK',
				});
			}

			if (data.taxes.social > 0) {
				trans.meta.lines.push({
					type: 'expenses.tax.social',
					tax: 0,
					total: data.taxes.social,
					currency: 'SEK',
				});
			}

			if (data.taxes.vat > 0) {
				trans.meta.lines.push({
					type: 'expenses.tax.vat',
					tax: 0,
					total: data.taxes.vat,
					currency: 'SEK',
				});
			}

			if (data.taxes.taxes > 0) {
				trans.meta.lines.push({
					type: 'expenses.tax.taxes',
					tax: 0,
					total: data.taxes.taxes,
					currency: 'SEK',
				});
			}

			if (data.taxes.misc > 0) {
				trans.meta.lines.push({
					type: 'expenses.tax.misc',
					tax: 0,
					total: data.taxes.misc,
					currency: 'SEK',
				});
			}
			*/
			expenses.push(trans);
		} else if (data.salary) {
			const amount = data.salary.total;
			const trans = {
				meta: {
					//lines: [],
					reference: data.number,
					description: data.desc,
				},
				type: 'expenses.salary',
				dates: {
					created: new Date(keys[i]),
					due: new Date(keys[i]),
					paid: new Date(keys[i]),
				},
				sums: {
					tax: 0,
					total: amount,
					currency: 'SEK',
				},
			};

			/*
			if (data.salary.salary > 0) {
				trans.meta.lines.push({
					type: 'expenses.salary.salary',
					tax: 0,
					total: data.salary.salary,
					currency: 'SEK',
				});
			}

			if (data.salary.sick > 0) {
				trans.meta.lines.push({
					type: 'expenses.salary.sick',
					tax: 0,
					total: data.salary.sick,
					currency: 'SEK',
				});
			}

			if (data.salary.parental > 0) {
				trans.meta.lines.push({
					type: 'expenses.salary.parental',
					tax: 0,
					total: data.salary.parental,
					currency: 'SEK',
				});
			}

			if (data.salary.misc > 0) {
				trans.meta.lines.push({
					type: 'expenses.salary.misc',
					tax: 0,
					total: data.salary.misc,
					currency: 'SEK',
				});
			}

			if (data.salary.vacation > 0) {
				trans.meta.lines.push({
					type: 'expenses.salary.vacation',
					tax: 0,
					total: data.salary.vacation,
					currency: 'SEK',
				});
			}
			*/
			expenses.push(trans);
		}
	}

	return expenses;
}
