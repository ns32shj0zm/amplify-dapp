import Compound from '@compound-finance/compound-js/dist/nodejs/src/index.js'
import { chainIdToName, ethDummyAddress } from '../general/constants'
import { eX, convertToLargeNumberRepresentation, zeroStringIfNullish } from '../general/helpers'
import { MaxUint256 } from '@ethersproject/constants'
import { BigNumber } from 'bignumber.js'
BigNumber.config({ EXPONENTIAL_AT: 1e9 })

const blockTime = 13.5 // seconds

export async function getMarkets(library, priceFeedAddress, account, comptrollerAddress): Promise<any> {
    let totalSupplyBalance = new BigNumber(0)
    let totalBorrowBalance = new BigNumber(0)
    let allMarketsTotalSupplyBalance = new BigNumber(0)
    let allMarketsTotalBorrowBalance = new BigNumber(0)
    let totalBorrowLimit = new BigNumber(0)
    let yearSupplyInterest = new BigNumber(0)
    let yearBorrowInterest = new BigNumber(0)
    const yearSupplyPctRewards = new BigNumber(0)
    const yearBorrowPctRewards = new BigNumber(0)
    let totalLiquidity = new BigNumber(0)

    const allMarkets = await getAllMarkets(library, comptrollerAddress)
    const enteredMarkets = await getEnteredMarkets(library, comptrollerAddress, account)

    async function getMarketDetails(library, pTokenAddress, priceFeedAddress, account, enteredMarkets, comptrollerAddress): Promise<any> {
        const underlyingAddress = await getUnderlyingTokenAddress(library, pTokenAddress)
        const symbol = await getTokenSymbol(library, underlyingAddress)
        const decimals = await getDecimals(library, underlyingAddress)
        const underlyingPrice = await getUnderlyingPrice(library, pTokenAddress, decimals, priceFeedAddress)
        const supplyAndBorrowBalance = await getSupplyAndBorrowBalance(library, pTokenAddress, decimals, underlyingPrice, account)
        const marketTotalSupply = (await getMarketTotalSupplyInTokenUnit(library, pTokenAddress, decimals))?.times(underlyingPrice)
        const marketTotalBorrowInTokenUnit = await getMarketTotalBorrowInTokenUnit(library, pTokenAddress, decimals)

        totalSupplyBalance = totalSupplyBalance.plus(supplyAndBorrowBalance?.supplyBalance)
        totalBorrowBalance = totalBorrowBalance.plus(supplyAndBorrowBalance?.borrowBalance)
        const marketTotalBorrow = marketTotalBorrowInTokenUnit?.times(underlyingPrice)
        if (marketTotalSupply?.isGreaterThan(0)) {
            allMarketsTotalSupplyBalance = allMarketsTotalSupplyBalance.plus(marketTotalSupply)
        }
        if (marketTotalBorrow?.isGreaterThan(0)) {
            allMarketsTotalBorrowBalance = allMarketsTotalBorrowBalance.plus(marketTotalBorrow)
        }
        const isEnterMarket = enteredMarkets.includes(pTokenAddress)

        const collateralFactor = await getCollateralFactor(library, comptrollerAddress, pTokenAddress)
        totalBorrowLimit = totalBorrowLimit.plus(isEnterMarket ? supplyAndBorrowBalance?.supplyBalance.times(collateralFactor) : 0)

        const supplyApy = await getSupplyApy(library, pTokenAddress)
        const borrowApy = await getBorrowApy(library, pTokenAddress)
        yearSupplyInterest = yearSupplyInterest.plus(supplyAndBorrowBalance?.supplyBalance.times(supplyApy).div(100))
        yearBorrowInterest = yearBorrowInterest.plus(supplyAndBorrowBalance?.borrowBalance.times(borrowApy).div(100))

        const underlyingAmount = await getUnderlyingAmount(library, pTokenAddress, decimals)

        const liquidity = +underlyingAmount * +underlyingPrice

        if (liquidity > 0) {
            totalLiquidity = totalLiquidity.plus(liquidity)
        }

        return {
            pTokenAddress,
            underlyingAddress,
            symbol,
            supplyApy,
            borrowApy,
            underlyingAllowance: await getAllowance(library, underlyingAddress, decimals, account, pTokenAddress),
            walletBalance: await getBalanceOf(library, underlyingAddress, decimals, account),
            supplyBalanceInTokenUnit: supplyAndBorrowBalance?.supplyBalanceInTokenUnit,
            supplyBalance: supplyAndBorrowBalance?.supplyBalance,
            marketTotalSupply: (await getMarketTotalSupplyInTokenUnit(library, pTokenAddress, decimals))?.times(underlyingPrice),
            borrowBalanceInTokenUnit: supplyAndBorrowBalance?.borrowBalanceInTokenUnit,
            borrowBalance: supplyAndBorrowBalance?.borrowBalance,
            marketTotalBorrowInTokenUnit,
            marketTotalBorrow: marketTotalBorrowInTokenUnit?.times(underlyingPrice),
            isEnterMarket,
            underlyingAmount,
            underlyingPrice,
            liquidity: +underlyingAmount * +underlyingPrice,
            collateralFactor,
            // pctSpeed: await getPctSpeed(library, pTokenAddress),
            decimals
        }
    }
    const allMarketDetails = await Promise.all(
        allMarkets.map(async pTokenAddress => {
            try {
                return await getMarketDetails(library, pTokenAddress, priceFeedAddress, account, enteredMarkets, comptrollerAddress)
            } catch (ex) {
                console.log(`Error getting ${pTokenAddress}: ${ex.message}`, ex)
                return {}
            }
        })
    )
    return {
        allMarketDetails,
        generalDetails: {
            comptrollerAddress,
            totalSupplyBalance,
            totalBorrowBalance,
            allMarketsTotalSupplyBalance,
            allMarketsTotalBorrowBalance,
            totalBorrowLimit,
            totalBorrowLimitUsedPercent: totalBorrowBalance.div(totalBorrowLimit).times(100),
            yearSupplyInterest,
            yearBorrowInterest,
            netApy: yearSupplyInterest.minus(yearBorrowInterest).div(totalSupplyBalance),
            totalSupplyPctApy: yearSupplyPctRewards?.div(totalSupplyBalance),
            totalBorrowPctApy: yearBorrowPctRewards?.div(totalBorrowBalance),
            totalLiquidity
        }
    }
}

