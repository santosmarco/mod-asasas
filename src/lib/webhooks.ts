export function getWebhookPayload(
  event: string,
  payload: Record<string, unknown>,
) {
  return {
    event,
    data: payload,
    timestamp: new Date().toISOString(),
  }
}
