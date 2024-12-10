import { z } from '~/utils/zod'

/**
 * Successful API response wrapper
 */
export function ApiResponseOk<T extends z.ZodTypeAny>(
  schema: T,
  name?: string
) {
  return z
    .object({
      status: z.literal('ok'),
      data: schema,
    })
    .openapi({
      title: 'Successful Response',
      description: 'Successful response with data.',
    })
}
export type ApiResponseOk<T> = z.infer<
  ReturnType<typeof ApiResponseOk<z.ZodType<T>>>
>

/**
 * Error details schema
 */
export const ErrorDetails = z
  .object({
    message: z.string().openapi({
      description: 'Human-readable error description.',
      example: 'Invalid input provided.',
    }),
    fields: z
      .record(z.string(), z.string().array().optional())
      .optional()
      .openapi({
        title: 'Fields',
        description: 'Validation errors by field name.',
        example: {
          email: ['Must be a valid email address'],
          amount: ['Must be a positive number'],
        },
      }),
    cause: z.instanceof(Error).optional().openapi({
      description: 'Underlying error details.',
    }),
  })
  .openapi({
    title: 'Error Details',
    description: 'Detailed error information.',
  })
export type ErrorDetails = z.infer<typeof ErrorDetails>

/**
 * Error response wrapper
 */
export const ApiResponseErr = z
  .object({
    status: z.literal('error').openapi({
      title: 'Response Status',
      example: 'error',
    }),
    error: ErrorDetails,
  })
  .openapi({
    title: 'Error Response',
    description: 'Error response with details.',
  })
export type ApiResponseErr = z.infer<typeof ApiResponseErr>

/**
 * Combined API response type
 */
export function ApiResponse<T extends z.ZodTypeAny>(schema: T, name?: string) {
  const response = z.union([ApiResponseOk(schema, name), ApiResponseErr])
  return name
    ? response.openapi({
        title: name ? `${name} Response` : 'API Response',
        description:
          'API response that can be either successful with data or unsuccessful with error details.',
      })
    : response
}
export type ApiResponse<T> = z.infer<
  ReturnType<typeof ApiResponse<z.ZodType<T>>>
>
