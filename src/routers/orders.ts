import { type Context, Hono } from 'hono'
import { describeRoute } from 'hono-openapi'
import { resolver, validator } from 'hono-openapi/zod'
import {
  confirmOrderById,
  createOrder,
  getOrderById,
  listUserOrders,
  mapOrderData,
  validateOrderConfirm,
  validateOrderCreate,
} from '~/lib/orders'
import { requestPaymentIdentifiers } from '~/lib/orders/payment-identifiers'
import { auth } from '~/middleware/auth'
import { ApiResponseErr, ApiResponseOk } from '~/schemas/api-response'
import {
  Order,
  OrderConfirm,
  OrderCreate,
  OrderPaymentIdentifiers,
} from '~/schemas/order'
import { Err, Ok } from '~/utils/api-response'
import {
  internalServerErrorResponse,
  unauthorizedResponse,
} from '~/utils/openapi'
import { z } from '~/utils/zod'

const routeDescriptions = {
  list: describeRoute({
    operationId: 'listOrders',
    summary: 'List orders',
    description: 'List all orders in the organization',
    tags: ['Orders'],
    responses: {
      200: {
        description: 'Successfully retrieved list of orders',
        content: {
          'application/json': {
            schema: resolver(ApiResponseOk(Order.array(), 'OrderList')),
          },
        },
      },
      401: unauthorizedResponse,
      500: internalServerErrorResponse,
    },
  }),

  create: describeRoute({
    operationId: 'createOrder',
    summary: 'Create order',
    description: 'Create a new order in the organization',
    tags: ['Orders'],
    responses: {
      201: {
        description: 'Order successfully created',
        content: {
          'application/json': {
            schema: resolver(ApiResponseOk(Order, 'Order')),
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
    operationId: 'getOrderById',
    summary: 'Get order',
    description: 'Retrieve a specific order by ID',
    tags: ['Orders'],
    responses: {
      200: {
        description: 'Order details successfully retrieved',
        content: {
          'application/json': {
            schema: resolver(ApiResponseOk(Order, 'Order')),
          },
        },
      },
      401: unauthorizedResponse,
      404: {
        description: 'Order not found',
        content: { 'application/json': { schema: resolver(ApiResponseErr) } },
      },
      500: internalServerErrorResponse,
    },
  }),

  confirm: describeRoute({
    operationId: 'confirmOrder',
    summary: 'Confirm order',
    description: 'Confirm an order',
    tags: ['Orders'],
    responses: {
      200: {
        description: 'Order confirmed',
        content: {
          'application/json': {
            schema: resolver(ApiResponseOk(Order, 'Order')),
          },
        },
      },
      401: unauthorizedResponse,
      404: {
        description: 'Order not found',
        content: { 'application/json': { schema: resolver(ApiResponseErr) } },
      },
      500: internalServerErrorResponse,
    },
  }),

  requestPaymentIdentifiers: describeRoute({
    operationId: 'requestPaymentIdentifiers',
    summary: 'Request payment identifiers',
    description: 'Request IMAD/OMAD payment identifiers for an order',
    tags: ['Orders'],
    responses: {
      200: {
        description: 'Payment identifiers successfully retrieved or requested',
        content: {
          'application/json': {
            schema: resolver(
              ApiResponseOk(OrderPaymentIdentifiers, 'PaymentIdentifiers'),
            ),
          },
        },
      },
      401: unauthorizedResponse,
      404: {
        description: 'Order not found',
        content: { 'application/json': { schema: resolver(ApiResponseErr) } },
      },
      500: internalServerErrorResponse,
    },
  }),
}

const orderIdParam = z.object({
  id: z.coerce.number().int().positive().openapi({
    description: 'Unique identifier for the order.',
  }),
})

const handleError = (error: unknown, c: Context) => {
  const err = error as Error
  console.error('Order operation failed:', err)
  return c.json(Err({ message: err.message, cause: err }), 500)
}

export const ordersRouter = new Hono()
  .use(auth())
  .get('/', routeDescriptions.list, async c => {
    try {
      const userId = c.get('user').id
      const orders = await listUserOrders({ userId })
      const mappedOrders = await Promise.all(orders.map(mapOrderData))
      return c.json(Ok<Order[]>()(mappedOrders), 200)
    } catch (error) {
      return handleError(error, c)
    }
  })
  .post(
    '/',
    routeDescriptions.create,
    validator('json', OrderCreate, (result, c) => {
      if (!result.success) return c.json(Err.fromZod(result.error), 400)
    }),
    async c => {
      try {
        const userId = c.get('user').id
        const data = c.req.valid('json')

        const { errors, isValid } = await validateOrderCreate({ data })
        if (!isValid) {
          return c.json(
            Err({ message: 'Invalid input data', fields: errors }),
            400,
          )
        }

        const order = await createOrder({ userId, data })
        if (!order) throw new Error('Failed to create order')

        return c.json(Ok<Order>()(await mapOrderData(order)), 201)
      } catch (error) {
        return handleError(error, c)
      }
    },
  )
  .get(
    '/:id',
    routeDescriptions.get,
    validator('param', orderIdParam, (result, c) => {
      if (!result.success) return c.json(Err.fromZod(result.error), 400)
    }),
    async c => {
      try {
        const userId = c.get('user').id
        const orderId = c.req.param('id')
        const order = await getOrderById({ orderId })

        if (!order) return c.json(Err({ message: 'Order not found' }), 404)
        if (!order.userIdExt || order.userIdExt !== userId) {
          return c.json(Err({ message: 'Unauthorized' }), 401)
        }

        return c.json(Ok<Order>()(await mapOrderData(order)), 200)
      } catch (error) {
        return handleError(error, c)
      }
    },
  )
  .post(
    '/:id/confirm',
    routeDescriptions.confirm,
    validator('param', orderIdParam, (result, c) => {
      if (!result.success) return c.json(Err.fromZod(result.error), 400)
    }),
    validator('json', OrderConfirm, (result, c) => {
      if (!result.success) return c.json(Err.fromZod(result.error), 400)
    }),
    async c => {
      try {
        const userId = c.get('user').id
        const orderId = c.req.param('id')
        const data = c.req.valid('json')

        const order = await getOrderById({ orderId })
        if (!order) return c.json(Err({ message: 'Order not found' }), 404)
        if (!order.userIdExt || order.userIdExt !== userId) {
          return c.json(Err({ message: 'Unauthorized' }), 401)
        }

        const { errors, isValid } = await validateOrderConfirm({ order, data })
        if (!isValid) {
          return c.json(
            Err({ message: 'Invalid input data', fields: errors }),
            400,
          )
        }

        const confirmedOrder = await confirmOrderById({ orderId, data })
        if (!confirmedOrder) throw new Error('Failed to confirm order')

        return c.json(Ok<Order>()(await mapOrderData(confirmedOrder)), 200)
      } catch (error) {
        return handleError(error, c)
      }
    },
  )
  .post(
    '/:id/payment_identifiers',
    routeDescriptions.requestPaymentIdentifiers,
    validator('param', orderIdParam, (result, c) => {
      if (!result.success) return c.json(Err.fromZod(result.error), 400)
    }),
    async c => {
      try {
        const userId = c.get('user').id
        const orderId = c.req.param('id')

        const result = await requestPaymentIdentifiers({ userId, orderId })
        if (!result) throw new Error('Failed to request payment identifiers')

        return c.json(Ok<OrderPaymentIdentifiers>()(result), 200)
      } catch (error) {
        return handleError(error, c)
      }
    },
  )
