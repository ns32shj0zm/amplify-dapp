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
import { BigNumber } from 'bignumber.js'
import { eX, zeroStringIfNullish } from '../../general/helpers'

const TabPanel = (props: any) => {
    const { children, value, index } = props
    return value === index ? (
        <Box style={{ padding: '20px 0px 0px 0px' }}>
            <div>{children}</div>
        </Box>
    ) : null
}

const BlueStyledTabs = withStyles({
    indicator: {
        backgroundColor: '#40c4ff'
    }
})(Tabs)

const LightTooltip = withStyles(theme => ({
    tooltip: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 11
    }
}))(Tooltip)

const DialogSupplyRatesSection = props => {
    return (
        <div>
            <ListSubheader style={{ fontSize: '80%', fontWeight: 'bold' }}>Supply Rate</ListSubheader>
            <ListItem>
                <ListItemText secondary={`Supply APY`} />
                <ListItemSecondaryAction style={{ margin: '0px 15px 0px 0px' }}>{`${props.selectedMarketDetails?.supplyApy
                    ?.times(100)
                    .toFixed(2)}%`}</ListItemSecondaryAction>
            </ListItem>
        </div>
    )
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

const GreyInfoIcon = props => {
    return (
        <InfoIcon
            style={{
                color: colors.grey[300],
                fontSize: 18,
                margin: '0px 0px 0px 5px',
                ...props.style
            }}
        />
    )
}

const DialogMarketInfoSection = props => {
    return (
        <div>
            <ListSubheader style={{ fontSize: '80%', fontWeight: 'bold' }}>Market Info</ListSubheader>
            <ListItem>
                <LightTooltip
                    title={
                        props.collateralFactorText === 'Loan-to-Value'
                            ? 'The maximum amount of borrowing in % of the collateral value of the provided token.'
                            : 'The point at which the protocol deems a borrowing position to be undercollateralized and subject to liquidation.'
                    }
                >
                    <div style={{ display: 'flex' }}>
                        <ListItemText secondary={props.collateralFactorText} />
                        <GreyInfoIcon style={{ margin: '5px 0px 0px 5px' }} />
                    </div>
                </LightTooltip>
                <ListItemSecondaryAction style={{ margin: '0px 15px 0px 0px' }}>
                    <span>{`${props.selectedMarketDetails?.collateralFactor?.times(100).toFixed(0)}%`}</span>
                </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
                <LightTooltip title="The amount of token supply in % of the total that is currently being lent out.">
                    <div style={{ display: 'flex' }}>
                        <ListItemText secondary={`% of Supply Borrowed`} />
                        <GreyInfoIcon style={{ margin: '5px 0px 0px 5px' }} />
                    </div>
                </LightTooltip>
                <ListItemSecondaryAction style={{ margin: '0px 15px 0px 0px' }}>
                    <span>
                        {`${zeroStringIfNullish(
                            props.selectedMarketDetails?.marketTotalBorrowInTokenUnit
                                ?.div(props.selectedMarketDetails?.marketTotalBorrowInTokenUnit.plus(props.selectedMarketDetails?.underlyingAmount))
                                .times(100)
                                .toFixed(2),
                            2
                        )}%`}
                    </span>
                </ListItemSecondaryAction>
            </ListItem>
        </div>
    )
}

const SupplyDialog = forwardRef((props: any, ref) => {
    const [tabValue, setTabValue] = useState(0)
    const [supplyAmount, setSupplyAmount] = useState('')
    const [withdrawAmount, setWithdrawAmount] = useState('')
    const [newBorrowLimit1, setNewBorrowLimit1] = useState()
    const [newBorrowLimit2, setNewBorrowLimit2] = useState()
    const [supplyValidationMessage, setSupplyValidationMessage] = useState('')
    const [withdrawValidationMessage, setWithdrawValidationMessage] = useState('')
    const [txSnackbarOpen, setTxSnackbarOpen] = useState(false)
    const [txSnackbarMessage, setTxSnackbarMessage] = useState('')
    const [supplyDialogOpen, setSupplyDialogOpen] = useState(false)

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
    }
    const handleSupplyAmountChange = amount => {
        setSupplyAmount(amount)

        if (amount <= 0) {
            setSupplyValidationMessage('Amount must be > 0')
        } else if (amount > +props.selectedMarketDetails.walletBalance) {
            setSupplyValidationMessage('Amount must be <= balance')
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
    const handleWithdrawAmountChange = amount => {
        setWithdrawAmount(amount)

        if (amount <= 0) {
            setWithdrawValidationMessage('Amount must be > 0')
        } else if (amount > +props.selectedMarketDetails.supplyBalanceInTokenUnit) {
            setWithdrawValidationMessage('Amount must be <= your supply balance')
        } else if (amount > +props.selectedMarketDetails.underlyingAmount) {
            setWithdrawValidationMessage('Amount must be <= liquidity')
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

    const handleWithdraw = async (underlyingAddress, pTokenAddress, amount, decimals, setTxSnackbarMessage, setTxSnackbarOpen, symbol) => {
        const options = {
            network: chainIdToName[parseInt(library.provider.chainId)],
            provider: library.provider,
            gasLimit:
                symbol === 'DAI'
                    ? gasLimitWithdrawDai
                    : symbol === 'SNX'
                    ? gasLimitWithdrawSnx
                    : symbol === 'sUSD'
                    ? gasLimitWithdrawSusd
                    : gasLimitWithdraw,
            gasPrice: globalState.gasPrice.toString()
        }

        if (underlyingAddress === ethDummyAddress) {
            options.abi = compoundConstants.abi.cEther
        } else {
            options.abi = compoundConstants.abi.cErc20
        }

        try {
            const tx = await Compound.eth.trx(
                pTokenAddress,
                'redeemUnderlying',
                [eX(amount, decimals).toString()], // [optional] parameters
                options // [optional] call options, provider, network, ethers.js "overrides"
            )
            console.log('tx', JSON.stringify(tx))
            setTxSnackbarMessage(`Transaction sent: ${tx.hash}`)
        } catch (e) {
            setTxSnackbarMessage(`Error: ${JSON.stringify(e)}`)
        }

        setTxSnackbarOpen(true)
    }

    const getMaxAmount = (symbol, walletBalance) => {
        if (symbol === 'ETH') {
            return walletBalance.minus(eX(globalState.gasPrice.times(gasLimit), -18))
        } else {
            return walletBalance
        }
    }

    const handleSupply = async (underlyingAddress, pTokenAddress, amount, decimals, setTxSnackbarMessage, setTxSnackbarOpen, symbol) => {
        const parameters = []
        const options = {
            network: chainIdToName[parseInt(library.provider.chainId)],
            provider: library.provider,
            gasLimit: symbol === 'DAI' ? gasLimitSupplyDai : symbol === 'SNX' ? gasLimitSupplySnx : symbol === 'sUSD' ? gasLimitSupplySusd : gasLimit,
            gasPrice: globalState.gasPrice.toString()
        }

        if (underlyingAddress === ethDummyAddress) {
            options.value = eX(amount, 18).toString()
            options.abi = compoundConstants.abi.cEther
        } else {
            parameters.push(eX(amount, decimals).toString())
            options.abi = compoundConstants.abi.cErc20
        }

        try {
            const tx = await Compound.eth.trx(
                pTokenAddress,
                'mint',
                parameters, // [optional] parameters
                options // [optional] call options, provider, network, ethers.js "overrides"
            )
            console.log('tx', JSON.stringify(tx))
            setTxSnackbarMessage(`Transaction sent: ${tx.hash}`)
        } catch (e) {
            setTxSnackbarMessage(`Error: ${JSON.stringify(e)}`)
        }

        setTxSnackbarOpen(true)
    }

    useImperativeHandle(ref, () => ({
        show: details => {
            setSupplyDialogOpen(true)
        },
        hide: () => {
            setSupplyDialogOpen(false)
        }
    }))

    return (
        <Dialog open={supplyDialogOpen} onClose={() => setSupplyDialogOpen(false)}>
            <DialogTitle>
                {props.selectedMarketDetails.symbol && (
                    <img
                        className="rounded-circle"
                        style={{ width: '30px', margin: '0px 10px 0px 0px' }}
                        src={props.selectedMarketDetails.logoSource}
                        alt=""
                    />
                )}
                {`${props.selectedMarketDetails.symbol}`}
            </DialogTitle>
            <DialogContent>
                <AppBar position="static" color="inherit" elevation={0}>
                    <BlueStyledTabs value={tabValue} onChange={handleTabChange} textColor="inherit" variant="fullWidth">
                        <Tab label="Supply" style={{ outline: 'none' }} />
                        <Tab label="Withdraw" style={{ outline: 'none' }} />
                    </BlueStyledTabs>
                </AppBar>
                {props.selectedMarketDetails.symbol && (
                    <div>
                        <TabPanel value={tabValue} index={0}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label={props.selectedMarketDetails.symbol}
                                value={supplyAmount}
                                onChange={event => {
                                    handleSupplyAmountChange(event.target.value)
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment
                                            position="end"
                                            onClick={() => {
                                                handleSupplyAmountChange(
                                                    getMaxAmount(
                                                        props.selectedMarketDetails.symbol,
                                                        props.selectedMarketDetails.walletBalance
                                                    ).toString()
                                                )
                                            }}
                                        >
                                            Max
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <div style={{ height: '30px', color: 'red' }}>{supplyValidationMessage}</div>
                            <List>
                                <DialogSupplyRatesSection generalDetails={props.generalDetails} selectedMarketDetails={props.selectedMarketDetails} />
                                <br />
                                <DialogBorrowLimitSection generalDetails={props.generalDetails} newBorrowLimit={newBorrowLimit1} />
                                <br />
                                <DialogMarketInfoSection
                                    generalDetails={props.generalDetails}
                                    selectedMarketDetails={props.selectedMarketDetails}
                                    collateralFactorText={'Loan-to-Value'}
                                />
                                <br />
                                <br />
                                <ListItem>
                                    {props.selectedMarketDetails.underlyingAllowance?.isGreaterThan(0) &&
                                    props.selectedMarketDetails.underlyingAllowance?.isGreaterThanOrEqualTo(+supplyAmount) ? (
                                        <Button
                                            variant="primary"
                                            size="lg"
                                            disabled={!supplyAmount || supplyValidationMessage}
                                            block
                                            onClick={() => {
                                                handleSupply(
                                                    props.selectedMarketDetails.underlyingAddress,
                                                    props.selectedMarketDetails.pTokenAddress,
                                                    supplyAmount,
                                                    props.selectedMarketDetails.decimals,
                                                    setTxSnackbarMessage,
                                                    setTxSnackbarOpen,
                                                    props.selectedMarketDetails.symbol
                                                )
                                            }}
                                        >
                                            Supply
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="primary"
                                            size="lg"
                                            block
                                            onClick={() => {
                                                handleEnable(
                                                    props.selectedMarketDetails.underlyingAddress,
                                                    props.selectedMarketDetails.pTokenAddress,
                                                    setTxSnackbarMessage,
                                                    setTxSnackbarOpen,
                                                    props.selectedMarketDetails.symbol
                                                )
                                            }}
                                        >
                                            Access To Wallet
                                        </Button>
                                    )}
                                </ListItem>
                            </List>
                            <List>
                                <ListItem>
                                    <ListItemText secondary={`Wallet Balance`} />
                                    <ListItemSecondaryAction
                                        style={{ margin: '0px 15px 0px 0px' }}
                                    >{`${props.selectedMarketDetails.walletBalance.decimalPlaces(4).toString()} ${
                                        props.selectedMarketDetails.symbol
                                    }`}</ListItemSecondaryAction>
                                </ListItem>
                            </List>
                        </TabPanel>

                        <TabPanel value={tabValue} index={1}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label={props.selectedMarketDetails.symbol}
                                value={withdrawAmount}
                                onChange={event => {
                                    handleWithdrawAmountChange(event.target.value)
                                }}
                                // InputProps={{
                                //   endAdornment: (
                                //     <InputAdornment
                                //       position="end"
                                //       onClick={() => {
                                //         setWithdrawAmount(
                                //           getMaxAmount(
                                //             props.selectedMarketDetails.symbol,
                                //             props.selectedMarketDetails.walletBalance
                                //           ).toString()
                                //         );
                                //       }}
                                //     >
                                //       Max
                                //     </InputAdornment>
                                //   ),
                                // }}
                            />
                            <div style={{ height: '30px', color: 'red' }}>{withdrawValidationMessage}</div>
                            <List>
                                <DialogSupplyRatesSection generalDetails={props.generalDetails} selectedMarketDetails={props.selectedMarketDetails} />
                                <br />
                                <DialogBorrowLimitSection generalDetails={props.generalDetails} newBorrowLimit={newBorrowLimit2} />
                                <br />
                                <DialogMarketInfoSection
                                    generalDetails={props.generalDetails}
                                    selectedMarketDetails={props.selectedMarketDetails}
                                    collateralFactorText={'Loan-to-Value'}
                                />
                                <br />
                                <br />
                                <ListItem>
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        disabled={!withdrawAmount || withdrawValidationMessage}
                                        block
                                        onClick={() => {
                                            handleWithdraw(
                                                props.selectedMarketDetails.underlyingAddress,
                                                props.selectedMarketDetails.pTokenAddress,
                                                withdrawAmount,
                                                props.selectedMarketDetails.decimals,
                                                setTxSnackbarMessage,
                                                setTxSnackbarOpen,
                                                props.selectedMarketDetails.symbol
                                            )
                                        }}
                                    >
                                        Withdraw
                                    </Button>
                                </ListItem>
                            </List>
                            <List>
                                <ListItem>
                                    <ListItemText secondary={`You Supplied`} />
                                    <ListItemSecondaryAction
                                        style={{ margin: '0px 15px 0px 0px' }}
                                    >{`${props.selectedMarketDetails.supplyBalanceInTokenUnit.decimalPlaces(4)} ${
                                        props.selectedMarketDetails.symbol
                                    }`}</ListItemSecondaryAction>
                                </ListItem>
                            </List>
                        </TabPanel>
                    </div>
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

export default SupplyDialog
