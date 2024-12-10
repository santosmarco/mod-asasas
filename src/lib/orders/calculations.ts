import { getCurrencyPair } from '~/lib/currencies'

export type OrderAmounts = {
  fromAmount: number
  toAmount: number
  platformFee: number
  developerFee: number
}

export async function calculateOrderAmounts({
  sendingCryptoTokenId,
  sendingFiatCurrencyId,
  sendingAmount,
  receivingCryptoTokenId,
  receivingFiatCurrencyId,
  receivingAmount,
  developerFee,
}: {
  sendingCryptoTokenId: string | undefined
  sendingFiatCurrencyId: string | undefined
  sendingAmount: number | undefined
  receivingCryptoTokenId: string | undefined
  receivingFiatCurrencyId: string | undefined
  receivingAmount: number | undefined
  developerFee: number | undefined
}): Promise<OrderAmounts> {
  const currencyPair = await getCurrencyPair({
    fromCurrencyId: sendingCryptoTokenId ?? sendingFiatCurrencyId ?? '',
    toCurrencyId: receivingCryptoTokenId ?? receivingFiatCurrencyId ?? '',
  })

  if (!currencyPair) {
    throw new Error('Currency pair not found')
  }

  const fromAmount = sendingAmount ?? 0
  const toAmount = receivingAmount ?? 0
  const platformFeePercent = +currencyPair.fee
  const devFeeAmount = developerFee ?? 0

  if (receivingAmount === undefined) {
    // When sending amount is provided, calculate receiving amount after fees
    const afterPlatformFee = fromAmount * (1 - platformFeePercent)
    const platformFeeAmount = fromAmount * platformFeePercent
    return {
      fromAmount,
      toAmount: afterPlatformFee - devFeeAmount,
      platformFee: platformFeeAmount,
      developerFee: devFeeAmount,
    }
  }

  // When receiving amount is provided, calculate required sending amount including fees
  const targetAmount = toAmount + devFeeAmount
  const calculatedFromAmount = targetAmount / (1 - platformFeePercent)
  const platformFeeAmount = calculatedFromAmount * platformFeePercent

  return {
    fromAmount: calculatedFromAmount,
    toAmount,
    platformFee: platformFeeAmount,
    developerFee: devFeeAmount,
  }
}
