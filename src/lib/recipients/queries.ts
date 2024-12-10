import { db } from '~/db'
import { customerAccounts } from '~/db/schema'
import { desc, eq, type InferSelectModel } from 'drizzle-orm'
import { getCountryByAlpha3Code, getCountryById } from '~/lib/countries'
import { FiatCurrency } from '~/schemas/fiat-currency'
import type {
  CryptoRecipient,
  FiatRecipient,
  RecipientCreate,
} from '~/schemas/recipient'

export async function mapRecipientData(
  recipient: InferSelectModel<typeof customerAccounts>
) {
  if (recipient.type === 'crypto') {
    if (!recipient.currency) {
      throw new Error('Crypto recipient has no currency')
    }

    if (
      recipient.currency === 'BRL' ||
      recipient.currency === 'MXN' ||
      recipient.currency === 'USD'
    ) {
      throw new Error(
        `Invalid currency for crypto recipient: ${recipient.currency}`
      )
    }

    const token = (
      {
        'USDC (ETH)': 'USDC_ETH',
        'USDT (ETH)': 'USDT_ETH',
        'USDT (TRX)': 'USDT_TRX',
      } as const
    )[recipient.currency]

    const data = {
      id: recipient.id,
      type: 'crypto',
      user_id: recipient.userId ?? 0,
      token,
      address: recipient.cryptoPubKey ?? '',
      business_details: {
        name: recipient.businessName ?? '',
      },
      is_active: recipient.status === 'active',
    } satisfies CryptoRecipient

    return data
  }

  const currencyParseResult = FiatCurrency.safeParse(recipient.currency)

  if (!currencyParseResult.success) {
    throw new Error(
      `Invalid currency for fiat recipient: ${recipient.currency}`
    )
  }

  const [businessCountry, bankCountry] = await Promise.all([
    getCountryById({ countryId: recipient.businessCountry ?? 0 }),
    getCountryById({ countryId: recipient.countryOfBank ?? 0 }),
  ])

  const data = {
    id: recipient.id,
    type: 'fiat',
    user_id: recipient.userId ?? 0,
    currency: currencyParseResult.data,
    business_details: {
      name: recipient.businessName ?? '',
      address: recipient.businessAddress ?? '',
      city: recipient.businessCity ?? '',
      state_province: recipient.businessStateProvince ?? '',
      postal_code: recipient.businessPostalCode ?? '',
      country: businessCountry?.alpha3Code ?? '',
    },
    destination_bank_account_details: {
      bank_name: recipient.nameOfBank ?? '',
      bank_address: recipient.bankAddress ?? '',
      bank_country: bankCountry?.alpha3Code ?? '',
      account_number: recipient.accountNumber ?? '',
      account_bic_swift_code: recipient.swiftCode ?? '',
    },
    ...(('nameOfIntermediaryBank' in recipient ||
      'routingNumberOfIntermediaryBank' in recipient) && {
      intermediary_bank_details: {
        bank_name: recipient.nameOfIntermediaryBank ?? '',
        account_routing_number: recipient.routingNumberOfIntermediaryBank ?? '',
      },
    }),
    is_active: recipient.status === 'active',
  } satisfies FiatRecipient

  return data
}

export async function listUserRecipients({
  userId,
}: {
  userId: string | number
}) {
  return await db
    .select()
    .from(customerAccounts)
    .where(eq(customerAccounts.userId, +userId))
    .orderBy(desc(customerAccounts.id))
}

export async function createRecipient({
  userId,
  data,
}: {
  userId: string | number
  data: RecipientCreate
}) {
  if (data.type === 'crypto') {
    return await createCryptoRecipient({ userId, data })
  }

  return await createFiatRecipient({ userId, data })
}

export async function createCryptoRecipient({
  userId,
  data,
}: {
  userId: string | number
  data: Extract<RecipientCreate, { type: 'crypto' }>
}) {
  const currency = (
    {
      USDC_ETH: 'USDC (ETH)',
      USDT_ETH: 'USDT (ETH)',
      USDT_TRX: 'USDT (TRX)',
    } as const
  )[data.token]

  return await db
    .insert(customerAccounts)
    .values({
      type: 'crypto',
      status: 'active',
      userId: +userId,
      currency,
      businessName: data.business_details.name,
      cryptoPubKey: data.address,
    })
    .returning()
    .then(([account]) => account)
}

export async function createFiatRecipient({
  userId,
  data,
}: {
  userId: string | number
  data: Extract<RecipientCreate, { type: 'fiat' }>
}) {
  const [businessCountry, bankCountry] = await Promise.all([
    getCountryByAlpha3Code({ alpha3Code: data.business_details.country }),
    getCountryByAlpha3Code({
      alpha3Code: data.destination_bank_account_details.bank_country,
    }),
  ])

  return await db
    .insert(customerAccounts)
    .values({
      type: 'fiat',
      status: 'active',
      userId: +userId,
      currency: data.currency,
      businessName: data.business_details.name,
      businessAddress: data.business_details.address,
      businessCity: data.business_details.city,
      businessStateProvince: data.business_details.state_province,
      businessPostalCode: data.business_details.postal_code,
      businessCountry: businessCountry?.id,
      nameOfBank: data.destination_bank_account_details.bank_name,
      bankAddress: data.destination_bank_account_details.bank_address,
      addressOfBank: data.destination_bank_account_details.bank_address,
      countryOfBank: bankCountry?.id,
      ...('account_number' in data.destination_bank_account_details && {
        accountNumber: data.destination_bank_account_details.account_number,
      }),
      ...('account_bic_swift_code' in data.destination_bank_account_details && {
        swiftCode: data.destination_bank_account_details.account_bic_swift_code,
      }),
      ...('intermediary_bank_details' in data && {
        nameOfIntermediaryBank: data.intermediary_bank_details.bank_name,
        routingNumberOfIntermediaryBank:
          data.intermediary_bank_details.account_routing_number,
      }),
    })
    .returning()
    .then(([account]) => account)
}

export async function getRecipientById({
  recipientId,
}: {
  recipientId: string | number
}) {
  return await db
    .select()
    .from(customerAccounts)
    .where(eq(customerAccounts.id, +recipientId))
    .then(([recipient]) => recipient)
}

export async function updateRecipientById({
  recipientId,
  data,
}: {
  recipientId: string | number
  data: RecipientCreate
}) {
  const existingRecipient = await getRecipientById({ recipientId })

  if (!existingRecipient?.userId) {
    throw new Error(`Recipient has no user: ${recipientId}`)
  }
  if (existingRecipient.status !== 'active') {
    throw new Error(`Cannot update non-active recipient: ${recipientId}`)
  }

  await db
    .update(customerAccounts)
    .set({ status: 'inactive' })
    .where(eq(customerAccounts.id, existingRecipient.id))

  return await createRecipient({ userId: existingRecipient.userId, data })
}

export async function softDeleteRecipientById({
  recipientId,
}: {
  recipientId: string | number
}) {
  const existingRecipient = await getRecipientById({ recipientId })

  if (!existingRecipient?.userId) {
    throw new Error(`Recipient has no user: ${recipientId}`)
  }
  if (existingRecipient.status === 'deleted') {
    throw new Error(`Recipient is already deleted: ${recipientId}`)
  }

  return await db
    .update(customerAccounts)
    .set({ status: 'deleted' })
    .where(eq(customerAccounts.id, existingRecipient.id))
    .returning()
    .then(([recipient]) => recipient)
}
