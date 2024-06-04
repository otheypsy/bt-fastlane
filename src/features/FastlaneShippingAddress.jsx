import FastlaneWatermark from "./FastlaneWatermark";

const FastlaneShippingAddress = (props) => {
    const changeAddress = async () => {
        if (props?.fastlane?.profile && props.customerState === 'recognized') {
            const { selectionChanged, selectedAddress } = await props.fastlane.profile.showShippingAddressSelector()
            console.log('FastlaneShippingAddress: changeAddress', { selectionChanged, selectedAddress })
            if (selectionChanged) props.onShippingAddressChange(selectedAddress)
        }
        else {
            window.alert('Merchant controlled shipping address form')
        }
    }

    return (
        <div className="card my-2">
            <h5 className="card-header">Shipping Address</h5>
            <div className="card-body">
                <div className="d-flex justify-content-between">
                    <div>
                        <p className="card-text">
                            {props.shippingAddress.firstName + ' ' + props.shippingAddress.lastName}
                            <br />
                            {props.shippingAddress.streetAddress}
                            <br />
                            {props.shippingAddress.locality + ', ' + props.shippingAddress.region + ' - ' + props.shippingAddress.postalCode}
                        </p>
                        {(props.customerState === 'recognized') && <FastlaneWatermark fastlane={props.fastlane} />}
                    </div>
                    <div>
                        <button className="btn btn-outline-primary m-2" onClick={changeAddress}>
                            Change
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FastlaneShippingAddress
