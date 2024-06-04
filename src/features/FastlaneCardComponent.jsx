import { useRef, useEffect } from 'react'
import FastlaneWatermark from "./FastlaneWatermark";

const billingAddress = {
    company: undefined,
    firstName: 'John',
    lastName: 'Doe',
    streetAddress: '1 Merchant Dr.',
    extendedAddress: undefined,
    locality: 'San Jose',
    postalCode: '94088',
    region: 'CA',
    countryCodeAlpha2: 'US',
}

const options = {
    fields: {
        phoneNumber: {
            prefill: "4026607986"
        }
    },
    styles: {
        root: {
            backgroundColorPrimary: "#ffffff"
        }
    }
};

const FastlaneCardComponent = (props) => {
    const cardComponentInstance = useRef(null)

    useEffect(() => {
        const initCardComponent = async () => {
            const instance = await props?.fastlane?.FastlaneCardComponent({
                options
            })
            console.log('FastlaneCardComponent: initCardComponent', instance)
            instance.render('#cardComponentContainer')
            cardComponentInstance.current = instance
        }
        props.customerState === 'guest' && props.fastlane && initCardComponent()

        return () => {
            cardComponentInstance.current = null
        }
    }, [props.customerState, props.fastlane, props.customer])

    const changeCard = async () => {
        const { selectionChanged, selectedCard } = await props.fastlane.profile.showCardSelector()
        console.log('FastlaneCardComponent: changeCard', { selectionChanged, selectedCard })
        if(selectionChanged) props.onPaymentMethodChange(selectedCard)
    }

    const getPaymentToken = async () => {
        if (props.customerState === 'recognized') return props.onTokenize(props.customer.card)
        if (!cardComponentInstance.current) return
        const response = await cardComponentInstance.current.getPaymentToken({
            billingAddress
        })
        console.log('FastlaneCardComponent: tokenize', response)
        props.onTokenize(response)
    }

    return (
        <>
        <div className="card my-2">
            <h5 className="card-header">Payment Method</h5>
            <div className="card-body">
                {
                    (props.customerState === 'recognized')
                    ?
                        <div className="d-flex justify-content-between">
                            <div>
                                <p className="card-text">
                                    {props.customer.card.paymentSource.card.brand + ' - ' + props.customer.card.paymentSource.card.lastDigits}
                                </p>
                                {(props.customerState === 'recognized') && <FastlaneWatermark fastlane={props.fastlane} />}
                            </div>
                            <div>
                                <button className="btn btn-outline-primary m-2" onClick={changeCard}>
                                    Change
                                </button>
                            </div>
                        </div>
                    :
                        <>
                            <div className="d-flex justify-content-between">
                                <pre>
                                     <code>{JSON.stringify(billingAddress, null, 2)}</code>
                                </pre>
                                <div>
                                    <button className="btn btn-outline-primary m-2" onClick={() => window.alert('Merchant controlled billing address form')}>
                                        Change
                                    </button>
                                </div>
                            </div>
                            <div className="border border-success p-2">
                                <div id="cardComponentContainer"></div>
                            </div>
                        </>
                }

            </div>
        </div>
        <button className="btn btn-outline-primary m-2" onClick={getPaymentToken}>
            Pay Now
        </button>
    </>
    )
}

export default FastlaneCardComponent
