import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Button, Modal } from 'antd'
import { zeroStringIfNullish } from '../../general/helpers'
import { IRootState } from '../../reducers/RootState'
import { IDetails, GeneralDetails } from './type'
import { handleExitMarket, handleEnterMarket } from '../../utils/compoundTool'
import StatusDialog from './StatusDialog'
import './dialog.styl'

const DialogBorrowLimitSection = (props: { generalDetails: GeneralDetails }): JSX.Element => {
    return (
        <div className="listItem">
            <div className="title">Limit</div>
            <div className="content">
                <div className="label">{`Borrow Limit`}</div>
                <div className="value">
                    <span>{`$${props.generalDetails.totalBorrowLimit?.toFixed(2)}`}</span>
                </div>
            </div>
            <div className="content">
                <div className="label">{`Borrow Limit Used`}</div>
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
                <div className="modalTitle">{`${props.selectedMarketDetails.isEnterMarket ? 'Disable' : 'Enable'} as Collateral`}</div>
                <div className="tabContent">
                    <div className="text">
                        {props.selectedMarketDetails.isEnterMarket
                            ? `This asset is required to support your borrowed assets. Either repay borrowed assets, or supply another asset as collateral.`
                            : `Each asset used as collateral increases your borrowing limit. Be careful, this can subject the asset to being seized in
                        liquidation.`}
                    </div>
                    <DialogBorrowLimitSection generalDetails={props.generalDetails} />
                    {props.selectedMarketDetails.isEnterMarket ? (
                        <Button
                            onClick={async () => {
                                setEnterMarketDialogOpen(false)
                                StatusDialogRef.current.show({ type: 'loading', title: '确认交易', text: '请在钱包中确认' })
                                const res = await handleExitMarket(props.selectedMarketDetails.pTokenAddress, globalInfo.library, gasPrice, () =>
                                    StatusDialogRef.current.reset({ type: 'pending', title: '确认交易', text: '等待钱包确认，请稍后' })
                                )
                                if (res) {
                                    props.handleUpdateData()
                                    StatusDialogRef.current.hide({ type: 'confirm', title: '确认交易', text: '确认交易' })
                                } else {
                                    StatusDialogRef.current.hide({ type: 'error', title: '交易错误', text: '交易错误' })
                                }
                            }}
                        >
                            {`Disable ${props.selectedMarketDetails.symbol} as Collateral`}
                        </Button>
                    ) : (
                        <Button
                            onClick={async () => {
                                setEnterMarketDialogOpen(false)
                                StatusDialogRef.current.show({ type: 'loading', title: '确认交易', text: '请在钱包中确认' })
                                const res = await handleEnterMarket(props.selectedMarketDetails.pTokenAddress, globalInfo.library, gasPrice, () =>
                                    StatusDialogRef.current.reset({ type: 'pending', title: '确认交易', text: '等待钱包确认，请稍后' })
                                )
                                if (res) {
                                    props.handleUpdateData()
                                    StatusDialogRef.current.hide({ type: 'confirm', title: '确认交易', text: '确认交易' })
                                } else {
                                    StatusDialogRef.current.hide({ type: 'error', title: '交易错误', text: '交易错误' })
                                }
                            }}
                        >
                            {`Use ${props.selectedMarketDetails.symbol} as Collateral`}
                        </Button>
                    )}
                </div>
            </Modal>
            <StatusDialog ref={StatusDialogRef} />
        </>
    ) : null
})

export default EnterMarketDialog
