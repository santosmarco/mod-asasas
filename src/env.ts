import 'dotenv/config'

import { z } from './utils/zod'

export const Env = z
  .object({
    DATABASE_URL: z.string().url(),
    API_KEY_SECRET: z.string(),
    SLACK_TOKEN: z.string(),
  })
  .strip()
  .readonly()
export type Env = z.infer<typeof Env>

export const env = Env.parse(process.env)
