const Common = require('@sixten/asteria-common');
const ClientMapper = require('./Client.js');

module.exports = Common.Utils.Mapper(ClientMapper.keyMap.concat([
	{ src: 'clientNumber', dest: 'meta.customerNumber' },
]));
