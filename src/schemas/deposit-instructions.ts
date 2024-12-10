import { z } from '~/utils/zod'

import { CryptoToken } from './crypto-token'

export const CryptoDepositInstructions = z
  .object({
    token: CryptoToken,
    wallet_address: z.string().openapi({
      description: 'Destination wallet address for receiving crypto funds.',
      example: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    }),
  })
  .openapi({
    ref: 'CryptoDepositInstructions',
    title: 'Crypto Deposit Instructions',
    description:
      'Specifications for depositing cryptocurrency to a wallet address.',
  })
export type CryptoDepositInstructions = z.infer<
  typeof CryptoDepositInstructions
>

export const FiatBaseDepositInstructions = z.object({
  bank_name: z.string().openapi({
    description: 'Full legal name of the receiving financial institution.',
    example: 'Chase Bank',
  }),
  account_holder_name: z.string().openapi({
    description:
      'Legal name of the bank account owner as registered with the institution.',
    example: 'Acme Inc.',
  }),
  account_number: z.string().openapi({
    description: 'Primary account number (PAN) for receiving deposits.',
    example: '000123456789',
  }),
  address_line_1: z.string().openapi({
    description:
      'Primary address line of the banking institution (street, building, suite).',
    example: '1001 S. Main Street, Suite 4080',
  }),
  address_line_2: z.string().openapi({
    description:
      'Secondary address line (city, state/province, postal code, country).',
    example: 'Kalispell, MT 59901, US',
  }),
})
export type FiatBaseDepositInstructions = z.infer<
  typeof FiatBaseDepositInstructions
>

export const FiatDomesticDepositInstructions =
  FiatBaseDepositInstructions.extend({
    routing_code: z.string().openapi({
      description:
        'Domestic bank routing number or ABA (American Banking Association) code.',
      example: '021000021',
    }),
  }).openapi({
    ref: 'FiatDomesticDepositInstructions',
    title: 'Domestic Bank Details',
    description:
      'Banking information required for domestic wire or ACH transfers.',
  })
export type FiatDomesticDepositInstructions = z.infer<
  typeof FiatDomesticDepositInstructions
>

export const FiatInternationalDepositInstructions =
  FiatBaseDepositInstructions.extend({
    swift_bic: z.string().openapi({
      description:
        'SWIFT/BIC (Bank Identifier Code) for international transfers.',
      example: 'CHASUS33',
    }),
    reference: z.string().openapi({
      description:
        'Unique reference code to track international wire transfers.',
      example: 'REF00000',
    }),
  }).openapi({
    ref: 'FiatInternationalDepositInstructions',
    title: 'International Bank Details',
    description:
      'Banking information required for SWIFT/international wire transfers.',
  })
export type FiatInternationalDepositInstructions = z.infer<
  typeof FiatInternationalDepositInstructions
>

export const FiatDepositInstructions = z
  .object({
    domestic: FiatDomesticDepositInstructions,
    international: FiatInternationalDepositInstructions,
  })
  .openapi({
    ref: 'FiatDepositInstructions',
    title: 'Fiat Deposit Instructions',
    description:
      'Complete set of banking details for both domestic and international transfers.',
  })
export type FiatDepositInstructions = z.infer<typeof FiatDepositInstructions>

export const DepositInstructions = z
  .union([
    CryptoDepositInstructions.openapi({
      ref: 'DepositInstructions.Crypto',
      title: 'Crypto',
    }),
    FiatDepositInstructions.openapi({
      ref: 'DepositInstructions.Fiat',
      title: 'Fiat',
    }),
  ])
  .openapi({
    ref: 'DepositInstructions',
    description:
      'Unified schema for both cryptocurrency and fiat currency deposit instructions.',
  })
export type DepositInstructions = z.infer<typeof DepositInstructions>
