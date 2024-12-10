import {
  pgTable,
  foreignKey,
  serial,
  text,
  boolean,
  integer,
  uuid,
  timestamp,
  real,
  bigint,
  unique,
  date,
  doublePrecision,
  numeric,
  primaryKey,
  pgSequence,
  pgEnum,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const categoryEnum637Cb4B7 = pgEnum('category_enum_637cb4b7', [
  'On-ramp',
  'Off-ramp',
])
export const categoryEnumAd2Fad7F = pgEnum('category_enum_ad2fad7f', [
  'On-ramp',
  'Off-ramp',
])
export const currencyEnum95958A2E = pgEnum('currency_enum_95958a2e', [
  'USD',
  'MXN',
  'BRL',
  'USDC (ETH)',
  'USDT (TRX)',
  'USDT (ETH)',
])
export const internalResponsiblePersonEnumB31B90Bc = pgEnum(
  'internal_responsible_person_enum_b31b90bc',
  ['Victor', 'Angel', 'Arnold', 'Daniel S']
)
export const operationTypeEnum741Ea889 = pgEnum(
  'operation_type_enum_741ea889',
  ['on_ramp', 'off_ramp']
)
export const ownerEnumA6707072 = pgEnum('owner_enum_a6707072', [
  'user',
  'bridge',
  'conduit',
])
export const paymentTypeEnum7Cc3Da13 = pgEnum('payment_type_enum_7cc3da13', [
  'Third-Party Payment',
  'On-Ramp',
  'Off-Ramp',
])
export const receivingCurrencyTypeEnum9F498E43 = pgEnum(
  'receiving_currency_type_enum_9f498e43',
  ['stable', 'fiat']
)
export const recievingMethodEnum17B6B816 = pgEnum(
  'recieving_method_enum_17b6b816',
  ['Telegram', 'WhatsApp', 'Order Form']
)
export const recipientCurrencyEnum9767781C = pgEnum(
  'recipient_currency_enum_9767781c',
  ['USDT (TRX)', 'USD (FIAT)', 'USDT (ETH)', 'USDC (ETH)', 'MXN (FIAT)']
)
export const recipientCurrencyEnumFd3Db64B = pgEnum(
  'recipient_currency_enum_fd3db64b',
  ['USDT (TRX)', 'USD (FIAT)', 'USDT (ETH)', 'USDC (ETH)', 'MXN (FIAT)']
)
export const recipientCurrencyEnumFf577Fa3 = pgEnum(
  'recipient_currency_enum_ff577fa3',
  ['USDT (TRX)', 'USD (FIAT)', 'USDT (ETH)', 'USDC (ETH)', 'MXN (FIAT)']
)
export const senderCurrencyEnum06F7D958 = pgEnum(
  'sender_currency_enum_06f7d958',
  ['USD (FIAT)', 'USDC (ETH)', 'USDT (ETH)', 'USDT (TRX)', 'MXN (FIAT)']
)
export const senderCurrencyEnum1E5C83F7 = pgEnum(
  'sender_currency_enum_1e5c83f7',
  ['USD (FIAT)', 'USDC (ETH)', 'USDT (ETH)', 'USDT (TRX)', 'MXN (FIAT)']
)
export const senderCurrencyEnum5B17Ffbd = pgEnum(
  'sender_currency_enum_5b17ffbd',
  ['USD (FIAT)', 'USDC (ETH)', 'USDT (ETH)', 'USDT (TRX)', 'MXN (FIAT)']
)
export const sendingCurrencyTypeEnumF9F3Ddac = pgEnum(
  'sending_currency_type_enum_f9f3ddac',
  ['stable', 'fiat']
)
export const sourceEnum53B14601 = pgEnum('source_enum_53b14601', [
  'Manual Sheet',
])
export const statusEnum0D232213 = pgEnum('status_enum_0d232213', [
  'Submitted',
  'Raised',
  'Sent',
  'Received',
  'Cancelled',
  'Pending',
])
export const statusEnum607Af79C = pgEnum('status_enum_607af79c', [
  'active',
  'inactive',
  'deleted',
])
export const statusEnum7892B369 = pgEnum('status_enum_7892b369', [
  'COMPLETED',
  'AWAITING_COMPLIANCE_REVIEW',
  'CANCELLED',
  'PAYMENT_PROCESSED',
  'PROCESSING_PAYMENT',
  'AWAITING_FUNDS',
  'IN_COMPLIANCE_REVIEW',
  'CREATED',
])
export const statusEnumA1Daba09 = pgEnum('status_enum_a1daba09', [
  'AWAITING_COMPLIANCE_REVIEW',
  'PAYMENT_PROCESSED',
  'CANCELLED',
  'COMPLETED',
])
export const statusEnumDc69B788 = pgEnum('status_enum_dc69b788', [
  'active',
  'updated',
  'deleted',
])
export const statusEnumDef65B9D = pgEnum('status_enum_def65b9d', [
  'AWAITING_COMPLIANCE_REVIEW',
  'PAYMENT_PROCESSED',
  'CANCELLED',
  'COMPLETED',
])
export const typeEnum3Da41284 = pgEnum('type_enum_3da41284', ['fiat', 'crypto'])
export const typeEnumAdbf729B = pgEnum('type_enum_adbf729b', ['fiat', 'crypto'])

export const currencyPairsCopyIdSeq1 = pgSequence(
  'currency_pairs_copy_id_seq1',
  {
    startWith: '1',
    increment: '1',
    minValue: '1',
    maxValue: '2147483647',
    cache: '1',
    cycle: false,
  }
)

export const customerAccounts = pgTable(
  'Customer_Accounts',
  {
    id: serial().primaryKey().notNull(),
    businessName: text('business_name'),
    accountNumber: text('account_number'),
    businessAddress: text('business_address'),
    swiftCode: text('swift_code'),
    bankAddress: text('bank_address'),
    nameOfBank: text('name_of_bank'),
    isSelfAccount: boolean('is_self_account').default(false),
    countryOfBank: integer('country_of_bank'),
    addressOfBank: text('address_of_bank'),
    nameOfIntermediaryBank: text('name_of_intermediary_bank'),
    routingNumberOfIntermediaryBank: text(
      'routing_number_of_intermediary_bank'
    ),
    businessCountry: integer('business_country'),
    businessCity: text('business_city'),
    businessStateProvince: text('business_state_province'),
    businessPostalCode: text('business_postal_code'),
    organization: text(),
    rootAccountId: integer('root_account_id'),
    rootAccountName: text('root_account_name'),
    currency: currencyEnum95958A2E(),
    type: typeEnumAdbf729B(),
    cryptoPubKey: text('crypto_pub_key'),
    externalId: uuid('external_id').defaultRandom().notNull(),
    userId: integer('user_id'),
    status: statusEnum607Af79C(),
  },
  table => {
    return {
      customerAccountsBusinessCountryFkey: foreignKey({
        columns: [table.businessCountry],
        foreignColumns: [countries.id],
        name: 'Customer_Accounts_business_country_fkey',
      }),
      customerAccountsCountryOfBankFkey: foreignKey({
        columns: [table.countryOfBank],
        foreignColumns: [countries.id],
        name: 'Customer_Accounts_country_of_bank_fkey',
      }),
      customerAccountsRootAccountIdFkey: foreignKey({
        columns: [table.rootAccountId],
        foreignColumns: [table.id],
        name: 'Customer_Accounts_root_account_id_fkey',
      }),
      customerAccountsUserIdFkey: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: 'Customer_Accounts_user_id_fkey',
      }),
    }
  }
)

