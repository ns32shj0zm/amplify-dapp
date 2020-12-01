// import storage from '../utils/storage'
import * as React from 'react'
// import { useEffect, useState } from 'react'
import { Route, Switch, withRouter, RouteComponentProps } from 'react-router'
import { useDispatch } from 'react-redux'
import basicAction from '../actions/baseAction'
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import systemRouter from './systemRouter'
import ScrollToTop from '../components/ScrollToTop'
import App from '../containers/App'
import NotFound from '../containers/NotFound'

function getLibrary(provider): Web3Provider {
    const library = new Web3Provider(provider)
    library.pollingInterval = 12000
    return library
}

const AppRoute = (props: RouteComponentProps): JSX.Element => {
    // const viewWidth = document.body.clientWidth;
    const dispatch = useDispatch()

    window.onresize = () => {
        dispatch(basicAction.setViewWidth(document.body.clientWidth))
    }

    return (
        <Web3ReactProvider getLibrary={getLibrary}>
            <ScrollToTop>
                <Switch>
                    {systemRouter.map((r, key) => {
                        return <Route render={() => <r.component />} key={r.router + key} path={r.router} />
                    })}
                    <Route exact={true} path="/" component={App} />
                    <Route path="*" component={NotFound} />
                </Switch>
            </ScrollToTop>
        </Web3ReactProvider>
    )
}

export default withRouter(AppRoute)
