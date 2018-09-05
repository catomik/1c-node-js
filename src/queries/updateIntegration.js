module.exports = `
mutation updateIntegration($input: CompanyInputIntegrationType){
	updateIntegration(input: $input) {
	  _id
	  name,
	  integrations {
		key
		config
	  }
	}
  }
`;
