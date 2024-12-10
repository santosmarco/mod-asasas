import { z } from '~/utils/zod'
import { CountryCode, PostalCode, SwiftBicCode } from './base'
import { CryptoToken } from './crypto-token'
import { FiatCurrency } from './fiat-currency'

// Base Types
export const RecipientType = z.enum(['fiat', 'crypto']).openapi({
  title: 'Recipient Type',
  description:
    'The type of recipient:\n- `fiat`: For bank transfers\n- `crypto`: For cryptocurrency payments',
  example: 'fiat',
})

// Crypto Recipient Schemas
export const CryptoRecipient = z
  .object({
    id: z.coerce.number().int().positive().openapi({
      description: 'Unique identifier for the recipient.',
    }),
    type: z.literal('crypto').openapi({
      description: 'Always `crypto`.',
      example: 'crypto',
    }),
    user_id: z.coerce.number().int().positive().openapi({
      description: 'Unique identifier for the user who owns this recipient.',
    }),
    token: CryptoToken,
    address: z.string().trim().toLowerCase().min(1, 'Required.').openapi({
      description:
        '**Wallet Address**\n- Must be a valid address for the specified token\n- Case-insensitive\n- No spaces allowed',
      example: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    }),
    business_details: z
      .object({
        name: z.string().trim().min(1, 'Required.').openapi({
          description:
            'Legal registered business name of the recipient organization.',
          example: 'Acme Corporation',
        }),
      })
      .openapi({
        description: 'Business entity details for the recipient.',
        example: {
          name: 'Acme Corporation',
        },
      }),
    is_active: z.boolean().openapi({
      description:
        'Indicates if the recipient is currently active and available for transactions.',
      example: true,
    }),
  })
  .openapi({
    ref: 'CryptoRecipient',
    title: 'Crypto Recipient',
    description:
      'Represents a cryptocurrency recipient for digital asset transfers.',
  })

// Fiat Recipient Components
export const BusinessDetails = z
  .object({
    name: z.string().trim().min(1, 'Required.').openapi({
      description:
        'Legal registered business name as it appears on bank documents.',
      example: 'Acme Corporation',
    }),
    address: z.string().trim().min(1, 'Required.').openapi({
      description: 'Complete street address of the business headquarters.',
      example: '123 Corporate Plaza, Suite 500',
    }),
    city: z.string().trim().min(1, 'Required.').openapi({
      description: 'City of business registration.',
      example: 'New York',
    }),
    state_province: z.string().trim().min(1, 'Required.').openapi({
      description: 'State/province/region of business registration.',
      example: 'NY',
    }),
    postal_code: PostalCode.openapi({
      description: 'Valid postal/ZIP code for the business address.',
      example: '10001',
    }),
    country: CountryCode,
  })
  .openapi({
    ref: 'BusinessDetails',
    title: 'Business Details',
    description: 'Business registration and location information.',
  })

export const DomesticBankDetails = z
  .object({
    bank_name: z.string().trim().min(1, 'Required.').openapi({
      description: 'Official name of the banking institution.',
      example: 'Chase Bank',
    }),
    bank_address: z.string().trim().min(1, 'Required.').openapi({
      description: 'Complete physical address of the bank branch.',
      example: '270 Park Avenue, New York, NY 10017',
    }),
    bank_country: CountryCode,
    account_number: z.string().trim().min(4).max(17).openapi({
      description:
        '**Bank Account Number**\n- Required for domestic (US) transfers\n- 4-17 digits\n- No spaces or special characters',
      example: '123456789012345',
    }),
  })
  .openapi({
    ref: 'DomesticBankDetails',
    title: 'Domestic Bank Details',
    description: 'Banking information for domestic (US) transfers.',
  })

export const InternationalBankDetails = z
  .object({
    bank_name: z.string().trim().min(1, 'Required.').openapi({
      description: 'Official name of the banking institution.',
      example: 'Deutsche Bank',
    }),
    bank_address: z.string().trim().min(1, 'Required.').openapi({
      description: 'Complete physical address of the bank branch.',
      example: 'Taunusanlage 12, 60325 Frankfurt am Main, Germany',
    }),
    bank_country: CountryCode,
    account_bic_swift_code: SwiftBicCode.openapi({
      description:
        '**BIC/SWIFT Code**\n- Required for international transfers\n- 8 or 11 characters\n- Format: `XXXXXX[XX][XXX]`',
      example: 'DEUTDEFF',
    }),
  })
  .openapi({
    ref: 'InternationalBankDetails',
    title: 'International Bank Details',
    description: 'Banking information for international transfers.',
  })

