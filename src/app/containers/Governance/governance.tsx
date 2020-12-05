import * as React from 'react'
import { useState, useEffect, useRef } from 'react'
import { Button, Spin } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import classnames from 'classnames'
import { useTranslation } from 'react-i18next'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import Layout from '../../components/Layout'
import Header from '../../components/Header'
import Confirm from './confirm'
import Vote from './vote'
import basicAction from '../../actions/baseAction'
import {
    getCurrentVotes,
    getClaimComp,
    getDelegates,
    getAMPTBalanceOf,
    getCompAccrued,
    getProposals,
    getState,
    amptDecimals,
    getBlockNumber
} from '../../utils/compoundTool'
import StatusDialog from '../App/StatusDialog'
import { IRootState } from '../../reducers/RootState'
import { getShortenAddress } from '../../utils/'
import { compareId } from '../../general/helpers'
import './governance.styl'
import dayjs from 'dayjs'

type IProps = RouteComponentProps

const STATUS = {
    en: ['Pending', 'Active', 'Canceled', 'Defeated', 'Succeeded', 'Queued', 'Expired', 'Executed'],
    zh: ['未开始', '投票中', '已取消', '失败', '通过', '排队中', '已过期', '已执行']
}

function Governance(props: IProps): JSX.Element {
    const [t, i18n] = useTranslation()
    const dispatch = useDispatch()
    const { account, library } = useWeb3React()
    const confirmRef = useRef<any>(null)
    const voteRef = useRef<any>(null)
    const StatusDialogRef = useRef<any>(null)
    const [info, setInfo] = useState<any>({})
    const { gasPrice } = useSelector((store: IRootState) => store.base)
    const [list, setList] = useState<ayn>([])
    const [loading, setLoading] = useState(false)

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

    const handleGetList = async (proposals, blockNumber): Promise<void> => {
        const arr = proposals.slice().sort(compareId)
        const list = await Promise.all(
            arr.map(async item => {
                try {
                    const status = await getState(library, item.id)
                    const proposal = await getProposals(library, item.id)
                    let id = item.id
                    if (id < 10) {
                        id = `00${id}`
                    } else if (id >= 10 && id < 100) {
                        id = `0${id}`
                    }
                    const diff = new BigNumber(+blockNumber).minus(+proposal[4])
                    const curTime = new BigNumber(dayjs().unix())
                    const time = +curTime.minus(diff.times(13.2)).times(1000)
                    console.log(id, time, +diff)
                    return {
                        idStr: id,
                        id: item.id,
                        name: item.name,
                        description: item.detail,
                        uri: item.uri,
                        status: status === undefined ? undefined : +status,
                        proposal,
                        time: dayjs(new Date(`${new Date(time)}Z`)).format('YYYY-MM-DD HH:mm:ss')
                    }
                } catch (ex) {
                    return {}
                }
            })
        )
        setList(list)
    }

    const updateData = async (): Promise<void> => {
        setLoading(true)
        const proposalsRes = await dispatch(basicAction.getProposals())
        await dispatch(basicAction.updateGasPrice())
        await dispatch(basicAction.setGlobalInfo({ library, account }))
        const votes = await getCurrentVotes(library, account)
        const delegates = await getDelegates(library, account)
        const balance = await getAMPTBalanceOf(library, account)
        const compAccrued = await getCompAccrued(account)
        const blockNumber = await getBlockNumber(library, account)
        await handleGetList((await proposalsRes.payload).data.results, blockNumber)
        setInfo({
            votes: +votes,
            delegates: +delegates === 0 ? null : delegates,
            balance: +balance,
            compAccrued: +new BigNumber(compAccrued).dividedBy(new BigNumber(10).pow(amptDecimals))
        })
        setLoading(false)
    }

    useEffect(() => {
        if (library && account) {
            updateData()
        }
        return () => {}
    }, [library, account])

    return (
        <Layout className={classnames('page-governance')}>
            <Header />
            <div className="lt-main">
                <Spin spinning={loading} size="large">
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
                                        <div className="number">{info.compAccrued}</div>
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
                                        <div>{info.votes ? +new BigNumber(info.votes).dividedBy(new BigNumber(10).pow(amptDecimals)) : 0}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="block right">
                            <div className="blockTitle">治理提案</div>
                            <div className="blockMain">
                                {list.map((item, index) => {
                                    const key = i18n.language === 'en_US' ? 'en' : 'zh'
                                    return item.name ? (
                                        <div className="item" key={`${item.id}${index}`} onClick={() => confirmRef.current.show(item)}>
                                            <div className="title">{item.name[key]}</div>
                                            <div className="main">
                                                <div className="left">
                                                    {item.status ? <div className="btn">{STATUS[key][item.status]}</div> : null}
                                                    <div className="text">
                                                        {item.idStr} {item.time}
                                                    </div>
                                                </div>
                                                <div className="right">
                                                    {item.status === 1 ? <div className="btn">投票</div> : <div className="text">没有投票</div>}
                                                </div>
                                            </div>
                                        </div>
                                    ) : null
                                })}
                            </div>
                        </div>
                    </div>
                </Spin>
                <Confirm ref={confirmRef} />
                <Vote ref={voteRef} />
                <StatusDialog ref={StatusDialogRef} />
            </div>
        </Layout>
    )
}

export default withRouter(Governance)
