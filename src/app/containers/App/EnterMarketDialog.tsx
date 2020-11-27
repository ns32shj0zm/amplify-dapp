import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react'
import { Row, Col, Card, Table, Button } from 'react-bootstrap'
import { withStyles } from '@material-ui/core/styles'
import Switch from '@material-ui/core/Switch'
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
import { eX, convertToLargeNumberRepresentation, zeroStringIfNullish } from '../../general/helpers'
import Compound from '@compound-finance/compound-js/dist/nodejs/src/index.js'
import compoundConstants from '@compound-finance/compound-js/dist/nodejs/src/constants.js'

import { chainIdToName, ethDummyAddress } from '../../general/constants'

type IProps = {
    details: any
    handleClick(): void
}

const DialogBorrowLimitSection = props => {
    return (
        <div>
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
    )
}

const EnterMarketDialog = forwardRef((props: any, ref) => {
    const [enterMarketDialogOpen, setEnterMarketDialogOpen] = useState(false)
    const [txSnackbarOpen, setTxSnackbarOpen] = useState(false)
    const [txSnackbarMessage, setTxSnackbarMessage] = useState('')
    const gasLimitEnterMarket = '112020'

    const handleExitMarket = async (pTokenAddress, setTxSnackbarMessage, setTxSnackbarOpen) => {
        try {
            const tx = await Compound.eth.trx(
                generalDetails.comptrollerAddress,
                'exitMarket',
                [pTokenAddress], // [optional] parameters
                {
                    network: chainIdToName[parseInt(library.provider.chainId)],
                    provider: library.provider,
                    gasLimitEnterMarket,
                    gasPrice: globalState.gasPrice.toString(),
                    abi: compoundConstants.abi.Comptroller
                } // [optional] call options, provider, network, ethers.js "overrides"
            )
            console.log('tx', JSON.stringify(tx))
            setTxSnackbarMessage(`Transaction sent: ${tx.hash}`)
        } catch (e) {
            setTxSnackbarMessage(`Error: ${JSON.stringify(e)}`)
        }

        setTxSnackbarOpen(true)
    }

    const handleEnterMarket = async (pTokenAddress, setTxSnackbarMessage, setTxSnackbarOpen) => {
        try {
            const tx = await Compound.eth.trx(
                generalDetails.comptrollerAddress,
                'enterMarkets',
                [[pTokenAddress]], // [optional] parameters
                {
                    network: chainIdToName[parseInt(library.provider.chainId)],
                    provider: library.provider,
                    gasLimitEnterMarket,
                    gasPrice: globalState.gasPrice.toString(),
                    abi: compoundConstants.abi.Comptroller
                } // [optional] call options, provider, network, ethers.js "overrides"
            )
            console.log('tx', JSON.stringify(tx))
            setTxSnackbarMessage(`Transaction sent: ${tx.hash}`)
        } catch (e) {
            setTxSnackbarMessage(`Error: ${JSON.stringify(e)}`)
        }

        setTxSnackbarOpen(true)
    }

    useImperativeHandle(ref, () => ({
        show: () => {
            setEnterMarketDialogOpen(true)
        },
        hide: () => {
            setEnterMarketDialogOpen(false)
        }
    }))

    return (
        <Dialog open={enterMarketDialogOpen} onClose={() => setEnterMarketDialogOpen(false)}>
            <DialogTitle>{`${props.selectedMarketDetails.isEnterMarket ? 'Disable' : 'Enable'} as Collateral`}</DialogTitle>
            <DialogContent>
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
                                    Each asset used as collateral increases your borrowing limit. Be careful, this can subject the asset to being
                                    seized in liquidation.
                                </Typography>
                            )}
                        </ListItem>
                        <DialogBorrowLimitSection generalDetails={props.generalDetails} />
                        <ListItem>
                            {props.selectedMarketDetails.isEnterMarket ? (
                                <Button
                                    variant="primary"
                                    size="lg"
                                    block
                                    onClick={() => {
                                        handleExitMarket(props.selectedMarketDetails.pTokenAddress, setTxSnackbarMessage, setTxSnackbarOpen)
                                    }}
                                >
                                    {`Disable ${props.selectedMarketDetails.symbol} as Collateral`}
                                </Button>
                            ) : (
                                <Button
                                    variant="primary"
                                    size="lg"
                                    block
                                    onClick={() => {
                                        handleEnterMarket(props.selectedMarketDetails.pTokenAddress, setTxSnackbarMessage, setTxSnackbarOpen)
                                    }}
                                >
                                    {`Use ${props.selectedMarketDetails.symbol} as Collateral`}
                                </Button>
                            )}
                        </ListItem>
                    </List>
                )}
            </DialogContent>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                open={txSnackbarOpen}
                autoHideDuration={5000}
                onClose={(event, reason) => {
                    if (reason === 'clickaway') {
                        return
                    }
                    setTxSnackbarOpen(false)
                }}
                message={txSnackbarMessage}
                action={null}
            />
        </Dialog>
    )
})

export default EnterMarketDialog
