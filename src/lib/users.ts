import { db } from '~/db'
import { users } from '~/db/schema'
import { eq } from 'drizzle-orm'
import { createHash } from 'node:crypto'
import { env } from '~/env'

export async function getUserById({ userId }: { userId: number | string }) {
  return await db
    .select()
    .from(users)
    .where(eq(users.id, +userId))
    .limit(1)
    .then(([user]) => user)
}

export async function getUserByApiKey(apiKey: string) {
  return await db
    .select()
    .from(users)
    .where(eq(users.hashedApiKey, hashApiKey(apiKey)))
    .limit(1)
    .then(([user]) => user)
}

function hashApiKey(key: string): string {
  const hash = createHash('sha256')
  hash.update(key + env.API_KEY_SECRET)
  return hash.digest('hex')
}
