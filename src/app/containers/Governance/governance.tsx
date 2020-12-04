import * as React from 'react'
import { useState, useEffect, useRef } from 'react'
import { Button } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import classnames from 'classnames'
import { useTranslation } from 'react-i18next'
import { useWeb3React } from '@web3-react/core'
import Layout from '../../components/Layout'
import Header from '../../components/Header'
import Confirm from './confirm'
import Vote from './vote'
import basicAction from '../../actions/baseAction'
import { getCurrentVotes, getClaimComp, getDelegates, getAMPTBalanceOf, getProposals, getState } from '../../utils/compoundTool'
import StatusDialog from '../App/StatusDialog'
import { IRootState } from '../../reducers/RootState'
import { getShortenAddress } from '../../utils/'
import './governance.styl'

type IProps = RouteComponentProps

function Governance(props: IProps): JSX.Element {
    const [t, i18n] = useTranslation()
    const dispatch = useDispatch()
    const { account, library } = useWeb3React()
    const confirmRef = useRef<any>(null)
    const voteRef = useRef<any>(null)
    const StatusDialogRef = useRef<any>(null)
    const [info, setInfo] = useState<any>({})
    const { gasPrice, proposals } = useSelector((store: IRootState) => store.base)
    const [list, setList] = useState<ayn>([])

    const updateData = async (): Promise<void> => {
        await dispatch(basicAction.updateGasPrice())
        await dispatch(basicAction.getProposals())
        const votes = await getCurrentVotes(library, account)
        const delegates = await getDelegates(library, account)
        const balance = await getAMPTBalanceOf(library, account)
        setInfo({
            votes: +votes,
            delegates: +delegates === 0 ? null : delegates,
            balance: +balance
        })
    }

    const handleGetClaimComp = async (): Promise<void> => {
        StatusDialogRef.current.show({
            type: 'loading',
            title: t('Transaction Confirmation'),
            text: t('Please confirm the transaction in your wallet')
        })
        const res = await getClaimComp(library, account, gasPrice, () =>
            StatusDialogRef.current.reset({
                type: 'pending',
                title: t('Transaction Confirmation'),
                text: t('Transaction Pending')
            })
        )
        if (res) {
            StatusDialogRef.current.hide({
                type: 'confirm',
                title: t('Transaction Confirmation'),
                text: t('Transaction Confirmed')
            })
        } else {
            StatusDialogRef.current.hide({ type: 'error', title: t('Transaction Error'), text: t('Transaction Error') })
        }
    }

    const handleGetList = async (): Promise<void> => {
        const list = await Promise.all(
            proposals.map(async item => {
                try {
                    const state = await getState(library, item.id)
                    const proposal = await getProposals(library, item.id)
                    return {
                        state,
                        proposal
                    }
                } catch (ex) {
                    return {}
                }
            })
        )
        console.log(list)
    }

    useEffect(() => {
        if (library && account) {
            dispatch(basicAction.setGlobalInfo({ library, account }))
            updateData()
        }
        return () => {}
    }, [library, account])

    useEffect(() => {
        if (library && account && proposals.length) {
            handleGetList()
        }
        return () => {}
    }, [proposals, library, account])

    return (
        <Layout className={classnames('page-governance')}>
            <Header />
            <div className="lt-main">
                <div className="content">
                    <div className="block left">
                        <div className="blockTitle">钱包</div>
                        <div className="blockMain">
                            <div className="item">
                                <div className="title">AMPT余额</div>
                                <div className="main">
                                    <div className="number">{info.balance}</div>
                                </div>
                            </div>
                            <div className="item">
                                <div className="title">挖矿收益</div>
                                <div className="main">
                                    <div className="number">0.0000000</div>
                                    <Button disabled={!(library && account)} className="btn" onClick={() => handleGetClaimComp()}>
                                        收集
                                    </Button>
                                </div>
                            </div>
                            <div className="item">
                                <div className="title">委托</div>
                                <div className="main">
                                    <div>{info.delegates ? getShortenAddress(info.delegates) : '暂无委托'}</div>
                                    <Button disabled={!(library && account)} className="btn" onClick={() => voteRef.current.show()}>
                                        委托
                                    </Button>
                                </div>
                            </div>
                            <div className="item">
                                <div className="title">受托票数</div>
                                <div className="main">
                                    <div>{info.votes}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="block right">
                        <div className="blockTitle">治理提案</div>
                        <div className="blockMain">
                            {proposals.map((item, index) => {
                                const key = i18n.language === 'en_US' ? 'en' : 'zh'
                                return (
                                    <div className="item" key={item.id}>
                                        <div className="title">{item.name[key]}</div>
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
                                )
                            })}

                            {/* <div className="item">
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
                            <div className="item">
                                <div className="title">Delegate UNI 2</div>
                                <div className="main">
                                    <div className="left">
                                        <div className="btn">已通过</div>
                                        <div className="text">028 · 已取消 November 4th ,2020</div>
                                    </div>
                                    <div className="right">
                                        <div className="btn">投 票</div>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
                <Confirm ref={confirmRef} />
                <Vote ref={voteRef} />
                <StatusDialog ref={StatusDialogRef} />
            </div>
        </Layout>
    )
}

export default withRouter(Governance)
