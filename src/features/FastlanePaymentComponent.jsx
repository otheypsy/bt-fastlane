import { useRef, useEffect } from 'react'
import FastlaneWatermark from "./FastlaneWatermark";

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

const FastlanePaymentMethod = (props) => {
    const container = useRef(null)
    const paymentComponentInstance = useRef(null)

    useEffect(() => {
        const initPaymentComponent = async () => {
            const instance = await props?.fastlane?.FastlanePaymentComponent({
                options,
                shippingAddress: props.customer.shippingAddress
            })
            console.log('FastlanePaymentMethod: initPaymentComponent', instance)
            instance.render('#paymentComponentContainer')
            paymentComponentInstance.current = instance
        }
        props.fastlane && props.customer?.shippingAddress && initPaymentComponent()

        return () => {
            paymentComponentInstance.current = null
        }
    }, [props.fastlane, props.customer])

    const tokenize = async () => {
        console.log(paymentComponentInstance)
        if (!paymentComponentInstance.current) return
        const response = await paymentComponentInstance.current.getPaymentToken()
        console.log('FastlanePaymentMethod: tokenize', response)
        props.onPaymentMethodChange(response)
    }

    console.log(props.customer)

    return (
        <div className="card my-2">
            <h5 className="card-header">Payment Method</h5>
            <div className="card-body">
                <div className="d-flex justify-content-between">
                    <div>
                        <p className="card-text">
                            {props.customer.card.paymentSource.card.name}
                            <br />
                            {props.customer.card.paymentSource.card.brand + ' ' + props.customer.card.paymentSource.card.lastDigits}
                        </p>
                    </div>
                    <div>
                        <button className="btn btn-outline-primary m-2" onClick={tokenize}>
                            Submit
                        </button>
                    </div>
                </div>
                <div className="border border-success p-2">
                    <div id="paymentComponentContainer"></div>
                </div>
            </div>
        </div>
    )
}

export default FastlanePaymentMethod
