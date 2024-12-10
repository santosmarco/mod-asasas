import { type Context, Hono } from 'hono'
import { describeRoute } from 'hono-openapi'
import { resolver, validator } from 'hono-openapi/zod'
import dedent from 'ts-dedent'
import {
  createRecipient,
  getRecipientById,
  listUserRecipients,
  mapRecipientData,
  softDeleteRecipientById,
  updateRecipientById,
} from '~/lib/recipients'
import { validateRecipientCreate } from '~/lib/recipients/validation'
import { auth } from '~/middleware/auth'
import { ApiResponseErr, ApiResponseOk } from '~/schemas/api-response'
import { Recipient, RecipientCreate } from '~/schemas/recipient'
import { Err, Ok } from '~/utils/api-response'
import {
  internalServerErrorResponse,
  unauthorizedResponse,
} from '~/utils/openapi'
import { z } from '~/utils/zod'

const routeDescriptions = {
  list: describeRoute({
    operationId: 'listRecipients',
    summary: 'List recipients',
    description: 'List all recipients in the organization',
    tags: ['Recipients'],
    responses: {
      200: {
        description: 'Successfully retrieved list of recipients',
        content: {
          'application/json': {
            schema: resolver(ApiResponseOk(Recipient.array(), 'RecipientList')),
          },
        },
      },
      401: unauthorizedResponse,
      500: internalServerErrorResponse,
    },
  }),

  create: describeRoute({
    operationId: 'createRecipient',
    summary: 'Create recipient',
    description: 'Create a new recipient',
    tags: ['Recipients'],
    responses: {
      201: {
        description: 'Recipient successfully created',
        content: {
          'application/json': {
            schema: resolver(ApiResponseOk(Recipient, 'Recipient')),
          },
        },
      },
      400: {
        description: 'Bad request - Invalid input data',
        content: { 'application/json': { schema: resolver(ApiResponseErr) } },
      },
      401: unauthorizedResponse,
      500: internalServerErrorResponse,
    },
  }),

  get: describeRoute({
    operationId: 'getRecipientById',
    summary: 'Get recipient',
    description: 'Retrieve a specific recipient by ID',
    tags: ['Recipients'],
    responses: {
      200: {
        description: 'Recipient details successfully retrieved',
        content: {
          'application/json': {
            schema: resolver(ApiResponseOk(Recipient, 'Recipient')),
          },
        },
      },
      401: unauthorizedResponse,
      404: {
        description: 'Recipient not found',
        content: { 'application/json': { schema: resolver(ApiResponseErr) } },
      },
      500: internalServerErrorResponse,
    },
  }),

  update: describeRoute({
    operationId: 'updateRecipient',
    summary: 'Update recipient',
    description: 'Update a recipient by ID',
    tags: ['Recipients'],
    responses: {
      200: {
        description: 'Recipient successfully updated',
        content: {
          'application/json': {
            schema: resolver(ApiResponseOk(Recipient, 'Recipient')),
          },
        },
      },
      400: {
        description: 'Bad request - Invalid input data',
        content: { 'application/json': { schema: resolver(ApiResponseErr) } },
      },
      401: unauthorizedResponse,
      404: {
        description: 'Recipient not found',
        content: { 'application/json': { schema: resolver(ApiResponseErr) } },
      },
      500: internalServerErrorResponse,
    },
  }),

  delete: describeRoute({
    operationId: 'deleteRecipientById',
    summary: 'Delete recipient',
    description: 'Delete a recipient by ID',
    tags: ['Recipients'],
    responses: {
      200: {
        description: 'Recipient successfully deleted',
        content: {
          'application/json': {
            schema: resolver(ApiResponseOk(Recipient, 'Recipient')),
          },
        },
      },
      401: unauthorizedResponse,
      404: {
        description: 'Recipient not found',
        content: { 'application/json': { schema: resolver(ApiResponseErr) } },
      },
      500: internalServerErrorResponse,
    },
  }),
} as const

const recipientIdParam = z.object({
  id: z.number().int().positive().openapi({
    description: 'Unique identifier for the recipient.',
  }),
})