export async function getAllMarkets(library, comptrollerAddress): Promise<any> {
    try {
        return await Compound.eth.read(
            comptrollerAddress,
            'function getAllMarkets() returns (address[])',
            [], // [optional] parameters
            {
                network: chainIdToName[parseInt(library?.provider?.chainId)],
                _compoundProvider: library
            } // [optional] call options, provider, network, ethers.js "overrides"
        )
    } catch (error) {
        console.log('getAllMarkets: ', error)
    }
}

export async function getEnteredMarkets(library, comptrollerAddress, account): Promise<any> {
    try {
        return await Compound.eth.read(
            comptrollerAddress,
            'function getAssetsIn(address) returns (address[])',
            [account], // [optional] parameters
            {
                network: chainIdToName[parseInt(library?.provider?.chainId)],
                _compoundProvider: library
            } // [optional] call options, provider, network, ethers.js "overrides"
        )
    } catch (error) {
        console.log('getEnteredMarkets: ', error)
    }
}

export async function getUnderlyingTokenAddress(library, pTokenAddress): Promise<any> {
    try {
        return await Compound.eth.read(
            pTokenAddress,
            'function underlying() returns (address)',
            [], // [optional] parameters
            {
                network: chainIdToName[parseInt(library?.provider?.chainId)],
                _compoundProvider: library
            } // [optional] call options, provider, network, ethers.js "overrides"
        )
    } catch (error) {
        if (error.error.code === 'UNPREDICTABLE_GAS_LIMIT') {
            return ethDummyAddress
        } else {
            console.log('getUnderlyingTokenAddress: ', error)
        }
    }
}

