import * as React from 'react'
import { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import classnames from 'classnames'
import { useTranslation } from 'react-i18next'
import { useWeb3React } from '@web3-react/core'
import Layout from '../../components/Layout'
import Header from '../../components/Header'
import Confirm from './confirm'
import './governance.styl'

type IProps = RouteComponentProps

function Home(props: IProps): JSX.Element {
    const [t] = useTranslation()
    const dispatch = useDispatch()
    const { account, library } = useWeb3React()
    const confirmRef = useRef<any>(null)

    useEffect(() => {
        confirmRef.current.show()
    }, [])

    return (
        <Layout className={classnames('page-governance')}>
            <Header />
            <div className="lt-main">
                <div className="header">我的票数</div>
                <div className="content">
                    <div className="block left">
                        <div className="blockTitle">钱包</div>
                        <div className="blockMain">
                            <div className="item">AMPT余额</div>
                            <div className="item">挖矿收益</div>
                            <div className="item">委托</div>
                            <div className="item">受托票数</div>
                        </div>
                    </div>
                    <div className="block right">
                        <div className="blockTitle">治理提案</div>
                        <div className="blockMain">
                            <div className="item">
                                <div className="title">Delegate UNI 2</div>
                                已通过 投 票
                            </div>
                        </div>
                    </div>
                </div>
                <Confirm ref={confirmRef} />
            </div>
        </Layout>
    )
}

export default withRouter(Home)
