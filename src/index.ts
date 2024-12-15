import { serve } from '@hono/node-server'
import { app } from './app'

const port = Number.parseInt(process.env.PORT || '3000', 10)
const host = process.env.HOST || '0.0.0.0'

serve(
  {
    fetch: app.fetch,
    port,
    hostname: host,
  },
  () => {
    console.log(`Server is running on ${host}:${port}`)
  }
)
