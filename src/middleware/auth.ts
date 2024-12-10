import type { Input } from 'hono'
import { createMiddleware } from 'hono/factory'
import { getUserByApiKey } from '~/lib/users'
import type { AppEnv, AppVariables } from '~/types'
import { Err } from '~/utils/api-response'

export const auth = <E extends AppEnv, P extends string, I extends Input>() =>
  createMiddleware<E & { Variables: Required<AppVariables> }, P, I>(
    async (c, next) => {
      const apiKey = c.req.header('x-api-key')

      if (!apiKey) {
        return c.json(Err({ message: 'Unauthorized' }), 401)
      }

      const user = await getUserByApiKey(apiKey)

      if (!user) {
        return c.json(Err({ message: 'Unauthorized' }), 401)
      }

      c.set('user', user)

      await next()
    },
  )
