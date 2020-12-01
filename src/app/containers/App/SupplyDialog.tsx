import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Input, Button, Modal } from 'antd'
import classnames from 'classnames'
import { BigNumber } from 'bignumber.js'
import { eX, zeroStringIfNullish } from '../../general/helpers'
import { IRootState } from '../../reducers/RootState'
import { IDetails, SelectedMarketDetails, GeneralDetails } from './type'
import { getMaxAmount, handleEnable, handleWithdraw, handleSupply } from '../../utils/compoundTool'
import StatusDialog from './StatusDialog'
import './dialog.styl'

const TabPanel = (props: any): JSX.Element | null => {
    const { children, value, index } = props
    return value === index ? <div className="tabContent">{children}</div> : null
}

const DialogSupplyRatesSection = (props: { selectedMarketDetails: SelectedMarketDetails }): JSX.Element => {
    const [t] = useTranslation()
    return (
        <div className="listItem">
            <div className="title">{t('Rate')}</div>
            <div className="content">
                <div className="label">{t('Supply APY')}</div>
                <div className="value">
                    <span className="number">{`${props.selectedMarketDetails?.supplyApy?.times(100).toFixed(2)}%`}</span>
                </div>
            </div>
        </div>
    )
}

const DialogBorrowLimitSection = (props: { generalDetails: GeneralDetails; newBorrowLimit: BigNumber }): JSX.Element => {
    const { newBorrowLimit } = props
    const [t] = useTranslation()
    return (
        <div className="listItem">
            <div className="title">{t('Limit')}</div>
            <div className="content">
                <div className="label">{t('Borrow Limit')}</div>
                <div className="value">
                    <span className="number">{`$${props.generalDetails.totalBorrowLimit?.toFixed(2)}`}</span>
                    <span className="icon"></span>
                    {newBorrowLimit ? <span className="number">{`$${zeroStringIfNullish(newBorrowLimit?.toFixed(2), 2)}`}</span> : `0.00%`}
                </div>
            </div>
            <div className="content">
                <div className="label">{t('Borrow Limit Used')}</div>
                <div className="value">
                    <span className="number">{`${zeroStringIfNullish(props.generalDetails.totalBorrowLimitUsedPercent?.toFixed(2), 2)}%`}</span>
                    <span className="icon"></span>
                    <span className="number">
                        {newBorrowLimit
                            ? `${zeroStringIfNullish(props.generalDetails.totalBorrowBalance?.div(newBorrowLimit).times(100).toFixed(2), 2)}%`
                            : `0.00%`}
                    </span>
                </div>
            </div>
        </div>
    )
}

const DialogMarketInfoSection = (props: { selectedMarketDetails: SelectedMarketDetails }): JSX.Element => {
    const [t] = useTranslation()
    return (
        <div className="listItem">
            <div className="title">{t('Market Info')}</div>
            <div className="content">
                <div className="label">{t('Loan-to-Value')}</div>
                <div className="value">
                    <span className="number">{`${props.selectedMarketDetails?.collateralFactor?.times(100).toFixed(0)}%`}</span>
                </div>
            </div>
            <div className="content">
                <div className="label">{t('% of Supply Borrowed')}</div>
                <div className="value">
                    <span className="number">
                        {`${zeroStringIfNullish(
                            props.selectedMarketDetails?.marketTotalBorrowInTokenUnit
                                ?.div(props.selectedMarketDetails?.marketTotalBorrowInTokenUnit.plus(props.selectedMarketDetails?.underlyingAmount))
                                .times(100)
                                .toFixed(2),
                            2
                        )}%`}
                    </span>
                </div>
            </div>
        </div>
    )
}

