import { useEffect, useRef, useState } from 'react'

const FastlaneIdentity = (props) => {
    const watermark = useRef(undefined)
    const [email, setEmail] = useState('odesai_connect@example.com')

    useEffect(() => {
        const initWatermark = async () => {
            const fastlaneWatermark = await props?.fastlane
                ?.FastlaneWatermarkComponent({ includeAdditionalInfo: true })
                .render(watermark.current)
            console.log('FastlaneIdentity: initWatermark', fastlaneWatermark)
        }
        props.fastlane && initWatermark()
    }, [props.fastlane])

    const lookupCustomer = async () => {
        const response = await props?.fastlane?.identity.lookupCustomerByEmail(email)
        console.log('FastlaneIdentity: lookupCustomer', response)
        return response.customerContextId
    }

    const authCustomer = async (customerContextId) => {
        const response = await props?.fastlane?.identity.triggerAuthenticationFlow(customerContextId)
        console.log('FastlaneIdentity: authCustomer', response)
        return response.authenticationState === 'succeeded' ? response.profileData : false
    }

    const runIdentity = async () => {
        const customerContextId = await lookupCustomer()
        const authResponse = customerContextId ? await authCustomer(customerContextId) : false
        props.onConnectIdentityResponse(authResponse)
    }

    const onEmailChange = async (e) => setEmail(e.target.value)

    return (
        <>
            <div className="form-floating mb-4">
                <input type="text" className="form-control" value={email} onChange={onEmailChange} />
                <label htmlFor="email">Email</label>
                <div className="float-end m-1" style={{ minWidth: '250px' }} ref={watermark} id="watermarkContainer" />
            </div>
            <button className="btn btn-outline-primary" onClick={runIdentity}>
                Identify
            </button>
        </>
    )
}

export default FastlaneIdentity
