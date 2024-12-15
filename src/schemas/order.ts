import { z } from '~/utils/zod'
import { CreatedAt, UpdatedAt } from './base'
import { CryptoToken } from './crypto-token'
import { DepositInstructions } from './deposit-instructions'
import { FiatCurrency } from './fiat-currency'

// Common validators
const PositiveAmount = z.number().positive().multipleOf(0.01).openapi({
  description: 'Amount must be positive and have at most 2 decimal places.',
  example: 1000.5,
})

const ValidUrl = z.string().trim().url('Must be a valid URL.').openapi({
  description: 'Valid URL string.',
  example: 'https://example.com/document.pdf',
})

// Enums
export const OrderType = z.enum(['on-ramp', 'off-ramp']).openapi({
  ref: 'OrderType',
  title: 'Order Type',
  description:
    'Specifies whether the order converts:\n- `on-ramp`: fiat to crypto\n- `off-ramp`: crypto to fiat',
  example: 'on-ramp',
})

export const OrderStatus = z
  .enum([
    'pending',
    'submitted',
    'raised',
    'sent',
    'received',
    'cancelled',
    'unknown',
  ])
  .openapi({
    ref: 'OrderStatus',
    title: 'Order Status',
    description:
      'Current state of the order in its lifecycle:\n\n' +
      '- `pending`: Initial state\n' +
      '- `submitted`: Order validated and accepted\n' +
      '- `raised`: Funds detected\n' +
      '- `sent`: Transfer initiated\n' +
      '- `received`: Transfer completed\n' +
      '- `cancelled`: Order cancelled\n' +
      '- `unknown`: Status cannot be determined',
    example: 'pending',
  })

// Currency types
export const OrderEndpointCurrency = z.union([
  // CryptoToken.openapi({
  //   ref: 'OrderEndpointCurrency.Crypto',
  //   title: 'Crypto',
  //   description: 'Supported cryptocurrency token identifier.',
  // }),
  // FiatCurrency.openapi({
  //   ref: 'OrderEndpointCurrency.Fiat',
  //   title: 'Fiat',
  //   description: 'Supported fiat currency code.',
  // }),
  CryptoToken,
  FiatCurrency,
])

// Base schemas
export const OrderEndpoint = z
  .object({
    currency: OrderEndpointCurrency.openapi({
      description: 'Currency or token for this endpoint.',
      example: 'USD',
    }),
    amount: PositiveAmount.optional().openapi({
      description:
        '**Important**: Transaction amount must be specified in either source or destination, not both.',
    }),
  })
  .openapi({
    ref: 'OrderEndpoint',
    description:
      'Defines one end (source or destination) of an order transaction.',
    example: {
      currency: 'USD',
      amount: 1000.5,
    },
  })

export const OrderDestinationEndpoint = z
  .object({
    recipient_id: z.number().int().positive().openapi({
      description:
        'Unique identifier for the recipient. Must be previously created via Recipients API.',
      example: 1,
    }),
  })
  .extend(OrderEndpoint.shape)
  .openapi({
    ref: 'OrderDestinationEndpoint',
    description: 'Destination endpoint with recipient information.',
    example: {
      recipient_id: 1,
      currency: 'USDC_ETH',
    },
  })

// Wire transfer identifiers
export const OrderPaymentIdentifiers = z
  .object({
    imad: z.string().trim().nullable().openapi({
      description:
        '**IMAD** (Input Message Accountability Data)\n\nUnique identifier for incoming wire transfers.',
      example: 'MMQFMP8C001002921',
    }),
    omad: z.string().trim().nullable().openapi({
      description:
        '**OMAD** (Output Message Accountability Data)\n\nUnique identifier for outgoing wire transfers.',
      example: 'O0C20JR81C000693',
    }),
    notes: z.string().trim().optional().openapi({
      description: 'Additional information about payment identifiers.',
      example: 'Payment identifiers pending assignment.',
    }),
  })
  .openapi({
    ref: 'PaymentIdentifiers',
    title: 'Payment Identifiers',
    description: 'Wire transfer tracking identifiers.',
    example: {
      imad: 'MMQFMP8C001002921',
      omad: 'O0C20JR81C000693',
      notes: 'Payment identifiers pending assignment.',
    },
  })

// Main order schemas
export const OrderCreate = z
  .object({
    from: OrderEndpoint.openapi({
      description:
        'Source endpoint details, including currency and optional amount.',
      example: {
        currency: 'USD',
        amount: 1000.5,
      },
    }),
    to: OrderDestinationEndpoint.openapi({
      description:
        'Destination endpoint details, including recipient and currency.',
      example: {
        recipient_id: 1,
        currency: 'USDC_ETH',
      },
    }),
    sender_legal_name: z.string().trim().optional().openapi({
      description:
        'Legal name of the sender.\n\n**Required** when sender differs from the account holder.',
      example: 'John Smith',
    }),
    sender_bank_account_last_4: z
      .string()
      .trim()
      .regex(/^\d{4}$/, 'Must be exactly 4 digits.')
      .optional()
      .openapi({
        description:
          "Last 4 digits of sender's bank account.\n\n**Required** for USD wire transfers.",
        example: '1234',
      }),
    is_third_party: z.boolean().default(false).openapi({
      description:
        'Indicates if the recipient is a third party. Affects required fields.',
      example: false,
    }),
    purpose_of_payment: z.string().trim().optional().openapi({
      description:
        'Reason for payment.\n\n**Required** for third-party transactions.',
      example: 'Business consulting services - Invoice #12345',
    }),
    invoice_file_url: ValidUrl.optional().openapi({
      description:
        'URL to invoice document.\n\n**Required** for third-party transactions.',
    }),
    developer_fee: z.number().optional().openapi({
      description:
        'The fee, expressed as a decimal number, represents the amount you wish to reserve for your own account. This fee is the final amount deducted from what your customer ultimately receives, rather than a percentage.\n\nIt is denominated in the source currency if that is a fiat currency, or in the fiat currency to which the source currency is pegged.',
      example: 0.05,
    }),
  })
  .openapi({
    ref: 'OrderCreate',
    title: 'Create Order',
    description: 'Parameters for creating a new order.',
    example: {
      from: {
        currency: 'USD',
        amount: 1000.5,
      },
      to: {
        recipient_id: 1,
        currency: 'USDC_ETH',
      },
      sender_legal_name: 'John Smith',
      sender_bank_account_last_4: '1234',
      is_third_party: false,
      purpose_of_payment: 'Business consulting services - Invoice #12345',
      invoice_file_url: 'https://example.com/document.pdf',
    },
  })