export const sumsubIndividuals = pgTable('sumsub_individuals', {
  applicantId: text('applicant_id').primaryKey().notNull(),
  externalId: text('external_id'),
  creationDate: timestamp('creation_date', {
    withTimezone: true,
    mode: 'string',
  }),
  lastReviewDate: timestamp('last_review_date', {
    withTimezone: true,
    mode: 'string',
  }),
  applicantName: text('applicant_name'),
  applicantEmail: text('applicant_email'),
  applicantPhoneNumber: text('applicant_phone_number'),
  applicantCountry: text('applicant_country'),
  rejectType: text('reject_type'),
  rejectLabels: text('reject_labels'),
  customTags: text('custom_tags'),
  sourceKey: text('source_key'),
  result: text(),
  applicantLevel: text('applicant_level'),
  platform: text(),
  status: text(),
  userComment: text('user_comment'),
  clientComment: text('client_comment'),
})

export const countries = pgTable('countries', {
  id: serial().primaryKey().notNull(),
  englishShortNameLowerCase: text('english_short_name_lower_case'),
  alpha2Code: text('alpha_2_code'),
  alpha3Code: text('alpha_3_code'),
  numericCode: real('numeric_code'),
  iso31662: text('iso_3166_2'),
})

export const cryptoNetworks = pgTable('crypto_networks', {
  name: text().notNull(),
  symbol: text().notNull(),
  status: statusEnum607Af79C().default('inactive'),
  id: uuid().defaultRandom().primaryKey().notNull(),
})

