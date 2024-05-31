import { useState, useEffect } from 'react'
import { useGetAppState } from '../states/App/AppHooks'
import { useSetAlert } from '../states/Alert/AlertHooks'
import FastlaneIdentity from '../features/FastlaneIdentity'
import FastlaneShippingAddress from '../features/FastlaneShippingAddress'
import FastlanePaymentMethod from '../features/FastlanePaymentMethod'
import { chargePaymentMethod } from '../services/ApiService'

const guest = {
    name: 'Guest',
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

const BTFastlaneCore = () => {
    const appState = useGetAppState()
    const { success, warning, danger } = useSetAlert()
    const [fastlaneInstance, setFastlaneInstance] = useState(null)
    const [isIdentified, setIsIdentified] = useState(false)
    const [customer, setCustomer] = useState(guest)
    const [customerState, setCustomerState] = useState('unknown')
    const [output, setOutput] = useState({})

    useEffect(() => {
        let fastlane = undefined
        const initConnect = async () => {
            try {
                warning('Initializing BTFastlane...')
                fastlane = await window.braintree.fastlane.create({
                    client: appState.clientInstance,
                    authorization: appState.clientInstance.getConfiguration().authorization,
                    deviceData: appState.deviceData,
                    styles: styles,
                })
                fastlane.setLocale('en_us')
                console.log('BTFastlane: initConnect', fastlane)
                setFastlaneInstance(fastlane)
                setIsIdentified(false)
                success('Ready!')
            } catch (error) {
                console.error(error)
                danger('Error!')
            }
        }
        appState.clientInstance && initConnect()

        return () => {
            fastlane?.teardown && fastlane.teardown()
            setFastlaneInstance(null)
        }
    }, [appState, success, warning, danger])

    const onIdentityResponse = (customer) => {
        console.log('BTFastlane: onIdentityResponse', customer)
        setCustomerState(() => (!customer ? 'guest' : 'recoginized'))
        if (!customer) return undefined
        setCustomer(customer)
    }

    const onPaymentMethodChange = async (card) => {
        console.log('BTFastlane: onPaymentMethodChange', card)
        setCustomer({
            ...customer,
            card,
        })
    }

    const onShippingAddressChange = (shippingAddress) => {
        console.log('BTFastlane: onShippingAddressChange', shippingAddress)
        setCustomer({
            ...customer,
            shippingAddress,
        })
    }

    const renderUXComponent = () => {
        switch (customerState) {
            case 'recoginized':
                return <></>

            case 'guest':
                return (
                    <>
                        <label className="lead">Welcome, {customer.name}</label>
                        <FastlaneShippingAddress
                            profile={fastlaneInstance.profile}
                            shippingAddress={customer.shippingAddress}
                            onChangeShippingAddress={onShippingAddressChange}
                        />
                        <FastlanePaymentMethod
                            profile={fastlaneInstance.profile}
                            card={customer.card}
                            onConnectCardResponse={onPaymentMethodChange}
                        />
                    </>
                )

            default:
                return <FastlaneIdentity fastlane={fastlaneInstance} onConnectIdentityResponse={onIdentityResponse} />
        }
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

const BTFastlane = () => {
    const appState = useGetAppState()
    const { danger } = useSetAlert()

    useEffect(() => {
        if (!appState?.clientInstance) danger('Braintree client instance is required')
    }, [appState, danger])

    if (!appState?.clientInstance) return null
    return <BTFastlaneCore />
}

export default BTFastlane
