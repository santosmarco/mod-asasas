import 'dotenv/config'

import { defineConfig } from 'drizzle-kit'

if (!process.env.DATABASE_URL) {
  throw new Error('❌ Environment variable missing: DATABASE_URL')
}

const drizzleConfig = defineConfig({
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  out: './drizzle',
  schema: './src/db/schema.ts',
})

export default drizzleConfig
