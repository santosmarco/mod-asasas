import { z } from '~/utils/zod'

import { CreatedAt, UpdatedAt } from './base'
import { CryptoToken } from './crypto-token'
import { FiatCurrency } from './fiat-currency'

export const FeeConfig = z
  .object({
    type: z.enum(['percentage', 'fixed']).openapi({
      title: 'Fee Type',
      description:
        'Specifies how the fee is calculated. Can be either `percentage` of the transaction amount or a `fixed` value.',
      example: 'percentage',
    }),
    value: z.number().positive().openapi({
      title: 'Fee Value',
      description:
        'The numeric fee value. Interpreted as a percentage (e.g., `2.5` for 2.5%) when `type` is `percentage`, or as a fixed amount in the specified currency.',
      example: 2.5,
    }),
    currency: z.union([FiatCurrency, CryptoToken]).openapi({
      title: 'Fee Currency',
      description:
        "The currency or token the fee is denominated in. Can be a fiat currency (e.g., `'USD'`) or crypto token (e.g., `'USDC_ETH'`).",
      example: 'USD',
    }),
    min_amount: z.number().positive().optional().openapi({
      title: 'Minimum Amount',
      description:
        'Optional minimum transaction amount threshold for this fee to apply.',
      example: 100,
    }),
    max_amount: z.number().positive().optional().openapi({
      title: 'Maximum Amount',
      description:
        'Optional maximum transaction amount threshold for this fee to apply.',
      example: 10000,
    }),
    applies_to: z.enum(['from', 'to']).openapi({
      title: 'Fee Application',
      description:
        "Specifies whether the fee applies to the source amount (`'from'`) or destination amount (`'to'`).",
      example: 'from',
    }),
  })
  .openapi({
    ref: 'FeeConfig',
    title: 'Fee Configuration',
    description:
      'Defines how transaction fees are calculated and applied for an organization.',
  })
export type FeeConfig = z.infer<typeof FeeConfig>

export const OrganizationFees = z
  .object({
    id: z.number().int().positive().openapi({
      description: 'Unique identifier for the organization fee configuration.',
      example: 1,
    }),
    organization_id: z.number().int().positive().openapi({
      description: 'Unique identifier for the organization.',
      example: 1,
    }),
    fee_configs: z.array(FeeConfig).openapi({
      title: 'Fee Configurations',
      description:
        'List of fee configurations that define how transaction fees are calculated for this organization.',
      example: [
        {
          type: 'percentage',
          value: 2.5,
          currency: 'USD',
          min_amount: 100,
          max_amount: 10000,
          applies_to: 'from',
        },
      ],
    }),
    created_at: CreatedAt,
    updated_at: UpdatedAt,
  })
  .openapi({
    ref: 'OrganizationFees',
    title: 'Organization Fee Configuration',
    description:
      'Complete fee configuration for an organization, including all transaction fee rules and their application criteria.',
  })
export type OrganizationFees = z.infer<typeof OrganizationFees>