export const kpiDashboard = pgTable('kpi_dashboard', {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint({ mode: 'number' }).primaryKey().notNull(),
  campaignName: text('campaign_name'),
  campaignOwner: text('campaign_owner'),
  startDate: text('start_date'),
  endDate: text('end_date'),
  budget: text(),
  impressions: text(),
  clicks: text(),
  conversions: text(),
  revenue: text(),
  photo: text(),
})

export const conduitTransactionsCopy = pgTable(
  'conduit_transactions_copy',
  {
    id: text().notNull(),
    sender: text(),
    effective: date(),
    status: statusEnumDef65B9D(),
    senderCurrency: senderCurrencyEnum06F7D958('sender_currency'),
    recipientCurrency: recipientCurrencyEnumFd3Db64B('recipient_currency'),
    created: timestamp({ withTimezone: true, mode: 'string' }),
    senderAmount: text('sender_amount'),
    client: text(),
    type: text(),
    purpose: text(),
    recipientAmount: text('recipient_amount'),
    recipient: text(),
    fees: real(),
    supportingDocs: text('supporting_docs'),
    transactionHash: text('transaction_hash'),
    reference: text(),
    amountSettled: text('amount_settled'),
    revenue: text(),
  },
  table => {
    return {
      conduitTransactionsCopyIdKey: unique(
        'conduit_transactions_copy_id_key'
      ).on(table.id),
    }
  }
)

export const conduitTransactionsCopy2 = pgTable(
  'conduit_transactions_copy2',
  {
    created: timestamp({ withTimezone: true, mode: 'string' }),
    id: text().notNull(),
    sender: text(),
    type: text(),
    senderAmount: text('sender_amount'),
    client: text(),
    status: statusEnumA1Daba09(),
    recipientAmount: text('recipient_amount'),
    senderCurrency: senderCurrencyEnum1E5C83F7('sender_currency'),
    supportingDocs: text('supporting_docs'),
    recipient: text(),
    effective: date(),
    transactionHash: text('transaction_hash'),
    recipientCurrency: recipientCurrencyEnum9767781C('recipient_currency'),
    reference: text(),
    purpose: text(),
    revenue: text(),
    fees: real(),
    amountSettled: text('amount_settled'),
  },
  table => {
    return {
      conduitTransactionsCopy2IdKey: unique(
        'conduit_transactions_copy2_id_key'
      ).on(table.id),
    }
  }
)

export const cryptoTokens = pgTable(
  'crypto_tokens',
  {
    name: text().notNull(),
    symbol: text().notNull(),
    imageUrl: text('image_url'),
    id: uuid().defaultRandom().primaryKey().notNull(),
    networkId: uuid('network_id').notNull(),
  },
  table => {
    return {
      cryptoTokensNetworkIdFkey: foreignKey({
        columns: [table.networkId],
        foreignColumns: [cryptoNetworks.id],
        name: 'crypto_tokens_network_id_fkey',
      }),
    }
  }
)

export const bridgeTransfers = pgTable('bridge_transfers', {
  id: text().primaryKey().notNull(),
  state: text(),
  amount: doublePrecision(),
  customer: text(),
  sourcePaymentRail: text('source_payment_rail'),
  sourceCurrency: text('source_currency'),
  destinationPaymentRail: text('destination_payment_rail'),
  destinationCurrency: text('destination_currency'),
  createdAt: timestamp('created_at', { mode: 'string' }),
  updatedAt: timestamp('updated_at', { mode: 'string' }),
})

export const currencies = pgTable(
  'currencies',
  {
    id: serial().primaryKey().notNull(),
    currencyAbrev: text('currency_abrev'),
    type: typeEnum3Da41284(),
    icon: text(),
    depositAddress: text('deposit_address'),
  },
  table => {
    return {
      currenciesCurrencyAbrevKey: unique('currencies_currency_abrev_key').on(
        table.currencyAbrev
      ),
    }
  }
)

