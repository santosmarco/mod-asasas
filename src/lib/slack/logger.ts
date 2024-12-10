import type { KnownBlock } from '@slack/web-api'
import { notifyChannel } from './client'
import { SLACK_CHANNEL } from './constants'

export type LogLevel = 'info' | 'warn' | 'error'

export type LogMessage = {
  level: LogLevel
  message: string
  metadata?: Record<string, unknown>
}

const LEVEL_EMOJI = {
  info: 'ℹ️',
  warn: '⚠️',
  error: '🚨',
} as const

export async function logToSlack({ level, message, metadata }: LogMessage) {
  const emoji = LEVEL_EMOJI[level]

  const blocks: KnownBlock[] = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `${emoji} *${level.toUpperCase()}*: ${message}`,
      },
    },
  ]

  if (metadata) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `\`\`\`${JSON.stringify(metadata, null, 2)}\`\`\``,
      },
    })
  }

  try {
    await notifyChannel(SLACK_CHANNEL.ENG_TESTING, blocks)
  } catch (error) {
    // Fallback to console if Slack notification fails
    console.error('Failed to log to Slack:', error)
    console.log({
      level,
      message,
      metadata,
    })
  }
}

export const slackLogger = {
  info: (message: string, metadata?: Record<string, unknown>) =>
    logToSlack({ level: 'info', message, metadata }),

  warn: (message: string, metadata?: Record<string, unknown>) =>
    logToSlack({ level: 'warn', message, metadata }),

  error: (message: string, metadata?: Record<string, unknown>) =>
    logToSlack({ level: 'error', message, metadata }),
}
