import type { ErrorHandler } from 'hono'
import { HTTPException } from 'hono/http-exception'

import { Err } from '~/utils/api-response'
import { z } from '~/utils/zod'

export const errorHandler: ErrorHandler = (err, c) => {
  if (err instanceof HTTPException) {
    return c.json(Err({ message: err.message, cause: err }), err.status)
  }

  if (err instanceof z.ZodError) {
    return c.json(Err.fromZod(err), 400)
  }

  return c.json(Err({ message: err.message, cause: err }), 500)
}
