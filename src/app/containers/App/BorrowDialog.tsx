import React, { useState, forwardRef, useImperativeHandle, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Input, Button, Modal, Spin } from 'antd'
import classnames from 'classnames'
import { BigNumber } from 'bignumber.js'
import { zeroStringIfNullish } from '../../general/helpers'
import { IRootState } from '../../reducers/RootState'
import { IDetails, SelectedMarketDetails, GeneralDetails } from './type'
import { getMaxAmount, handleEnable, handleBorrow, handleRepay } from '../../utils/compoundTool'
import StatusDialog from './StatusDialog'
import './dialog.styl'

const TabPanel = (props: any): JSX.Element | null => {
    const { children, value, index } = props
    return value === index ? <div className="tabContent">{children}</div> : null
}

const DialogBorrowRatesSection = (props: { selectedMarketDetails: SelectedMarketDetails }): JSX.Element => {
    return (
        <div className="listItem">
            <div className="title">Rate</div>
            <div className="content">
                <div className="label">{`Borrow APY`}</div>
                <div className="value">{`${props.selectedMarketDetails.borrowApy?.times(100).toFixed(2)}%`}</div>
            </div>
        </div>
    )
}

const DialogBorrowLimitSection2 = (props: {
    selectedMarketDetails: SelectedMarketDetails
    generalDetails: GeneralDetails
    borrowAmount: number
    repayAmount: number
}): JSX.Element => {
    const getNewBorrowBalance = (originBorrowBalance, borrowAmount, repayAmount, underlyingPrice): BigNumber => {
        return originBorrowBalance?.plus(new BigNumber(borrowAmount).minus(repayAmount).times(underlyingPrice))
    }
    const [t] = useTranslation()

    return (
        <div className="listItem">
            <div className="title">Limit</div>
            <div className="content">
                <div className="label">{t('Borrow Balance')}</div>
                <div className="value">
                    <span className="number">{`$${props.generalDetails.totalBorrowBalance?.toFixed(2)}`}</span>
                    <span className="icon"></span>
                    {props.borrowAmount || props.repayAmount ? (
                        <span className="number">
                            {`$${zeroStringIfNullish(
                                getNewBorrowBalance(
                                    props.generalDetails.totalBorrowBalance,
                                    props.borrowAmount,
                                    props.repayAmount,
                                    props.selectedMarketDetails.underlyingPrice
                                )?.toFixed(2),
                                2
                            )}`}
                        </span>
                    ) : (
                        `0.00%`
                    )}
                </div>
            </div>
            <div className="content">
                <div className="label">{t('Borrow Limit Used')}</div>
                <div className="value">
                    <span className="number">{`${zeroStringIfNullish(props.generalDetails.totalBorrowLimitUsedPercent?.toFixed(2), 2)}%`}</span>
                    <span className="icon"></span>
                    {props.borrowAmount || props.repayAmount ? (
                        <span className="number">
                            {`${zeroStringIfNullish(
                                getNewBorrowBalance(
                                    props.generalDetails.totalBorrowBalance,
                                    props.borrowAmount,
                                    props.repayAmount,
                                    props.selectedMarketDetails.underlyingPrice
                                )
                                    ?.div(props.generalDetails.totalBorrowLimit)
                                    .times(100)
                                    .toFixed(2),
                                2
                            )}%`}
                        </span>
                    ) : (
                        `0.00%`
                    )}
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
                <div className="val">
                    <span>{`${props.selectedMarketDetails.collateralFactor?.times(100).toFixed(0)}%`}</span>
                </div>
            </div>
            <div className="content">
                <div className="label">{t('% of Supply Borrowed')}</div>
                <div className="value">
                    <span className="number">
                        {`${zeroStringIfNullish(
                            props.selectedMarketDetails.marketTotalBorrowInTokenUnit
                                ?.div(props.selectedMarketDetails.marketTotalBorrowInTokenUnit.plus(props.selectedMarketDetails.underlyingAmount))
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

const BorrowDialog = forwardRef((props: IDetails, ref) => {
    const [tabValue, setTabValue] = useState(0)
    const [borrowAmount, setBorrowAmount] = useState(0)
    const [repayAmount, setRepayAmount] = useState(0)
    const [isFullRepay, setIsFullRepay] = useState(false)
    const [borrowValidationMessage, setBorrowValidationMessage] = useState('')
    const [repayValidationMessage, setRepayValidationMessage] = useState('')
    const [borrowDialogOpen, setBorrowDialogOpen] = useState(false)
    const { gasPrice, globalInfo } = useSelector((store: IRootState) => store.base)
    const StatusDialogRef = useRef<any>(null)
    const [t] = useTranslation()

    const handleBorrowAmountChange = (amount): void => {
        setBorrowAmount(amount)
        if (amount <= 0) {
            setBorrowValidationMessage(t('Amount must be > 0'))
        } else if (amount * +props.selectedMarketDetails.underlyingPrice > +props.generalDetails.totalBorrowLimit) {
            setBorrowValidationMessage(t('Amount must be <= borrow limit'))
        } else if (amount > +props.selectedMarketDetails.underlyingAmount) {
            setBorrowValidationMessage(t('Amount must be <= liquidity'))
        } else {
            setBorrowValidationMessage('')
        }
    }

    const handleRepayAmountChange = (amount, isFull): void => {
        setRepayAmount(amount)

        if (amount <= 0) {
            setRepayValidationMessage(t('Amount must be > 0'))
        } else if (!isFull && amount > +props.selectedMarketDetails.borrowBalanceInTokenUnit) {
            setRepayValidationMessage(t('Amount must be <= your borrow balance'))
        } else if (amount > +props.selectedMarketDetails.walletBalance) {
            setRepayValidationMessage(t('Amount must be <= balance'))
        } else {
            setRepayValidationMessage('')
        }
    }

    useImperativeHandle(ref, () => ({
        show: () => {
            setBorrowDialogOpen(true)
        },
        hide: () => {
            setBorrowDialogOpen(false)
        }
    }))

    useEffect(() => {
        if (!borrowDialogOpen) {
            setTabValue(0)
            setBorrowAmount(0)
            setRepayAmount(0)
            setIsFullRepay(false)
            setBorrowValidationMessage('')
            setRepayValidationMessage('')
        }
        return () => {}
    }, [borrowDialogOpen])

    const getMaxRepayAmount = (symbol, borrowBalanceInTokenUnit, borrowApy): BigNumber => {
        const maxRepayFactor = new BigNumber(1).plus(borrowApy / 100) // e.g. Borrow APY = 2% => maxRepayFactor = 1.0002
        if (symbol === 'ETH') {
            return borrowBalanceInTokenUnit.times(maxRepayFactor).decimalPlaces(18) // Setting it to a bit larger, this makes sure the user can repay 100%.
        } else {
            return borrowBalanceInTokenUnit.times(maxRepayFactor).decimalPlaces(18) // The same as ETH for now. The transaction will use -1 anyway.
        }
    }

    return props.selectedMarketDetails.symbol ? (
        <>
            <Modal
                visible={borrowDialogOpen}
                onCancel={() => setBorrowDialogOpen(false)}
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
                        {t('Borrow')}
                    </div>
                    <div className={classnames('item', { cur: tabValue === 1 })} onClick={() => setTabValue(1)}>
                        {t('Repay')}
                    </div>
                </div>
                <TabPanel value={tabValue} index={0}>
                    <div className={classnames('input', { error: !!borrowValidationMessage })}>
                        <div className="label">{t('Borrow Amount')}</div>
                        <Input
                            bordered={false}
                            value={borrowAmount}
                            onChange={event => {
                                handleBorrowAmountChange(event.target.value)
                            }}
                        />
                        <div
                            className="max"
                            onClick={() => {
                                handleBorrowAmountChange(+props.generalDetails.totalBorrowLimit)
                            }}
                        >
                            {t('Max')}
                        </div>
                    </div>
                    <div className="inputInfo">
                        <div className="msg">{borrowValidationMessage}</div>
                        <div className="balance">
                            {t('You Borrowed')}:
                            {` ${props.selectedMarketDetails.borrowBalanceInTokenUnit?.decimalPlaces(4)} ${props.selectedMarketDetails.symbol}`}
                        </div>
                    </div>
                    <DialogBorrowRatesSection selectedMarketDetails={props.selectedMarketDetails} />
                    <DialogBorrowLimitSection2
                        generalDetails={props.generalDetails}
                        selectedMarketDetails={props.selectedMarketDetails}
                        borrowAmount={borrowAmount}
                        repayAmount={0}
                    />
                    <DialogMarketInfoSection selectedMarketDetails={props.selectedMarketDetails} />
                    <Button
                        disabled={!borrowAmount || !!borrowValidationMessage}
                        onClick={async () => {
                            setBorrowDialogOpen(false)
                            StatusDialogRef.current.show({
                                type: 'loading',
                                title: t('Transaction Confirmation'),
                                text: t('Please confirm the transaction in your wallet')
                            })
                            const res = await handleBorrow(
                                props.selectedMarketDetails.underlyingAddress,
                                props.selectedMarketDetails.pTokenAddress,
                                borrowAmount,
                                props.selectedMarketDetails.decimals,
                                props.selectedMarketDetails.symbol,
                                globalInfo.library,
                                gasPrice,
                                () =>
                                    StatusDialogRef.current.reset({
                                        type: 'pending',
                                        title: t('Transaction Confirmation'),
                                        text: t('Transaction Pending')
                                    })
                            )
                            if (res) {
                                props.handleUpdateData()
                                StatusDialogRef.current.hide({
                                    type: 'confirm',
                                    title: t('Transaction Confirmation'),
                                    text: t('Transaction Confirmed')
                                })
                            } else {
                                StatusDialogRef.current.hide({ type: 'error', title: t('Transaction Error'), text: t('Transaction Error') })
                            }
                        }}
                    >
                        {t('Borrow')}
                    </Button>
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <div className={classnames('input', { error: !!repayValidationMessage })}>
                        <div className="label">{t('Repay Amount')}</div>
                        <Input
                            bordered={false}
                            value={repayAmount}
                            onChange={event => {
                                setIsFullRepay(false)
                                handleRepayAmountChange(event.target.value, false)
                            }}
                        />
                        <div
                            className="max"
                            onClick={() => {
                                const maxAffortable = getMaxAmount(
                                    props.selectedMarketDetails.symbol,
                                    props.selectedMarketDetails.walletBalance,
                                    gasPrice
                                )
                                const fullRepayAmount = getMaxRepayAmount(
                                    props.selectedMarketDetails.symbol,
                                    props.selectedMarketDetails.borrowBalanceInTokenUnit,
                                    props.selectedMarketDetails.borrowApy
                                )
                                const isFull = maxAffortable.gte(fullRepayAmount)
                                setIsFullRepay(isFull)
                                handleRepayAmountChange(BigNumber.minimum(maxAffortable, fullRepayAmount).toString(), isFull)
                            }}
                        >
                            {t('Max')}
                        </div>
                    </div>
                    <div className="inputInfo">
                        <div className="msg">{repayValidationMessage}</div>
                        <div className="balance">
                            {t('Wallet Balance')}:
                            {` ${props.selectedMarketDetails.walletBalance?.decimalPlaces(4).toString()} ${props.selectedMarketDetails.symbol}`}
                        </div>
                    </div>
                    <DialogBorrowRatesSection selectedMarketDetails={props.selectedMarketDetails} />
                    <DialogBorrowLimitSection2
                        generalDetails={props.generalDetails}
                        selectedMarketDetails={props.selectedMarketDetails}
                        borrowAmount={0}
                        repayAmount={repayAmount}
                    />
                    <DialogMarketInfoSection selectedMarketDetails={props.selectedMarketDetails} />
                    {props.selectedMarketDetails.underlyingAllowance?.isGreaterThan(0) &&
                    props.selectedMarketDetails.underlyingAllowance?.isGreaterThanOrEqualTo(+repayAmount) ? (
                        <Button
                            disabled={!repayAmount || !!repayValidationMessage}
                            onClick={async () => {
                                setBorrowDialogOpen(false)
                                StatusDialogRef.current.show({
                                    type: 'loading',
                                    title: t('Transaction Confirmation'),
                                    text: t('Please confirm the transaction in your wallet')
                                })
                                const res = await handleRepay(
                                    globalInfo.account,
                                    props.selectedMarketDetails.underlyingAddress,
                                    props.selectedMarketDetails.pTokenAddress,
                                    repayAmount,
                                    isFullRepay,
                                    props.selectedMarketDetails.decimals,
                                    props.selectedMarketDetails.symbol,
                                    globalInfo.library,
                                    gasPrice,
                                    () =>
                                        StatusDialogRef.current.reset({
                                            type: 'pending',
                                            title: t('Transaction Confirmation'),
                                            text: t('Transaction Pending')
                                        })
                                )
                                if (res) {
                                    props.handleUpdateData()
                                    StatusDialogRef.current.hide({
                                        type: 'confirm',
                                        title: t('Transaction Confirmation'),
                                        text: t('Transaction Confirmed')
                                    })
                                } else {
                                    StatusDialogRef.current.hide({ type: 'error', title: t('Transaction Error'), text: t('Transaction Error') })
                                }
                            }}
                        >
                            {t('Repay')}
                        </Button>
                    ) : (
                        <Button
                            onClick={async () => {
                                setBorrowDialogOpen(false)
                                StatusDialogRef.current.show({
                                    type: 'loading',
                                    title: t('Transaction Confirmation'),
                                    text: t('Please confirm the transaction in your wallet')
                                })
                                const res = await handleEnable(
                                    props.selectedMarketDetails.underlyingAddress,
                                    props.selectedMarketDetails.pTokenAddress,
                                    props.selectedMarketDetails.symbol,
                                    globalInfo.library,
                                    gasPrice,
                                    () =>
                                        StatusDialogRef.current.reset({
                                            type: 'pending',
                                            title: t('Transaction Confirmation'),
                                            text: t('Transaction Pending')
                                        })
                                )
                                if (res) {
                                    props.handleUpdateData()
                                    StatusDialogRef.current.hide({
                                        type: 'confirm',
                                        title: t('Transaction Confirmation'),
                                        text: t('Transaction Confirmed')
                                    })
                                } else {
                                    StatusDialogRef.current.hide({ type: 'error', title: t('Transaction Error'), text: t('Transaction Error') })
                                }
                            }}
                        >
                            {t('Access To Wallet')}
                        </Button>
                    )}
                </TabPanel>
            </Modal>
            <StatusDialog ref={StatusDialogRef} />
        </>
    ) : null
})

export default BorrowDialog