const SupplyDialog = forwardRef((props: IDetails, ref) => {
    const [tabValue, setTabValue] = useState(0)
    const [supplyAmount, setSupplyAmount] = useState(0)
    const [withdrawAmount, setWithdrawAmount] = useState('')
    const [newBorrowLimit1, setNewBorrowLimit1] = useState<BigNumber>(new BigNumber(0))
    const [newBorrowLimit2, setNewBorrowLimit2] = useState<BigNumber>(new BigNumber(0))
    const [supplyValidationMessage, setSupplyValidationMessage] = useState('')
    const [withdrawValidationMessage, setWithdrawValidationMessage] = useState('')
    const [supplyDialogOpen, setSupplyDialogOpen] = useState(false)
    const { gasPrice, globalInfo } = useSelector((store: IRootState) => store.base)
    const StatusDialogRef = useRef<any>(null)
    const [t] = useTranslation()

    const handleSupplyAmountChange = (amount): void => {
        setSupplyAmount(amount)

        if (amount <= 0) {
            setSupplyValidationMessage(t('Amount must be > 0'))
        } else if (amount > +props.selectedMarketDetails.walletBalance) {
            setSupplyValidationMessage(t('Amount must be <= balance'))
        } else {
            setSupplyValidationMessage('')
        }

        setNewBorrowLimit1(
            props.generalDetails.totalBorrowLimit.plus(
                props.selectedMarketDetails.isEnterMarket
                    ? new BigNumber(amount ? amount : '0')
                          .times(props.selectedMarketDetails.underlyingPrice)
                          .times(props.selectedMarketDetails.collateralFactor)
                    : new BigNumber(0)
            )
        )
    }

    const handleWithdrawAmountChange = (amount): void => {
        setWithdrawAmount(amount)

        if (amount <= 0) {
            setWithdrawValidationMessage(t('Amount must be > 0'))
        } else if (amount > +props.selectedMarketDetails.supplyBalanceInTokenUnit) {
            setWithdrawValidationMessage(t('Amount must be <= your supply balance'))
        } else if (amount > +props.selectedMarketDetails.underlyingAmount) {
            setWithdrawValidationMessage(t('Amount must be <= liquidity'))
        } else {
            setWithdrawValidationMessage('')
        }

        setNewBorrowLimit2(
            props.generalDetails.totalBorrowLimit.minus(
                props.selectedMarketDetails.isEnterMarket
                    ? new BigNumber(amount ? amount : '0')
                          .times(props.selectedMarketDetails.underlyingPrice)
                          .times(props.selectedMarketDetails.collateralFactor)
                    : new BigNumber(0)
            )
        )
    }

    useImperativeHandle(ref, () => ({
        show: details => {
            setSupplyDialogOpen(true)
        },
        hide: () => {
            setSupplyDialogOpen(false)
        }
    }))

    return props.selectedMarketDetails.symbol ? (
        <>
            <Modal
                visible={supplyDialogOpen}
                onCancel={() => setSupplyDialogOpen(false)}
                footer={null}
                wrapClassName="modal"
                centered
                destroyOnClose={true}
            >
                <div className="modalTitle">
                    <img src={`/${props.selectedMarketDetails.symbol}.png`} alt="" />
                    <span>{`${props.selectedMarketDetails.symbol}`}</span>
                </div>
                <div className="tab">
                    <div className={classnames('item', { cur: tabValue === 0 })} onClick={() => setTabValue(0)}>
                        {t('Supply')}
                    </div>
                    <div className={classnames('item', { cur: tabValue === 1 })} onClick={() => setTabValue(1)}>
                        {t('Withdraw')}
                    </div>
                </div>
                <TabPanel value={tabValue} index={0}>
                    <div className={classnames('input', { error: !!supplyValidationMessage })}>
                        <div className="label">{t('Supply Amount')}</div>
                        <Input
                            bordered={false}
                            value={supplyAmount}
                            onChange={event => {
                                handleSupplyAmountChange(event.target.value)
                            }}
                        />
                        <div
                            className="max"
                            onClick={() => {
                                handleSupplyAmountChange(
                                    getMaxAmount(props.selectedMarketDetails.symbol, props.selectedMarketDetails.walletBalance, gasPrice).toString()
                                )
                            }}
                        >
                            {t('Max')}
                        </div>
                    </div>
                    <div className="inputInfo">
                        <div className="msg">{supplyValidationMessage}</div>
                        <div className="balance">
                            {t('Wallet Balance')}:
                            {` ${props.selectedMarketDetails.walletBalance?.decimalPlaces(4).toString()} ${props.selectedMarketDetails.symbol}`}
                        </div>
                    </div>
                    <DialogSupplyRatesSection selectedMarketDetails={props.selectedMarketDetails} />
                    <DialogBorrowLimitSection generalDetails={props.generalDetails} newBorrowLimit={newBorrowLimit1} />
                    <DialogMarketInfoSection selectedMarketDetails={props.selectedMarketDetails} />
                    {props.selectedMarketDetails.underlyingAllowance?.isGreaterThan(0) &&
                    props.selectedMarketDetails.underlyingAllowance?.isGreaterThanOrEqualTo(+supplyAmount) ? (
                        <Button
                            disabled={!supplyAmount || !!supplyValidationMessage}
                            onClick={async () => {
                                setSupplyDialogOpen(false)
                                StatusDialogRef.current.show({ type: 'loading', title: '确认交易', text: '请在钱包中确认' })
                                const res = await handleSupply(
                                    props.selectedMarketDetails.underlyingAddress,
                                    props.selectedMarketDetails.pTokenAddress,
                                    supplyAmount,
                                    props.selectedMarketDetails.decimals,
                                    props.selectedMarketDetails.symbol,
                                    globalInfo.library,
                                    gasPrice,
                                    () => StatusDialogRef.current.reset({ type: 'pending', title: '确认交易', text: '等待钱包确认，请稍后' })
                                )
                                if (res) {
                                    props.handleUpdateData()
                                    StatusDialogRef.current.hide({ type: 'confirm', title: '确认交易', text: '确认交易' })
                                } else {
                                    StatusDialogRef.current.hide({ type: 'error', title: '交易错误', text: '交易错误' })
                                }
                            }}
                        >
                            {t('Supply')}
                        </Button>
                    ) : (
                        <Button
                            onClick={async () => {
                                setSupplyDialogOpen(false)
                                StatusDialogRef.current.show({ type: 'loading', title: '确认交易', text: '请在钱包中确认' })
                                const res = await handleEnable(
                                    props.selectedMarketDetails.underlyingAddress,
                                    props.selectedMarketDetails.pTokenAddress,
                                    props.selectedMarketDetails.symbol,
                                    globalInfo.library,
                                    gasPrice,
                                    () => StatusDialogRef.current.reset({ type: 'pending', title: '确认交易', text: '等待钱包确认，请稍后' })
                                )
                                if (res) {
                                    props.handleUpdateData()
                                    StatusDialogRef.current.hide({ type: 'confirm', title: '确认交易', text: '确认交易' })
                                } else {
                                    StatusDialogRef.current.hide({ type: 'error', title: '交易错误', text: '交易错误' })
                                }
                            }}
                        >
                            {t('Access To Wallet')}
                        </Button>
                    )}
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <div className={classnames('input', { error: !!withdrawValidationMessage })}>
                        <div className="label">Withdraw Amount</div>
                        <Input
                            bordered={false}
                            value={withdrawAmount}
                            onChange={event => {
                                handleWithdrawAmountChange(event.target.value)
                            }}
                        />
                    </div>
                    <div className="inputInfo">
                        <div className="msg">{withdrawValidationMessage}</div>
                        <div className="balance">
                            {t('You Supplied')}:
                            {`${props.selectedMarketDetails.supplyBalanceInTokenUnit?.decimalPlaces(4)} ${props.selectedMarketDetails.symbol}`}
                        </div>
                    </div>
                    <DialogSupplyRatesSection selectedMarketDetails={props.selectedMarketDetails} />
                    <DialogBorrowLimitSection generalDetails={props.generalDetails} newBorrowLimit={newBorrowLimit2} />
                    <DialogMarketInfoSection selectedMarketDetails={props.selectedMarketDetails} />
                    <Button
                        disabled={!withdrawAmount || !!withdrawValidationMessage}
                        onClick={async () => {
                            setSupplyDialogOpen(false)
                            StatusDialogRef.current.show({ type: 'loading', title: '确认交易', text: '请在钱包中确认' })
                            const res = await handleWithdraw(
                                props.selectedMarketDetails.underlyingAddress,
                                props.selectedMarketDetails.pTokenAddress,
                                withdrawAmount,
                                props.selectedMarketDetails.decimals,
                                props.selectedMarketDetails.symbol,
                                globalInfo.library,
                                gasPrice,
                                () => StatusDialogRef.current.reset({ type: 'pending', title: '确认交易', text: '等待钱包确认，请稍后' })
                            )
                            if (res) {
                                props.handleUpdateData()
                                StatusDialogRef.current.hide({ type: 'confirm', title: '确认交易', text: '确认交易' })
                            } else {
                                StatusDialogRef.current.hide({ type: 'error', title: '交易错误', text: '交易错误' })
                            }
                        }}
                    >
                        {t('Withdraw')}
                    </Button>
                </TabPanel>
            </Modal>
            <StatusDialog ref={StatusDialogRef} />
        </>
    ) : null
})

export default SupplyDialog