export async function getTokenSymbol(library, address): Promise<any> {
    const saiAddress = Compound.util.getAddress(Compound.SAI, chainIdToName[parseInt(library?.provider?.chainId)])
    let symbol
    if (address.toLowerCase() === saiAddress.toLowerCase()) {
        symbol = 'SAI'
    } else if (address === ethDummyAddress) {
        symbol = 'ETH'
    } else if (address === '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2') {
        symbol = 'MKR'
    } else {
        // console.log('address', address)
        symbol = await Compound.eth.read(
            address,
            'function symbol() returns (string)',
            [], // [optional] parameters
            {
                network: chainIdToName[parseInt(library?.provider?.chainId)],
                _compoundProvider: library
            } // [optional] call options, provider, network, ethers.js "overrides"
        )
    }
    // console.log('symbol', symbol)
    return symbol
}

export async function getDecimals(library, tokenAddress): Promise<any> {
    let decimals
    if (tokenAddress === ethDummyAddress) {
        decimals = 18
    } else {
        decimals = await Compound.eth.read(
            tokenAddress,
            'function decimals() returns (uint8)',
            [], // [optional] parameters
            {
                network: chainIdToName[parseInt(library.provider.chainId)],
                _compoundProvider: library
            } // [optional] call options, provider, network, ethers.js "overrides"
        )
    }
    return decimals
}

export async function getSupplyApy(library, address): Promise<any> {
    const mantissa = 1e18 // mantissa is the same even the underlying asset has different decimals
    const blocksPerDay = (24 * 60 * 60) / blockTime
    const daysPerYear = 365

    let supplyRatePerBlock
    try {
        supplyRatePerBlock = await Compound.eth.read(
            address,
            'function supplyRatePerBlock() returns (uint256)',
            [], // [optional] parameters
            {
                network: chainIdToName[parseInt(library.provider.chainId)],
                _compoundProvider: library
            } // [optional] call options, provider, network, ethers.js "overrides"
        )
    } catch (e) {
        console.log('getSupplyApy:', e)
        supplyRatePerBlock = new BigNumber(0)
    }

    const supplyApy = new BigNumber(Math.pow((supplyRatePerBlock.toNumber() / mantissa) * blocksPerDay + 1, daysPerYear - 1) - 1)
    return supplyApy
}

export async function getBorrowApy(library, address): Promise<any> {
    const mantissa = 1e18 // mantissa is the same even the underlying asset has different decimals
    const blocksPerDay = (24 * 60 * 60) / blockTime
    const daysPerYear = 365

    let borrowRatePerBlock
    try {
        borrowRatePerBlock = await Compound.eth.read(
            address,
            'function borrowRatePerBlock() returns (uint256)',
            [], // [optional] parameters
            {
                network: chainIdToName[parseInt(library.provider.chainId)],
                _compoundProvider: library
            } // [optional] call options, provider, network, ethers.js "overrides"
        )
    } catch (e) {
        console.log('getBorrowApy: ', e)
        borrowRatePerBlock = new BigNumber(0)
    }
    const borrowApy = new BigNumber(Math.pow((borrowRatePerBlock.toNumber() / mantissa) * blocksPerDay + 1, daysPerYear - 1) - 1)
    return borrowApy
}

export async function getBalanceOf(library, tokenAddress, decimals, walletAddress): Promise<any> {
    let balance
    if (tokenAddress === ethDummyAddress) {
        balance = await library.getBalance(walletAddress)
    } else {
        balance = await Compound.eth.read(
            tokenAddress,
            'function balanceOf(address) returns (uint)',
            [walletAddress], // [optional] parameters
            {
                network: chainIdToName[parseInt(library.provider.chainId)],
                _compoundProvider: library
            } // [optional] call options, provider, network, ethers.js "overrides"
        )
    }

    return eX(balance.toString(), -1 * decimals)
}

export async function getAllowance(library, tokenAddress, decimals, walletAddress, pTokenAddress): Promise<any> {
    let allowance
    if (tokenAddress === ethDummyAddress) {
        allowance = MaxUint256
    } else {
        allowance = await Compound.eth.read(
            tokenAddress,
            'function allowance(address, address) returns (uint)',
            [walletAddress, pTokenAddress], // [optional] parameters
            {
                network: chainIdToName[parseInt(library.provider.chainId)],
                _compoundProvider: library
            } // [optional] call options, provider, network, ethers.js "overrides"
        )
    }

    return eX(allowance.toString(), -1 * decimals)
}

