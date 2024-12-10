import { z } from '~/utils/zod'

const FIAT_CURRENCY_VALUES = ['USD', 'BRL', 'MXN'] as const

export const FiatCurrency = z.enum(FIAT_CURRENCY_VALUES).openapi({
  ref: 'FiatCurrency',
  title: 'Fiat Currency',
  description:
    'The fiat currency code in [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) format.',
  example: 'USD',
  externalDocs: {
    description: 'ISO 4217 Currency Codes',
    url: 'https://www.iso.org/iso-4217-currency-codes.html',
  },
})
export type FiatCurrency = z.infer<typeof FiatCurrency>
