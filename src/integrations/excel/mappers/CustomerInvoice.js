const Common = require('@sixten/asteria-common');
const InvoiceMapper = require('./Invoice.js');

module.exports = Common.Utils.Mapper(InvoiceMapper.keyMap.concat([
	{ src: 'clientNumber', dest: 'meta.customerNumber' },
]));
