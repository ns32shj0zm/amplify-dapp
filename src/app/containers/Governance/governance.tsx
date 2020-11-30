import * as React from 'react'
import { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import classnames from 'classnames'
import { useTranslation } from 'react-i18next'
import { useWeb3React } from '@web3-react/core'
import Layout from '../../components/Layout'
import Header from '../../components/Header'
import './governance.styl'

type IProps = RouteComponentProps

function Home(props: IProps): JSX.Element {
    const [t] = useTranslation()
    const dispatch = useDispatch()
    const { account, library } = useWeb3React()

    return (
        <Layout className={classnames('page-governance')}>
            <Header />
            <div className="lt-main">
                <div className="content">治理功能暂未开放，敬请期待！</div>
            </div>
        </Layout>
    )
}

export default withRouter(Home)
