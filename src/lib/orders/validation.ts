import type { orderData } from '~/db/schema'
import type { InferSelectModel } from 'drizzle-orm'
import type { Paths } from 'type-fest'
import { getRecipientById, mapRecipientData } from '~/lib/recipients'
import { CryptoToken } from '~/schemas/crypto-token'
import { FiatCurrency } from '~/schemas/fiat-currency'
import type { OrderConfirm, OrderCreate } from '~/schemas/order'
import type { ValidationResult } from '~/types'

export async function validateOrderCreate({
  data,
}: {
  data: OrderCreate
}): Promise<ValidationResult> {
  const errors: Partial<Record<Paths<typeof data>, string[]>> = {}

  if (
    [data.from.currency, data.to.currency].every(
      currency => FiatCurrency.safeParse(currency).success
    )
  ) {
    const errorMessage = `An order must have at least one crypto token currency. Both currencies provided (${data.from.currency} and ${data.to.currency}) are fiat currencies.`
    errors['from.currency'] = [...(errors['from.currency'] ?? []), errorMessage]
    errors['to.currency'] = [...(errors['to.currency'] ?? []), errorMessage]
  }

  if (
    [data.from.currency, data.to.currency].every(
      currency => CryptoToken.safeParse(currency).success
    )
  ) {
    const errorMessage = `An order must have at least one fiat currency. Both currencies provided (${data.from.currency} and ${data.to.currency}) are crypto tokens.`
    errors['from.currency'] = [...(errors['from.currency'] ?? []), errorMessage]
    errors['to.currency'] = [...(errors['to.currency'] ?? []), errorMessage]
  }

  if (data.from.amount === undefined && data.to.amount === undefined) {
    const errorMessage =
      'Please provide an amount for either the source or destination currency.'
    errors['from.amount'] = [...(errors['from.amount'] ?? []), errorMessage]
    errors['to.amount'] = [...(errors['to.amount'] ?? []), errorMessage]
  }

  if (data.from.amount !== undefined && data.to.amount !== undefined) {
    const errorMessage = `Please specify only one amount - either for the source (${data.from.amount}) or destination (${data.to.amount}) currency, not both.`
    errors['from.amount'] = [...(errors['from.amount'] ?? []), errorMessage]
    errors['to.amount'] = [...(errors['to.amount'] ?? []), errorMessage]
  }

  if (data.is_third_party) {
    if (!data.purpose_of_payment) {
      errors.purpose_of_payment = [
        ...(errors.purpose_of_payment ?? []),
        'For third-party orders, please specify the purpose of payment.',
      ]
    }

    if (!data.invoice_file_url) {
      errors.invoice_file_url = [
        ...(errors.invoice_file_url ?? []),
        'For third-party orders, please provide an invoice file.',
      ]
    }
  }

  try {
    const recipient = await getRecipientById({
      recipientId: data.to.recipient_id,
    })

    if (!recipient) {
      errors['to.recipient_id'] = [
        ...(errors['to.recipient_id'] ?? []),
        'Recipient not found',
      ]
    } else {
      const recipientMapped = await mapRecipientData(recipient)

      if (!recipientMapped.is_active) {
        errors['to.recipient_id'] = [
          ...(errors['to.recipient_id'] ?? []),
          'Recipient is not active.',
        ]
      }

      if (
        (recipientMapped.type === 'crypto'
          ? recipientMapped.token
          : recipientMapped.currency) !== data.to.currency
      ) {
        errors['to.currency'] = [
          ...(errors['to.currency'] ?? []),
          "Recipient's currency does not match the order's currency.",
        ]
      }
    }
  } catch (error) {
    errors['to.recipient_id'] = [
      ...(errors['to.recipient_id'] ?? []),
      (error as Error).message,
    ]
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  }
}

export async function validateOrderConfirm({
  order,
  data,
}: {
  order: InferSelectModel<typeof orderData>
  data: OrderConfirm
}): Promise<ValidationResult> {
  const errors: Partial<Record<Paths<typeof data>, string[]>> = {}

  if (order.paymentType === 'Off-Ramp' && !data.transaction_hash) {
    errors.transaction_hash = [
      ...(errors.transaction_hash ?? []),
      'For off-ramp orders, please provide a transaction hash.',
    ]
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  }
}
