import * as React from 'react'
import { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { Spin } from 'antd'
import { Table } from 'react-bootstrap'
import classnames from 'classnames'
import { useTranslation } from 'react-i18next'
import { useWeb3React } from '@web3-react/core'
import Layout from '../../components/Layout'
import Header from '../../components/Header'
import * as compoundTool from '../../utils/compoundTool'
import { zeroStringIfNullish, compareSymbol } from '../../general/helpers'
import SupplyMarketRow from './SupplyMarketRow'
import BorrowMarketRow from './BorrowMarketRow'
import SupplyDialog from './SupplyDialog'
import BorrowDialog from './BorrowDialog'
import EnterMarketDialog from './EnterMarketDialog'
import Circle from './Circle'
import basicAction from '../../actions/baseAction'
import { SelectedMarketDetails } from './type'

import './app.styl'

type IProps = RouteComponentProps

function Home(props: IProps): JSX.Element {
    const [t] = useTranslation()
    const dispatch = useDispatch()
    const { account, library } = useWeb3React()
    const [allMarketDetails, setAllMarketDetails] = useState<any>([])
    const [generalDetails, setGeneralDetails] = useState<any>({})
    const [loading, setLoading] = useState(false)
    const SupplyDialogRef = useRef<any>(null)
    const BorrowDialogRef = useRef<any>(null)
    const EnterMarketDialogRef = useRef<any>(null)
    const [selectedMarketDetails, setSelectedMarketDetails] = useState<SelectedMarketDetails>({} as SelectedMarketDetails)

    useEffect(() => {
        if (library && account) {
            dispatch(basicAction.setGlobalInfo({ library, account }))
            updateData()
        }
        return () => {}
    }, [library, account])

    const updateData = async (): Promise<void> => {
        setLoading(true)
        await dispatch(basicAction.updateGasPrice())
        const details = await compoundTool.getMarkets(library, account)
        const allMarketDetails = details.allMarketDetails.sort(compareSymbol)
        setAllMarketDetails(allMarketDetails)
        setGeneralDetails(details.generalDetails)
        setLoading(false)
    }

    const handleShowSupply = (details: SelectedMarketDetails): void => {
        setSelectedMarketDetails(details)
        SupplyDialogRef.current.show()
    }

    const handleShowBorrow = (details: SelectedMarketDetails): void => {
        setSelectedMarketDetails(details)
        BorrowDialogRef.current?.show()
    }

    const handleShowEnterMarket = (details: SelectedMarketDetails): void => {
        setSelectedMarketDetails(details)
        EnterMarketDialogRef.current?.show()
        SupplyDialogRef.current.hide()
    }

    return (
        <Layout className={classnames('page-app')}>
            <Header />
            <div className="lt-main">
                <div className="header">
                    <div className="block">
                        <div className="blockItem supply">
                            <div className="blockTitle">Your Supply Balance</div>
                            <div className="blockNumber">{`$${zeroStringIfNullish(generalDetails.totalSupplyBalance?.toFixed(2), 2)}`}</div>
                        </div>
                        <Circle percentNum={zeroStringIfNullish(generalDetails.netApy?.times(100).toFixed(2), 2)} />
                        <div className="blockItem borrow">
                            <div className="blockTitle">Your Borrow Balance</div>
                            <div className="blockNumber">{`$${zeroStringIfNullish(generalDetails.totalBorrowBalance?.toFixed(2), 2)}`}</div>
                        </div>
                    </div>
                    <div className="progress">
                        <div className="text">
                            <div className="left">
                                {t('Your Borrow Limit')}:{`(${zeroStringIfNullish(generalDetails.totalBorrowLimitUsedPercent?.toFixed(2), 2)}% Used)`}
                            </div>
                            <div className="right">{`$${zeroStringIfNullish(generalDetails.totalBorrowLimit?.toFixed(2), 2)}`}</div>
                        </div>
                        <div className="bar">
                            <div style={{ width: `${zeroStringIfNullish(generalDetails.totalBorrowLimitUsedPercent?.toFixed(2), 2)}%` }}></div>
                        </div>
                    </div>
                </div>
                <Spin spinning={loading}>
                    <div className="content">
                        <div className="block left">
                            <div className="blockAccount">
                                <div className="blockTitle">
                                    <span>当前存款</span>
                                    <i></i>
                                </div>
                                <div className="blockMain">
                                    <Table className="table" responsive hover style={{ marginBottom: '0px' }}>
                                        <thead>
                                            <tr>
                                                <th>Asset</th>
                                                <th></th>
                                                <th>
                                                    <div>APY</div>
                                                </th>
                                                <th>You Supplied</th>
                                                <th>Wallet</th>
                                                <th>
                                                    <div>Use As Collateral</div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allMarketDetails
                                                .filter(item => item.supplyBalance?.toNumber() > 0)
                                                .map((details, index) => (
                                                    <SupplyMarketRow
                                                        key={index}
                                                        details={details}
                                                        handleClick={() => handleShowSupply(details)}
                                                        handleSwitchClick={() => handleShowEnterMarket(details)}
                                                    />
                                                ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                            <div className="blockItem">
                                <div className="blockTitle">
                                    <span>存款市场</span>
                                    <i></i>
                                </div>
                                <div className="blockMain">
                                    <Table className="table" responsive hover style={{ marginBottom: '0px' }}>
                                        <thead>
                                            <tr>
                                                <th>Asset</th>
                                                <th></th>
                                                <th>
                                                    <div>APY</div>
                                                </th>
                                                <th>You Supplied</th>
                                                <th>Wallet</th>
                                                <th>
                                                    <div>Use As Collateral</div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allMarketDetails
                                                .filter(item => item.supplyBalance?.toNumber() <= 0)
                                                .map((details, index) => (
                                                    <SupplyMarketRow
                                                        key={index}
                                                        details={details}
                                                        handleClick={() => handleShowSupply(details)}
                                                        handleSwitchClick={() => handleShowEnterMarket(details)}
                                                    />
                                                ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                        <div className="block right">
                            <div className="blockAccount">
                                <div className="blockTitle">
                                    <span>当前贷款</span>
                                    <i></i>
                                </div>
                                <div className="blockMain">
                                    <Table className="table" responsive hover style={{ marginBottom: '0px' }}>
                                        <thead>
                                            <tr>
                                                <th>Asset</th>
                                                <th></th>
                                                <th>APY</th>
                                                <th>You Borrowed</th>
                                                <th>Total Borrowed</th>
                                                <th>Wallet</th>
                                                <th>
                                                    <div>Liquidity</div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allMarketDetails
                                                .filter(item => item.borrowBalance?.toNumber() > 0)
                                                .map((details, index) => (
                                                    <BorrowMarketRow key={index} details={details} handleClick={() => handleShowBorrow(details)} />
                                                ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                            <div className="blockItem">
                                <div className="blockTitle">
                                    <span>贷款市场</span>
                                    <i></i>
                                </div>
                                <div className="blockMain">
                                    <Table className="table" responsive hover style={{ marginBottom: '0px' }}>
                                        <thead>
                                            <tr>
                                                <th>Asset</th>
                                                <th></th>
                                                <th>APY</th>
                                                <th>You Borrowed</th>
                                                <th>Total Borrowed</th>
                                                <th>Wallet</th>
                                                <th>
                                                    <div>Liquidity</div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allMarketDetails
                                                .filter(item => item.borrowBalance?.toNumber() <= 0)
                                                .map((details, index) => (
                                                    <BorrowMarketRow key={index} details={details} handleClick={() => handleShowBorrow(details)} />
                                                ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </div>
                </Spin>
                <SupplyDialog
                    generalDetails={generalDetails}
                    selectedMarketDetails={selectedMarketDetails}
                    ref={SupplyDialogRef}
                    handleUpdateData={() => updateData()}
                />
                <BorrowDialog
                    generalDetails={generalDetails}
                    selectedMarketDetails={selectedMarketDetails}
                    ref={BorrowDialogRef}
                    handleUpdateData={() => updateData()}
                />
                <EnterMarketDialog
                    generalDetails={generalDetails}
                    selectedMarketDetails={selectedMarketDetails}
                    ref={EnterMarketDialogRef}
                    handleUpdateData={() => updateData()}
                />
            </div>
        </Layout>
    )
}

export default withRouter(Home)
