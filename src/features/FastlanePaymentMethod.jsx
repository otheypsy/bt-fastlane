import { useRef, useEffect } from 'react'

const fields = {
    phoneNumber: {
        prefill: '1234567890',
    },
}

const FastlanePaymentMethod = (props) => {
    const container = useRef(undefined)
    const ccInstance = useRef(undefined)

    useEffect(() => {
        const initialize = async () => {
            const instance = await props?.connect
                .ConnectCardComponent({
                    fields,
                })
                .render('#connectCardComponentContainer')
            console.log('ConnectCards: initialize', instance)
            ccInstance.current = instance
        }
        initialize()

        return () => {
            // Cleanup
        }
    }, [props.connect])

    const tokenize = async () => {
        if (!ccInstance.current) return
        const response = await ccInstance.current.tokenize({
            billingAddress: {
                streetAddress: '2211 North 1st St',
                locality: 'San Jose',
                region: 'CA',
                postalCode: '95131',
                countryCodeAlpha3: 'USA',
            },
        })
        console.log('ConnectCards: tokenize', response, props)
        props.onConnectCardResponse(response)
    }

    return (
        <>
            <div className="py-4">
                <div ref={container} id="connectCardComponentContainer" />
            </div>
            <button className="btn btn-outline-primary" onClick={tokenize}>
                Submit
            </button>
        </>
    )
}

export default FastlanePaymentMethod
