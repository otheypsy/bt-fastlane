const title = 'Braintree ~ Fastlane'

const credentials = {
    set: (credentials) => {
        try {
            window.localStorage.setItem('credentials', JSON.stringify(credentials))
        } catch (error) {
            console.error(error)
        }
    },
    get: () => {
        try {
            return JSON.parse(window.localStorage.getItem('credentials')) || {}
        } catch (error) {
            console.error(error)
            return {}
        }
    },
}

const routes = [
    {
        label: 'ClientInstance',
        path: 'client-instance',
        element: () => import('./pages/ClientInstance'),
        isDep: false,
    },
    {
        label: 'FL-Components',
        path: 'bt-fastlane-components',
        element: () => import('./pages/FastlaneComponents'),
        isDep: true,
    },
    {
        label: 'FL-Flexible',
        path: 'bt-fastlane-flex',
        element: () => import('./pages/FastlaneFlexible'),
        isDep: true,
    },
]

export { title, credentials, routes }