export const fiatCurrencies = pgTable('fiat_currencies', {
  name: text().notNull(),
  symbol: text().notNull(),
  imageUrl: text('image_url'),
  id: uuid().defaultRandom().primaryKey().notNull(),
})

export const orderData = pgTable(
  'Order_Data',
  {
    id: serial().primaryKey().notNull(),
    dateOfRequest: timestamp('date_of_request', {
      withTimezone: true,
      mode: 'string',
    }).default('2024-10-08 16:26:19.406701+00'),
    paymentType: paymentTypeEnum7Cc3Da13('payment_type'),
    recievingMethod: recievingMethodEnum17B6B816('recieving_method'),
    amountSent: numeric('amount_sent').default('0'),
    txnId: text('txn_id'),
    internalResponsiblePerson: internalResponsiblePersonEnumB31B90Bc(
      'internal_responsible_person'
    ),
    status: statusEnum0D232213(),
    datePaymentSent: timestamp('date_payment_sent', {
      withTimezone: true,
      mode: 'string',
    }),
    notes: text(),
    invoiceFileId: text('invoice_file_id'),
    sendingAccount: integer('sending_account'),
    receivingAccount: integer('receiving_account'),
    receiptFileId: text('receipt_file_id'),
    txnHash: text('txn_hash'),
    userId: text('user_id'),
    omad: text(),
    imad: text(),
    settledAmount: integer('settled_amount'),
    organization: text(),
    amountReceived: numeric('amount_received').default('0'),
    sendingFiatCurrencyId: uuid('sending_fiat_currency_id'),
    sendingCryptoTokenId: uuid('sending_crypto_token_id'),
    receivingFiatCurrencyId: uuid('receiving_fiat_currency_id'),
    receivingCryptoTokenId: uuid('receiving_crypto_token_id'),
    invoiceFileUrl: text('invoice_file_url'),
    userEmail: text('user_email'),
    isThirdParty: boolean('is_third_party').default(false),
    purpose: text(),
    receiptFileUrl: text('receipt_file_url'),
    deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'string' }),
    senderBusinessName: text('sender_business_name'),
    last4SenderBankAccountNumber: text('last4_sender_bank_account_number'),
    userIdExt: integer('user_id_ext'),
    platformFee: doublePrecision('platform_fee').default(sql`'0'`),
    developerFee: doublePrecision('developer_fee').default(sql`'0'`),
  },
  table => {
    return {
      orderDataReceivingAccountFkey: foreignKey({
        columns: [table.receivingAccount],
        foreignColumns: [customerAccounts.id],
        name: 'Order_Data_receiving_account_fkey',
      }).onDelete('set null'),
      orderDataSendingAccountFkey: foreignKey({
        columns: [table.sendingAccount],
        foreignColumns: [customerAccounts.id],
        name: 'Order_Data_sending_account_fkey',
      }).onDelete('set null'),
      orderDataSendingFiatCurrencyIdFkey: foreignKey({
        columns: [table.sendingFiatCurrencyId],
        foreignColumns: [fiatCurrencies.id],
        name: 'Order_Data_sending_fiat_currency_id_fkey',
      }),
      orderDataSendingCryptoTokenIdFkey: foreignKey({
        columns: [table.sendingCryptoTokenId],
        foreignColumns: [cryptoTokens.id],
        name: 'Order_Data_sending_crypto_token_id_fkey',
      }),
      orderDataReceivingFiatCurrencyIdFkey: foreignKey({
        columns: [table.receivingFiatCurrencyId],
        foreignColumns: [fiatCurrencies.id],
        name: 'Order_Data_receiving_fiat_currency_id_fkey',
      }),
      orderDataReceivingCryptoTokenIdFkey: foreignKey({
        columns: [table.receivingCryptoTokenId],
        foreignColumns: [cryptoTokens.id],
        name: 'Order_Data_receiving_crypto_token_id_fkey',
      }),
      orderDataUserIdExtFkey: foreignKey({
        columns: [table.userIdExt],
        foreignColumns: [users.id],
        name: 'Order_Data_user_id_ext_fkey',
      }),
    }
  }
)

