import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Button, Modal } from 'antd'
import { zeroStringIfNullish } from '../../general/helpers'
import { IRootState } from '../../reducers/RootState'
import { IDetails, GeneralDetails } from './type'
import { handleExitMarket, handleEnterMarket } from '../../utils/compoundTool'
import StatusDialog from './StatusDialog'
import './dialog.styl'

const DialogBorrowLimitSection = (props: { generalDetails: GeneralDetails }): JSX.Element => {
    const [t] = useTranslation()
    return (
        <div className="listItem">
            <div className="title">{t('Limit')}</div>
            <div className="content">
                <div className="label">{t('Borrow Limit')}</div>
                <div className="value">
                    <span>{`$${props.generalDetails.totalBorrowLimit?.toFixed(2)}`}</span>
                </div>
            </div>
            <div className="content">
                <div className="label">{t('Borrow Limit Used')}</div>
                <div className="value">
                    <span>{`${zeroStringIfNullish(props.generalDetails.totalBorrowLimitUsedPercent?.toFixed(2), 2)}%`}</span>
                </div>
            </div>
        </div>
    )
}

const EnterMarketDialog = forwardRef((props: IDetails, ref) => {
    const [enterMarketDialogOpen, setEnterMarketDialogOpen] = useState(false)
    const { gasPrice, globalInfo } = useSelector((store: IRootState) => store.base)
    const StatusDialogRef = useRef<any>(null)
    const [t] = useTranslation()

    useImperativeHandle(ref, () => ({
        show: () => {
            setEnterMarketDialogOpen(true)
        },
        hide: () => {
            setEnterMarketDialogOpen(false)
        }
    }))

    return props.selectedMarketDetails.symbol ? (
        <>
            <Modal visible={enterMarketDialogOpen} onCancel={() => setEnterMarketDialogOpen(false)} footer={null} wrapClassName="modal" centered>
                <div className="modalTitle">
                    {t(`${props.selectedMarketDetails.isEnterMarket ? 'Disable as Collateral' : 'Enable as Collateral'}`)}
                </div>
                <div className="tabContent">
                    <div className="text">
                        {props.selectedMarketDetails.isEnterMarket
                            ? t(
                                  'This asset is required to support your borrowed assets. Either repay borrowed assets, or supply another asset as collateral.'
                              )
                            : t(
                                  'Each asset used as collateral increases your borrowing limit. Be careful, this can subject the asset to being seized in liquidation.'
                              )}
                    </div>
                    <DialogBorrowLimitSection generalDetails={props.generalDetails} />
                    {props.selectedMarketDetails.isEnterMarket ? (
                        <Button
                            onClick={async () => {
                                setEnterMarketDialogOpen(false)
                                StatusDialogRef.current.show({
                                    type: 'loading',
                                    title: t('Transaction Confirmation'),
                                    text: t('Please confirm the transaction in your wallet')
                                })
                                const res = await handleExitMarket(props.selectedMarketDetails.pTokenAddress, globalInfo.library, gasPrice, () =>
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
                            {t('`Disable {{symbol}} as Collateral`', { symbol: props.selectedMarketDetails.symbol })}
                        </Button>
                    ) : (
                        <Button
                            onClick={async () => {
                                setEnterMarketDialogOpen(false)
                                StatusDialogRef.current.show({
                                    type: 'loading',
                                    title: t('Transaction Confirmation'),
                                    text: t('Please confirm the transaction in your wallet')
                                })
                                const res = await handleEnterMarket(props.selectedMarketDetails.pTokenAddress, globalInfo.library, gasPrice, () =>
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
                            {t('Use {{symbol}} as Collateral', { symbol: props.selectedMarketDetails.symbol })}
                        </Button>
                    )}
                </div>
            </Modal>
            <StatusDialog ref={StatusDialogRef} />
        </>
    ) : null
})

export default EnterMarketDialog