const handleError = (error: unknown, c: Context) => {
  const err = error as Error
  return c.json(Err({ message: err.message, cause: err }), 500)
}

export const recipientsRouter = new Hono()
  .use(auth())
  .get('/', routeDescriptions.list, async c => {
    try {
      const userId = c.get('user').id
      const recipients = await listUserRecipients({ userId })
      const mappedRecipients = await Promise.all(
        recipients.map(mapRecipientData)
      )
      return c.json(Ok<Recipient[]>()(mappedRecipients), 200)
    } catch (error) {
      return handleError(error, c)
    }
  })
  .post(
    '/',
    routeDescriptions.create,
    validator('json', RecipientCreate, (result, c) => {
      if (!result.success) return c.json(Err.fromZod(result.error), 400)
    }),
    async c => {
      try {
        const userId = c.get('user').id
        const data = c.req.valid('json')

        const { errors, isValid } = await validateRecipientCreate(data)
        if (!isValid) {
          return c.json(
            Err({ message: 'Invalid input data', fields: errors }),
            400
          )
        }

        const recipient = await createRecipient({
          userId,
          data,
        })
        if (!recipient) throw new Error('Failed to create recipient')

        return c.json(Ok<Recipient>()(await mapRecipientData(recipient)), 201)
      } catch (error) {
        return handleError(error, c)
      }
    }
  )
  .get(
    '/:id',
    routeDescriptions.get,
    validator('param', recipientIdParam, (result, c) => {
      if (!result.success) return c.json(Err.fromZod(result.error), 400)
    }),
    async c => {
      try {
        const userId = c.get('user').id
        const recipientId = c.req.param('id')
        const recipient = await getRecipientById({ recipientId })

        if (!recipient) {
          return c.json(Err({ message: 'Recipient not found' }), 404)
        }
        if (!recipient.userId || recipient.userId !== userId) {
          return c.json(Err({ message: 'Unauthorized' }), 401)
        }

        return c.json(Ok<Recipient>()(await mapRecipientData(recipient)), 200)
      } catch (error) {
        return handleError(error, c)
      }
    }
  )
  .patch(
    '/:id',
    routeDescriptions.update,
    validator('param', recipientIdParam, (result, c) => {
      if (!result.success) return c.json(Err.fromZod(result.error), 400)
    }),
    validator('json', RecipientCreate, (result, c) => {
      if (!result.success) return c.json(Err.fromZod(result.error), 400)
    }),
    async c => {
      try {
        const userId = c.get('user').id
        const recipientId = c.req.param('id')
        const data = c.req.valid('json')
        const recipient = await getRecipientById({ recipientId })

        if (!recipient) {
          return c.json(Err({ message: 'Recipient not found' }), 404)
        }
        if (!recipient.userId || recipient.userId !== userId) {
          return c.json(Err({ message: 'Unauthorized' }), 401)
        }

        const updatedRecipient = await updateRecipientById({
          recipientId,
          data,
        })
        if (!updatedRecipient) throw new Error('Failed to update recipient')

        return c.json(Ok<Recipient>()(await mapRecipientData(recipient)), 200)
      } catch (error) {
        return handleError(error, c)
      }
    }
  )
  .delete(
    '/:id',
    routeDescriptions.delete,
    validator('param', recipientIdParam, (result, c) => {
      if (!result.success) return c.json(Err.fromZod(result.error), 400)
    }),
    async c => {
      try {
        const userId = c.get('user').id
        const recipientId = c.req.param('id')
        const recipient = await getRecipientById({ recipientId })

        if (!recipient) {
          return c.json(Err({ message: 'Recipient not found' }), 404)
        }
        if (!recipient.userId || recipient.userId !== userId) {
          return c.json(Err({ message: 'Unauthorized' }), 401)
        }

        const deletedRecipient = await softDeleteRecipientById({ recipientId })
        if (!deletedRecipient) throw new Error('Failed to delete recipient')

        return c.json(Ok<Recipient>()(await mapRecipientData(recipient)), 200)
      } catch (error) {
        return handleError(error, c)
      }
    }
  )
