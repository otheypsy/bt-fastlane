const FastlaneShippingAddress = (props) => {
    const changeAddress = async () => {
        if (props?.profile) {
            const { selectionChanged, selectedAddress } = await props.profile.showShippingAddressSelector()
            if (selectionChanged) props.onChangeShippingAddress(selectedAddress)
        }
    }

    return (
        <>
            <div className="card my-2">
                <div className="card-body">
                    <pre>
                        <code>{JSON.stringify(props.shippingAddress, null, 2)}</code>
                    </pre>
                </div>
                {props?.profile && (
                    <button className="btn btn-outline-primary m-2" onClick={changeAddress}>
                        Change
                    </button>
                )}
            </div>
        </>
    )
}

export default FastlaneShippingAddress
