const Common = require('@sixten/asteria-common');
const ClientMapper = require('./Client.js');

module.exports = Common.Utils.Mapper([
	{ src: 'Active', dest: 'active', default: true },
	{ src: 'name', dest: 'name', default: 'Unknown', required: true },
	{ src: 'orgnum', dest: 'info.orgNumber' },
	{ src: 'vatnumber', dest: 'info.vatNumber' },
	{ src: 'termsOfPayment', dest: 'info.termsOfPayment', required: true },
	{ src: 'clientNumber', dest: 'meta.customerNumber', required: true },
	{ src: 'bank', dest: 'info.accounts[0].bank' },
	{ src: 'bank_account_number', dest: 'info.accounts[0].bankAccountNumber' },
	{ src: 'bank_clearing_number', dest: 'info.accounts[0].clearingNumber' },
	// { src: 'bank_giro', dest: 'info.accounts[0].BG' },
	// { src: 'plus_giro', dest: 'info.accounts[0].PG' },
	{ src: 'bic', dest: 'info.accounts[0].bic' },
	{ src: 'iban', dest: 'info.accounts[0].iban' },
	{ src: 'contact_internal_name', dest: 'contact.internal.name' },
	{ src: 'contact_internal_email', dest: 'contact.internal.email' },
	{ src: 'contact_internal_phone', dest: 'contact.internal.phone' },
	{ src: 'contact_name', dest: 'contact.general.name' },
	{ src: 'contact_email', dest: 'contact.general.email' },
	{ src: 'contact_streett', dest: 'contact.general.street' },
	{ src: 'contact_street_2', dest: 'contact.general.street2' },
	{ src: 'contact_city', dest: 'contact.general.city' },
	{ src: 'contact_zipcode', dest: 'contact.general.zipcode' },
	{ src: 'contact_phone', dest: 'contact.general.phone' },
	{ src: 'contact_country', dest: 'contact.general.country' }
]);