export const IntermediaryBankDetails = z
  .object({
    bank_name: z.string().trim().openapi({
      description: 'Name of the US-based intermediary bank.',
      example: 'JPMorgan Chase',
    }),
    account_routing_number: z
      .string()
      .trim()
      .regex(/^\d{9}$/, 'Invalid routing number.')
      .openapi({
        description:
          '**ABA Routing Number**\n- 9 digits\n- Must be valid US routing number\n- Required for international transfers',
        example: '021000021',
      }),
  })
  .openapi({
    ref: 'IntermediaryBankDetails',
    title: 'Intermediary Bank Details',
    description:
      'US intermediary bank information for international wire transfers.',
  })

// Main Fiat Recipient Schemas
export const FiatDomesticRecipient = z
  .object({
    id: z.coerce.number().int().positive().openapi({
      description: 'Unique identifier for the recipient.',
    }),
    type: z.literal('fiat').openapi({
      description: 'Always `fiat`.',
      example: 'fiat',
    }),
    user_id: z.coerce.number().int().positive().openapi({
      description: 'Unique identifier for the user who owns this recipient.',
    }),
    currency: FiatCurrency,
    business_details: BusinessDetails,
    destination_bank_account_details: DomesticBankDetails,
    is_active: z.boolean().openapi({
      description:
        'Indicates if the recipient is currently active and available for transactions.',
      example: true,
    }),
  })
  .openapi({
    ref: 'FiatDomesticRecipient',
    title: 'Domestic Fiat Recipient',
    description: 'Represents a domestic (US) bank account recipient.',
  })

export const FiatInternationalRecipient = z
  .object({
    id: z.coerce.number().int().positive().openapi({
      description: 'Unique identifier for the recipient.',
    }),
    type: z.literal('fiat').openapi({
      description: 'Always `fiat`.',
      example: 'fiat',
    }),
    user_id: z.coerce.number().int().positive().openapi({
      description: 'Unique identifier for the user who owns this recipient.',
    }),
    currency: FiatCurrency,
    business_details: BusinessDetails,
    destination_bank_account_details: InternationalBankDetails,
    intermediary_bank_details: IntermediaryBankDetails,
    is_active: z.boolean().openapi({
      description:
        'Indicates if the recipient is currently active and available for transactions.',
      example: true,
    }),
  })
  .openapi({
    ref: 'FiatInternationalRecipient',
    title: 'International Fiat Recipient',
    description: 'Represents an international bank account recipient.',
  })

// Union Types
export const FiatRecipient = z.union([
  FiatDomesticRecipient,
  FiatInternationalRecipient,
])

export const Recipient = z.union([
  CryptoRecipient,
  FiatDomesticRecipient,
  FiatInternationalRecipient,
])

// Create Types
export const RecipientCreate = z.union([
  CryptoRecipient.omit({
    id: true,
    user_id: true,
    is_active: true,
  }).openapi({
    title: 'Crypto Recipient',
    description:
      '**Required fields for creating a new cryptocurrency recipient.**',
  }),
  FiatDomesticRecipient.omit({
    id: true,
    user_id: true,
    is_active: true,
  }).openapi({
    title: 'Fiat Recipient (Domestic)',
    description:
      '**Required fields for creating a new domestic bank recipient.**',
  }),
  FiatInternationalRecipient.omit({
    id: true,
    user_id: true,
    is_active: true,
  }).openapi({
    title: 'Fiat Recipient (International)',
    description:
      '**Required fields for creating a new international bank recipient.**',
  }),
])

// Type Exports
export type RecipientType = z.infer<typeof RecipientType>
export type CryptoRecipient = z.infer<typeof CryptoRecipient>
export type BusinessDetails = z.infer<typeof BusinessDetails>
export type DomesticBankDetails = z.infer<typeof DomesticBankDetails>
export type InternationalBankDetails = z.infer<typeof InternationalBankDetails>
export type IntermediaryBankDetails = z.infer<typeof IntermediaryBankDetails>
export type FiatDomesticRecipient = z.infer<typeof FiatDomesticRecipient>
export type FiatInternationalRecipient = z.infer<
  typeof FiatInternationalRecipient
>
export type FiatRecipient = z.infer<typeof FiatRecipient>
export type Recipient = z.infer<typeof Recipient>
export type RecipientCreate = z.infer<typeof RecipientCreate>
