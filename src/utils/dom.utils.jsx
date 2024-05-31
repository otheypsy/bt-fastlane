const loadScript = (url, queryParams = {}, dataAttributes = {}) => {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        const finalUrl = new URL(url)

        for (const key in queryParams) {
            finalUrl.searchParams.append(key, queryParams[key])
        }

        for (const key in dataAttributes) {
            script.setAttribute(key, dataAttributes[key])
        }

        const onLoad = () => {
            resolve(script)
            script.removeEventListener('error', onError)
            script.removeEventListener('load', onLoad)
        }

        const onError = (e) => {
            reject(e)
            script.removeEventListener('error', onError)
            script.removeEventListener('load', onLoad)
        }

        script.src = finalUrl.href
        script.async = true
        document.body.appendChild(script)

        script.addEventListener('load', onLoad)
        script.addEventListener('error', onError)
    })
}

export { loadScript }
