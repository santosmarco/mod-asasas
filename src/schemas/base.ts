import { z } from '~/utils/zod'

export const CreatedAt = z.string().datetime().openapi({
  description:
    '[ISO 8601 timestamp](https://en.wikipedia.org/wiki/ISO_8601) indicating when this entity was first created in the system.',
})
export type CreatedAt = z.infer<typeof CreatedAt>

export const UpdatedAt = z.string().datetime().openapi({
  description:
    '[ISO 8601 timestamp](https://en.wikipedia.org/wiki/ISO_8601) indicating when this entity was last updated in the system.',
})
export type UpdatedAt = z.infer<typeof UpdatedAt>

export const DeletedAt = z.string().datetime().optional().openapi({
  description:
    '[ISO 8601 timestamp](https://en.wikipedia.org/wiki/ISO_8601) indicating when this entity was deleted in the system, if applicable.',
})
export type DeletedAt = z.infer<typeof DeletedAt>

export const PostalCode = z
  .string()
  .trim()
  .toUpperCase()
  .min(1, 'Required.')
  .regex(/^[0-9A-Z\s-]+$/i, 'Invalid postal code format. Must be alphanumeric.')
export type PostalCode = z.infer<typeof PostalCode>

export const CountryCode = z
  .string()
  .trim()
  .toUpperCase()
  .min(1, 'Required.')
  .regex(/^[A-Z]{3}$/, 'Must be a valid ISO 3166-1 alpha-3 country code.')
  .openapi({
    description:
      'Three-letter country code in [ISO 3166-1 alpha-3](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3) format.',
    example: 'USA',
    externalDocs: {
      description: 'ISO 3166-1 alpha-3',
      url: 'https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3',
    },
  })
export type CountryCode = z.infer<typeof CountryCode>

export const SwiftBicCode = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/, 'Invalid SWIFT/BIC code.')
export type SwiftBicCode = z.infer<typeof SwiftBicCode>
