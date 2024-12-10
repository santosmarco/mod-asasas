import type { CryptoToken } from '~/schemas/crypto-token'

export const DEPOSIT_INSTRUCTIONS = {
  OFF_RAMP: {
    USDC_ETH: {
      WALLET_ADDRESS: '0x7e91b3688119A71D2dFA94F138B76D9d66399DA3',
    },
    USDT_ETH: {
      WALLET_ADDRESS: '0x7e91b3688119A71D2dFA94F138B76D9d66399DA3',
    },
    USDT_TRX: {
      WALLET_ADDRESS: 'TM4yvuDWSjXtS7ymNas1FcmWuZV12dsh5H',
    },
  } satisfies Record<CryptoToken, unknown>,

  ON_RAMP: {
    DOMESTIC: {
      BANK_NAME: 'Lead Bank',
      ACCOUNT_HOLDER_NAME: 'Conduit Technologies, Inc.',
      ACCOUNT_NUMBER: '1000682791',
      ROUTING_CODE: '101206101',
      ADDRESS_LINE_1: '1001 S. Main Street, Suite 4080',
      ADDRESS_LINE_2: 'Kalispell, MT 59901, US',
    },
    INTERNATIONAL: {
      BANK_NAME: 'DBS',
      ACCOUNT_HOLDER_NAME: 'Ibanera Pte Ltd',
      ACCOUNT_NUMBER: '0726475328',
      SWIFT_BIC: 'DBSSSGSGXXX',
      ADDRESS_LINE_1: '62 Ubi Road 1, #03-16, Oxley Bizhub 2',
      ADDRESS_LINE_2: '408734, Singapore',
      REFERENCE: 'REF12795',
    },
  },
} as const
