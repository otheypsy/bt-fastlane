import { useState, useEffect } from 'react'
import { useGetAppState } from '../states/App/AppHooks'
import { useSetAlert } from '../states/Alert/AlertHooks'
import FastlaneIdentity from '../features/FastlaneIdentity'
import FastlaneShippingAddress from '../features/FastlaneShippingAddress'
import FastlaneCardComponent from '../features/FastlaneCardComponent'
import { chargeCreditCard } from '../services/ApiService'

const guest = {
    name: {
        firstName: 'Guest',
        lastName: 'Doe'
    },
    shippingAddress: {
        company: undefined,
        firstName: 'John',
        lastName: 'Doe',
        streetAddress: '1 Merchant Dr.',
        extendedAddress: undefined,
        locality: 'San Jose',
        postalCode: '94088',
        region: 'CA',
        countryCodeAlpha2: 'US',
    },
    card: undefined,
}

const styles = {
    root: {
        backgroundColorPrimary: '#ffffff',
        errorColor: '#C40B0B',
        fontFamily: 'PayPal-Light, sans-serif',
    },
    input: {
        borderRadius: '0.25rem',
        borderColor: '#9E9E9E',
        focusBorderColor: '#4496F6',
    },
    toggle: {
        colorPrimary: '#0F005E',
        colorSecondary: '#ffffff',
    },
    text: {
        body: {
            color: '#222222',
            fontSize: '1rem',
        },
        caption: {
            color: '#515151',
            fontSize: '0.8rem',
        },
    },
    branding: 'light',
}

const FastlaneFlexibleCore = () => {
    const appState = useGetAppState()
    const { success, warning, danger } = useSetAlert()
    const [fastlaneInstance, setFastlaneInstance] = useState(null)
    const [customer, setCustomer] = useState(guest)
    const [customerState, setCustomerState] = useState('unknown')
    const [output, setOutput] = useState({})

    useEffect(() => {
        let fastlane = undefined
        const initFastlane = async () => {
            try {
                warning('Initializing FastlaneFlexibleCore...')
                fastlane = await window.braintree.fastlane.create({
                    client: appState.clientInstance,
                    authorization: appState.clientInstance.getConfiguration().authorization,
                    deviceData: appState.deviceData,
                    styles: styles,
                })
                fastlane.setLocale('en_us')
                console.log('FastlaneFlexibleCore: initFastlane', fastlane)
                setFastlaneInstance(fastlane)
                setCustomerState('unknown')
                success('Ready!')
            } catch (error) {
                console.error(error)
                danger('Error!')
            }
        }
        appState.clientInstance && initFastlane()

        return () => {
            fastlane?.teardown && fastlane.teardown()
            setFastlaneInstance(null)
        }
    }, [appState, success, warning, danger])

    const onIdentityResponse = (customer) => {
        console.log('FastlaneComponents: onIdentityResponse', customer)
        setCustomerState(() => (!customer ? 'guest' : 'recognized'))
        if (!customer) return undefined
        setCustomer(customer)
    }

    const onShippingAddressChange = (shippingAddress) => {
        console.log('FastlaneComponents: onShippingAddressChange', shippingAddress)
        setCustomer({
            ...customer,
            shippingAddress,
        })
    }

    const onPaymentMethodChange = async (card) => {
        console.log('FastlaneComponents: onPaymentMethodChange', card)
        setCustomer({
            ...customer,
            card,
        })
    }

    const createTransaction = async (card) => {
        const params = {
            amount: 100,
            nonce: card.id,
            shippingAddress: customer.shippingAddress,
            billingAddress: card.paymentSource.card.billingAddress
        }
        const response = await chargeCreditCard(params)
        console.log('FastlaneComponents: createTransaction', response)
        setOutput(response)
    }

    const renderUXComponent = () => {
        return (customerState === 'recognized' || customerState === 'guest')
        ?
            (
                <>
                    <label className="lead mb-4">Welcome, {customer.name.firstName}</label>
                    <FastlaneShippingAddress
                        customerState={customerState}
                        fastlane={fastlaneInstance}
                        shippingAddress={customer.shippingAddress}
                        onShippingAddressChange={onShippingAddressChange}
                    />
                    <FastlaneCardComponent
                        customerState={customerState}
                        fastlane={fastlaneInstance}
                        profile={fastlaneInstance.profile}
                        customer={customer}
                        onPaymentMethodChange={onPaymentMethodChange}
                        onTokenize={createTransaction}
                    />
                </>
            )
        :
            <FastlaneIdentity fastlane={fastlaneInstance} onConnectIdentityResponse={onIdentityResponse} />
    }

    return (
        <div className="row">
            <div className="col">
                <div className="row">
                    <div className="col-12 col-lg-6 col-xxl-4">
                        <div className="mb-4">{renderUXComponent()}</div>
                    </div>
                </div>
                <br />
                <br />
                <pre className="bg-light p-2">
                    <code>{JSON.stringify(output, null, 2)}</code>
                </pre>
            </div>
        </div>
    )
}

const FastlaneFlexible = () => {
    const appState = useGetAppState()
    const { danger } = useSetAlert()

    useEffect(() => {
        if (!appState?.clientInstance) danger('Braintree client instance is required')
    }, [appState, danger])

    if (!appState?.clientInstance) return null
    return <FastlaneFlexibleCore />
}

export default FastlaneFlexible
