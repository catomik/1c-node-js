module.exports = `
query getCompany {
	company {
    name,
    integrations {
      key
      config
    }
  }
}
`;
