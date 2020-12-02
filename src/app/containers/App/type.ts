import { BigNumber } from 'bignumber.js'
export interface IDetails {
    generalDetails: GeneralDetails
    selectedMarketDetails: SelectedMarketDetails
    mySupplyDetails: SelectedMarketDetails[]
    handleUpdateData(): void
}

export interface GeneralDetails {
    comptrollerAddress: BigNumber
    totalSupplyBalance: BigNumber
    totalBorrowBalance: BigNumber
    allMarketsTotalSupplyBalance: BigNumber
    allMarketsTotalBorrowBalance: BigNumber
    totalBorrowLimit: BigNumber
    totalBorrowLimitUsedPercent: BigNumber
    yearSupplyInterest: BigNumber
    yearBorrowInterest: BigNumber
    netApy: BigNumber
    totalSupplyPctApy: BigNumber
    totalBorrowPctApy: BigNumber
    totalLiquidity: BigNumber
}

export interface SelectedMarketDetails {
    pTokenAddress: string
    underlyingAddress: string
    symbol: string
    supplyApy: BigNumber
    borrowApy: BigNumber
    underlyingAllowance: BigNumber
    supplyCTokenBalance: BigNumber
    walletBalance: BigNumber
    supplyBalanceInTokenUnit: BigNumber
    supplyBalance: string
    marketTotalSupply: string
    borrowBalanceInTokenUnit: BigNumber
    borrowBalance: string
    marketTotalBorrowInTokenUnit: BigNumber
    marketTotalBorrow: string
    isEnterMarket: boolean
    underlyingAmount: string
    underlyingPrice: string
    liquidity: number
    collateralFactor: BigNumber
    decimals: number
}
