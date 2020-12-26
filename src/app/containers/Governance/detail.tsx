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
import Vote from './vote'
import './detail.styl'

type IProps = RouteComponentProps

function Home(props: IProps): JSX.Element {
    const [t] = useTranslation()
    const dispatch = useDispatch()
    const { account, library } = useWeb3React()
    const confirmRef = useRef<any>(null)
    const voteRef = useRef<any>(null)

    // useEffect(() => {
    //     voteRef.current.show()
    // }, [])

    return (
        <Layout className={classnames('page-governanceDetail')}>
            <Header />
            <div className="lt-main">
                <div className="header">
                    <div className="backBtn">返回提案列表</div>
                    <div className="wrap">
                        <div className="title">Delegate UNI 2</div>
                        <div className="main">
                            <div className="left">
                                <div className="btn">已通过</div>
                                <div className="text">028 · 已取消 November 4th ,2020</div>
                            </div>
                            <div className="right">
                                <div className="text">没有投票</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="content">
                    <div className="block agree">
                        <div className="title">赞成</div>
                        <div className="wrap">
                            <div className="info">
                                <div>投票最多的10个地址</div>
                                <div>票数</div>
                            </div>
                        </div>
                    </div>
                    <div className="block against">
                        <div className="title">反对</div>
                    </div>
                    <div className="block detail">
                        <div className="title">提案详情</div>
                    </div>
                    <div className="block history">
                        <div className="title">操作历史</div>
                    </div>
                </div>
                <Confirm ref={confirmRef} />
                <Vote ref={voteRef} />
            </div>
        </Layout>
    )
}

export default withRouter(Home)
