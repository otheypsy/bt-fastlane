const styles = {
    input: {
        borderRadius: '15px',
    },
    toggle: {
        colorPrimary: 'darkorange',
        colorSecondary: '#222222',
    },
    text: {
        body: {
            color: '#222222',
            fontSize: '12px',
        },
    },
}

const createConnectInstance = async ({ clientInstance, deviceData }) => {
    const connect = await window?.braintree?.connect?.create({
        client: clientInstance,
        deviceData: deviceData,
        styles: styles,
    })
    return connect
}

export { createConnectInstance }
