import * as React from 'react'
import { useState } from 'react'
import { convertToLargeNumberRepresentation } from '../../general/helpers'
import { BigNumber } from 'bignumber.js'

type IProps = {
    details: any
    handleClick(): void
}

function SupplyMarketRow(props: IProps): JSX.Element {
    return (
        <tr
            style={{ cursor: 'pointer' }}
            onClick={() => {
                props?.handleClick()
            }}
        >
            <td>
                <img className="rounded-circle" style={{ width: '30px' }} src={`/${props.details.symbol}.png`} alt="" />
            </td>
            <td>
                <h6 className="mb-1">{props.details.symbol}</h6>
            </td>
            <td>
                <h6 className="text-muted">
                    {`${props.details.borrowApy?.times(100).toFixed(2)}%`}
                    {props.details.borrowPctApy?.isGreaterThan(0) ? <div>{`(${props.details.borrowPctApy?.times(100).toFixed(2)}% PCT)`}</div> : null}
                </h6>
            </td>
            <td>
                <h6 className="text-muted">{props.details.borrowBalanceInTokenUnit.decimalPlaces(4).toString()}</h6>
            </td>
            <td>
                <h6 className="text-muted">{convertToLargeNumberRepresentation(props.details.marketTotalBorrowInTokenUnit.precision(2))}</h6>
            </td>
            <td>
                <h6 className="text-muted">{props.details.walletBalance.decimalPlaces(4).toString()}</h6>
            </td>
            <td>
                <h6 className="text-muted">{`$${convertToLargeNumberRepresentation(new BigNumber(props.details.liquidity).precision(2))}`}</h6>
            </td>
        </tr>
    )
}

export default SupplyMarketRow
