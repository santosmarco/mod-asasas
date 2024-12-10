import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { secureHeaders } from 'hono/secure-headers'
import { trimTrailingSlash } from 'hono/trailing-slash'
import { errorHandler } from './errors/handler'
import { openapiSpec } from './openapi'
import { ordersRouter } from './routers/orders'
import { recipientsRouter } from './routers/recipients'

export const app = new Hono()

// Add health check endpoint
app.get('/health', c => c.json({ status: 'ok' }))

app.use(cors())
app.use(secureHeaders())
app.use(trimTrailingSlash())
app.use(logger())
app.use(prettyJSON())
app.get('/openapi.json', openapiSpec(app))
app.route('/api/orders', ordersRouter)
app.route('/api/recipients', recipientsRouter)
app.onError(errorHandler)