export async function getSupplyAndBorrowBalance(library, tokenAddress, decimals, underlyingPrice, walletAddress): Promise<any> {
    const accountSnapshot = await Compound.eth.read(
        tokenAddress,
        'function getAccountSnapshot(address) returns (uint, uint, uint, uint)',
        [walletAddress], // [optional] parameters
        {
            network: chainIdToName[parseInt(library.provider.chainId)],
            _compoundProvider: library
        } // [optional] call options, provider, network, ethers.js "overrides"
    )

    const supplyBalanceInTokenUnit = eX(accountSnapshot[1].mul(accountSnapshot[3]).toString(), -1 * decimals - 18)
    const supplyBalanceInUsd = supplyBalanceInTokenUnit.times(underlyingPrice)
    const borrowBalanceInTokenUnit = eX(accountSnapshot[2].toString(), -1 * decimals)
    const borrowBalanceInUsd = borrowBalanceInTokenUnit.times(underlyingPrice)

    return {
        supplyBalanceInTokenUnit,
        supplyBalance: supplyBalanceInUsd,
        borrowBalanceInTokenUnit,
        borrowBalance: borrowBalanceInUsd
    }
}

export async function getCollateralFactor(library, comptrollerAddress, tokenAddress): Promise<any> {
    const market = await Compound.eth.read(
        comptrollerAddress,
        'function markets(address) returns (bool, uint, bool)',
        [tokenAddress], // [optional] parameters
        {
            network: chainIdToName[parseInt(library.provider.chainId)],
            _compoundProvider: library
        } // [optional] call options, provider, network, ethers.js "overrides"
    )
    return eX(market[1].toString(), -18)
}

export async function getUnderlyingAmount(library, tokenAddress, decimals): Promise<any> {
    const underlyingAmount = await Compound.eth.read(
        tokenAddress,
        'function getCash() returns (uint)',
        [], // [optional] parameters
        {
            network: chainIdToName[parseInt(library.provider.chainId)],
            _compoundProvider: library
        } // [optional] call options, provider, network, ethers.js "overrides"
    )

    return eX(underlyingAmount.toString(), -1 * decimals)
}

export async function getUnderlyingPrice(library, tokenAddress, decimals, priceFeedAddress): Promise<any> {
    // const priceFeedAddress = Compound.util.getAddress(
    //   Compound.PriceFeed,
    //   chainIdToName[parseInt(library?.provider?.chainId)]
    // );

    // const priceFeedAddress = process.env.REACT_APP_ORACLE_ADDRESS

    const underlyingPrice = await Compound.eth.read(
        priceFeedAddress,
        'function getUnderlyingPrice(address) returns (uint)',
        [tokenAddress], // [optional] parameters
        {
            network: chainIdToName[parseInt(library.provider.chainId)],
            _compoundProvider: library
        } // [optional] call options, provider, network, ethers.js "overrides"
    )

    return eX(underlyingPrice.toString(), decimals - 36)
}

export async function getMarketTotalSupplyInTokenUnit(library, tokenAddress, decimals): Promise<any> {
    const cTokenTotalSupply = await Compound.eth.read(
        tokenAddress,
        'function totalSupply() returns (uint)',
        [], // [optional] parameters
        {
            network: chainIdToName[parseInt(library.provider.chainId)],
            _compoundProvider: library
        } // [optional] call options, provider, network, ethers.js "overrides"
    )

    const exchangeRateStored = await Compound.eth.read(
        tokenAddress,
        'function exchangeRateStored() returns (uint)',
        [], // [optional] parameters
        {
            network: chainIdToName[parseInt(library.provider.chainId)],
            _compoundProvider: library
        } // [optional] call options, provider, network, ethers.js "overrides"
    )

    return eX(cTokenTotalSupply.mul(exchangeRateStored).toString(), -1 * decimals - 18)
}

export async function getMarketTotalBorrowInTokenUnit(library, tokenAddress, decimals): Promise<any> {
    const totalBorrows = await Compound.eth.read(
        tokenAddress,
        'function totalBorrows() returns (uint)',
        [], // [optional] parameters
        {
            network: chainIdToName[parseInt(library.provider.chainId)],
            _compoundProvider: library
        } // [optional] call options, provider, network, ethers.js "overrides"
    )

    return eX(totalBorrows.toString(), -1 * decimals)
}
