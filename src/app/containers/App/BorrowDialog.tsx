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
import { chainIdToName, ethDummyAddress } from '../../general/constants'

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

const DialogBorrowRatesSection = props => {
    return (
        <div>
            <ListSubheader style={{ fontSize: '80%', fontWeight: 'bold' }}>Borrow Rate</ListSubheader>
            <ListItem>
                <img
                    className="rounded-circle"
                    style={{ width: '30px', margin: '0px 10px 0px 0px' }}
                    src={props.selectedMarketDetails.logoSource}
                    alt=""
                />
                <ListItemText secondary={`Borrow APY`} />
                <ListItemSecondaryAction style={{ margin: '0px 15px 0px 0px' }}>{`${props.selectedMarketDetails.borrowApy
                    ?.times(100)
                    .toFixed(2)}%`}</ListItemSecondaryAction>
            </ListItem>
            <ListItem>
                <ListItemText secondary={`PCT APY`} />
                <ListItemSecondaryAction style={{ margin: '0px 15px 0px 0px' }}>{`${zeroStringIfNullish(
                    props.selectedMarketDetails.borrowPctApy?.times(100).toFixed(2),
                    2
                )}%`}</ListItemSecondaryAction>
            </ListItem>
        </div>
    )
}

const DialogBorrowLimitSection2 = props => {
    const getNewBorrowBalance = (originBorrowBalance, borrowAmount, repayAmount, underlyingPrice) => {
        return originBorrowBalance?.plus(new BigNumber(borrowAmount).minus(repayAmount).times(underlyingPrice))
    }

    return (
        <div>
            <ListSubheader style={{ fontSize: '80%', fontWeight: 'bold' }}>Borrow Limit</ListSubheader>
            <ListItem>
                <ListItemText secondary={`Borrow Balance`} />
                <ListItemSecondaryAction style={{ margin: '0px 15px 0px 0px' }}>
                    <span>{`$${props.generalDetails.totalBorrowBalance?.toFixed(2)}`}</span>
                    {props.borrowAmount || props.repayAmount ? (
                        <span>
                            <ArrowRightIcon style={{ color: colors.lightBlue[500] }} />
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
                    ) : null}
                </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
                <ListItemText secondary={`Borrow Limit Used`} />
                <ListItemSecondaryAction style={{ margin: '0px 15px 0px 0px' }}>
                    <span>{`${zeroStringIfNullish(props.generalDetails.totalBorrowLimitUsedPercent?.toFixed(2), 2)}%`}</span>
                    {props.borrowAmount || props.repayAmount ? (
                        <span>
                            <ArrowRightIcon style={{ color: colors.lightBlue[500] }} />
                            <span
                                style={{
                                    color: getNewBorrowBalance(
                                        props.generalDetails.totalBorrowBalance,
                                        props.borrowAmount,
                                        props.repayAmount,
                                        props.selectedMarketDetails.underlyingPrice
                                    )
                                        ?.div(props.generalDetails.totalBorrowLimit)
                                        .isGreaterThan(1)
                                        ? colors.red[500]
                                        : null
                                }}
                            >
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
                        </span>
                    ) : null}
                </ListItemSecondaryAction>
            </ListItem>
        </div>
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
                    <span>{`${props.selectedMarketDetails.collateralFactor?.times(100).toFixed(0)}%`}</span>
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
                            props.selectedMarketDetails.marketTotalBorrowInTokenUnit
                                ?.div(props.selectedMarketDetails.marketTotalBorrowInTokenUnit.plus(props.selectedMarketDetails.underlyingAmount))
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

const BorrowDialog = forwardRef((props: any, ref) => {
    const [tabValue, setTabValue] = useState(0)
    const [borrowAmount, setBorrowAmount] = useState('')
    const [repayAmount, setRepayAmount] = useState('')
    const [isFullRepay, setIsFullRepay] = useState(false)
    const [borrowValidationMessage, setBorrowValidationMessage] = useState('')
    const [repayValidationMessage, setRepayValidationMessage] = useState('')
    const [txSnackbarOpen, setTxSnackbarOpen] = useState(false)
    const [txSnackbarMessage, setTxSnackbarMessage] = useState('')
    const [borrowDialogOpen, setBorrowDialogOpen] = useState(false)

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
    }
    const handleBorrowAmountChange = amount => {
        setBorrowAmount(amount)

        if (amount <= 0) {
            setBorrowValidationMessage('Amount must be > 0')
        } else if (amount * +props.selectedMarketDetails.underlyingPrice > +props.generalDetails.totalBorrowLimit) {
            setBorrowValidationMessage('Amount must be <= borrow limit')
        } else if (amount > +props.selectedMarketDetails.underlyingAmount) {
            setBorrowValidationMessage('Amount must be <= liquidity')
        } else {
            setBorrowValidationMessage('')
        }
    }
    const handleRepayAmountChange = (amount, isFull) => {
        setRepayAmount(amount)

        if (amount <= 0) {
            setRepayValidationMessage('Amount must be > 0')
        } else if (!isFull && amount > +props.selectedMarketDetails.borrowBalanceInTokenUnit) {
            setRepayValidationMessage('Amount must be <= your borrow balance')
        } else if (amount > +props.selectedMarketDetails.walletBalance) {
            setRepayValidationMessage('Amount must be <= balance')
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

    const handleEnable = async (underlyingAddress, pTokenAddress, setTxSnackbarMessage, setTxSnackbarOpen, symbol) => {
        try {
            const tx = await Compound.eth.trx(
                underlyingAddress,
                'approve',
                [pTokenAddress, MaxUint256], // [optional] parameters
                {
                    network: chainIdToName[parseInt(library.provider.chainId)],
                    provider: library.provider,
                    gasLimit: symbol === 'DAI' ? gasLimitEnableDai : gasLimitEnable,
                    gasPrice: globalState.gasPrice.toString(),
                    abi: compoundConstants.abi.cErc20
                } // [optional] call options, provider, network, ethers.js "overrides"
            )
            console.log('tx', JSON.stringify(tx))
            setTxSnackbarMessage(`Transaction sent: ${tx.hash}`)
        } catch (e) {
            setTxSnackbarMessage(`Error: ${JSON.stringify(e)}`)
        }

        setTxSnackbarOpen(true)
    }

    const handleRepay = async (
        walletAddress,
        underlyingAddress,
        pTokenAddress,
        amount,
        isFullRepay,
        decimals,
        setTxSnackbarMessage,
        setTxSnackbarOpen,
        symbol
    ) => {
        const parameters = []
        const options = {
            network: chainIdToName[parseInt(library.provider.chainId)],
            provider: library.provider,
            gasLimit: symbol === 'DAI' ? gasLimitRepayDai : symbol === 'sUSD' ? gasLimitRepaySusd : gasLimit,
            gasPrice: globalState.gasPrice.toString()
        }

        try {
            let tx
            if (underlyingAddress === ethDummyAddress) {
                parameters.push(walletAddress)
                parameters.push(pTokenAddress)
                options.value = eX(amount, 18).toString()
                tx = await Compound.eth.trx(
                    process.env.REACT_APP_MAXIMILLION_ADDRESS,
                    {
                        constant: false,
                        inputs: [
                            { internalType: 'address', name: 'borrower', type: 'address' },
                            { internalType: 'address', name: 'cEther_', type: 'address' }
                        ],
                        name: 'repayBehalfExplicit',
                        outputs: [],
                        payable: true,
                        stateMutability: 'payable',
                        type: 'function'
                    },
                    [walletAddress, pTokenAddress], // [optional] parameters
                    options // [optional] call options, provider, network, ethers.js "overrides"
                )
            } else {
                if (isFullRepay) {
                    parameters.push('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff') //-1 (i.e. 2256 - 1)
                } else {
                    parameters.push(eX(amount, decimals).toString())
                }
                options.abi = compoundConstants.abi.cErc20
                tx = await Compound.eth.trx(
                    pTokenAddress,
                    'repayBorrow',
                    parameters, // [optional] parameters
                    options // [optional] call options, provider, network, ethers.js "overrides"
                )
            }

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

    const getMaxRepayAmount = (symbol, borrowBalanceInTokenUnit, borrowApy) => {
        const maxRepayFactor = new BigNumber(1).plus(borrowApy / 100) // e.g. Borrow APY = 2% => maxRepayFactor = 1.0002
        if (symbol === 'ETH') {
            return borrowBalanceInTokenUnit.times(maxRepayFactor).decimalPlaces(18) // Setting it to a bit larger, this makes sure the user can repay 100%.
        } else {
            return borrowBalanceInTokenUnit.times(maxRepayFactor).decimalPlaces(18) // The same as ETH for now. The transaction will use -1 anyway.
        }
    }

    const handleBorrow = async (underlyingAddress, pTokenAddress, amount, decimals, setTxSnackbarMessage, setTxSnackbarOpen, symbol) => {
        const options = {
            network: chainIdToName[parseInt(library.provider.chainId)],
            provider: library.provider,
            gasLimit: symbol === 'DAI' ? gasLimitBorrowDai : gasLimitBorrow,
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
                'borrow',
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

    return (
        <Dialog open={borrowDialogOpen} onClose={() => setBorrowDialogOpen(false)}>
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
                        <Tab label="Borrow" style={{ outline: 'none' }} />
                        <Tab label="Repay" style={{ outline: 'none' }} />
                    </BlueStyledTabs>
                </AppBar>
                {props.selectedMarketDetails.symbol && (
                    <div>
                        <TabPanel value={tabValue} index={0}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label={props.selectedMarketDetails.symbol}
                                value={borrowAmount}
                                onChange={event => {
                                    handleBorrowAmountChange(event.target.value)
                                }}
                            />
                            <div style={{ height: '30px', color: 'red' }}>{borrowValidationMessage}</div>
                            <List>
                                <DialogBorrowRatesSection generalDetails={props.generalDetails} selectedMarketDetails={props.selectedMarketDetails} />
                                <br />
                                <DialogBorrowLimitSection2
                                    generalDetails={props.generalDetails}
                                    selectedMarketDetails={props.selectedMarketDetails}
                                    borrowAmount={borrowAmount}
                                    repayAmount={0}
                                />
                                <br />
                                <DialogMarketInfoSection
                                    generalDetails={props.generalDetails}
                                    selectedMarketDetails={props.selectedMarketDetails}
                                    collateralFactorText={'Liquidation Threshold'}
                                />
                                <br />
                                <br />
                                <ListItem>
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        disabled={!borrowAmount || !!borrowValidationMessage}
                                        block
                                        onClick={() => {
                                            handleBorrow(
                                                props.selectedMarketDetails.underlyingAddress,
                                                props.selectedMarketDetails.pTokenAddress,
                                                borrowAmount,
                                                props.selectedMarketDetails.decimals,
                                                setTxSnackbarMessage,
                                                setTxSnackbarOpen,
                                                props.selectedMarketDetails.symbol
                                            )
                                        }}
                                    >
                                        Borrow
                                    </Button>
                                </ListItem>
                            </List>
                            <List>
                                <ListItem>
                                    <ListItemText secondary={`You Borrowed`} />
                                    <ListItemSecondaryAction
                                        style={{ margin: '0px 15px 0px 0px' }}
                                    >{`${props.selectedMarketDetails.borrowBalanceInTokenUnit.decimalPlaces(4)} ${
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
                                value={repayAmount}
                                onChange={event => {
                                    setIsFullRepay(false)
                                    handleRepayAmountChange(event.target.value, false)
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment
                                            position="end"
                                            onClick={() => {
                                                const maxAffortable = getMaxAmount(
                                                    props.selectedMarketDetails.symbol,
                                                    props.selectedMarketDetails.walletBalance
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
                                            Max
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <div style={{ height: '30px', color: 'red' }}>{repayValidationMessage}</div>
                            <List>
                                <DialogBorrowRatesSection generalDetails={props.generalDetails} selectedMarketDetails={props.selectedMarketDetails} />
                                <br />
                                <DialogBorrowLimitSection2
                                    generalDetails={props.generalDetails}
                                    selectedMarketDetails={props.selectedMarketDetails}
                                    borrowAmount={0}
                                    repayAmount={repayAmount}
                                />
                                <br />
                                <DialogMarketInfoSection
                                    generalDetails={props.generalDetails}
                                    selectedMarketDetails={props.selectedMarketDetails}
                                    collateralFactorText={'Liquidation Threshold'}
                                />
                                <br />
                                <br />
                                <ListItem>
                                    {props.selectedMarketDetails.underlyingAllowance?.isGreaterThan(0) &&
                                    props.selectedMarketDetails.underlyingAllowance?.isGreaterThanOrEqualTo(+repayAmount) ? (
                                        <Button
                                            variant="primary"
                                            size="lg"
                                            disabled={!repayAmount || !!repayValidationMessage}
                                            block
                                            onClick={() => {
                                                handleRepay(
                                                    props.account,
                                                    props.selectedMarketDetails.underlyingAddress,
                                                    props.selectedMarketDetails.pTokenAddress,
                                                    repayAmount,
                                                    isFullRepay,
                                                    props.selectedMarketDetails.decimals,
                                                    setTxSnackbarMessage,
                                                    setTxSnackbarOpen,
                                                    props.selectedMarketDetails.symbol
                                                )
                                            }}
                                        >
                                            Repay
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

export default BorrowDialog
