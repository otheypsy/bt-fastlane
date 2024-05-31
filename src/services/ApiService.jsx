import { GraphQLClient } from 'graphql-request'
let client = null

const setup = (credentials) => {
    const endpoint = 'https://payments.sandbox.braintree-api.com/graphql'
    client = new GraphQLClient(endpoint, {
        headers: {
            authorization: 'Bearer ' + window.btoa(credentials.publicKey + ':' + credentials.privateKey),
            'Braintree-Version': '2020-10-01',
        },
    })
}

const createClientToken = (params) => {
    const query = `
        mutation CreateClientTokenRequest($input: CreateClientTokenInput!) {
            createClientToken(input: $input) {
                clientMutationId
                clientToken
            }
        }
    `
    const variables = {
        input: {
            clientMutationId: Date.now(),
            clientToken: {
                merchantAccountId: params.merchantAccountId,
                domains: params.domains,
            },
        },
    }
    return client.request(query, variables)
}

const chargePaymentMethod = (params) => {
    const query = `
        mutation MyChargePaymentMethod($input: ChargePaymentMethodInput!) {
            chargePaymentMethod(input: $input) {
                clientMutationId
                transaction {
                    id
                    legacyId
                    merchantId
                    merchantAccountId
                    orderId
                    status
                }
            }
        }
    `
    const variables = {
        input: {
            clientMutationId: Date.now(),
            paymentMethodId: params.nonce,
            transaction: {
                orderId: params.orderId,
                amount: params.amount,
                merchantAccountId: params.merchantAccountId,
            },
        },
    }
    return client.request(query, variables)
}

const vaultPaymentMethod = (params) => {
    const query = `
        mutation MyVaultPaymentMethod($input: VaultPaymentMethodInput!) {
            vaultPaymentMethod(input: $input) {
                clientMutationId
                paymentMethod {
                    id
                    legacyId
                }
            }
        }
    `
    const variables = {
        input: {
            clientMutationId: Date.now(),
            paymentMethodId: params.nonce,
            customerId: params.customerId,
        },
    }
    return client.request(query, variables)
}

export { setup, createClientToken, chargePaymentMethod, vaultPaymentMethod }
