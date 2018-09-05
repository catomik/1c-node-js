const Common = require('@sixten/asteria-common');

module.exports = Common.Utils.Mapper([
	{ src: 'type', dest: 'type', required: true },
	{ src: 'reference', dest: 'meta.reference', required: true },
	{ src: 'created', dest: 'dates.created', type: 'date' },
	{ src: 'due', dest: 'dates.due', type: 'date' },
	{ src: 'paid', dest: 'dates.paid', type: 'date' },
	{ src: 'total', dest: 'sums.total', type: 'float', required: true },
	{ src: 'tax', dest: 'sums.tax', type: 'float' },
	{ src: 'currency', dest: 'sums.currency', required: true },
	{ src: 'description', dest: 'meta.description' },
]);
