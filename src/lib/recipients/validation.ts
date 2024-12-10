import type { Paths } from 'type-fest'
import type { RecipientCreate } from '~/schemas/recipient'
import type { ValidationResult } from '~/types'
import { isValidCryptoAddress } from '~/utils/crypto'

export async function validateRecipientCreate(
  data: RecipientCreate
): Promise<ValidationResult> {
  if (data.type === 'crypto') {
    return validateCryptoRecipientCreate(data)
  }

  return { errors: {}, isValid: true }
}

export async function validateCryptoRecipientCreate(
  data: Extract<RecipientCreate, { type: 'crypto' }>
): Promise<ValidationResult> {
  const errors: Partial<Record<Paths<typeof data>, string[]>> = {}

  if (!isValidCryptoAddress(data.token.split('_')[1] ?? '', data.address)) {
    errors.address = ['Invalid crypto address.']
  }

  return { errors, isValid: Object.keys(errors).length === 0 }
}
