import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { useSelector } from 'react-redux'
import { Input, Button, Modal, Spin } from 'antd'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import AppBar from '@material-ui/core/AppBar'
import Box from '@material-ui/core/Box'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListSubheader from '@material-ui/core/ListSubheader'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Snackbar from '@material-ui/core/Snackbar'
import LinearProgress from '@material-ui/core/LinearProgress'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import InfoIcon from '@material-ui/icons/Info'
import Tooltip from '@material-ui/core/Tooltip'
import * as colors from '@material-ui/core/colors'
import { zeroStringIfNullish } from '../../general/helpers'
import { IRootState } from '../../reducers/RootState'
import { IDetails, SelectedMarketDetails, GeneralDetails } from './type'
import { handleExitMarket, handleEnterMarket } from '../../utils/compoundTool'
import './dialog.styl'

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
            <div className="modalTitle">{`${props.selectedMarketDetails.isEnterMarket ? 'Disable' : 'Enable'} as Collateral`}</div>
            {props.selectedMarketDetails.symbol && (
                <List>
                    <ListItem>
                        {props.selectedMarketDetails.isEnterMarket ? (
                            <Typography>
                                This asset is required to support your borrowed assets. Either repay borrowed assets, or supply another asset as
                                collateral.
                            </Typography>
                        ) : (
                            <Typography>
                                Each asset used as collateral increases your borrowing limit. Be careful, this can subject the asset to being seized
                                in liquidation.
                            </Typography>
                        )}
                    </ListItem>
                    <div className="listItem">
                        <ListSubheader style={{ fontSize: '80%', fontWeight: 'bold' }}>Borrow Limit</ListSubheader>
                        <ListItem>
                            <ListItemText secondary={`Borrow Limit`} />
                            <ListItemSecondaryAction style={{ margin: '0px 15px 0px 0px' }}>
                                <span>{`$${props.generalDetails.totalBorrowLimit?.toFixed(2)}`}</span>
                                {props.newBorrowLimit ? (
                                    <span>
                                        <ArrowRightIcon style={{ color: colors.lightBlue[500] }} />
                                        {`$${zeroStringIfNullish(props.newBorrowLimit?.toFixed(2), 2)}`}
                                    </span>
                                ) : null}
                            </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem>
                            <ListItemText secondary={`Borrow Limit Used`} />
                            <ListItemSecondaryAction style={{ margin: '0px 15px 0px 0px' }}>
                                <span>{`${zeroStringIfNullish(props.generalDetails.totalBorrowLimitUsedPercent?.toFixed(2), 2)}%`}</span>
                                {props.newBorrowLimit ? (
                                    <span>
                                        <ArrowRightIcon style={{ color: colors.lightBlue[500] }} />
                                        <span
                                            style={{
                                                color: props.generalDetails.totalBorrowBalance?.div(props.newBorrowLimit).isGreaterThan(1)
                                                    ? colors.red[500]
                                                    : null
                                            }}
                                        >
                                            {`${zeroStringIfNullish(
                                                props.generalDetails.totalBorrowBalance?.div(props.newBorrowLimit).times(100).toFixed(2),
                                                2
                                            )}%`}
                                        </span>
                                    </span>
                                ) : null}
                            </ListItemSecondaryAction>
                        </ListItem>
                    </div>
                    <ListItem>
                        {props.selectedMarketDetails.isEnterMarket ? (
                            <Button
                                onClick={() => {
                                    handleExitMarket(props.selectedMarketDetails.pTokenAddress, globalInfo.library, gasPrice)
                                }}
                            >
                                {`Disable ${props.selectedMarketDetails.symbol} as Collateral`}
                            </Button>
                        ) : (
                            <Button
                                onClick={() => {
                                    handleEnterMarket(props.selectedMarketDetails.pTokenAddress, globalInfo.library, gasPrice)
                                }}
                            >
                                {`Use ${props.selectedMarketDetails.symbol} as Collateral`}
                            </Button>
                        )}
                    </ListItem>
                </List>
            )}
        </Modal>
    ) : null
})

export default EnterMarketDialog
