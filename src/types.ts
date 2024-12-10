import type { users } from '~/db/schema'
import type { InferSelectModel } from 'drizzle-orm'

export type UnauthenticatedAppVariables = {
  user?: never
}

export type AuthenticatedAppVariables = {
  user: InferSelectModel<typeof users>
}

export type AppVariables =
  | UnauthenticatedAppVariables
  | AuthenticatedAppVariables

export type AppEnv = {
  Variables: AppVariables
}

export type OptionalKey<T extends object> = {
  [K in keyof T]: undefined extends T[K] ? K : never
}[keyof T]

export type RequiredKey<T extends object> = {
  [K in keyof T]: undefined extends T[K] ? never : K
}[keyof T]

export type AddQuestionMarks<T extends object> = {
  [K in RequiredKey<T>]: T[K]
} & {
  [K in OptionalKey<T>]?: T[K]
}

export type NullableToNullishDeep<T> = T extends object
  ? AddQuestionMarks<{ [K in keyof T]: NullableToNullishDeep<T[K]> }>
  : T extends Array<infer U>
  ? Array<NullableToNullishDeep<U>>
  : null extends T
  ? T | undefined
  : T

export type ValidationResult = {
  errors: Partial<Record<string, string[]>>
  isValid: boolean
}

export type LibraryResult<T> =
  | { data: T; error?: never }
  | { data?: never; error: Error }
