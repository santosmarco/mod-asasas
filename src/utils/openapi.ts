import { resolver } from 'hono-openapi/zod'
import { ApiResponseErr } from '~/schemas/api-response'

export const unauthorizedResponse = {
  description: 'Unauthorized - Invalid or missing authentication',
  content: {
    'application/json': {
      schema: resolver(
        ApiResponseErr.openapi({
          title: 'Error Response',
          description: 'Error response with details.',
          example: {
            status: 'error',
            error: {
              message: 'Unauthorized',
            },
          },
        })
      ),
    },
  },
}

export const internalServerErrorResponse = {
  description: 'Internal server error',
  content: {
    'application/json': {
      schema: resolver(
        ApiResponseErr.openapi({
          title: 'Error Response',
          description: 'Error response with details.',
          example: {
            status: 'error',
            error: {
              message: 'Internal server error',
            },
          },
        })
      ),
    },
  },
}

export const defaultErrorResponses = {
  401: unauthorizedResponse,
  500: internalServerErrorResponse,
}
