import { useRef, useEffect } from 'react'

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

const FastlanePaymentComponent = (props) => {
    const paymentComponentInstance = useRef(null)

    useEffect(() => {
        const initPaymentComponent = async () => {
            const instance = await props?.fastlane?.FastlanePaymentComponent({
                options,
                shippingAddress: props.customer.shippingAddress
            })
            console.log('FastlanePaymentComponent: initPaymentComponent', instance)
            instance.render('#paymentComponentContainer')
            paymentComponentInstance.current = instance
        }
        props.fastlane && props.customer?.shippingAddress && initPaymentComponent()

        return () => {
            paymentComponentInstance.current = null
        }
    }, [props.fastlane, props.customer])

    const getPaymentToken = async () => {
        if (!paymentComponentInstance.current) return
        const response = await paymentComponentInstance.current.getPaymentToken()
        console.log('FastlanePaymentComponent: tokenize', response)
        props.onTokenize(response)
    }

    return (
        <>
        <div className="card my-2">
            <h5 className="card-header">Payment Method</h5>
            <div className="card-body">
                <div className="border border-success p-2">
                    <div id="paymentComponentContainer"></div>
                </div>
            </div>
        </div>
        <button className="btn btn-outline-primary m-2" onClick={getPaymentToken}>
            Pay Now
        </button>
    </>
    )
}

export default FastlanePaymentComponent
