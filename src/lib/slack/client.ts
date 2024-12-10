import type { users } from '~/db/schema'
import { type KnownBlock, WebClient } from '@slack/web-api'
import type { InferSelectModel } from 'drizzle-orm'
import { env } from '~/env'
import type { Order } from '~/schemas/order'
import type { Recipient } from '~/schemas/recipient'
import { SLACK_CHANNEL } from './constants'

export const slack = new WebClient(env.SLACK_TOKEN)

export async function notifyChannel(
  channel: string,
  content: string | KnownBlock[]
) {
  try {
    await slack.chat.postMessage({
      channel,
      ...(typeof content === 'string'
        ? { text: content }
        : { blocks: content }),
    })
  } catch (error) {
    console.error('Failed to send Slack message:', error)
    throw error
  }
}

export async function notifyPaymentIdentifiersRequested({
  user,
  order,
  recipient,
}: {
  user: InferSelectModel<typeof users>
  order: Order
  recipient: Recipient
}) {
  await notifyChannel(SLACK_CHANNEL.ENG_TESTING, [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: '🔍 Payment Identifiers Requested',
        emoji: true,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Order #${order.id}* requires payment identifiers (IMAD/OMAD) assignment.`,
      },
    },
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*From:*\n${user.name} (${user.email})`,
        },
        {
          type: 'mrkdwn',
          text: `*To:*\n${recipient.business_details.name}`,
        },
      ],
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Amount:* ${order.from.amount.toLocaleString()} ${
          order.from.currency
        } → ${order.to.amount.toLocaleString()} ${order.to.currency}`,
      },
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: '👉 Please assign IMAD/OMAD identifiers for this order',
        },
      ],
    },
  ])
}
