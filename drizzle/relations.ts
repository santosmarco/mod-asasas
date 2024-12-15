import { relations } from "drizzle-orm/relations";
import { countries, customerAccounts, users, cryptoNetworks, cryptoTokens, orderData, fiatCurrencies, currencies, currencyTradingPairs, wallets, organizations, entities, conduitTransactions, currencyPairs2 } from "./schema";

export const customerAccountsRelations = relations(customerAccounts, ({one, many}) => ({
	country_businessCountry: one(countries, {
		fields: [customerAccounts.businessCountry],
		references: [countries.id],
		relationName: "customerAccounts_businessCountry_countries_id"
	}),
	country_countryOfBank: one(countries, {
		fields: [customerAccounts.countryOfBank],
		references: [countries.id],
		relationName: "customerAccounts_countryOfBank_countries_id"
	}),
	customerAccount: one(customerAccounts, {
		fields: [customerAccounts.rootAccountId],
		references: [customerAccounts.id],
		relationName: "customerAccounts_rootAccountId_customerAccounts_id"
	}),
	customerAccounts: many(customerAccounts, {
		relationName: "customerAccounts_rootAccountId_customerAccounts_id"
	}),
	user: one(users, {
		fields: [customerAccounts.userId],
		references: [users.id]
	}),
	orderData_receivingAccount: many(orderData, {
		relationName: "orderData_receivingAccount_customerAccounts_id"
	}),
	orderData_sendingAccount: many(orderData, {
		relationName: "orderData_sendingAccount_customerAccounts_id"
	}),
}));

export const countriesRelations = relations(countries, ({many}) => ({
	customerAccounts_businessCountry: many(customerAccounts, {
		relationName: "customerAccounts_businessCountry_countries_id"
	}),
	customerAccounts_countryOfBank: many(customerAccounts, {
		relationName: "customerAccounts_countryOfBank_countries_id"
	}),
}));

export const usersRelations = relations(users, ({one, many}) => ({
	customerAccounts: many(customerAccounts),
	orderData: many(orderData),
	organization: one(organizations, {
		fields: [users.organizationId],
		references: [organizations.id]
	}),
}));

export const cryptoTokensRelations = relations(cryptoTokens, ({one, many}) => ({
	cryptoNetwork: one(cryptoNetworks, {
		fields: [cryptoTokens.networkId],
		references: [cryptoNetworks.id]
	}),
	orderData_sendingCryptoTokenId: many(orderData, {
		relationName: "orderData_sendingCryptoTokenId_cryptoTokens_id"
	}),
	orderData_receivingCryptoTokenId: many(orderData, {
		relationName: "orderData_receivingCryptoTokenId_cryptoTokens_id"
	}),
	wallets: many(wallets),
	currencyPairs2s: many(currencyPairs2),
}));

export const cryptoNetworksRelations = relations(cryptoNetworks, ({many}) => ({
	cryptoTokens: many(cryptoTokens),
}));

export const orderDataRelations = relations(orderData, ({one}) => ({
	customerAccount_receivingAccount: one(customerAccounts, {
		fields: [orderData.receivingAccount],
		references: [customerAccounts.id],
		relationName: "orderData_receivingAccount_customerAccounts_id"
	}),
	customerAccount_sendingAccount: one(customerAccounts, {
		fields: [orderData.sendingAccount],
		references: [customerAccounts.id],
		relationName: "orderData_sendingAccount_customerAccounts_id"
	}),
	fiatCurrency_sendingFiatCurrencyId: one(fiatCurrencies, {
		fields: [orderData.sendingFiatCurrencyId],
		references: [fiatCurrencies.id],
		relationName: "orderData_sendingFiatCurrencyId_fiatCurrencies_id"
	}),
	cryptoToken_sendingCryptoTokenId: one(cryptoTokens, {
		fields: [orderData.sendingCryptoTokenId],
		references: [cryptoTokens.id],
		relationName: "orderData_sendingCryptoTokenId_cryptoTokens_id"
	}),
	fiatCurrency_receivingFiatCurrencyId: one(fiatCurrencies, {
		fields: [orderData.receivingFiatCurrencyId],
		references: [fiatCurrencies.id],
		relationName: "orderData_receivingFiatCurrencyId_fiatCurrencies_id"
	}),
	cryptoToken_receivingCryptoTokenId: one(cryptoTokens, {
		fields: [orderData.receivingCryptoTokenId],
		references: [cryptoTokens.id],
		relationName: "orderData_receivingCryptoTokenId_cryptoTokens_id"
	}),
	user: one(users, {
		fields: [orderData.userIdExt],
		references: [users.id]
	}),
}));

export const fiatCurrenciesRelations = relations(fiatCurrencies, ({many}) => ({
	orderData_sendingFiatCurrencyId: many(orderData, {
		relationName: "orderData_sendingFiatCurrencyId_fiatCurrencies_id"
	}),
	orderData_receivingFiatCurrencyId: many(orderData, {
		relationName: "orderData_receivingFiatCurrencyId_fiatCurrencies_id"
	}),
	currencyPairs2s: many(currencyPairs2),
}));

export const currencyTradingPairsRelations = relations(currencyTradingPairs, ({one}) => ({
	currency_receivingCurrency: one(currencies, {
		fields: [currencyTradingPairs.receivingCurrency],
		references: [currencies.currencyAbrev],
		relationName: "currencyTradingPairs_receivingCurrency_currencies_currencyAbrev"
	}),
	currency_sendingCurrency: one(currencies, {
		fields: [currencyTradingPairs.sendingCurrency],
		references: [currencies.currencyAbrev],
		relationName: "currencyTradingPairs_sendingCurrency_currencies_currencyAbrev"
	}),
}));

export const currenciesRelations = relations(currencies, ({many}) => ({
	currencyTradingPairs_receivingCurrency: many(currencyTradingPairs, {
		relationName: "currencyTradingPairs_receivingCurrency_currencies_currencyAbrev"
	}),
	currencyTradingPairs_sendingCurrency: many(currencyTradingPairs, {
		relationName: "currencyTradingPairs_sendingCurrency_currencies_currencyAbrev"
	}),
}));

export const walletsRelations = relations(wallets, ({one}) => ({
	cryptoToken: one(cryptoTokens, {
		fields: [wallets.tokenId],
		references: [cryptoTokens.id]
	}),
}));

export const organizationsRelations = relations(organizations, ({many}) => ({
	users: many(users),
}));

export const conduitTransactionsRelations = relations(conduitTransactions, ({one}) => ({
	entity: one(entities, {
		fields: [conduitTransactions.entity],
		references: [entities.entityId]
	}),
}));

export const entitiesRelations = relations(entities, ({many}) => ({
	conduitTransactions: many(conduitTransactions),
}));

export const currencyPairs2Relations = relations(currencyPairs2, ({one}) => ({
	fiatCurrency: one(fiatCurrencies, {
		fields: [currencyPairs2.fiatCurrencyId],
		references: [fiatCurrencies.id]
	}),
	cryptoToken: one(cryptoTokens, {
		fields: [currencyPairs2.cryptoTokenId],
		references: [cryptoTokens.id]
	}),
}));