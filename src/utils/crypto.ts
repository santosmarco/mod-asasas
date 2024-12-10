export function isValidCryptoAddress(network: string, address: string) {
  if (network === 'ETH') {
    return /^0x[0-9a-fA-F]{40}$/.test(address)
  }

  if (network === 'TRX') {
    return /^T[A-Za-z0-9]{33}$/.test(address)
  }

  return false
}
