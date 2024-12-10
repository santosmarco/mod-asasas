import { db } from '~/db'
import { orderData } from '~/db/schema'
import {
  type InferInsertModel,
  type InferSelectModel,
  desc,
  eq,
} from 'drizzle-orm'
import { getAllCurrencies } from '~/lib/currencies'
import { getUserById } from '~/lib/users'
import { Order, type OrderConfirm, type OrderCreate } from '~/schemas/order'
import { toLowerCase } from '~/utils/strings'
import { calculateOrderAmounts } from './calculations'
import { getOrderDepositInstructions } from './deposit-instructions'

export async function mapOrderData(order: InferSelectModel<typeof orderData>) {
  const currencies = await getAllCurrencies()

  const fromCurrencyId = currencies.find(
    currency =>
      currency.id === order.sendingFiatCurrencyId ||
      currency.id === order.sendingCryptoTokenId
  )
  const fromCurrency =
    order.paymentType === 'On-Ramp'
      ? fromCurrencyId?.symbol
      : fromCurrencyId?.name.replace(/[()]/g, '').replace(/\s/g, '_')

  const toCurrencyId = currencies.find(
    currency =>
      currency.id === order.receivingFiatCurrencyId ||
      currency.id === order.receivingCryptoTokenId
  )
  const toCurrency =
    order.paymentType === 'On-Ramp'
      ? toCurrencyId?.name.replace(/[()]/g, '').replace(/\s/g, '_')
      : toCurrencyId?.symbol

  const from = {
    currency: Order.shape.from.shape.currency.parse(fromCurrency),
    amount: Number.parseFloat(order.amountSent ?? '0'),
  } satisfies Order['from']

  const to = {
    recipient_id: order.receivingAccount ?? 0,
    currency: Order.shape.to.shape.currency.parse(toCurrency),
    amount: Number.parseFloat(order.amountReceived ?? '0'),
  } satisfies Order['to']

  const depositInstructions = getOrderDepositInstructions(from.currency)

  const paymentIdentifiers = {
    imad: order.imad ?? null,
    omad: order.omad ?? null,
  }

  return {
    id: order.id,
    user_id: order.userIdExt ?? 0,
    type: order.paymentType === 'On-Ramp' ? 'on-ramp' : 'off-ramp',
    status: order.status ? toLowerCase(order.status) : 'unknown',
    from,
    to,
    is_third_party: order.isThirdParty ?? false,
    sender_legal_name: order.senderBusinessName ?? undefined,
    sender_bank_account_last_4: order.last4SenderBankAccountNumber ?? undefined,
    purpose_of_payment: order.purpose ?? undefined,
    invoice_file_url: order.invoiceFileUrl ?? undefined,
    deposit_instructions: depositInstructions,
    transaction_hash: order.txnHash ?? undefined,
    notes: order.notes ?? undefined,
    payment_identifiers: paymentIdentifiers,
    created_at: order.dateOfRequest ?? '',
    updated_at: order.dateOfRequest ?? '',
  } satisfies Order
}

export async function listUserOrders({ userId }: { userId: number | string }) {
  return await db
    .select()
    .from(orderData)
    .where(eq(orderData.userIdExt, +userId))
    .orderBy(desc(orderData.id))
}

export async function createOrder({
  userId,
  data,
}: {
  userId: number | string
  data: OrderCreate
}) {
  const [user, currencies] = await Promise.all([
    getUserById({ userId }),
    getAllCurrencies(),
  ])

  const sendingCryptoTokenId = currencies.find(
    currency => currency.name === `${data.from.currency.replace('_', ' (')})`
  )?.id
  const sendingFiatCurrencyId = currencies.find(
    currency => currency.symbol === data.from.currency
  )?.id
  const receivingCryptoTokenId = currencies.find(
    currency => currency.name === `${data.to.currency.replace('_', ' (')})`
  )?.id
  const receivingFiatCurrencyId = currencies.find(
    currency => currency.symbol === data.to.currency
  )?.id

  const { fromAmount, toAmount, platformFee, developerFee } =
    await calculateOrderAmounts({
      sendingCryptoTokenId,
      sendingFiatCurrencyId,
      sendingAmount: data.from.amount,
      receivingCryptoTokenId,
      receivingFiatCurrencyId,
      receivingAmount: data.to.amount,
      developerFee: data.developer_fee,
    })

  return await db
    .insert(orderData)
    .values({
      userIdExt: user?.id,
      organization: user?.organizationId,
      userEmail: user?.email,
      dateOfRequest: new Date().toISOString(),
      status: 'Pending',
      paymentType: receivingCryptoTokenId ? 'On-Ramp' : 'Off-Ramp',
      sendingCryptoTokenId,
      sendingFiatCurrencyId,
      receivingCryptoTokenId,
      receivingFiatCurrencyId,
      amountSent: fromAmount.toString(),
      amountReceived: toAmount.toString(),
      receivingAccount: data.to.recipient_id,
      isThirdParty: data.is_third_party,
      senderBusinessName: data.sender_legal_name,
      last4SenderBankAccountNumber: data.sender_bank_account_last_4,
      purpose: data.purpose_of_payment,
      invoiceFileUrl: data.invoice_file_url,
      platformFee: platformFee,
      developerFee: developerFee,
      notes: null,
    })
    .returning()
    .then(([order]) => order)
}

export async function getOrderById({ orderId }: { orderId: number | string }) {
  return await db
    .select()
    .from(orderData)
    .where(eq(orderData.id, +orderId))
    .limit(1)
    .then(([order]) => order)
}

export async function updateOrderById({
  orderId,
  data,
}: {
  orderId: number | string
  data: InferInsertModel<typeof orderData>
}) {
  return await db
    .update(orderData)
    .set(data)
    .where(eq(orderData.id, +orderId))
    .returning()
    .then(([order]) => order)
}

export async function deleteOrderById({
  orderId,
}: {
  orderId: number | string
}) {
  return await db
    .delete(orderData)
    .where(eq(orderData.id, +orderId))
    .returning()
    .then(([order]) => order)
}

export async function confirmOrderById({
  orderId,
  data,
}: {
  orderId: number | string
  data: OrderConfirm
}) {
  return await db
    .update(orderData)
    .set({
      status: 'Submitted',
      txnHash: data.transaction_hash,
    })
    .where(eq(orderData.id, +orderId))
    .returning()
    .then(([order]) => order)
}
