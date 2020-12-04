import Loader from '../components/Loader'

// const App = Loader(import(/*webpackChunkName: 'App'*/ /* webpackPrefetch: true */ '../containers/App'))
const Governance = Loader(import(/*webpackChunkName: 'Governance'*/ /* webpackPrefetch: true */ '../containers/Governance'))
// const GovernanceDetail = Loader(import(/*webpackChunkName: 'GovernanceDetail'*/ /* webpackPrefetch: true */ '../containers/Governance/detail'))

const menuData = [
    // {
    //     name: 'App',
    //     key: 'App',
    //     router: '/app/',
    //     component: App
    // },
    {
        name: 'Governance',
        key: 'Governance',
        router: '/governance/',
        component: Governance
    }
    // {
    //     name: 'GovernanceDetail',
    //     key: 'GovernanceDetail',
    //     router: '/governanceDetail',
    //     component: GovernanceDetail
    // }
]

export default menuData
