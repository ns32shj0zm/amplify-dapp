import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { useSelector } from 'react-redux'
import { Input, Button, Modal, Spin } from 'antd'
import { zeroStringIfNullish } from '../../general/helpers'
import { IRootState } from '../../reducers/RootState'
import { IDetails, SelectedMarketDetails, GeneralDetails } from './type'
import { handleExitMarket, handleEnterMarket } from '../../utils/compoundTool'
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
    const [loading, setLoading] = useState(false)

    useImperativeHandle(ref, () => ({
        show: () => {
            setEnterMarketDialogOpen(true)
        },
        hide: () => {
            setEnterMarketDialogOpen(false)
        }
    }))

    return props.selectedMarketDetails.symbol ? (
        <Modal visible={enterMarketDialogOpen} onCancel={() => setEnterMarketDialogOpen(false)} footer={null} wrapClassName="modal">
            <Spin spinning={loading}>
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
                                setLoading(true)
                                const res = await handleExitMarket(props.selectedMarketDetails.pTokenAddress, globalInfo.library, gasPrice)
                                if (res) {
                                    props.handleUpdateData()
                                    setEnterMarketDialogOpen(false)
                                }
                                setLoading(false)
                            }}
                        >
                            {`Disable ${props.selectedMarketDetails.symbol} as Collateral`}
                        </Button>
                    ) : (
                        <Button
                            onClick={async () => {
                                setLoading(true)
                                const res = await handleEnterMarket(props.selectedMarketDetails.pTokenAddress, globalInfo.library, gasPrice)
                                if (res) {
                                    props.handleUpdateData()
                                    setEnterMarketDialogOpen(false)
                                }
                                setLoading(false)
                            }}
                        >
                            {`Use ${props.selectedMarketDetails.symbol} as Collateral`}
                        </Button>
                    )}
                </div>
            </Spin>
        </Modal>
    ) : null
})

export default EnterMarketDialog
