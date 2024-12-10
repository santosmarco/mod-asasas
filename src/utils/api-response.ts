import type { IsEqual, Tagged } from 'type-fest'

import type {
  ApiResponseErr,
  ApiResponseOk,
  ErrorDetails,
} from '~/schemas/api-response'
import type { z } from '~/utils/zod'

export function Ok<T = void>() {
  return (
    ...[data]: IsEqual<T, void> extends true
      ? [
          data: T,
          Tagged<
            '`Ok` expects a generic type argument but received none.',
            'TypeError'
          >,
        ]
      : [data: T]
  ) => {
    return {
      status: 'ok',
      data,
    } satisfies ApiResponseOk<T>
  }
}

export function Err(error: ErrorDetails) {
  return {
    status: 'error',
    error,
  } satisfies ApiResponseErr
}

Err.fromZod = (error: z.ZodError) => {
  const fields = error.issues.reduce(
    (acc, issue) => {
      const path = issue.path.join('.')
      if (!acc[path]) acc[path] = []
      acc[path]?.push(issue.message)
      return acc
    },
    {} as Record<string, string[]>,
  )

  return Err({
    message: 'Invalid input data',
    fields,
    cause: error,
  })
}
