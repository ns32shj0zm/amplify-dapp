import Loader from '../components/Loader'

const App = Loader(import(/*webpackChunkName: 'Login'*/ /* webpackPrefetch: true */ '../containers/App'))

const menuData = [
    {
        name: 'App',
        key: 'App',
        router: '/app/',
        component: App
    }
]

export default menuData
