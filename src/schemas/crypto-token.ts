import { z } from '~/utils/zod'

const CRYPTO_TOKEN_VALUES = ['USDC_ETH', 'USDT_ETH', 'USDT_TRX'] as const

export const CryptoToken = z.enum(CRYPTO_TOKEN_VALUES).openapi({
  ref: 'CryptoToken',
  title: 'Crypto Token',
  description:
    'The crypto token, in the form of `{symbol}_{chain}`, e.g., `USDC_ETH`',
  example: 'USDC_ETH',
})
export type CryptoToken = z.infer<typeof CryptoToken>
