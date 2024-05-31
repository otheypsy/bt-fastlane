import { StrictMode, lazy, Suspense, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import MainLayout from './layouts/MainLayout'
import Error from './components/Error'
import Loading from './components/Loading'
import { title, routes } from './config'
import './style.scss'
import { loadScript } from './utils/dom.utils'

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout routes={routes} title={title} />,
        errorElement: <Error />,
        children: routes.map((route) => {
            const Component = lazy(route.element)
            return {
                path: route.path,
                errorElement: <Error />,
                element: (
                    <Suspense fallback={<Loading />}>
                        <Component />
                    </Suspense>
                ),
            }
        }),
    },
])

const Mount = () => {
    useEffect(() => {
        const init = async () => {
            window.localStorage.setItem('axoEnv', 'sandbox')
            await loadScript('https://assets.braintreegateway.com/web/3.101.0-fastlane-beta.7.2/js/client.min.js')
            await loadScript('https://assets.braintreegateway.com/web/3.101.0-fastlane-beta.7.2/js/fastlane.min.js')
            await loadScript(
                'https://assets.braintreegateway.com/web/3.101.0-fastlane-beta.7.2/js/data-collector.min.js',
            )
        }
        init()
    }, [])

    return (
        <StrictMode>
            <RecoilRoot>
                <RouterProvider router={router} />
            </RecoilRoot>
        </StrictMode>
    )
}

const container = document.getElementById('root')
const root = createRoot(container)
root.render(<Mount tab="home" />)