export const products = pgTable('products', {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint({ mode: 'number' }).primaryKey().notNull(),
  name: text(),
  quantity: integer(),
  unitPriceCents: integer('unit_price_cents'),
  createdAt: timestamp('created_at', { mode: 'string' }),
  updatedAt: timestamp('updated_at', { mode: 'string' }),
  imageUrl: text('image_url'),
  partNumber: text('part_number'),
})

export const bridgeCustomers = pgTable('bridge_customers', {
  id: text().primaryKey().notNull(),
  type: text(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  email: text(),
  status: text(),
  createdAt: timestamp('created_at', { mode: 'string' }),
  updatedAt: timestamp('updated_at', { mode: 'string' }),
  hasAcceptedTermsOfService: boolean('has_accepted_terms_of_service'),
})

export const orderTypes = pgTable('order_types', {
  id: serial().primaryKey().notNull(),
  orderTypeName: text('order_type_name'),
  fee: numeric({ precision: 15, scale: 4 }).default('0'),
})

export const currencyPairs = pgTable('currency_pairs', {
  id: serial().primaryKey().notNull(),
  sendingCurrency: text('sending_currency'),
  sendingCurrencyType: sendingCurrencyTypeEnumF9F3Ddac('sending_currency_type'),
  receivingCurrency: text('receiving_currency'),
  receivingCurrencyType: receivingCurrencyTypeEnum9F498E43(
    'receiving_currency_type'
  ),
  feeTotal: numeric('fee_total', { precision: 15, scale: 4 }).default('0'),
  category: categoryEnum637Cb4B7(),
})

export const rampTransfers = pgTable('ramp_transfers', {
  id: text().primaryKey().notNull(),
  state: text(),
  amount: doublePrecision(),
  customer: text(),
  sourcePaymentRail: text('source_payment_rail'),
  sourceCurrency: text('source_currency'),
  destinationPaymentRail: text('destination_payment_rail'),
  destinationCurrency: text('destination_currency'),
  createdAt: timestamp('created_at', { mode: 'string' }),
  updatedAt: timestamp('updated_at', { mode: 'string' }),
})

export const rampCustomers = pgTable('ramp_customers', {
  id: text().primaryKey().notNull(),
  type: text(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  email: text(),
  status: text(),
  createdAt: timestamp('created_at', { mode: 'string' }),
  updatedAt: timestamp('updated_at', { mode: 'string' }),
  hasAcceptedTermsOfService: boolean('has_accepted_terms_of_service'),
})

export const bridgeTransfersAuto = pgTable('bridge_transfers_auto', {
  id: text().primaryKey().notNull(),
  state: text(),
  amount: doublePrecision(),
  customer: text(),
  sourcePaymentRail: text('source_payment_rail'),
  sourceCurrency: text('source_currency'),
  destinationPaymentRail: text('destination_payment_rail'),
  destinationCurrency: text('destination_currency'),
  createdAt: timestamp('created_at', { mode: 'string' }),
  updatedAt: timestamp('updated_at', { mode: 'string' }),
})

export const currencyTradingPairs = pgTable(
  'currency_trading_pairs',
  {
    receivingCurrency: text('receiving_currency'),
    feeTotal: numeric('fee_total', { precision: 15, scale: 4 }).default('0'),
    category: categoryEnumAd2Fad7F(),
    id: integer().primaryKey().generatedByDefaultAsIdentity({
      name: 'currency_pairs_copy_id_seq',
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
      cache: 1,
    }),
    sendingCurrency: text('sending_currency'),
  },
  table => {
    return {
      currencyPairsCopyReceivingCurrencyFkey: foreignKey({
        columns: [table.receivingCurrency],
        foreignColumns: [currencies.currencyAbrev],
        name: 'currency_pairs_copy_receiving_currency_fkey',
      }),
      currencyPairsCopySendingCurrencyFkey: foreignKey({
        columns: [table.sendingCurrency],
        foreignColumns: [currencies.currencyAbrev],
        name: 'currency_pairs_copy_sending_currency_fkey',
      }),
    }
  }
)

export const wallets = pgTable(
  'wallets',
  {
    owner: ownerEnumA6707072(),
    address: text().notNull(),
    note: text(),
    id: uuid().defaultRandom().primaryKey().notNull(),
    tokenId: uuid('token_id').notNull(),
  },
  table => {
    return {
      walletsTokenIdFkey: foreignKey({
        columns: [table.tokenId],
        foreignColumns: [cryptoTokens.id],
        name: 'wallets_token_id_fkey',
      }),
    }
  }
)

export const users = pgTable(
  'users',
  {
    id: serial().primaryKey().notNull(),
    organizationId: uuid('organization_id'),
    name: text().notNull(),
    email: text().notNull(),
    hashedApiKey: text('hashed_api_key'),
  },
  table => {
    return {
      usersOrganizationIdFkey: foreignKey({
        columns: [table.organizationId],
        foreignColumns: [organizations.id],
        name: 'users_organization_id_fkey',
      }),
    }
  }
)

export const volumeOnetimePayments = pgTable('volume_onetime_payments', {
  day: date().primaryKey().notNull(),
  arbitrum: doublePrecision(),
  bitcoin: doublePrecision(),
  bsc: doublePrecision(),
  ethereum: doublePrecision(),
  gnosis: doublePrecision(),
  optimism: doublePrecision(),
  polygon: doublePrecision(),
  sepolia: doublePrecision(),
  sol: doublePrecision(),
})

export const volumeSubscriptionPayments = pgTable(
  'volume_subscription_payments',
  {
    day: date().primaryKey().notNull(),
    arbitrum: doublePrecision(),
    bitcoin: doublePrecision(),
    bsc: doublePrecision(),
    ethereum: doublePrecision(),
    gnosis: doublePrecision(),
    optimism: doublePrecision(),
    polygon: doublePrecision(),
    sepolia: doublePrecision(),
    sol: doublePrecision(),
  }
)

export const organizations = pgTable('organizations', {
  displayName: text('display_name'),
  logoUrl: text('logo_url'),
  id: uuid().defaultRandom().primaryKey().notNull(),
})

export const conduitTransactions = pgTable('conduit_transactions', {
  created: timestamp({ withTimezone: true, mode: 'string' }),
  id: text().primaryKey().notNull(),
  client: text(),
  type: text(),
  status: statusEnum7892B369(),
  effective: date(),
  sender: text(),
  senderAmount: text('sender_amount'),
  senderCurrency: senderCurrencyEnum5B17Ffbd('sender_currency'),
  recipient: text(),
  recipientAmount: text('recipient_amount'),
  recipientCurrency: recipientCurrencyEnumFf577Fa3('recipient_currency'),
  fees: real(),
  purpose: text(),
  supportingDocs: text('supporting_docs'),
  reference: text(),
  transactionHash: text('transaction_hash'),
  amountSettled: text('amount_settled'),
  revenue: text(),
  source: sourceEnum53B14601(),
})

export const currencyPairs2 = pgTable(
  'currency_pairs_2',
  {
    fiatCurrencyId: uuid('fiat_currency_id').notNull(),
    cryptoTokenId: uuid('crypto_token_id').notNull(),
    operationType: operationTypeEnum741Ea889('operation_type').notNull(),
    fee: numeric({ precision: 15, scale: 8 }).default('0').notNull(),
  },
  table => {
    return {
      fiatCurrencyCryptoTokenPairsSendingCurrencyFkey: foreignKey({
        columns: [table.fiatCurrencyId],
        foreignColumns: [fiatCurrencies.id],
        name: 'fiat_currency_crypto_token_pairs_sending_currency_fkey',
      }),
      fiatCurrencyCryptoTokenPairsReceivingCurrencyFkey: foreignKey({
        columns: [table.cryptoTokenId],
        foreignColumns: [cryptoTokens.id],
        name: 'fiat_currency_crypto_token_pairs_receiving_currency_fkey',
      }),
      fiatCurrencyCryptoTokenPairsPkey: primaryKey({
        columns: [
          table.fiatCurrencyId,
          table.cryptoTokenId,
          table.operationType,
        ],
        name: 'fiat_currency_crypto_token_pairs_pkey',
      }),
    }
  }
)

export const volumeBridgeTransfers = pgTable(
  'volume_bridge_transfers',
  {
    date: date().notNull(),
    bridgeTransferStatus: text('bridge_transfer_status').notNull(),
    bridgeTransferCount: integer('bridge_transfer_count'),
    bridgeTransferAmount: doublePrecision('bridge_transfer_amount'),
  },
  table => {
    return {
      volumeBridgeTransfersPkey: primaryKey({
        columns: [table.date, table.bridgeTransferStatus],
        name: 'volume_bridge_transfers_pkey',
      }),
    }
  }
)
