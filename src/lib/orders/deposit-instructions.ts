import { DEPOSIT_INSTRUCTIONS } from '~/constants/deposit-instructions'
import { CryptoToken } from '~/schemas/crypto-token'
import type {
  CryptoDepositInstructions,
  DepositInstructions,
  FiatDepositInstructions,
} from '~/schemas/deposit-instructions'

export function getOrderDepositInstructions(
  sourceCurrency: string,
): DepositInstructions {
  const cryptoTokenParseResult = CryptoToken.safeParse(sourceCurrency)

  if (cryptoTokenParseResult.success) {
    return {
      token: cryptoTokenParseResult.data,
      wallet_address:
        DEPOSIT_INSTRUCTIONS.OFF_RAMP[cryptoTokenParseResult.data]
          .WALLET_ADDRESS,
    } satisfies CryptoDepositInstructions
  }

  return {
    domestic: {
      bank_name: DEPOSIT_INSTRUCTIONS.ON_RAMP.DOMESTIC.BANK_NAME,
      account_holder_name:
        DEPOSIT_INSTRUCTIONS.ON_RAMP.DOMESTIC.ACCOUNT_HOLDER_NAME,
      account_number: DEPOSIT_INSTRUCTIONS.ON_RAMP.DOMESTIC.ACCOUNT_NUMBER,
      routing_code: DEPOSIT_INSTRUCTIONS.ON_RAMP.DOMESTIC.ROUTING_CODE,
      address_line_1: DEPOSIT_INSTRUCTIONS.ON_RAMP.DOMESTIC.ADDRESS_LINE_1,
      address_line_2: DEPOSIT_INSTRUCTIONS.ON_RAMP.DOMESTIC.ADDRESS_LINE_2,
    },
    international: {
      bank_name: DEPOSIT_INSTRUCTIONS.ON_RAMP.INTERNATIONAL.BANK_NAME,
      account_holder_name:
        DEPOSIT_INSTRUCTIONS.ON_RAMP.INTERNATIONAL.ACCOUNT_HOLDER_NAME,
      account_number: DEPOSIT_INSTRUCTIONS.ON_RAMP.INTERNATIONAL.ACCOUNT_NUMBER,
      swift_bic: DEPOSIT_INSTRUCTIONS.ON_RAMP.INTERNATIONAL.SWIFT_BIC,
      address_line_1: DEPOSIT_INSTRUCTIONS.ON_RAMP.INTERNATIONAL.ADDRESS_LINE_1,
      address_line_2: DEPOSIT_INSTRUCTIONS.ON_RAMP.INTERNATIONAL.ADDRESS_LINE_2,
      reference: DEPOSIT_INSTRUCTIONS.ON_RAMP.INTERNATIONAL.REFERENCE,
    },
  } satisfies FiatDepositInstructions
}
