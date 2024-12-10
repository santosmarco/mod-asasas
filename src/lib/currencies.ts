import { db } from '~/db'
import {
  cryptoNetworks as cryptoNetworksTable,
  cryptoTokens as cryptoTokensTable,
  currencyPairs2,
  fiatCurrencies as fiatCurrenciesTable,
} from '~/db/schema'
import { and, eq, type InferSelectModel } from 'drizzle-orm'

export type Currency =
  | (InferSelectModel<typeof fiatCurrenciesTable> & {
      type: 'fiat'
    })
  | (InferSelectModel<typeof cryptoTokensTable> & {
      type: 'crypto'
      network: InferSelectModel<typeof cryptoNetworksTable>
    })

export async function getAllCurrencies(): Promise<Currency[]> {
  const [fiatCurrencies, cryptoTokens, cryptoNetworks] = await Promise.all([
    db.select().from(fiatCurrenciesTable),
    db.select().from(cryptoTokensTable),
    db.select().from(cryptoNetworksTable),
  ])

  const cryptoTokensWithNetwork = cryptoTokens
    .map(token => ({
      ...token,
      network: cryptoNetworks.find(network => network.id === token.networkId),
    }))
    .filter(
      (
        token
      ): token is typeof token & {
        network: NonNullable<typeof token.network>
      } => !!token.network
    )

  return [
    ...fiatCurrencies.map(currency => ({
      ...currency,
      type: 'fiat' as const,
    })),
    ...cryptoTokensWithNetwork.map(token => ({
      ...token,
      type: 'crypto' as const,
    })),
  ]
}

export async function getCurrencyPair({
  fromCurrencyId,
  toCurrencyId,
}: {
  fromCurrencyId: string
  toCurrencyId: string
}) {
  const currencies = await getAllCurrencies()

  const fromCurrency = currencies.find(
    currency => currency.id === fromCurrencyId
  )

  return await db
    .select()
    .from(currencyPairs2)
    .where(
      and(
        eq(
          currencyPairs2.fiatCurrencyId,
          fromCurrency?.type === 'fiat' ? fromCurrencyId : toCurrencyId
        ),
        eq(
          currencyPairs2.cryptoTokenId,
          fromCurrency?.type === 'crypto' ? fromCurrencyId : toCurrencyId
        )
      )
    )
    .limit(1)
    .then(([pair]) => pair)
}