export const Order = z
  .object({
    id: z.coerce.number().int().positive().openapi({
      description: 'Unique identifier for the order.',
    }),
    user_id: z.coerce.number().int().positive().openapi({
      description: 'Unique identifier for the user who created the order.',
    }),
    type: OrderType,
    status: OrderStatus,
    from: z.object({
      currency: OrderEndpointCurrency,
      amount: PositiveAmount.openapi({
        description: 'Amount sent from source.',
      }),
    }),
    to: z.object({
      recipient_id: z.coerce.number().int().positive().openapi({
        description: 'Unique identifier for the recipient.',
      }),
      currency: OrderEndpointCurrency,
      amount: PositiveAmount.openapi({
        description: 'Amount received at destination.',
      }),
    }),
    sender_legal_name: z.string().trim().optional().openapi({
      description:
        'Legal name of the sender.\n\n**Required** when sender differs from the account holder.',
      example: 'John Smith',
    }),
    sender_bank_account_last_4: z
      .string()
      .trim()
      .regex(/^\d{4}$/, 'Must be exactly 4 digits.')
      .optional()
      .openapi({
        description:
          "Last 4 digits of sender's bank account.\n\n**Required** for USD wire transfers.",
        example: '1234',
      }),
    is_third_party: z.boolean().default(false).openapi({
      description:
        'Indicates if the recipient is a third party. Affects required fields.',
      example: false,
    }),
    purpose_of_payment: z.string().trim().optional().openapi({
      description:
        'Reason for payment.\n\n**Required** for third-party transactions.',
      example: 'Business consulting services - Invoice #12345',
    }),
    invoice_file_url: ValidUrl.optional().openapi({
      description:
        'URL to invoice document.\n\n**Required** for third-party transactions.',
    }),
    deposit_instructions: DepositInstructions,
    transaction_hash: z.string().trim().optional().openapi({
      description: 'Blockchain transaction hash for cryptocurrency transfers.',
      example:
        '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    }),
    notes: z.string().trim().optional().openapi({
      description: 'Internal notes about the order.',
      example: 'Processed through priority channel.',
    }),
    payment_identifiers: OrderPaymentIdentifiers.optional(),
    order_source: z.string().openapi({
      description: 'Source of the order.',
      example: 'api',
    }),
    created_at: CreatedAt,
    updated_at: UpdatedAt,
  })
  .openapi({
    ref: 'Order',
    title: 'Order',
    description: 'Order record with all details and current status.',
    example: {
      id: 1,
      user_id: 1,
      type: 'on-ramp',
      status: 'pending',
      from: {
        currency: 'USD',
        amount: 1000.5,
      },
      to: {
        recipient_id: 1,
        currency: 'USDC_ETH',
        amount: 1000.5,
      },
      sender_legal_name: 'John Smith',
      sender_bank_account_last_4: '1234',
      is_third_party: false,
      purpose_of_payment: 'Business consulting services - Invoice #12345',
      invoice_file_url: 'https://example.com/document.pdf',
      deposit_instructions: {
        domestic: {
          bank_name: 'Bank of America',
          account_holder_name: 'John Smith',
          account_number: '1234567890',
          address_line_1: '123 Main St',
          address_line_2: 'Apt 4B',
          routing_code: '110000000',
        },
        international: {
          bank_name: 'Bank of America',
          account_holder_name: 'John Smith',
          account_number: '1234567890',
          address_line_1: '123 Main St',
          address_line_2: 'Apt 4B',
          swift_bic: '110000000',
          reference: '1234567890',
        },
      },
      payment_identifiers: {
        imad: 'MMQFMP8C001002921',
        omad: 'O0C20JR81C000693',
      },
      order_source: 'api',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  })

export const OrderConfirm = z
  .object({
    transaction_hash: z.string().trim().optional().openapi({
      description:
        'Blockchain transaction hash.\n\n**Required** for cryptocurrency transfers.',
      example:
        '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    }),
  })
  .openapi({
    ref: 'OrderConfirm',
    title: 'Confirm Order',
    description: 'Parameters for confirming an order completion.',
    example: {
      transaction_hash:
        '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    },
  })

// Type exports
export type OrderType = z.infer<typeof OrderType>
export type OrderStatus = z.infer<typeof OrderStatus>
export type OrderEndpointCurrency = z.infer<typeof OrderEndpointCurrency>
export type OrderEndpoint = z.infer<typeof OrderEndpoint>
export type OrderDestinationEndpoint = z.infer<typeof OrderDestinationEndpoint>
export type OrderPaymentIdentifiers = z.infer<typeof OrderPaymentIdentifiers>
export type OrderCreate = z.infer<typeof OrderCreate>
export type Order = z.infer<typeof Order>
export type OrderConfirm = z.infer<typeof OrderConfirm>
