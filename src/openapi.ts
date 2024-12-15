import type { Context, Hono } from 'hono'
import { openAPISpecs } from 'hono-openapi'
import _ from 'lodash'
import dedent from 'ts-dedent'

const REFERENCES = {
  AUTHENTICATION_GUIDE: '/docs#description/authentication',
  RECIPIENTS_GUIDE: '/docs#tag/recipients',
  ORDERS_GUIDE: '/docs#tag/orders',
  MONITORING_GUIDE: '/docs#description/monitoring',
  WORKFLOW_GUIDE: '/docs#description/workflow',
  ROUTES: {
    ORDERS: {
      LIST: '/docs#tag/orders/GET/api/orders',
      CREATE: '/docs#tag/orders/POST/api/orders',
      GET: '/docs#tag/orders/GET/api/orders/%7Bid%7D',
      CONFIRM: '/docs#tag/orders/POST/api/orders/%7Bid%7D/confirm',
      REQUEST_PAYMENT_IDENTIFIERS:
        '/docs#tag/orders/POST/api/orders/%7Bid%7D/payment_identifiers',
    },
  },
}

export function openapiSpec(app: Hono) {
  return async (c: Context) => {
    const specs = await openAPISpecs(app, {
      documentation: {
        openapi: '3.0.3',
        tags: [
          {
            name: 'Orders',
            description: dedent`
              Orders represent payment transactions between fiat and crypto. This guide explains how to create and manage orders effectively.

              ## Understanding Orders

              ### Source (From) →

              The currency and amount being sent:

              - Fiat currency (\`USD\`, \`BRL\`, \`MXN\`)
              - crypto (\`USDC_ETH\`, \`USDT_ETH\`, \`USDT_TRX\`)

              ### Destination (To) ←

              The currency and recipient receiving the payment:

              - Recipient ID (created via the [Recipients API](${REFERENCES.RECIPIENTS_GUIDE}))
              - Currency to receive

              ## Order Types

              | Type | Description | Examples |
              |------|-------------|----------|
              | **On-Ramp** | Convert fiat to crypto | \`USD → USDC_ETH\`<br>\`BRL → USDT_ETH\`<br>\`MXN → USDT_TRX\` |
              | **Off-Ramp** | Convert crypto to fiat | \`USDC_ETH → USD\`<br>\`USDT_ETH → BRL\`<br>\`USDT_TRX → MXN\` |

              ## Creating Orders

              > **📚 Recipients Guide**  
              > Before creating orders, make sure you have set up your recipients.  
              > [Learn more about Recipients](${REFERENCES.RECIPIENTS_GUIDE})

              ### Basic Order Creation

              \`\`\`typescript
              interface OrderEndpoint {
                currency: string
                amount?: number
              }

              interface OrderDestination extends OrderEndpoint {
                recipient_id: number
              }

              interface OrderCreate {
                from: OrderEndpoint
                to: OrderDestination
                is_third_party: boolean
                purpose_of_payment?: string
                invoice_file_url?: string
                sender_legal_name?: string
                sender_bank_account_last_4?: string
              }

              async function createOrder(orderData: OrderCreate) {
                const response = await fetch('http://localhost:3000/api/orders', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.API_KEY,
                  },
                  body: JSON.stringify(orderData),
                })

                if (!response.ok) {
                  const error = await response.json()
                  throw new Error(error.error.message)
                }

                return response.json()
              }
              \`\`\`

              <details>
                <summary>Example: On-Ramp</summary>

                \`\`\`typescript
                const fiatToCryptoOrder = {
                  from: {
                    currency: 'USD',
                    amount: 1000,
                  },
                  to: {
                    currency: 'USDC_ETH',
                    recipient_id: 123,
                  },
                  is_third_party: false,
                }

                const { data: order } = await createOrder(fiatToCryptoOrder)
                console.log('Created order:', order.id)
                \`\`\`
              </details>

              <details>
                <summary>Example: Off-Ramp</summary>

                \`\`\`typescript
                const cryptoToFiatOrder = {
                  from: {
                    currency: 'USDC_ETH',
                    amount: 1000,
                  },
                  to: {
                    currency: 'USD',
                    recipient_id: 456,
                  },
                  is_third_party: true,
                  purpose_of_payment: 'Consulting services',
                  invoice_file_url: 'https://example.com/invoice.pdf',
                  sender_legal_name: 'John Smith',
                  sender_bank_account_last_4: '1234',
                }

                const { data: order } = await createOrder(cryptoToFiatOrder)
                console.log('Created order:', order.id)
                \`\`\`
              </details>

              ## Order Confirmation

              After creating an order and receiving the deposit instructions, you must confirm it by calling the [Confirm Order](${REFERENCES.ROUTES.ORDERS.CONFIRM}) endpoint.

              \`\`\`typescript TypeScript
              const orderId = 'ord_123'
              const confirmation = {
                transaction_hash:
                  '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
              }

              const response = await fetch(
                \`http://localhost:3000/api/orders/\${orderId}/confirm\`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.API_KEY,
                  },
                  body: JSON.stringify(confirmation),
                },
              )

              const { data: confirmedOrder } = await response.json()
              console.log('Order confirmed:', confirmedOrder.status)
              \`\`\`


              ## Requesting Payment Identifiers

              After confirming an order, you can request payment identifiers by calling the [Request Payment Identifiers](${REFERENCES.ROUTES.ORDERS.REQUEST_PAYMENT_IDENTIFIERS}) endpoint.

              \`\`\`typescript
              const orderId = 'ord_123'
              const response = await fetch(
                \`http://localhost:3000/api/orders/\${orderId}/payment_identifiers\`,
                {
                  method: 'POST',
                  headers: {
                    'x-api-key': process.env.API_KEY,
                  },
                },
              )

              const { data: identifiers } = await response.json()
              console.log('Payment identifiers:', {
                imad: identifiers.imad,
                omad: identifiers.omad,
              })
              \`\`\`
            `,
          },
        ],
        info: {
          title: 'SDigital2 Manual Order Desk API',
          version: '1.0.0',
          description: dedent`
            SDigital2 Manual Order Desk API enables seamless transactions between fiat currencies and cryptocurrencies. Our API provides a robust platform for managing payments, recipients, and orders with enterprise-grade security and reliability.

            ## Features

            | Feature | Availability |
            | ------- | ------------ |
            | **Fiat & Crypto Support**<br>Process payments in multiple fiat currencies (USD, BRL, MXN) and cryptocurrencies (USDC, USDT) across different networks | ✓ |
            | **Recipient Management**<br>Create and manage recipients for both fiat and crypto payments with validation and security checks | ✓ |
            | **Order Processing**<br>Create, confirm, and track payment orders with real-time status updates and detailed transaction history | ✓ |
            | **Payment Identifiers**<br>Track wire transfers with IMAD/OMAD identifiers for complete payment visibility | ✓ |

            ## Supported Currencies

            ### Fiat Currencies

            - \`USD\` — United States Dollar
            - \`BRL\` — Brazilian Real
            - \`MXN\` — Mexican Peso

            ### Cryptocurrencies

            - \`USDC_ETH\` — USDC on Ethereum network
            - \`USDT_ETH\` — USDT on Ethereum network
            - \`USDT_TRX\` — USDT on Tron network

            ## Getting Started

            1. Get your API key and learn about [authentication](${REFERENCES.AUTHENTICATION_GUIDE}).
            2. Set up [recipients](${REFERENCES.RECIPIENTS_GUIDE}) for payments.
            3. Create and manage [orders](${REFERENCES.ORDERS_GUIDE}).
            4. Track orders and payments with our [monitoring tools](${REFERENCES.MONITORING_GUIDE}).

            ## API Overview

            Our RESTful API uses standard HTTP methods and returns JSON responses. Here's a quick example:

            \`\`\`bash
            # Create a new order
            curl -X POST "http://localhost:3000/api/orders" \\
              -H "Content-Type: application/json" \\
              -H "x-api-key: your_api_key_here" \\
              -d '{
                "from": {
                  "currency": "USD",
                  "amount": 1000
                },
                "to": {
                  "currency": "USDC_ETH",
                  "recipient_id": 123
                },
                "is_third_party": false
              }'
            \`\`\`

            ## Guides

            - [Complete Workflow](${REFERENCES.WORKFLOW_GUIDE})
            - [Recipients Guide](${REFERENCES.RECIPIENTS_GUIDE})
            - [Orders Guide](${REFERENCES.ORDERS_GUIDE})
            - [Monitoring Guide](${REFERENCES.MONITORING_GUIDE})
          `,
        },
        servers: [
          {
            url: 'https://orders-sdigital2-sandbox.fly.dev',
            description: 'Sandbox server',
          },
          {
            url: 'https://orders-sdigital2.fly.dev',
            description: 'Production server',
          },
          {
            url: 'http://localhost:3000',
            description: 'Local server',
          },
        ],
        security: [{ apiKeyAuth: [] }],
        components: {
          securitySchemes: {
            apiKeyAuth: {
              type: 'apiKey',
              in: 'header',
              name: 'x-api-key',
              description: 'API key for authentication',
            },
          },
        },
      },
    })(c)

    const blob = await specs.json()
    const parsedBlob = JSON.parse(JSON.stringify(blob))

    // Remove all instances of { "in": "param", ... } from `parameters` arrays
    // as they are not supported by the OpenAPI spec.
    function removeParamObjects(value: unknown): unknown {
      if (Array.isArray(value)) {
        const inParam = value.find(item => item.in === 'param') ?? {}
        const { in: _in, ...paramData } = inParam

        const inPath = value.find(item => item.in === 'path') ?? {}
        const pathData = inPath

        if (pathData.schema && paramData.schema) {
          pathData.schema = _.mergeWith(
            pathData.schema,
            paramData.schema,
            (a, b) => {
              if (_.isArray(a) && _.isArray(b)) {
                return a.concat(b)
              }
            }
          )
        }

        return value
          .filter(item => !(item.in === 'param'))
          .map(removeParamObjects)
      }

      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
          Object.entries(value).map(([key, value]) => [
            key,
            removeParamObjects(value),
          ])
        )
      }

      return value
    }

    const cleanedBlob = removeParamObjects(parsedBlob)

    return c.json<typeof blob, 200>(cleanedBlob, 200)
  }
}
