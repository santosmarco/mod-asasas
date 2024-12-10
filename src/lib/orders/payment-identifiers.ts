import { getRecipientById, mapRecipientData } from '~/lib/recipients'
import { notifyPaymentIdentifiersRequested } from '~/lib/slack/client'
import { getUserById } from '~/lib/users'
import type { OrderPaymentIdentifiers } from '~/schemas/order'
import { getOrderById, mapOrderData } from './queries'

export async function requestPaymentIdentifiers({
  userId,
  orderId,
}: {
  userId: number | string
  orderId: number | string
}): Promise<OrderPaymentIdentifiers | undefined> {
  const [user, order] = await Promise.all([
    getUserById({ userId }),
    getOrderById({ orderId }),
  ])
  if (!user || !order) return

  if (order.imad || order.omad) {
    return {
      imad: order.imad,
      omad: order.omad,
    }
  }

  const recipient = await getRecipientById({
    recipientId: order.receivingAccount ?? 0,
  })
  if (!recipient) return

  const [orderMapped, recipientMapped] = await Promise.all([
    mapOrderData(order),
    mapRecipientData(recipient),
  ])

  await notifyPaymentIdentifiersRequested({
    user,
    order: orderMapped,
    recipient: recipientMapped,
  })

  return {
    imad: null,
    omad: null,
    notes: 'Payment identifiers requested. Please wait.',
  }
}
